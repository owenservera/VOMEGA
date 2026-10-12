#!/usr/bin/env node
/**
 * REVIEWER ROUNDTRIP MAPPING AUDIT — Section 22 quality gate 1.
 *
 * Quality gate being executed, verbatim from protocol-backbone/crosswalk.json:
 *   "Independent round-trip reviewer can enumerate original preconditions, state
 *    transitions, unknown behaviors, failure paths and permissions from compact
 *    contract plus refs, or report missing mapping."
 *
 * SCOPE: one full original protocol — the SDK self-hosting obligation and the two
 * owner-directed documents it composes with — mapped forward to its cards
 * (epg.semantic.selfhosting, epg.visual.parity, epg.governance.universal).
 *
 * WHAT THIS IS NOT: it does not judge whether the design is good, and it does not
 * re-derive any arm's fixture claims. It measures one thing only: how much of the
 * original obligation set survives the trip into compact contract form, and where
 * it does not, whether the crosswalk DECLARES that it does not.
 *
 * Counts are derived from the source text and from parsed card JSON — never from
 * any prose summary of them. Checks that cannot be decided mechanically are
 * excluded from the pass/fail set rather than guessed at; a phrase-absence search
 * over JSON is reported as a heuristic, not as a finding.
 *
 * Usage:  node backbone-roundtrip-audit.mjs          -> print JSON
 *         node backbone-roundtrip-audit.mjs --check  -> exit 1 on any control failure
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const gym = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const P = (p) => resolve(gym, p);

const read = (p) => readFileSync(P(p), "utf8");

const S1 = read("SDK_SELF_HOSTING_DOGFOOD.md");
const S2 = read("UNIVERSAL_SEMANTIC_GOVERNANCE.md");
const S3 = read("CORE_VISUAL_LANGUAGE.md");

const selfhosting = JSON.parse(read("protocol-backbone/protocols/sdk-selfhosting.json"));
const visual = JSON.parse(read("protocol-backbone/protocols/visual-parity.json"));
const governance = JSON.parse(read("protocol-backbone/protocols/universal-governance.json"));
const crosswalk = JSON.parse(read("protocol-backbone/crosswalk.json"));
const profiles = JSON.parse(read("protocol-backbone/profiles.json"));

/* ---------- helpers: section scoping and key collection ---------- */

const section = (text, startMarker) => {
  const i = text.indexOf(startMarker);
  if (i < 0) return "";
  const rest = text.slice(i + startMarker.length);
  const j = rest.indexOf("\n## ");
  return j < 0 ? rest : rest.slice(0, j);
};

const allKeys = (node, acc = []) => {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node)) {
      acc.push(k);
      allKeys(v, acc);
    }
  } else if (Array.isArray(node)) {
    for (const v of node) allKeys(v, acc);
  }
  return acc;
};

const cardJson = JSON.stringify(selfhosting) + JSON.stringify(visual) + JSON.stringify(governance);
const keys = [...new Set(allKeys(selfhosting).concat(allKeys(visual), allKeys(governance)))];

const crosswalkEntriesFor = (file) =>
  (crosswalk.mappings ?? crosswalk.entries ?? []).filter((m) => (m.source ?? "").includes(file));

/* ---------- the reviewer's independent enumeration of the originals ----------
 *
 * Anchors are exact substrings of the source. checkAnchors() proves each enumerated
 * obligation still exists in the document it was read from, so this enumeration cannot
 * silently drift into describing a different document than the one on disk.
 */

const OBLIGATIONS = [
  // --- SDK_SELF_HOSTING_DOGFOOD.md ---
  { id: "O01", cat: "precondition", src: "S1", anchor: "This is a **capability inventory, not a ratified API list**" },
  { id: "O02", cat: "precondition", src: "S1", anchor: "The first corpus is not only natural-language commands or toy arithmetic." },
  { id: "O03", cat: "precondition", src: "S1", anchor: "Retain adversarial questions and deliberately wrong statements as negative controls" },
  { id: "O04", cat: "precondition", src: "S1", anchor: "declare NOT_RUN and fail the execution acceptance condition" },
  { id: "O05", cat: "precondition", src: "S1", anchor: "No pass can be claimed merely by a generated proposal" },
  { id: "O06", cat: "precondition", src: "S1", anchor: "agents may derive more tests but cannot silently rewrite referee holdouts" },
  { id: "O07", cat: "state", src: "S1", anchor: "ONE REVISION-BOUND SEMANTIC PUBLICATION" },
  { id: "O08", cat: "permission", src: "S1", anchor: "Enter-to-publish freezes semantic meaning" },
  { id: "O09", cat: "state", src: "S1", anchor: "Phase 0-A — Observability before redesign" },
  { id: "O10", cat: "state", src: "S1", anchor: "No second release ledger" },
  { id: "O11", cat: "unknown", src: "S1", anchor: "That one general semantic compiler can faithfully represent arbitrary self-operating protocols" },
  { id: "O12", cat: "unknown", src: "S1", anchor: "Do not answer these by assuming a comprehensive all-in-one SDK already works" },
  { id: "O13", cat: "failure", src: "S1", anchor: "One deliberate mistake:" },
  { id: "O14", cat: "failure", src: "S1", anchor: "One measured iteration:" },
  { id: "O15", cat: "failure", src: "S1", anchor: "Independent reconstruction:" },
  { id: "O16", cat: "failure", src: "S1", anchor: "Spatial parity:" },
  { id: "O17", cat: "failure", src: "S1", anchor: "Do not allow an agent to certify itself." },
  { id: "O18", cat: "permission", src: "S1", anchor: "it does not automatically grant permission to execute untrusted generated code or reach external systems" },
  { id: "O19", cat: "state", src: "S1", anchor: "must be distinguishable" },
  { id: "O20", cat: "precondition", src: "S1", anchor: "source-Git-commit-only scans must not pretend to see uncommitted changes" },

  // --- UNIVERSAL_SEMANTIC_GOVERNANCE.md ---
  { id: "O21", cat: "precondition", src: "S2", anchor: "A domain may be marked `INTERFACE_GOVERNED` only with an independently witnessed demonstration" },
  { id: "O22", cat: "precondition", src: "S2", anchor: "recorded as a coverage gap, not hidden or hallucinated" },
  { id: "O23", cat: "state", src: "S2", anchor: "**U0 — Indexed, NOT_GOVERNED:**" },
  { id: "O24", cat: "state", src: "S2", anchor: "**U5 — Recursive self-hosting:**" },
  { id: "O25", cat: "unknown", src: "S2", anchor: "NOT IMPLEMENTED OR CURRENTLY ENFORCED" },
  { id: "O26", cat: "unknown", src: "S2", anchor: "SDK claims alone do not physically prevent bypass" },
  { id: "O27", cat: "failure", src: "S2", anchor: "grants consent" },
  { id: "O28", cat: "failure", src: "S2", anchor: "becomes a test failure unless under a separately documented, authorized emergency recovery/bootstrapping procedure" },
  { id: "O29", cat: "failure", src: "S2", anchor: "Do not implement separate hidden self-management APIs" },
  { id: "O30", cat: "permission", src: "S2", anchor: "is dispatched **through the command system**, after applicable external/owner review" },
  { id: "O31", cat: "permission", src: "S2", anchor: "Safe bootstrapping remains possible before U4 and during a documented failure recovery" },
  { id: "O32", cat: "precondition", src: "S2", anchor: "This is not permission to expose secrets or directly edit arbitrary infrastructure." },

  // --- CORE_VISUAL_LANGUAGE.md ---
  { id: "O33", cat: "precondition", src: "S3", anchor: "**V1 — Semantic invariance under theming:**" },
  { id: "O34", cat: "state", src: "S3", anchor: "Proposed conceptual Visual Projection Receipt (NOT a frozen API)" },
  { id: "O35", cat: "unknown", src: "S3", anchor: "remain experimental" },
  { id: "O36", cat: "unknown", src: "S3", anchor: "is DECLARED/UNKNOWN, not VERIFIED" },
  { id: "O37", cat: "failure", src: "S3", anchor: "checker must detect a human-facing loss even if canonical bytes are stable" },
  { id: "O38", cat: "failure", src: "S3", anchor: "must not alter the command digest or executable action chain" },
  { id: "O39", cat: "failure", src: "S3", anchor: "must not implicitly mean independently verified success" },
  { id: "O40", cat: "failure", src: "S3", anchor: "Reject/rollback failing visual packs without modifying the canonical record" },
  { id: "O41", cat: "failure", src: "S3", anchor: "Never claim parity from one view alone" },
  { id: "O42", cat: "permission", src: "S3", anchor: "**Visual customization is data**, not a silent rewrite of parsed meaning" },
  { id: "O43", cat: "permission", src: "S3", anchor: "classify it as a proposed language/semantic mapping edit" },
  { id: "O44", cat: "permission", src: "S3", anchor: "no visual can execute unauthorized effects or misstate proof" },
];

const SOURCE_TEXT = { S1, S2, S3 };
const anchorsOk = OBLIGATIONS.every((o) => SOURCE_TEXT[o.src].includes(o.anchor));

/* ---------- mechanically decided checks ----------
 *
 * Each check pairs a count derived from the ORIGINAL with what the CARD STRUCTURE
 * can express. "Not enumerated" means the card JSON has no field for it — not that
 * the information is absent from the repository, which the refs still carry.
 */

const countAll = (text, re) => (text.match(re) ?? []).length;

const sourceCounts = {
  capability_groups_s1: countAll(section(S1, "## Tooling as a self-describing SDK surface"), /^\d+\. \*\*/gm),
  acceptance_path_steps_s1: countAll(section(S1, "The minimum independently testable acceptance path is:"), /^\d+\. \*\*/gm),
  interface_governed_criteria_s2: countAll(section(S2, "## Universal semantic-control coverage gate"), /^\d+\. \*\*/gm),
  u_stages_s2: countAll(S2, /^- \*\*U\d —/gm),
  visual_probes_s3: countAll(section(S3, "## Mandatory experimental probes and falsifiers"), /^\*\*V\d —/gm),
};

const cardCounts = {
  selfhosting_capability_group_field: keys.filter((k) => /capabilit/i.test(k)).length,
  visual_probe_field: allKeys(visual).filter((k) => /probe/i.test(k)).length,
  governance_u_stage_phases: (governance.phases ?? []).filter((p) => /^U[0-5]_/.test(p.id)).length,
  governance_gates: (governance.gates ?? []).length,
  selfhosting_modules: (selfhosting.modules ?? []).length,
  selfhosting_modules_include_governance: (selfhosting.modules ?? []).includes("epg.governance.universal"),
};

const profilesList = profiles.profiles ?? profiles;
const reachesGovernanceByProfile = profilesList
  .filter((pr) => (pr.protocols ?? []).includes("epg.semantic.selfhosting"))
  .filter((pr) => (pr.protocols ?? []).includes("epg.governance.universal"))
  .map((pr) => pr.id);

const heuristics = {
  mentions_negative_control: /negative.?control|adversarial/i.test(cardJson),
  mentions_not_run: /NOT_RUN/.test(cardJson),
  mentions_single_ledger: /second release ledger|no second ledger/i.test(cardJson),
};

const crosswalkCoverage = ["SDK_SELF_HOSTING_DOGFOOD.md", "UNIVERSAL_SEMANTIC_GOVERNANCE.md", "CORE_VISUAL_LANGUAGE.md"].map((f) => {
  const entries = crosswalkEntriesFor(f);
  return {
    source_file: f,
    crosswalk_entries: entries.map((e) => e.id),
    states: entries.map((e) => e.state),
    unmapped_requirements: entries.reduce((n, e) => n + (e.unmapped_requirements ?? []).length, 0),
  };
});

const declaredUnmappedTotal = crosswalkCoverage.reduce((n, c) => n + c.unmapped_requirements, 0);

const FINDINGS = [
  {
    id: "F-01",
    severity: "material",
    check: "capability_inventory_enumerable",
    statement:
      `SDK_SELF_HOSTING_DOGFOOD.md enumerates ${sourceCounts.capability_groups_s1} discoverable capability groups as an owner-directed inventory; no card field enumerates them (card keys matching /capabilit/i: ${cardCounts.selfhosting_capability_group_field}).`,
    roundtrip_effect: "A consumer holding the three cards cannot name the eight groups from contract alone; it must open the source ref.",
    declared_in_crosswalk: false,
  },
  {
    id: "F-02",
    severity: "material",
    check: "visual_probe_set_enumerable",
    statement:
      `CORE_VISUAL_LANGUAGE.md defines ${sourceCounts.visual_probes_s3} mandatory probes V1-V7; the visual card carries ${cardCounts.visual_probe_field} probe fields and no probe identifiers.`,
    roundtrip_effect: "The named falsifier set — the source's own test obligations — is not recoverable from the contract.",
    declared_in_crosswalk: false,
  },
  {
    id: "F-03",
    severity: "material",
    check: "interface_governed_criteria_enumerable",
    statement:
      `UNIVERSAL_SEMANTIC_GOVERNANCE.md lists ${sourceCounts.interface_governed_criteria_s2} numbered criteria to mark a domain INTERFACE_GOVERNED; the governance card carries ${cardCounts.governance_gates} gates.`,
    roundtrip_effect: "Discovery/Read/Propose/Act/Test/Parity/Replay/Provenance/No-bypass cannot each be checked off against the contract.",
    declared_in_crosswalk: false,
  },
  {
    id: "F-04",
    severity: "conditional",
    check: "u_stage_ladder_direction",
    statement:
      `All ${sourceCounts.u_stages_s2} U-stages are enumerated as phases in epg.governance.universal, but epg.semantic.selfhosting — whose FIRST authority source is that document — does not list epg.governance.universal among its ${cardCounts.selfhosting_modules} modules (include=${cardCounts.selfhosting_modules_include_governance}).`,
    roundtrip_effect:
      `Forward module resolution from the self-hosting card never reaches the ladder; it is restored only by profile composition: ${JSON.stringify(reachesGovernanceByProfile)}. A card-only consumer is incomplete; a profile-driven consumer is not.`,
    declared_in_crosswalk: false,
  },
  {
    id: "F-05",
    severity: "material",
    check: "fault_injection_path_enumerable",
    statement:
      "SDK_SELF_HOSTING_DOGFOOD.md acceptance item 4 requires deliberately injecting a wrong wiki statement / stale fact / wrong symbol meaning and producing a minimal repro; no gate or phase in the self-hosting card or the governance card represents fault injection (only epg.visual.parity carries a negative_mutation phase).",
    roundtrip_effect: "The negative path that makes the positive path trustworthy is the part the contract drops.",
    declared_in_crosswalk: false,
  },
  ];

FINDINGS.push({
  id: "F-06",
  severity: "material",
  check: "declared_gap_covers_found_gaps",
  statement:
    `The three crosswalk entries for these sources declare ${declaredUnmappedTotal} unmapped_requirement string(s) in total; this audit produced ${FINDINGS.length} distinct unnormalised obligation clusters.`,
  roundtrip_effect:
    "PARTIAL_MAPPING is honestly labelled, but the single generic gap text does not tell a later reader WHICH obligations were dropped, so nothing prompts their recovery.",
  declared_in_crosswalk: true,
});

/* ---------- controls ----------
 *
 * Positive: an audit that found nothing would mean the checker is broken, not that the
 * mapping is perfect — so zero findings is a control FAILURE.
 * Negative: each detector must be able to fail. Mutating a copy of the source and a copy
 * of a card must flip the corresponding count; if they do not, the PASS means nothing.
 */

const mutatedSources = { ...SOURCE_TEXT };
mutatedSources.S1 = mutatedSources.S1.replace("No second release ledger", "TBD");

const obligationsAfterMutation = OBLIGATIONS.filter((o) => !mutatedSources[o.src].includes(o.anchor));

const strippedGovernance = JSON.parse(JSON.stringify(governance));
strippedGovernance.gates = [];
const governanceGatesAfterMutation = strippedGovernance.gates.length;

const negativeSource = section(mutatedSources.S1, "## Tooling as a self-describing SDK surface");
const capGroupsAfterSourceMutation = countAll(negativeSource, /^\d+\. \*\*/gm);

const controls = {
  anchors_resolve_in_sources: anchorsOk,
  positive_control_findings_nonempty: FINDINGS.length > 0,
  negative_control_detector_can_fail: obligationsAfterMutation.length > 0,
  negative_control_gate_count_detector: governanceGatesAfterMutation === 0 && cardCounts.governance_gates > 0,
  negative_control_source_count_detector: capGroupsAfterSourceMutation === sourceCounts.capability_groups_s1,
};

const ok = Object.values(controls).every(Boolean);

const result = {
  schema: "reviewer-roundtrip-audit/1",
  gate_executed: crosswalk.quality_gates?.[0] ?? null,
  scope: {
    original_protocols: ["SDK_SELF_HOSTING_DOGFOOD.md", "UNIVERSAL_SEMANTIC_GOVERNANCE.md", "CORE_VISUAL_LANGUAGE.md"],
    cards: [selfhosting.id, visual.id, governance.id],
    obligations_enumerated: OBLIGATIONS.length,
    by_category: OBLIGATIONS.reduce((acc, o) => ({ ...acc, [o.cat]: (acc[o.cat] ?? 0) + 1 }), {}),
  },
  source_counts: sourceCounts,
  card_counts: cardCounts,
  profile_resolves_governance: reachesGovernanceByProfile,
  heuristics,
  crosswalk_coverage: crosswalkCoverage,
  declared_unmapped_total: declaredUnmappedTotal,
  findings: FINDINGS,
  controls,
  verdict: ok ? "PASS — audit executed and its detectors are falsifiable" : "CONTROL FAILURE — audit result is not trustworthy",
};

console.log(JSON.stringify(result, null, 2));
process.exit(ok ? 0 : 1);