/* zcode-workflow
description: "Convenes the multi-model design council under the five-protocol design
  (.project/dev-loop/DESIGN-COUNCIL.md): a scout grades the stakes, the router picks
  PANEL, PANEL+CHALLENGE or ROUND-ROBIN+JUDGE (owner-reserved questions ABSTAIN),
  independent voices from different provider families answer the same brief, and the
  circuit breakers (quorum loss, convergence, drift, call ceiling) stop a ruling
  instead of grinding. Contradictions are recorded verbatim; rulings are
  recommendations, never authority."
whenToUse: An interactive convening of the design council on a genuine contested
  planning/design question (D4/D5 design-intensity rule, contested regression fix,
  cross-worker disagreement). Not for task selection, re-litigating owner decisions,
  or questions only Owen may decide. Unattended (DESK) convenings use the direct
  procedure in DESIGN-COUNCIL.md §7 instead.
args:
  question:
    type: string
    description: The design question before the council, in one or two sentences.
    required: true
  context:
    type: string
    description: Optional paths/notes the scout should read for ground truth (repo
      paths, task refs).
    required: false
    default: ""
  stakes:
    type: string
    description: Optional stakes grade override - "routine", "contested" or "dispute".
      Leave empty to let the scout grade it (it grades one level up when unsure).
    required: false
    default: ""
*/
type Stakes = "routine" | "contested" | "dispute";

interface Dossier {
  /** The question restated precisely, competing options named. */
  question: string;
  /** Evidence already held: path:line cites, one line each. */
  evidence: string;
  /** Invariants and boundaries the answer must respect. */
  constraints: string;
  /** Questions only the owner may decide; voices must not rule on these. */
  ownerReserved: string;
  /** True when deciding the question itself would decide auth, provider/model configuration, spend, mission or an invariant. A question with one owner-reserved corner is owner-reserved. */
  touchesOwnerReserved: boolean;
  /** "routine" (one defensible reading; spec or a red gate implies the answer), "contested" (two or more defensible answers), or "dispute" (workers still disagree, or a wide-blast-radius architecture choice). When unsure, choose the higher grade. */
  stakes: Stakes;
  /** One sentence: why this grade. */
  stakesReason: string;
}

interface VoiceAnswer {
  /** One sentence. */
  position: string;
  /** What in the evidence drives it, with path:line cites where possible. */
  reasoning: string;
  /** The strongest argument against your own position. */
  selfObjection: string;
  /** What evidence would change your mind. */
  falsifier: string;
}

interface VoiceVerdict {
  /** Voice slot: "in-session", "codex", "claude" or "grok". */
  voice: string;
  /** Provider family used for quorum: "gpt", "claude", "grok"; "session" for the in-session voice, whose provider the script cannot see and which never counts toward quorum. */
  family: string;
  /** "available", "available-unparsed", or why the voice was skipped. */
  status: string;
  position: string;
  reasoning: string;
  selfObjection: string;
  falsifier: string;
  /** What showed this: exit code and output size, model provenance, or "typed subagent reply". */
  evidence: string;
}

interface Ruling {
  /** The ruling in two or three sentences, or an explicit refusal to decide. */
  ruling: string;
  /** "high" | "medium" | "low" | "refused". */
  confidence: string;
  /** Genuine disagreements, each quoted verbatim from the voices; empty when none. */
  contradictions: string[];
  /** The bounded experiment or check that would settle what is contested. */
  decider: string;
  /** "evidence-decidable" | "owner-decision" | "hypothesis". */
  classification: string;
  /** One line per voice: heard (with family and model) or skipped (and why). */
  voicesHeard: string[];
  /** True when every heard voice took the same position. */
  unanimous: boolean;
  /** Voice slots whose answers went outside the brief (ruled on owner-reserved ground, ignored the question, or invented evidence). Empty when none. */
  drifted: string[];
  /** Workspace-relative path of the full record the chair wrote. */
  recordPath: string;
}

interface BreakerTrip {
  breaker: string;
  detail: string;
}

interface WorkflowReport {
  conclusion: string;
  findings: Array<{ voice: string; what: string; evidence: string; status: string; severity: string }>;
  verified: string[];
  notCovered: string[];
}

// Proposed defaults (DESIGN-COUNCIL.md §3.1), pending Owen's confirmation.
const MIN_FAMILIES = 2; // #providers
const VOICE_CALL_CEILING = 6; // COST/TIME: #models (3) + 3
const ROUNDS = 2; // #rounds: first answers + one more round
const ROUTER = "node";
const ROUTER_ARGS = [
  "C:/Users/VIVIM.inc/.agents/skills/cliproxy-router/cliproxy.mjs",
  "route",
];
const PROJECT = "C:/0-BlackBoxProject-0/VOMEGA";

const question = String(args.question ?? "").trim();
const context = String(args.context ?? "").trim();
const stakesOverride = String(args.stakes ?? "").trim();
if (question === "") {
  throw new Error("No question supplied: run with args.question set to the design question.");
}

artifact.table("voices", {
  title: "Council voices",
  description: "Each voice's answer, by round",
  columns: [
    { field: "round", label: "Round" },
    { field: "voice", label: "Voice" },
    { field: "family", label: "Family" },
    { field: "status", label: "Status" },
    { field: "position", label: "Position" },
  ],
});

const breakers: BreakerTrip[] = [];
let voiceCalls = 0;

/** The last balanced {...} object in a text, so an echoed prompt template earlier in the output cannot be mistaken for the answer. */
const lastJsonObject = (text: string): string | null => {
  const end = text.lastIndexOf("}");
  if (end < 0) return null;
  let depth = 0;
  for (let i = end; i >= 0; i--) {
    const ch = text[i];
    if (ch === "}") depth++;
    else if (ch === "{") {
      depth--;
      if (depth === 0) return text.slice(i, end + 1);
    }
  }
  return null;
};

const parseVoice = (
  voice: string,
  family: string,
  r: { exitCode: number; stdout: string; stderr: string },
  provenance: string,
): VoiceVerdict => {
  const out = (r.stdout || "").trim();
  let parsed: Partial<VoiceAnswer> | null = null;
  const json = r.exitCode === 0 ? lastJsonObject(out) : null;
  if (json !== null) {
    try {
      parsed = JSON.parse(json) as Partial<VoiceAnswer>;
    } catch {
      parsed = null;
    }
  }
  if (parsed !== null && typeof parsed.position === "string" && parsed.position !== "") {
    return {
      voice,
      family,
      status: "available",
      position: parsed.position,
      reasoning: parsed.reasoning ?? "",
      selfObjection: parsed.selfObjection ?? "",
      falsifier: parsed.falsifier ?? "",
      evidence: `exit 0, ${out.length} bytes of stdout${provenance === "" ? "" : "; " + provenance}`,
    };
  }
  if (r.exitCode === 0 && out !== "") {
    return {
      voice,
      family,
      status: "available-unparsed",
      position: out.slice(-800),
      reasoning: "",
      selfObjection: "",
      falsifier: "",
      evidence: `exit 0, stdout not JSON (${out.length} bytes)${provenance === "" ? "" : "; " + provenance}`,
    };
  }
  const why = ((r.stderr || "") + " " + (r.stdout || "")).trim().slice(-240);
  return {
    voice,
    family,
    status: `unavailable (exit ${r.exitCode}): ${why}`,
    position: "",
    reasoning: "",
    selfObjection: "",
    falsifier: "",
    evidence: `exit ${r.exitCode}`,
  };
};

const failVoice = (voice: string, family: string, e: unknown): VoiceVerdict => ({
  voice,
  family,
  status: `unavailable: ${String(e).slice(0, 240)}`,
  position: "",
  reasoning: "",
  selfObjection: "",
  falsifier: "",
  evidence: "command could not run",
});

const isLive = (v: VoiceVerdict) => v.status === "available" || v.status === "available-unparsed";

interface RoutePick {
  /** "router" | "override" | "unknown". */
  kind: string;
  /** "reason" | "review". */
  profile: string;
  /** Model id the router selected, or "" when it could not be read. */
  id: string;
  /** Provider the router named for that id. */
  provider: string;
  /** The router's own "why". */
  why: string;
}

const routerErr = (profile: string, e: unknown): RoutePick => ({
  kind: "unknown",
  profile,
  id: "",
  provider: "",
  why: "router call failed: " + String(e).slice(0, 120),
});

/**
 * Voice selection goes through the router entrypoint (DESIGN-COUNCIL.md §3.3): the router
 * drops what is unroutable or in cooldown, so its selection IS the availability measurement.
 * The chair overrides it only to keep two independent families, and says so in the record.
 */
const askRouter = async (profile: string): Promise<RoutePick> => {
  try {
    const r = await world.run(ROUTER, [...ROUTER_ARGS, profile, "--project", PROJECT], { timeoutMs: 60_000 });
    if (r.exitCode !== 0) {
      return { kind: "unknown", profile, id: "", provider: "", why: `router exit ${r.exitCode}: ` + r.stderr.slice(-120) };
    }
    const j = JSON.parse(lastJsonObject(r.stdout) ?? "{}") as {
      selected?: { id?: string; provider?: string; why?: string[] };
    };
    const sel = j.selected ?? {};
    return {
      kind: "router",
      profile,
      id: sel.id ?? "",
      provider: sel.provider ?? "",
      why: (sel.why ?? []).join("; "),
    };
  } catch (e) {
    return routerErr(profile, e);
  }
};

const routeLine = (p: RoutePick, overrideReason: string): string =>
  p.kind === "router"
    ? `route: profile=${p.profile} id=${p.id} provider=${p.provider} explicit=no (why: ${p.why})`
    : `route: profile=${p.profile} id=${p.id || "unknown"} provider=${p.provider || "unknown"} explicit=${overrideReason === "" ? "no" : "yes"} (why: ${p.why}${overrideReason === "" ? "" : "; override: " + overrideReason})`;

const countedFamilies = (vs: VoiceVerdict[], dropped: string[]): string[] => {
  const fams = new Set<string>();
  for (const v of vs) if (isLive(v) && v.family !== "session" && !dropped.includes(v.voice)) fams.add(v.family);
  return [...fams].sort();
};

const answerFormat =
  "Answer with ONLY a JSON object, no markdown fence, no commentary, exactly these keys:\n" +
  '{"position": string, "reasoning": string, "selfObjection": string, "falsifier": string}\n';

phase("Establish the ground truth and grade the stakes");
const scout = agent("scout", {
  system:
    "You prepare a bounded factual dossier for a design council and grade how contested the question is. " +
    "Cite path:line for every claim. You read; you never edit repository files. Also create the git-ignored " +
    "directory .local/dev-loop/scratch (mkdir -p); the voices run from there.",
});
const dossier = await scout.ask<Dossier>(
  `Question before the council: ${question}\n\n` +
    (context === "" ? "" : `Context to read first (paths or notes): ${context}\n\n`) +
    "Read only what is needed (.project/dev-loop/DESIGN-COUNCIL.md §5 for the stakes grades, the relevant " +
    "deliverable docs, seed-docs/INVARIANTS.md, the relevant source). Keep each text field under ~120 words. " +
    "Owner-reserved ground is auth, provider/model configuration, spend, mission and invariants.",
);

const validOverride = stakesOverride === "routine" || stakesOverride === "contested" || stakesOverride === "dispute";
const stakes: Stakes = validOverride ? (stakesOverride as Stakes) : dossier.stakes;
const protocol =
  stakes === "routine" ? "PANEL" : stakes === "contested" ? "PANEL + CHALLENGE" : "ROUND-ROBIN + JUDGE";
const gradeLine = validOverride
  ? `Stakes graded "${stakes}" by the caller (scout had graded "${dossier.stakes}": ${dossier.stakesReason})`
  : `Stakes graded "${stakes}" by the scout: ${dossier.stakesReason}`;

if (dossier.touchesOwnerReserved) {
  await artifact.markdown(
    "ruling",
    [
      "# Council: ABSTAIN — owner-reserved",
      "",
      "**Question:** " + question,
      "",
      "The router's owner-reserved test came first and matched, so no voices were convened and no ruling was made.",
      "",
      "## Why it is owner-reserved",
      "",
      dossier.ownerReserved,
      "",
      "_Queue this for Owen through the ChiefOfStaff. Council rulings are recommendations, never authority._",
    ].join("\n"),
    { title: "Council: abstained (owner-reserved)", description: question.slice(0, 180), primary: true },
  );
  const abstained: WorkflowReport = {
    conclusion: "The council abstained: the question touches owner-reserved ground and is queued for Owen. " + dossier.ownerReserved,
    findings: [],
    verified: ["the scout read the question against the owner-reserved list (DESIGN-COUNCIL.md §5, router row 4)"],
    notCovered: ["no voices were convened, by design: the council has no standing on owner-reserved questions"],
  };
  return abstained;
}

const brief =
  "You are one independent voice on a design council. Other voices will not see your answer.\n" +
  "READ-ONLY: do not create, modify or delete any file.\n" +
  answerFormat +
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

/** One call to the GPT family through the Codex CLI, read-only, from the scratch directory. */
const askCodex = async (prompt: string): Promise<VoiceVerdict> => {
  voiceCalls++;
  try {
    const r = await world.run("codex.cmd", ["exec", "-s", "read-only", "-C", ".local/dev-loop/scratch", prompt], {
      timeoutMs: 600_000,
    });
    const m = /model:\s*(\S+)/.exec(r.stderr + "\n" + r.stdout);
    return parseVoice("codex", "gpt", r, m === null ? "" : `model ${m[1]}`);
  } catch (e) {
    return failVoice("codex", "gpt", e);
  }
};

/** One call to the Claude family through the authorized local proxy; falls back once along the REVIEW ladder (MODEL-SELECTION.md). */
const askClaude = async (prompt: string): Promise<VoiceVerdict> => {
  let last: VoiceVerdict | null = null;
  for (const model of ["claude-opus-5-5", "claude-sonnet-5-5"]) {
    if (voiceCalls >= VOICE_CALL_CEILING) break;
    voiceCalls++;
    try {
      const r = await world.run("node", [".local/dev-loop/claude-voice.mjs", "-t", prompt, model, "3000"], {
        timeoutMs: 600_000,
      });
      const sel = /model-selection:[^\n]*/.exec(r.stderr);
      const provenance =
        (sel === null ? `model ${model}` : sel[0]) + (model === "claude-opus-5-5" ? "" : " fallback-from=claude-opus-5-5");
      last = parseVoice("claude", "claude", r, provenance);
      if (isLive(last)) return last;
    } catch (e) {
      last = failVoice("claude", "claude", e);
    }
  }
  return last ?? failVoice("claude", "claude", "call ceiling reached before the first attempt");
};

phase("Hear the independent voices");
log(`Router: ${protocol} (${stakes}). Asking the model router, then convening the in-session voice and the GPT, Claude and Grok families.`);
const reasonPick = await askRouter("reason");
const reviewPick = await askRouter("review");
const independence = "a ruling needs two independent families, so each family is called on its own model rather than the router's single pick";
const routeLines: string[] = [
  routeLine(reasonPick, ""),
  routeLine(reviewPick, ""),
  `route: profile=reason id=gpt-6.1-sol provider=openai (codex CLI) explicit=yes (override: ${independence})`,
  `route: profile=reason id=claude-opus-5-5 provider=claude-code-oauth explicit=yes (override: ${independence}; falls back to claude-sonnet-5-5)`,
  `route: profile=reason id=grok-4.7 provider=grok-build-oauth explicit=yes (override: ${independence}; the router's reason/review profiles list no grok candidate)`,
];

const sessionVoice = agent("voice-in-session", {
  system:
    "You are one independent council voice. Judge from the brief alone; read the repository only to verify a " +
    "specific dossier cite. READ-ONLY: never edit a file.",
});
const askSession = async (prompt: string): Promise<VoiceVerdict> => {
  voiceCalls++;
  const a = await sessionVoice.ask<VoiceAnswer>(prompt);
  return {
    voice: "in-session",
    family: "session",
    status: "available",
    position: a.position,
    reasoning: a.reasoning,
    selfObjection: a.selfObjection,
    falsifier: a.falsifier,
    evidence: "typed subagent reply (session model; provider not visible to the script, so it never counts toward quorum)",
  };
};

/** One call to the Grok family through the authorized local proxy (the grok CLI has no key). */
const askGrok = async (prompt: string): Promise<VoiceVerdict> => {
  voiceCalls++;
  try {
    const r = await world.run("node", [".local/dev-loop/grok-voice.mjs", "-t", prompt, "grok-4.7", "3000"], {
      timeoutMs: 600_000,
    });
    return parseVoice("grok", "grok", r, "model grok-4.7");
  } catch (e) {
    return failVoice("grok", "grok", e);
  }
};

const firstRound = await Promise.all([askSession(brief), askCodex(brief), askClaude(brief), askGrok(brief)]);
for (const v of firstRound) report({ round: 1, ...v }, "voices");

let finalRound: VoiceVerdict[] = firstRound;
const families = countedFamilies(firstRound, []);

if (families.length < MIN_FAMILIES) {
  breakers.push({
    breaker: "QUORUM-LOSS",
    detail: `${families.length} independent famil${families.length === 1 ? "y" : "ies"} live (${families.join(", ") || "none"}); at least ${MIN_FAMILIES} needed. No ruling.`,
  });
  const tried = firstRound.map((v) => `- **${v.voice}** (${v.family}): ${v.status}`);
  await artifact.markdown(
    "ruling",
    [
      "# Council: BLOCKED — quorum lost",
      "",
      "**Question:** " + question,
      "",
      "**Router:** " + protocol + ". " + gradeLine,
      "",
      `Fewer than ${MIN_FAMILIES} independent provider families answered, so the QUORUM-LOSS breaker stopped the ruling. ` +
        "A single-family answer is never reported as a council ruling.",
      "",
      "## Every voice tried",
      ...tried,
      "",
      "_Wait for a family to recover (DEVops keeps the dark list) and convene again._",
    ].join("\n"),
    { title: "Council: blocked (quorum lost)", description: question.slice(0, 180), primary: true },
  );
  const blocked: WorkflowReport = {
    conclusion: `The council could not rule: only ${families.length} independent provider famil${families.length === 1 ? "y was" : "ies were"} live, and a ruling needs ${MIN_FAMILIES}.`,
    findings: firstRound.map((v) => ({ voice: v.voice, what: v.status, evidence: v.evidence, status: "unconfirmed", severity: "low" })),
    verified: [`every voice was called once against the same brief (${voiceCalls} calls)`],
    notCovered: ["no ruling and no ruling record: the QUORUM-LOSS breaker tripped before the chair ran"],
  };
  return blocked;
}

const others = (vs: VoiceVerdict[], self: string) =>
  JSON.stringify(
    vs.filter((v) => isLive(v) && v.voice !== self).map((v) => ({ voice: v.voice, position: v.position, reasoning: v.reasoning })),
    null,
    2,
  );

const liveFirst = firstRound.filter(isLive);
let secondRoundRan = false;

if (stakes === "contested") {
  phase("Let each voice attack the others' weakest claims");
  const budget = VOICE_CALL_CEILING - voiceCalls;
  const challengers = liveFirst.slice(0, Math.max(0, budget));
  if (challengers.length < liveFirst.length) {
    breakers.push({
      breaker: "COST/TIME",
      detail: `call ceiling ${VOICE_CALL_CEILING} left room for ${challengers.length} of ${liveFirst.length} challenges; the rest keep their first answers.`,
    });
  }
  const challenge = (self: string) =>
    "Round 2 of the same council (CHALLENGE). The other voices answered:\n" +
    others(firstRound, self) +
    "\n\nAttack the single weakest claim in each other answer, one attack each, inside reasoning. " +
    "Then give your position after the attacks: keep it or change it, and say which.\n" +
    answerFormat +
    "\nThe original brief follows.\n\n" +
    brief;
  const challenged = await Promise.all(
    challengers.map((v) =>
      v.voice === "in-session"
        ? askSession(challenge("in-session"))
        : v.voice === "codex"
          ? askCodex(challenge("codex"))
          : v.voice === "claude"
            ? askClaude(challenge("claude"))
            : askGrok(challenge("grok")),
    ),
  );
  for (const v of challenged) report({ round: 2, ...v }, "voices");
  finalRound = firstRound.map((v) => challenged.find((c) => c.voice === v.voice && isLive(c)) ?? v);
  secondRoundRan = true;
} else if (stakes === "dispute") {
  phase("Have the voices answer in turn, each seeing the ones before");
  const order = liveFirst.map((v) => v.voice);
  const turns: VoiceVerdict[] = [];
  for (const voice of order) {
    if (voiceCalls >= VOICE_CALL_CEILING) {
      breakers.push({ breaker: "COST/TIME", detail: `call ceiling ${VOICE_CALL_CEILING} reached; ${voice} kept its first answer.` });
      break;
    }
    const priors = JSON.stringify(turns.map((t) => ({ voice: t.voice, position: t.position, reasoning: t.reasoning })), null, 2);
    const prompt =
      "Round 2 of the same council (ROUND-ROBIN). Voices answering before you in this round said:\n" +
      (turns.length === 0 ? "(you answer first in this round)" : priors) +
      "\n\nTake ONE position, building on or rejecting theirs, and say which.\n" +
      answerFormat +
      "\nThe original brief follows.\n\n" +
      brief;
    const t =
      voice === "in-session"
        ? await askSession(prompt)
        : voice === "codex"
          ? await askCodex(prompt)
          : voice === "claude"
            ? await askClaude(prompt)
            : await askGrok(prompt);
    report({ round: 2, ...t }, "voices");
    if (isLive(t)) turns.push(t);
  }
  finalRound = firstRound.map((v) => turns.find((t) => t.voice === v.voice) ?? v);
  secondRoundRan = true;
}

phase("Rule on the question and record it");
const chair = agent("chair", {
  system:
    "You chair a multi-model design council and are not one of its voices. You collapse the voices' answers into " +
    "a ruling. Record contradictions verbatim instead of smoothing them; refusing to decide is a valid ruling. " +
    "Rulings are recommendations, never authority. If the answers are incoherent or contradict the dossier, say " +
    "so plainly rather than inventing coherence.",
});
const role =
  stakes === "dispute"
    ? "You are the JUDGE: you read every round and rule yourself; preserve the panel's spread beside your ruling."
    : "You are the chair: collapse the panel into a weighted conclusion.";
let ruling = await chair.ask<Ruling>(
  role +
    "\n\nRouter: " +
    protocol +
    ". " +
    gradeLine +
    "\n\nDossier:\n" +
    JSON.stringify(dossier, null, 2) +
    "\n\nRound 1 answers (independent):\n" +
    JSON.stringify(firstRound, null, 2) +
    (secondRoundRan ? "\n\nFinal answers after round 2:\n" + JSON.stringify(finalRound, null, 2) : "") +
    "\n\nRouting (copy these lines into the record verbatim):\n" +
    routeLines.join("\n") +
    "\n\nBreakers tripped so far:\n" +
    JSON.stringify(breakers, null, 2) +
    "\n\nRule. Mark any voice that went outside the brief (ruled on owner-reserved ground, ignored the question, " +
    "or invented evidence) in drifted. Then write the full record (router grade, dossier, every answer verbatim, " +
    "breakers, ruling) to .local/dev-loop/council/<UTC yyyymmddThhmmZ>-ruling.md, creating directories " +
    "(the path is git-ignored), and return that path as recordPath.",
);

if (ruling.drifted.length > 0) {
  const remaining = countedFamilies(finalRound, ruling.drifted);
  breakers.push({ breaker: "DRIFT", detail: `dropped ${ruling.drifted.join(", ")}; ${remaining.length} independent famil${remaining.length === 1 ? "y" : "ies"} remain.` });
  if (remaining.length < MIN_FAMILIES) {
    breakers.push({ breaker: "QUORUM-LOSS", detail: "after dropping drifted voices fewer than two independent families remain; ruling withdrawn." });
    ruling = { ...ruling, ruling: "Refused: quorum was lost after a drifted voice was dropped. " + ruling.ruling, confidence: "refused" };
  }
}
if (stakes === "dispute" && ruling.unanimous && ruling.confidence === "high") {
  breakers.push({
    breaker: "CONVERGENCE",
    detail: "unanimous on a real dispute: the ruling rests on unanimous-but-unverified agreement; confidence capped at medium.",
  });
  ruling = { ...ruling, confidence: "medium" };
}
if (stakes === "routine" && ruling.confidence === "refused" && ruling.contradictions.length > 0 && voiceCalls < VOICE_CALL_CEILING && ROUNDS > 1) {
  const rebuttal = await askSession(
    "The chair could not rule. Disagreements recorded:\n" +
      ruling.contradictions.join("\n") +
      "\n\nRespond once: does your position survive these objections?\n" +
      answerFormat,
  );
  report({ round: 2, ...rebuttal }, "voices");
  ruling = await chair.ask<Ruling>(
    "One rebuttal round is in. Rebuttal from the in-session voice:\n" +
      JSON.stringify(rebuttal, null, 2) +
      '\n\nRule now: if the disagreement survives the rebuttal, keep confidence "refused" and record it. Update the record file you wrote and return the same recordPath.',
  );
}

const md = [
  "# Council ruling",
  "",
  "**Question:** " + question,
  "",
  "**Router:** " + protocol + ". " + gradeLine,
  "",
  "**Variables (proposed defaults, pending Owen):** #providers " + MIN_FAMILIES + ", call ceiling " + VOICE_CALL_CEILING + ", #rounds " + ROUNDS + ". Voice calls used: " + voiceCalls + ".",
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
  "## Circuit breakers",
  ...(breakers.length === 0 ? ["_None tripped._"] : breakers.map((b) => "- **" + b.breaker + "**: " + b.detail)),
  "",
  "## Routing",
  ...routeLines.map((l) => "- `" + l + "`"),
  "",
  "## Voices",
  ...ruling.voicesHeard.map((l) => "- " + l),
  "",
  "Full record: `" + ruling.recordPath + "`",
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
      : "Council ruling (" + ruling.confidence + ", " + protocol + "): " + ruling.ruling,
  findings: finalRound.map((v) => ({
    voice: v.voice + " (" + v.family + ")",
    what: v.position === "" ? v.status : v.position,
    evidence: v.evidence,
    status: v.status === "available" ? "verified" : "unconfirmed",
    severity: "low",
  })),
  verified: [
    `independent families heard: ${countedFamilies(finalRound, ruling.drifted).join(", ")}`,
    `${voiceCalls} voice calls under a ceiling of ${VOICE_CALL_CEILING}`,
    "ruling record written by the chair to " + ruling.recordPath,
  ],
  notCovered: [
    ...finalRound.filter((v) => !isLive(v)).map((v) => `${v.voice} skipped: ${v.status}`),
    ...breakers.map((b) => `breaker ${b.breaker}: ${b.detail}`),
    "LOOP-BREAKER cannot trip at #rounds 2; wall-clock COST/TIME is not measurable inside a workflow, only the call ceiling",
    "VOTE is not wired: the router routes to no VOTE protocol by default",
    "no repository check gates a design ruling; the decider experiment is named in the ruling",
  ],
};
return result;
