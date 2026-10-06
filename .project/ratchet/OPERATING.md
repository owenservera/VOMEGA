# Operating the ratchet

All commands run from `omega-baseline/` with Bun 1.4.2 (`scripts/omega.ps1` finds Bun on Windows). Design and rationale: [DESIGN.md](DESIGN.md).

## The worker loop (Codex, Claude Code, ZCode, a human)

```sh
bun run ratchet next                        # highest-value frontier task as a packet
bun run ratchet claim D1-004 --by codex-1   # 4h lease (renew by claiming again)
bun run ratchet verify D1-004               # raw truth for this task's gates; exit 0 iff green
# … implement inside the packet's write surface …
bun run ratchet promote --task D1-004 --by codex-1
bun run ratchet sync                        # probe + graph + board + evidence
git add -A && git commit -m "D1-004: required fields derived from declaration"
bun run ratchet release D1-004 --by codex-1
```

Rules the tool enforces:

- Only gates green in a fresh probe can be promoted.
- A promoted gate that goes red is REGRESSED, and `next` hands it out before anything else.
- `review` refuses a reviewer who promoted or claimed the task.
- Deleting a promoted gate fails `check` (`GATE_VANISHED`); editing its file flags `SPEC_CHANGED`.
- An anchored gate file changed without a recorded `spec-change` fails `check` (`SPEC_CHANGED_ANCHOR`) and its gates cannot be promoted — including gates never promoted (C1).

Rules it cannot enforce (stop conditions in every packet):

- No live provider or browser access, and no auth, provider or model configuration changes.
- Never weaken a gate to pass it. If a gate is wrong, change it in its own commit with the reason in the message, and expect re-review.
- Simulated is never live.
- `--by` labels are coordination labels, not proof of independent actors: the tool rejects a reviewer *label* that promoted or claimed the task, but it cannot prove two labels are two real parties (C2).

## Parallel work

```sh
bun run ratchet fanout --n 4 --write .local/ratchet/packets
```

This writes one packet per task for up to four frontier tasks whose write surfaces do not overlap. Give each worker one packet and one git worktree. Merge order does not matter for disjoint surfaces; `ratchet check` after each merge catches regressions.

## Review

```sh
bun run ratchet review D1-004 --by claude-review            # accept: PROVEN → DONE
bun run ratchet review D1-004 --by claude-review --reject --note "…"
```

## CI / pre-merge gate

```sh
bun run ratchet check            # graph fresh, no regressions/vanished/orphans/silent files/anchor drift, drift clean
bun run ratchet check --strict   # also fails on pending promotions and changed promoted specs
bun run ratchet:test             # engine unit tests
bun run d1:gates                 # D1 gates in ratchet mode (green while honest)
```

**Reading "green" (C4).** A green `d1:gates` run is **not** D1 completion: open gates run as expected failures, so the suite is green while most of D1 is unfinished (it prints a notice saying exactly this). Raw truth is `bun run ratchet probe`; `bun run ratchet status` prints the four readings separately. The only completion records are the evidence `semanticCompletion` key (every gate green in probe) and `reviewedCompletion` (the committed completion record). Never report "80 gates passed" when most are open expected failures.

## Projections (never edit by hand)

| File | Regenerate with |
| --- | --- |
| `.project/deliverables/D1-ATOMIC-TASKS.json` | `bun run ratchet graph` |
| `.project/ratchet/D1-BOARD.md` | `bun run ratchet board` |
| `.project/evidence/d1-ratchet.json` | `bun run ratchet evidence` (and `baseline`) |

`bun run ratchet sync` does all of them.

## Changing the plan

- **First run (once):** `bun run ratchet anchor --by <label>` records the digest of every gate file, before implementation claims begin. After that the gate files are anchored.
- **Change a gate/spec file (C1):** `bun run ratchet spec-change --file <F> --by <label> --reason "<why>"`. This is the only way to change an anchored file: it records from/to digests and the reason, and re-authorizes the new content. To retire a gate file, add `--deleted`. Without this record, `check` fails (`SPEC_CHANGED_ANCHOR`) and `promote` refuses the file's gates — a worker cannot weaken an unpromoted gate and then promote the weakened form.
- **New or split task:** edit `D1-ATOMIC-TASKS.md`, run `graph`, add the task's `surface` in `specs/d1/spec.json`, and write its gate first (a new gate file is `UNANCHORED_GATE_FILE` until anchored).
- **Retire a task:** `bun run ratchet supersede D1-0xx --by <label> --reason "…"`.
- **Doc claim changed:** update the document and `specs/facts.json` together, then run `drift`.
- **Finish:** `bun run ratchet complete --by <label>` once every task except D1-089 is DONE and the tree is committed.
