# ROLE=REVIEWER for {{TASK_ID}}

Read the implementer handoff and diff in this worktree.  
Accept only if tests pass and distinctions fixture≠live / confidence≠proof hold.  
On accept: write `.dev-machine/REVIEW_OK` with reviewer harness, model_or_unknown, and one-paragraph rationale.  
On reject: write `.dev-machine/REVIEW_REJECT` with findings. Do not implement fixes in the same turn unless asked.
