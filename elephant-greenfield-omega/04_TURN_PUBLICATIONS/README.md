# 04 — Turn Publications and Capability-Pack Exchange

This is the durable receiving and lookup layer for every independently operating author, general Z.ai A/B/C track, and proposal-specific Z.ai development instance.

**No maturity gate:** at the end of EVERY bounded top-level development turn, publish a complete, versioned inventory of **ALL** the track's capability packs and their actual transferable materials, including discovered hypotheses, unverified drafts, partial or failing code, blocked attempts, negative results, verified tools, and retired/rejected work. A no-op or blocked turn must still publish the full inventory with an honest delta. At every experiment round close, publish a consolidated round snapshot too.

A changed pack's actual content, tests and evidence must be retrievable without the originating model chat. Unchanged packs may refer to previously published immutable, hash-addressed materials instead of duplicating everything. Publication is about completeness; VERIFIED/PORTABLE/COMPOSED certification remains separate and needs independent proof.

## Logical namespace guidance
- general-zai-lab/A, B, C: three internal research tracks of the original unrestricted Z.ai lab;
- proposal-specific/<proposal-id>: one separately started full Z.ai session per actual submitted authored architecture;
- architect-authors/<author-id>: revised independent architecture design portfolios when relevant;
- comparisons: independently judged cross-track/proposal scorecards and assembly tests.

A lab can choose its physical file structure but must preserve these identities and a verifiable full-inventory exchange. Git main stores sanitized summary, immutable index and source/test references; confidential logs may stay in restricted hash-addressed storage.

## Publication vs maturity vs actual execution
A portfolio is PUBLISHED only when independent retrieval/checksum succeeds. A pack is VERIFIED only on reproducible independent claims. A lab is actually RUNNING only when real session and tool-call evidence exists. Missing live data is UNKNOWN or NOT STARTED, not zero. A failed publish remains staged and marked UNPUBLISHED; retry before claiming turn completion.

See TURN_RELEASE_FIELDS_AND_LIFECYCLE.md and CURRENT_PUBLICATION_INDEX.md. Binding source: ../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md.
