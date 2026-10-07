# Daily Build Guidance

Status: **ACTIVE ADVISORY CONTROL LOOP**  
Owner intent: use the daily review to improve build direction, expose drift early, and give local agents concrete next actions.

This layer is deliberately **advisory**. It does not replace owner authority, PM scope, Ratchet task/proof state, source truth, tests, or independent review.

## What it consumes

The daily assessment reconciles:

- current `main` HEAD, commits, changed files, branches and pull requests;
- `.project/SITREP.md`, `.project/COMMONS.md` and current owner decisions;
- Ratchet task/probe/board/evidence state for D1;
- PM owner-selected scope/build plan and gate/evidence state;
- active development-agent claims;
- the local-machine snapshot published on branch `ops/local-state`, when available;
- proof/test/review evidence actually observed.

## What it produces

The daily output is not a generic summary. It must answer:

1. **What changed?**
2. **What became more proven?**
3. **Where is the project drifting from selected intent or executable truth?**
4. **What is the current highest-leverage build frontier?**
5. **What should the available agents do today?**

The output should end with up to three dispatch cards. Each card names:

- target lane/task;
- why it is high leverage now;
- expected write surface;
- stop condition;
- proof required;
- dependencies/collision warnings.

## Authority boundary

Build guidance may rank or sequence work **inside already owner-selected execution scope** using dependency, proof, blockage and collision evidence.

It must not:

- add or remove PM-managed programs;
- redefine the product mission;
- invent release authority;
- mark gates proven without evidence;
- treat a local-agent claim as proof;
- silently turn a planning suggestion into project authority.

When owner intent and observed repository state disagree, report the disagreement rather than resolving it by assumption.

## Local visibility

GitHub cannot see unpushed local work. A local controller/orchestrator should publish the compact snapshot defined in [LOCAL-STATE-PROTOCOL.md](LOCAL-STATE-PROTOCOL.md) to the fixed branch `ops/local-state`.

Ordinary workers continue using the existing claim protocol. They do not each maintain a second tracker.

## Drift method

Use [DRIFT-ASSESSMENT.md](DRIFT-ASSESSMENT.md) for the comparison model, severity rules and daily report shape.
