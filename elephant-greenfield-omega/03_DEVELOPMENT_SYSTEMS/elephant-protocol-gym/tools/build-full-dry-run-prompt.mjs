// Dependency-free assembler for the Elephant Protocol Gym full dry-run prompt.
//
// WHAT THIS IS: it concatenates the canonical Gym documents into one paste-ready
// prompt, so an operator can hand a complete session its seed + policy + fixture +
// one arm + the run-note contract without copying text by hand.
//
// WHAT THIS IS NOT: not a new protocol, not an editor of any source document, not
// authorization to launch anything, and not evidence that any Gym run happened.
// Sources are embedded VERBATIM with sha256 custody. Edit the sources, rerun this.
//
// Usage:
//   node tools/build-full-dry-run-prompt.mjs                 # all slices
//   node tools/build-full-dry-run-prompt.mjs --arm A         # one arm slice
//   node tools/build-full-dry-run-prompt.mjs --arm reviewer  # reviewer slice
//   node tools/build-full-dry-run-prompt.mjs --arm all       # every slice
//   node tools/build-full-dry-run-prompt.mjs --arm A --out /tmp/prompt-A.md
import {readFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const home = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// audience keys decide which slice embeds a section:
//   core       every arm and the reviewer
//   decision   every arm (owner decisions 1-3 the runs must apply)
//   direction  every arm (owner-approved designer direction, P1-P4)
//   state      every arm (initial-state anchor + optional Wasm booster)
//   arm:<ID>   exactly that arm only
//   phase0     arms C and D, optional swarm arm, reviewer (SDK self-hosting + visual)
//   reuse      arms may read it; if they do they MUST disclose the reuse (Decision 2)
//   afterR0    reviewer only, and only AFTER round-0 notes exist (blind discovery)
//   swarm      optional fifth arm (adaptive Elephant swarm)
//   contract   optional compact machine-contract reference (protocol backbone)
const SECTIONS = [
  {id: 'policy', audience: 'core', file: 'LAUNCH_POLICY.md', title: 'Canonical Gym Launch Policy (owner-confirmed decisions 1-4)'},
  {id: 'seed', audience: 'core', file: 'CORE_SEED.md', title: 'Shared Seed (identical for every independent arm)'},
  {id: 'fixture', audience: 'core', file: 'fixture/001-semantic-basics.ts', title: 'Common fixture - the tiny ordinary TypeScript file every run starts from', lang: 'typescript'},
  {id: 'runA', audience: 'arm:A', file: 'RUN_A_SOURCE_MEANING.md', title: 'YOUR ARM A - Source First, Meaning Second'},
  {id: 'runB', audience: 'arm:B', file: 'RUN_B_COMPILER_BOUNDARY.md', title: 'YOUR ARM B - Semantic Compiler and Human/Machine Boundary'},
  {id: 'runC', audience: 'arm:C', file: 'RUN_C_WIKICORE_SELF_RUNTIME.md', title: 'YOUR ARM C - WikiCore Verbs and Self-Runtime'},
  {id: 'runD', audience: 'arm:D', file: 'RUN_D_ELEPHANT_TOOLKIT.md', title: 'YOUR ARM D - Elephant Self-Optimization and Automation Toolkit'},
  {id: 'signal', audience: 'decision', file: 'MACHINE_HUMAN_SIGNAL.md', title: 'Decision 3 - the Machine <-> Human learning signal every run must expose'},
  {id: 'feeder', audience: 'decision', file: 'FEEDER_REUSE.md', title: 'Decision 1 - reuse the existing source feeder and custody contracts'},
  {id: 'automation', audience: 'decision', file: 'AUTOMATION_REUSE.md', title: 'Decision 2 - reuse existing automation as replaceable controls'},
  {id: 'direction', audience: 'direction', file: 'OWNER_APPROVED_DESIGNER_DIRECTION_2026-10-11.md', title: 'Owner-approved designer direction - five corrections and P1-P4 evidence priorities'},
  {id: 'initial', audience: 'state', file: 'INITIAL_STATE.md', title: 'Initial state - infinite 3D canvas and shared human/machine execution manifold'},
  {id: 'wasm', audience: 'state', file: 'WASM_BOOSTER.md', title: 'WebAssembly is an optional booster, never a required runtime'},
  {id: 'dogfood', audience: 'phase0', file: 'SDK_SELF_HOSTING_DOGFOOD.md', title: 'Phase 0 primary dogfood - the SDK must explain and test its own toolchain'},
  {id: 'visual', audience: 'phase0', file: 'CORE_VISUAL_LANGUAGE.md', title: 'Core visual language - machine-readable visual assertions and safe user reprogramming'},
  {id: 'cases', audience: 'phase0', file: 'corpus/self-hosting-cases.json', title: 'Starter falsifiable self-hosting cases', lang: 'json'},
  {id: 'universal', audience: 'phase0', file: 'UNIVERSAL_SEMANTIC_GOVERNANCE.md', title: 'Universal U0-U5 code and tooling command->Wiki governance'},
  {id: 'symbolic', audience: 'reuse', file: 'SYMBOLIC_LANGUAGE_INTAKE.md', title: 'Recovered 17-family symbolic language - source-inspected prior art, not prescribed syntax', disclose: true},
  {id: 'legacy', audience: 'afterR0', file: 'LEGACY_ALIGNMENT_MAP.md', title: 'Ten historical capability classes - REVIEWER lens, only after round-0 notes exist', disclose: true},
  {id: 'swarm', audience: 'swarm', file: 'ADAPTIVE_SWARM.md', title: 'Optional fifth arm - elastic parallel Elephant self-organization'},
  {id: 'stream', audience: 'swarm', file: 'adaptive-swarm/STREAM_STARTER.md', title: 'Adaptive swarm stream starter prompt'},
  {id: 'manifest', audience: 'swarm', file: 'adaptive-swarm/launch-manifest.json', title: 'Adaptive swarm machine-readable launch manifest', lang: 'json'},
  {id: 'backbone', audience: 'contract', file: 'protocol-backbone/README.md', title: 'Protocol backbone (candidate) - compact machine cards, not a ratified runtime'},
  {id: 'registry', audience: 'contract', file: 'protocol-backbone/registry.json', title: 'Protocol registry - source provenance', lang: 'json'},
  {id: 'profiles', audience: 'contract', file: 'protocol-backbone/profiles.json', title: 'Composition profiles - four experiments, none authorizes execution', lang: 'json'},
  {id: 'crosswalk', audience: 'contract', file: 'protocol-backbone/crosswalk.json', title: 'Source-to-contract crosswalk - 19 mappings with PARTIAL_MAPPING honesty labels', lang: 'json'},
];

// Documents deliberately NOT embedded: they are alternative designs, not Round-0 canon.
const EXCLUDED = [
  ['PROPOSAL_R0_FIVE_GYM_TIMED_FANOUT_TO_B1_2026-10-11.md', 'Timed five-Gym fan-out to B1: a SECOND launch design for independent review, not the four-arm dry run. Do not let it pre-load arm conclusions.'],
  ['r0-five-gym/', 'Five independent one-turn briefs (G1-G5) for the alternative timed design; read only when the owner chooses that design or for Round-1 second opinion.'],
  ['PROPOSAL_LEGACY_SEMANTIC_ARCHAEOLOGY_AND_REUSE_2026-10-11.md', 'Legacy archaeology pack: retained as historical research intelligence, explicitly non-prescriptive (owner disposition 2026-10-11).'],
  ['ELEPHANT_INTELLIGENCE_PRESERVATION.md', 'Preservation index: required when a run recovers prior Elephant work or claims reuse of it.'],
];

const ARMS = ['A', 'B', 'C', 'D'];
const PHASE0_ARMS = ['C', 'D'];

function wanted(section, slice) {
  if (slice === 'all') return true;
  if (slice === 'reviewer') return section.audience !== 'arm:A' && section.audience !== 'arm:B' && section.audience !== 'arm:C' && section.audience !== 'arm:D';
  if (section.audience === 'core' || section.audience === 'decision' || section.audience === 'direction' || section.audience === 'state') return true;
  if (section.audience === `arm:${slice}`) return true;
  if (section.audience === 'phase0') return PHASE0_ARMS.includes(slice);
  if (section.audience === 'reuse') return true;
  return false;
}

const fence = (lang, text) => ['```' + lang, text.replace(/\n+$/, ''), '```'].join('\n');

// A prepended banner is decoration the assembler adds, not source text. It MUST be
// recorded as decoration, because a custody check that hashes alone would otherwise
// attest the source sha256 while the rendered body differs — and would conclude
// "verbatim" about a body that is not. sha256 attests INPUT identity; only a body
// comparison attests RENDER fidelity. Those are two claims and are reported as two.
const DISCLOSURE_BANNER = section => section.disclose
  ? `\n> **DISCLOSURE RULE:** if your run reads this document, the run note must say so and mark the affected result **LEGACY-SEEDED REUSE**, not a blind discovery.`
  : '';

function embed(section) {
  const path = join(home, section.file);
  if (!existsSync(path)) throw new Error(`missing canonical source: ${section.file}`);
  const raw = readFileSync(path, 'utf8');
  const sha = createHash('sha256').update(raw).digest('hex');
  const sourceBody = section.lang ? fence(section.lang, raw) : raw.replace(/\n+$/, '');
  const banner = DISCLOSURE_BANNER(section);
  const body = banner ? [banner, sourceBody].join('\n\n') : sourceBody;

  // rendered_body_identical is false whenever the assembler decorated the body. It is
  // computed, never asserted, so the two custody claims can never silently agree.
  const renderedIdentical = banner === '';

  // The BEGIN/END block is a WIRE FORMAT consumed by master-exec's custody-check.mjs, which
  // (a) matches the marker with an anchored regex and (b) treats everything after the
  // `*Source:` line as the body. So the marker stays byte-identical and every custody
  // annotation is emitted BEFORE the block, never inside it. Putting decoration in either
  // place silently breaks that checker's reproduction — which is how this was found, and is
  // itself an instance of the round's own lesson: an instrument change that looked harmless
  // turned a green reproduction red.
  const begin = `<!-- BEGIN VERBATIM ${section.file} sha256:${sha} bytes:${Buffer.byteLength(raw)} -->`;
  const end = `<!-- END VERBATIM ${section.file} -->`;
  const annotation = [
    `<!-- CUSTODY sha256_match:true rendered_body_identical:${renderedIdentical}${renderedIdentical ? '' : ' reason:assembler-prepended-disclosure-banner'} -->`,
    `*Custody: sha256 attests the source bytes (${Buffer.byteLength(raw)}); rendered_body_identical is ${renderedIdentical}${renderedIdentical ? '.' : ' — the assembler prepended a DISCLOSURE banner that is NOT in the source file.'}*`,
  ].join('\n');
  return {
    section, sha, bytes: Buffer.byteLength(raw), renderedIdentical, body,
    text: [annotation, begin, `## ${section.title}`, `*Source: \`${section.file}\` — embedded verbatim, do not edit here.*`, body, end].filter(Boolean).join('\n\n'),
  };
}

function header(slice, parts) {
  const arm = ARMS.includes(slice) ? `RUN ${slice}` : slice === 'swarm' ? 'ADAPTIVE SWARM STREAM' : slice === 'reviewer' ? 'REVIEWER' : 'ALL SLICES (REFERENCE MASTER)';
  const lines = [
    '# Elephant Protocol Gym — FULL DRY-RUN PROMPT (assembled)',
    '',
    `**Slice: ${arm}.** **Status: ASSEMBLED FRESH FROM CANONICAL SOURCES.**`,
    '',
    '> **This file is a launch artifact, not a record of what has already happened.** Round 0 (arms A-D) and a Round 1 reviewer synthesis were executed on 2026-10-12 at pinned commit `1199b38`; their evidence lives in `runs/` and nothing from them was ratified. A rebuilt slice describes a *new* launch, so it must never claim the Gym is unrun — and must never claim prior results are settled. Verify execution state against `runs/` and the run receipts, never against prose.',
    '',
  ];
  if (slice === 'all') {
    lines.push(
      '> **DO NOT PASTE THIS FILE INTO AN ARM SESSION.** This master embeds all four arm prompts plus the reviewer lens. A run that has read them is no longer an independent arm: label it PROCESS_REHEARSAL and expect a degraded Round 0. Use it to read, audit, plan or launch — then hand each arm its own single-arm slice.',
      '',
    );
  }
  lines.push(
    '## How to use this file',
    '',
    '- **Paste the whole file into ONE fresh, isolated session per arm.** Independence is the experiment: four genuinely separate contexts answering four different questions from one identical seed.',
    '- **Do not merge arms into one session.** A single session holding all four prompts destroys the comparison that makes Round 0 valuable and must be reported as PROCESS_REHEARSAL, not a four-arm study.',
    '- **Pin the repo commit you actually used** and state it in the run note. Relative links inside the embedded documents resolve from `elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/`; for hosted sessions use absolute GitHub URLs from that root and record the SHA.',
    '- **Read-only is the default.** Do not edit the shared seed, this assembled file, or main. Work in a disposable worktree or scratch directory.',
    '',
    '## Non-negotiable honesty rules for every arm',
    '',
    '1. Label every claim PROPOSED / OBSERVED / TESTED / UNKNOWN. Never present an agent self-report as independent proof.',
    '2. Executed vs merely proposed must be explicit; an unrun experiment is NOT_RUN with a reproducible procedure, never an invented number.',
    '3. Preserve source truth and provenance; separate claims from verified behavior; preserve human authorization for external effects; no self-authorizing tool.',
    '4. This run conditions protocol/tooling/context only. It does **not** train model weights and must never be described as fine-tuning.',
    '5. Actual Elephant development turns still owe the all-state capability-pack publication; this short run note does not replace it.',
    '6. Authority: owner-approved direction ≠ executable authorization. A proposal is not a decision; an experiment is not a production result.',
    '',
    '## What is embedded, and for whom',
    '',
    'Sections are embedded verbatim from canonical sources with sha256 custody. Gating is deliberate — some material must NOT be read before independent rounds.',
    '',
    '| # | Section | Audience |',
    '|---|---|---|',
  );
  parts.forEach((p, i) => lines.push(`| ${i + 1} | ${p.section.title} | \`${p.section.audience}\` |`));
  lines.push('');
  lines.push('Deliberately **not** embedded (alternative designs and historical packs — read only when the owner chooses them, or at Round 1):');
  lines.push('');
  EXCLUDED.forEach(([what, why]) => lines.push(`- \`${what}\` — ${why}`));
  lines.push('');
  lines.push('### Withheld from arm slices on purpose');
  lines.push('');
  if (ARMS.includes(slice)) {
    lines.push('- `LEGACY_ALIGNMENT_MAP.md` — the blind-discovery protection. A run must find what the source needs before it sees what previous runs already found, and must label itself LEGACY-SEEDED REUSE if it reads the map anyway.');
    lines.push('- `protocol-backbone/*` — composed protocol cards would pre-empt the discovery this dry run exists to perform. Use them as the reviewer/execution-side contract, not as arm input.');
    lines.push('- `ADAPTIVE_SWARM.md`, `adaptive-swarm/*` — optional fifth arm only; launching it alongside A-D changes the experiment design.');
  } else {
    lines.push('- The four `RUN_*.md` arm prompts are mutually exclusive by design; the reviewer compares notes, it does not re-run an arm.');
  }
  lines.push('- Every section above is copied from a canonical source with its sha256. **If a section contradicts this header, the canonical source and the owner win** — report the conflict, do not resolve it silently.');
  return lines.join('\n');
}

// A launch manifest says exactly what a session is being handed and what it must not read.
// It is GENERATED from the same section table that built the slice, so the two can never
// drift: if a section is added to an audience, it appears in both. The manifest is not a
// curation surface — nobody hand-picks an arm's contents, which is what keeps the
// dispatcher's power structural rather than editorial.
function manifest(slice, parts, text) {
  const included = parts.map(p => ({
    file: p.section.file,
    audience: p.section.audience,
    sha256: p.sha,
    bytes: p.bytes,
    rendered_body_identical: p.renderedIdentical,
  }));
  const forbidden = SECTIONS.filter(s => !parts.some(p => p.section.id === s.id)).map(s => s.file);
  return {
    schema: 'epg.launch-manifest/0.1',
    generated_by: 'tools/build-full-dry-run-prompt.mjs',
    slice,
    slice_sha256: createHash('sha256').update(text).digest('hex'),
    slice_bytes: Buffer.byteLength(text),
    arm_file: parts.find(p => p.section.audience.startsWith('arm:'))?.section.file ?? null,
    independence: {
      rule: 'This slice must be the ONLY Elephant Gym material the session reads before it starts.',
      one_arm_per_session: true,
      forbidden_before_start: forbidden,
      disclosure: [
        'A session that reads ANY other arm prompt or result is no longer an independent arm.',
        'Label such a run PROCESS_REHEARSAL and state exactly what was read and when.',
        'A self-reported transcript is not proof of execution; attach a reproducible command.',
      ],
    },
    included_sections: included,
    receipt_contract: {
      run_note: 'RUN_NOTE.md following REVIEW.md, all ten template fields present',
      machine_human_signal: 'Decision 3 — source/task, machine meaning, human reading, comparison, evidence status, next test',
      labels_required: ['PROPOSED', 'OBSERVED', 'TESTED', 'NOT_RUN', 'UNKNOWN'],
      mint_command: 'node tools/mint-receipt.mjs --run <RUN-ID>  (after writing runs/receipts/<RUN-ID>.decl.json)',
    },
    prohibitions: [
      'No edits to the shared seed, this slice, or main.',
      'No credential, provider or account configuration changes.',
      'No spawning of further agents.',
      'No claim of a launched system without real execution evidence.',
      'This is protocol/tooling conditioning, NOT model weight training.',
    ],
  };
}

function build(slice) {
  const parts = SECTIONS.filter(s => wanted(s, slice)).map(embed);
  if (slice === 'reviewer' && !parts.some(p => p.section.audience === 'afterR0')) {
    throw new Error('reviewer slice must include the after-round-0 reviewer lens');
  }
  const body = parts.map((p, i) => `## Section ${i + 1} of ${parts.length} — ${p.section.title}\n\n${p.text}`).join('\n\n');
  const text = [header(slice, parts), '---\n', body].join('\n\n');
  return {text, parts, manifest: manifest(slice, parts, text)};
}

function main() {
  const argv = process.argv.slice(2);
  const armIdx = argv.indexOf('--arm');
  const outIdx = argv.indexOf('--out');
  const slices = armIdx === -1 ? [...ARMS, 'reviewer'] : [argv[armIdx + 1]];
  if (outIdx !== -1 && slices.length > 1) throw new Error('--out takes a single slice');

  const reports = [];
  for (const slice of slices) {
    if (slice !== 'all' && !ARMS.includes(slice) && slice !== 'reviewer') {
      throw new Error(`unknown slice "${slice}" (use A|B|C|D|reviewer|all)`);
    }
    const {text, parts, manifest: man} = build(slice);
    const name = slice === 'all' ? 'FULL_DRY_RUN_PROMPT_ALL' : `FULL_DRY_RUN_PROMPT_${slice.toUpperCase()}`;
    const out = outIdx === -1 ? join(home, 'built', `${name}.md`) : resolve(argv[outIdx + 1]);
    mkdirSync(dirname(out), {recursive: true});
    writeFileSync(out, text);
    // The manifest is generated beside the slice so a launcher never hand-assembles one.
    const manPath = join(dirname(out), `${name}.manifest.json`);
    writeFileSync(manPath, JSON.stringify(man, null, 2) + '\n');
    reports.push({slice, out, manifest: manPath, sections: parts.length, bytes: Buffer.byteLength(text), decorated: parts.filter(p => !p.renderedIdentical).length});
  }
  for (const r of reports) {
    console.log(JSON.stringify({slice: r.slice, out: r.out, manifest: r.manifest, sections: r.sections, bytes: r.bytes, decorated_sections: r.decorated}, null, 0));
  }
  console.log('generated artifacts: edit the canonical sources and rerun; do not hand-edit these files.');
}

// Compare via pathToFileURL, not a hand-rolled "file://"+argv string: that form throws
// Invalid URL when argv[1] is ALREADY a file URL (which is exactly what happens when
// this module is imported by a child process), so the guard itself became the bug.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();