# Meta-workstream dispatch procedure

**This file is procedure only and advisory.** It does not execute SDW/LNC/… product work by itself and does not have scheduling authority. `press-go.sh` may use it to suggest bounded tasks.

META-TRACKER is the governing program map. STATUS and current evidence may justify a task not listed here, a different lane decomposition, or no dispatch at all. The reference candidate queue is a historical convenience, not a backlog that must be consumed.

## Sources of truth (read in order)

1. `.project/agentic-launch/STATUS.md` — what is claimed / next gate per lane  
2. `.project/META-TRACKER.md` + `meta-tracker.json` — full program map (do not treat lanes as the whole product)  
3. `.project/roadmap/` task cards when a STATUS gate names them  
4. Optional reference list: `bootstrap/first-wave-candidates.REFERENCE.json` (may drift; STATUS wins)

## Lanes (optional ownership vocabulary, not permanent departments)

`SDW LNC VFX SKW EXP PRV RTE DEV TRU`

Merge, split or bypass these labels when another decomposition reduces handoffs or better matches the current problem.

## Algorithm (`select-tasks.py`)

1. Parse STATUS table for lanes whose next gate is unblocked and not already claimed.  
2. Prefer tasks whose `depends_on` are satisfied by existing candidate artifacts / prior STATUS rows.  
3. Emit ≤N JSON task records: `{id, lane, title, worktree, harness_prefer, reviewer_prefer, prompt_template, paths[]}`.  
4. `paths[]` point at repo files (STATUS, handoffs, Lock candidates, test paths) — **never** inline large docs.  
5. Respect concurrency cap from `press-go.sh` / env `VOMEGA_MAX_PARALLEL` (default 2).  
6. Skip lanes that would write the same shared contract as an already-enqueued task.

## Boundedness rules

Each task prompt must include:

- task id + lane  
- acceptance checks (commands)  
- stop conditions  
- forbidden actions (auth mutation, live browser unless TRU-05 gate open, etc.)  
- implementer vs reviewer role marker

## After workers finish

1. Tests in worktree  
2. Independent review  
3. `integrate.sh` or Daintree Review Hub → main  
4. Update STATUS with SHA, tests, reviewer, proof level  
5. Append `runs.jsonl`  
6. Remove disposable worktree  

## First press-go wave (when owner authorizes product work)

Not executed by this platform bootstrap. Candidates historically ranked: DEV machinery (this pack) → SDW precedence/fixtures → LNC false-READY → TRU-05 / SKW migrator slice. Re-read STATUS before launching.
