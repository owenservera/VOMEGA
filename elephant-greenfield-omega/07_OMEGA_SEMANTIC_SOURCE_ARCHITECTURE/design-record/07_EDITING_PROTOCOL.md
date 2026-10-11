# How to Edit, Review and Evolve This Design Record

**Role:** evergreen editorial protocol. **Status:** FIRST PASS process proposal constrained by existing VOMEGA authority; does not independently delegate owner decisions. **Last reviewed:** 2026-10-11.

## The purpose of a living source of record

These files are deliberately **not dated snapshots**. The filenames stay the same as the design evolves. They represent what a new contributor should currently understand, while Git history and cited decisions preserve the path that led here. A change should leave the next reader less confused, not force them to reread five months of discussions or find a new document with a slightly newer date.

We keep the prose explanatory. A human should be able to read [01 — The current state](01_AGREED_STATE.md) as a coherent story before encountering symbols, formal claims or code. Technical readers should find precise distinctions in [02](02_SOURCE_TO_MEANING.md) and [05](05_PRINCIPLES_AND_CONTRACTS.md). When depth would obscure the main document, link a detailed experiment, model design or technical appendix rather than making the entry point unusable.

The design record distinguishes **recorded intent**, **engineering hypotheses**, **tested facts** and **approvals**. A statement may be important and still be unsettled. We do not gain rigor by pretending every design decision is already final.

## Which file should change?

Edit [01](01_AGREED_STATE.md) to change the concise presently understood design, not to debate a specific cache. Edit [02](02_SOURCE_TO_MEANING.md) when the file-to-semantics mental model or initial example changes. Edit [03](03_FEEDBACK_AND_EXPERIMENTS.md) to change experimental principles or benchmarks; put actual immutable run receipts in the existing lab publications. Edit [04](04_ELEPHANT_COEVOLUTION.md) for agent/cognition integration. Edit [05](05_PRINCIPLES_AND_CONTRACTS.md) for fundamental truth boundaries and candidate interfaces. Edit [06](06_DECISION_BOARD.md) to track unresolved alternatives, experiment triggers and linked resolutions. Edit [08](08_GLOSSARY.md) to keep language consistent.

Only this [07](07_EDITING_PROTOCOL.md) owns the editing rules. The [root design-record README](README.md) owns navigation. Do not create competing “latest state” files or date-stamped clones every time somebody changes their mind.

## Claim states — use them deliberately

**OWNER_CONFIRMED** means there is explicit, scoped owner guidance with an actual source reference, typically in the existing [decision batches](../../DECISION_PROCESS_TRACKER.md) or a direct recorded instruction. It does not mean an implementation exists. Record the date, exact scope and source; do not infer consent from silence or agent agreement.

**OWNER_DIRECTION** means the user clearly expressed an intended approach but may not have ratified a concrete mechanism. A conversation can support this status when its intent is unambiguous; retain the source context or explicit decision reference when available.

**PROTECTED_INVARIANT** marks a current mandatory safety/truth boundary inherited from documented scoped authority, such as separate execution authorization. It may change only through explicit decision, analysis of consequences and migration/referee evidence, not casual wording edits.

**PROVISIONAL_SYNTHESIS** means an editor has consolidated several ideas into a coherent draft; this is **not automatically agreed**. Present it for review rather than asserting consensus.

**CANDIDATE** marks an implementable option awaiting test, such as a claim schema, syntax, index or UI approach. **OPEN** means multiple meaningful answers remain possible. **EXPERIMENTAL_RESULT** means a named run produced evidence with a witness and cohort, not general production proof. **REJECTED** means a candidate failed or was explicitly rejected under a stated scope; preserve why. **SUPERSEDED** means there is a known successor with a stable link.

Implementation status stays separate: NOT_IMPLEMENTED, MOCK_ONLY, RUNNING_IN_EXPERIMENT, VERIFIED_FOR_COHORT or DEPLOYED_VERIFIED. Don't blend design acceptance with shipping success.

## A small, repeatable edit process

**Step 1 — Find the owning concept.** Follow the F-number in [01](01_AGREED_STATE.md), P-number in [05](05_PRINCIPLES_AND_CONTRACTS.md), or SQ-number in [06](06_DECISION_BOARD.md). Read linked principles and applicable current owner guidance. If it is a new question, create a new SQ identifier rather than reusing an old one.

**Step 2 — Classify the proposed change.** Is it correcting an inaccurate description? Adding a speculative technical alternative? Updating a measured result? Asking for an owner decision? Replacing an actual prior rule? Each requires different evidence; changing prose alone must not create new authority.

**Step 3 — State the difference and why.** Write a concise plain-language paragraph: previously we believed X, new evidence/guidance says Y under scope Z, so the revised interpretation is W. Link the exact source/experiment/owner approval where possible. For contradictory findings, preserve both claims and label uncertainty until resolved.

**Step 4 — Edit the smallest owning page.** Update narrative directly so newcomers see the current account, keep stable identifiers, and adjust at least the decision-board state and any directly contradicting overview. Avoid creating duplicate canonical paragraphs across multiple chapters.

**Step 5 — Check boundaries and links.** Confirm a proposal wasn't promoted to fact, tests weren't claimed without running, historical evidence wasn't rewritten, any source-changing action has independent authorization, and relative links resolve. Make sure canonical meaning, wiki/rendering and agent-specific contexts aren't described as independent sources of authority.

**Step 6 — Record lineage.** Use a descriptive Git commit, link any decision receipt and experimental evidence. Maintain old/source path links where compatibility matters. The reader should be able to see *what we believe now* from current docs and *how we arrived here* from Git, source references and preserved artifacts.

**Step 7 — Request approval only where needed.** A candidate can be studied without owner input; a normative design decision, changed safety boundary, product scope change or replacement of explicit owner guidance needs the proper authority. Route the issue via the existing [decision process](../../DECISION_PROCESS_TRACKER.md) rather than pretending this folder is a new approval committee.

## Worked example: an annotation placement experiment

Suppose Track A demonstrates that repetitive parameter descriptions in inline comments waste context and improve no tested explanations. An agent recommends moving them into generated structural fields.

**Before:** [01] says semantic comments are a possible carrier; [06 SQ-002] is OPEN_LAB. **Evidence:** a specific pinned fixture, trial variants, independent explanations and cost data. **Edit:** add the result as EXPERIMENTAL_RESULT in [03], update SQ-002 with a link and perhaps choose “generated structural fields” as CANDIDATE_SELECTED_FOR_TRIAL. [02] can explain the newly promising strategy while still labeling syntax open. **Do not:** rewrite [01] to say “all parameters must be generated” or mark OWNER_CONFIRMED unless there is real scoped approval.

If a subsequent owner choice adopts this syntax as the baseline, link the exact decision, update SQ-002 to DECIDED_LINKED, adjust the present-tense narrative and add any compatibility/migration implications. The unsuccessful candidates remain linked as evidence. No dated duplicate of [02] is required.

## Reusable paragraph template

Use this inside an owning file when a meaningful new concept is introduced:

> **Stable ID / title:** one permanent identifier and human-readable heading.  
> **State:** OWNER_DIRECTION / PROVISIONAL_SYNTHESIS / CANDIDATE / OPEN / etc.  
> **Meaning:** two to six sentences readable by an informed non-specialist.  
> **Why it matters:** the user or engineering problem it addresses.  
> **Evidence and limits:** exact source, experiment link, what is unverified.  
> **Alternatives:** relevant choices, or link to a specific SQ item.  
> **Next discriminating action:** smallest test or owner review needed.  
> **Supersedes / affected:** references to prior decisions, documents and consumers.

For a decision packet, also record alternative hypotheses, cost/safety tradeoffs, scope of the change, reviewer or owner authority, version, rollback and implementation state. Reuse the existing DECQ schema rather than inventing a conflicting second approval process.

## Conflict rules

If two documents disagree, do not simply choose the newest-looking paragraph. Check subject scope, explicit owner authority, source/evidence truth, active versus archived classification and the exact Git revision. A dated experiment remains evidence but not evergreen law. An existing protected constraint is not displaced by one prototype win. Flag a conflict in SQ or the canonical decision tracker; preserve the loser as history once resolved.

If a model proposes a clever alternative, encourage a bounded falsifiable test, not a documentation vote. If a test is impossible right now, mark the question OPEN with a blocker. If original approval evidence cannot be located, write PROVISIONAL_SYNTHESIS or NEEDS_OWNER instead of backfilling a false attribution.

## Review rhythm and completion checks

Review when a meaningful source mutation, experimental finding, owner instruction or release changes the best current explanation. No arbitrary calendar ceremony is necessary; the evergreen pages may change several times in a day or stay stable through many experiments. A good change leaves one coherent present-tense account, dated provenance only where needed, and a clean distinction between proof, decision and implementation.

A reviewer should be able to answer: What did we agree? Which parts were only proposed? Which tests actually ran? Where is the evidence? What remains open? Which file may I safely edit next? If any answer requires reconstructing a chat transcript, the record needs improvement.

**Scope:** this protocol maintains the Semantic SDK design narrative only. Do not apply it to overwrite frozen benchmarks, external provider settings, product operations, source code, published packs or live agent instructions. Those retain their own custodianship and safe-change rules.