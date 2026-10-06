interface Dossier {
  /** The question restated precisely, competing options named. */
  question: string;
  /** Evidence already held: path:line cites, one line each. */
  evidence: string;
  /** Invariants and boundaries the answer must respect. */
  constraints: string;
  /** Questions only the owner may decide; voices must not rule on these. */
  ownerReserved: string;
}

interface VoiceVerdict {
  /** Voice slot, e.g. "zcode-glm", "codex-gpt". */
  voice: string;
  /** "available", "available-unparsed", or why the voice was skipped. */
  status: string;
  /** One-sentence position. */
  position: string;
  /** What in the evidence drives the position. */
  reasoning: string;
  /** Strongest argument against this voice's own position. */
  selfObjection: string;
  /** What evidence would change this voice's mind. */
  falsifier: string;
  /** What showed this: exit code and output size, or "typed subagent reply". */
  evidence: string;
}

interface Ruling {
  /** The ruling in two or three sentences — or an explicit refusal to decide. */
  ruling: string;
  /** "high" | "medium" | "low" | "refused". */
  confidence: string;
  /** Genuine disagreements, recorded verbatim; empty when none. */
  contradictions: string[];
  /** The bounded experiment or check that would settle what is contested. */
  decider: string;
  /** "evidence-decidable" | "owner-decision" | "hypothesis". */
  classification: string;
  /** One line per voice: heard or skipped (and why). */
  voicesHeard: string[];
}

interface WorkflowReport {
  conclusion: string;
  findings: Array<{ voice: string; what: string; evidence: string; status: string; severity: string }>;
  verified: string[];
  notCovered: string[];
}

const question = String(args.question ?? "").trim();
const context = String(args.context ?? "").trim();
if (question === "") {
  throw new Error("No question supplied: run with args.question set to the design question.");
}

artifact.table("voices", {
  title: "Council voices",
  description: "Independent verdicts, one per model family",
  columns: [
    { field: "voice", label: "Voice" },
    { field: "status", label: "Status" },
    { field: "position", label: "Position" },
  ],
  key: "voice",
});

phase("Establish the ground truth");
const scout = agent("scout", {
  system:
    "You prepare a bounded factual dossier for a design council. Cite path:line for every claim. " +
    "You read; you never edit repository files. Also create the git-ignored directory " +
    ".local/dev-loop/scratch (mkdir -p) — later steps write there.",
});
const dossier = await scout.ask<Dossier>(
  `Question before the council: ${question}\n\n` +
    (context === "" ? "" : `Context to read first (paths or notes): ${context}\n\n`) +
    "Read only what is needed (deliverable docs, seed-docs/INVARIANTS.md, relevant source). Return:\n" +
    "- question: restated precisely, competing options named\n" +
    "- evidence: path:line cites, one line each\n" +
    "- constraints: invariants/boundaries that constrain the answer\n" +
    "- ownerReserved: questions only the owner may decide (auth/provider/model configuration, spend, mission)\n" +
    "Keep each field under ~120 words.",
);

const brief =
  "You are one independent voice on a design council. Other voices will not see your answer.\n" +
  "READ-ONLY: do not create, modify or delete any file.\n" +
  "Answer with ONLY a JSON object, no markdown fence, no commentary, exactly these keys:\n" +
  '{"position": string, "reasoning": string, "selfObjection": string, "falsifier": string}\n' +
  "- position: one sentence.\n" +
  "- reasoning: what in the evidence drives it (cite path:line where you can).\n" +
  "- selfObjection: the strongest argument against your own position.\n" +
  "- falsifier: what evidence would change your mind.\n" +
  "Do not rule on owner-reserved questions; if the answer hinges on one, say so in position.\n\n" +
  "QUESTION: " +
  dossier.question +
  "\n\nEVIDENCE:\n" +
  dossier.evidence +
  "\n\nCONSTRAINTS:\n" +
  dossier.constraints +
  "\n\nOWNER-RESERVED (do not decide):\n" +
  dossier.ownerReserved;

const push = (list: Array<PromiseLike<VoiceVerdict>>, p: PromiseLike<VoiceVerdict>) => {
  list.push(
    p.then((v) => {
      report(v, "voices");
      return v;
    }),
  );
};

phase("Hear the independent voices");
log("Convening the council: 1 in-session voice + external model-family voices (skips recorded honestly)");
const pending: Array<PromiseLike<VoiceVerdict>> = [];

const zcodeVoice = agent("voice-zcode", {
  system:
    "You are one independent council voice. Judge from the brief alone; read the repository only to " +
    "verify a specific dossier cite. READ-ONLY: never edit a file.",
});
push(
  pending,
  zcodeVoice
    .ask<VoiceVerdict>(brief + "\n\nReturn the JSON object as your entire answer.")
    .then((v) => ({
      voice: "zcode-glm",
      status: "available",
      position: v.position ?? "",
      reasoning: v.reasoning ?? "",
      selfObjection: v.selfObjection ?? "",
      falsifier: v.falsifier ?? "",
      evidence: "typed subagent reply (session model)",
    })),
);

const parseVoice = (
  voice: string,
  r: { exitCode: number; stdout: string; stderr: string },
): VoiceVerdict => {
  const out = (r.stdout || "").trim();
  let parsed: Partial<VoiceVerdict> | null = null;
  const start = out.indexOf("{");
  const end = out.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      parsed = JSON.parse(out.slice(start, end + 1)) as Partial<VoiceVerdict>;
    } catch {
      parsed = null;
    }
  }
  if (parsed !== null && typeof parsed.position === "string" && parsed.position !== "") {
    return {
      voice,
      status: "available",
      position: parsed.position ?? "",
      reasoning: parsed.reasoning ?? "",
      selfObjection: parsed.selfObjection ?? "",
      falsifier: parsed.falsifier ?? "",
      evidence: `exit ${r.exitCode}, ${out.length} bytes of stdout`,
    };
  }
  if (r.exitCode === 0 && out !== "") {
    return {
      voice,
      status: "available-unparsed",
      position: out.slice(0, 800),
      reasoning: "",
      selfObjection: "",
      falsifier: "",
      evidence: `exit ${r.exitCode}, stdout not JSON (${out.length} bytes)`,
    };
  }
  const why = ((r.stderr || "") + " " + (r.stdout || "")).trim().slice(0, 200);
  return {
    voice,
    status: `unavailable (exit ${r.exitCode}): ${why}`,
    position: "",
    reasoning: "",
    selfObjection: "",
    falsifier: "",
    evidence: `exit ${r.exitCode}`,
  };
};

const failVoice = (voice: string, e: unknown): VoiceVerdict => ({
  voice,
  status: `unavailable: ${String(e).slice(0, 200)}`,
  position: "",
  reasoning: "",
  selfObjection: "",
  falsifier: "",
  evidence: "command could not run",
});

push(
  pending,
  (async (): Promise<VoiceVerdict> => {
    try {
      return parseVoice("codex-gpt", await world.run("codex", ["exec", "-s", "read-only", "-C", ".local/dev-loop/scratch", brief], { timeoutMs: 600_000 }));
    } catch (e) {
      return failVoice("codex-gpt", e);
    }
  })(),
);
push(
  pending,
  (async (): Promise<VoiceVerdict> => {
    try {
      return parseVoice("claude-claude", await world.run("claude", ["-p", brief, "--output-format", "text"], { timeoutMs: 600_000 }));
    } catch (e) {
      return failVoice("claude-claude", e);
    }
  })(),
);
push(
  pending,
  (async (): Promise<VoiceVerdict> => {
    try {
      return parseVoice("grok-grok", await world.run("grok", ["-p", brief, "--max-tool-rounds", "1"], { timeoutMs: 600_000 }));
    } catch (e) {
      return failVoice("grok-grok", e);
    }
  })(),
);

const verdicts = await Promise.all(pending);
const live = verdicts.filter((v) => v.status === "available" || v.status === "available-unparsed");

const chair = agent("chair", {
  system:
    "You chair a multi-model design council. You collapse independent verdicts into a ruling. " +
    "Record contradictions verbatim instead of smoothing them; refusing to decide is a valid ruling. " +
    "Rulings are recommendations, never authority. If the verdicts are incoherent or contradict the " +
    "dossier, say so plainly rather than inventing coherence.",
});
let ruling = await chair.ask<Ruling>(
  "Independent verdicts from the council voices (JSON):\n" +
    JSON.stringify(verdicts, null, 2) +
    "\n\nCollapse them into a ruling:\n" +
    "- ruling: two or three sentences; or an explicit refusal to decide\n" +
    "- confidence: high | medium | low | refused\n" +
    "- contradictions: genuine disagreements verbatim; empty if none\n" +
    "- decider: the bounded experiment or check that would settle what is contested\n" +
    "- classification: evidence-decidable | owner-decision | hypothesis\n" +
    "- voicesHeard: one line per voice — heard, or skipped and why\n" +
    "Then write the full record (dossier, verdicts verbatim, ruling) to " +
    ".local/dev-loop/council/latest-ruling.md (create directories; the path is git-ignored).",
);

// One rebuttal round, capped — only when the ruling is contested and an in-session voice can answer it.
if (ruling.confidence === "refused" && ruling.contradictions.length > 0 && live.some((v) => v.voice === "zcode-glm")) {
  const rebuttal = await zcodeVoice.ask<string>(
    "The chair could not rule. Disagreements recorded:\n" +
      ruling.contradictions.join("\n") +
      "\n\nRespond once: does your position survive these objections? Answer in under 120 words.",
  );
  ruling = await chair.ask<Ruling>(
    "One rebuttal round is in. Rebuttal from the in-session voice:\n" +
      rebuttal +
      "\n\nOriginal verdicts:\n" +
      JSON.stringify(verdicts, null, 2) +
      '\n\nRule now: if the disagreement survives the rebuttal, keep confidence "refused" and record it.',
  );
}

const md = [
  "# Council ruling",
  "",
  "**Question:** " + question,
  "",
  "## Ruling (" + ruling.classification + ", confidence: " + ruling.confidence + ")",
  "",
  ruling.ruling,
  "",
  "## What would settle it",
  "",
  ruling.decider,
  "",
  "## Contradictions recorded",
  ...(ruling.contradictions.length === 0 ? ["_None — voices converged._"] : ruling.contradictions.map((c) => "- " + c)),
  "",
  "## Voices",
  ...ruling.voicesHeard.map((l) => "- " + l),
  "",
  "_Council rulings are recommendations, never authority. Owner-reserved questions route to Owen._",
].join("\n");

await artifact.markdown("ruling", md, {
  title: "Council ruling",
  description: question.slice(0, 180),
  primary: true,
});

const result: WorkflowReport = {
  conclusion:
    ruling.classification === "owner-decision"
      ? "The council routed this to the owner: " + ruling.ruling
      : "Council ruling (" + ruling.confidence + "): " + ruling.ruling,
  findings: verdicts.map((v) => ({
    voice: v.voice,
    what: v.position === "" ? v.status : v.position,
    evidence: v.evidence,
    status: v.status === "available" ? "verified" : "unconfirmed",
    severity: "low",
  })),
  verified: [
    `voices answered independently from the same brief; ${live.length} of ${verdicts.length} voices were live`,
    "ruling record written to .local/dev-loop/council/latest-ruling.md",
  ],
  notCovered: [
    ...verdicts.filter((v) => v.status.startsWith("unavailable")).map((v) => `${v.voice} skipped: ${v.status}`),
    "no repository check gates a design ruling; the decider experiment is named in the ruling",
  ],
};
return result;
