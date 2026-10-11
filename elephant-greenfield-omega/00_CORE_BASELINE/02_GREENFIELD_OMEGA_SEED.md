# Common Frozen Product Seed: Greenfield Ω Prompt Fanout Mini

**Reference baseline:** [original Ω seed](../02_GREENFIELD_OMEGA_PRODUCT.md). This page defines the cross-architecture **product and test target**; do not copy the old implementation into a new allegedly greenfield agent run.

## What the user can do
In a Windows-first local UI or justified portable preview, type one command/prompt, choose enabled recipients, preview its meaning and fan-out, submit the same content to multiple **simulated local** recipients, and see a transparent deterministic progress/event trail including completion, cancellation, delay and failure.

## Objective behavioral contract
- Parse and validate prompt and target selection; blank prompts or unknown targets are rejected without dispatch.
- Simulate at least three deterministic local adapters (Alpha/Beta/Gamma), with independent outcomes, bounded retries, idempotent command-target execution and cancellation/timeout semantics.
- Events have attributable command/target identities and ordered or causally reconstructable status.
- Demonstrate a working UI or defensible staged CLI/TUI fallback with visible interpreted command, selected targets, user controls and terminal states; state its real limitation.
- Prove duplicate dispatch, delayed/offline recipient, cancellation race, restart/replay, status/schema evolution and a cross-cutting dependency change.
- Do not connect real user browser accounts, scrape responses, use credentials, or transmit private input to external providers in this seed.

## Acceptance standard
Accepted work must be runnable, pass frozen relevant tests, withstand independent review, present actual behavioral evidence and be versioned to an exact source/test basis. Attractive screenshots, synthetic UI rows, mock agent sessions or unsupported performance claims are not accepted product work.

## Fairness
Give architectures and per-proposal Z.ai builders **equivalent initial tasks** with fixed fixture cohort/hash, balanced task complexity and budget controls. Each competing agent's personal architecture is its design anchor, not part of baseline. If test cohort changes mid-study, record separate version/epoch, do not blend performance scores.

## Independence and evolution
This seed is a bounded research workload, not the prescribed shape of the Elephant runtime. The eventual Elephant system's capability-pack inventory, context approach, protocol and architecture remain open to discovery. Proposed enhancements to this seed live as separately versioned experiment cohorts, never silent amendments to R1.
