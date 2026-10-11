# C3 — Event journal and replay contract (`pfm.journal/1`)

**Status:** FROZEN for R1. Same rules as C1: the public suite (`team/acceptance/C3.acceptance.test.mjs`) and the sealed oracle test only what is written here. Ambiguity → `limitations`, and prefer *refuse over guess*.

## 0. Module

| Item | Requirement |
|---|---|
| File | `<product>/src/c3/journal.mjs` (ESM), Node ≥ 20, standard library only |
| Exports | `EVENT_TYPES`, `JournalError`, `openJournal(path)`, `replay(path)` |
| `EVENT_TYPES` | `['submitted', 'accepted', 'rejected', 'cancelled', 'timed_out']`, frozen |
| `JournalError` | class extending `Error`; own string `code`; for `CORRUPT` also own integer `line` (1-based line number of the first offending line) |

## 1. Events and state

* An **event** passed to `append` is a plain object with **exactly** the keys `type`, `command_id`, `target`. `type` ∈ `EVENT_TYPES`; `command_id` and `target` are non-empty strings **without `:`** (the key separator). Anything else → `INVALID_EVENT` (including a caller-supplied `seq`, extra keys, non-objects).
* The **key** of an event is `` `${command_id}:${target}` ``.
* Per key: no state → `submitted` → `pending`; `pending` → one of `accepted | rejected | cancelled | timed_out` → that terminal status. **Terminal states are absorbing.** Every other transition → `ILLEGAL_TRANSITION` (an event for an unknown key that is not `submitted`; a second `submitted` for a pending or terminal key; anything after a terminal state).
* **Cancellation race:** whichever of `accepted` / `cancelled` (or any two terminal events) is appended first wins; the second is `ILLEGAL_TRANSITION`.

## 2. File format

One JSON object per line, each line terminated by `\n`. Lines written by the implementation are exactly
`{"seq":<n>,"type":"<t>","command_id":"<c>","target":"<g>"}` (keys in that order). When **reading**, extra keys in a line are ignored; the four keys are required with the right types (`seq` an integer).

* `seq` starts at 1 and increases by exactly 1 per line.
* A **torn tail** is a non-empty run of bytes after the last `\n` (a crash mid-write). It is not an event.
* Anything else that is wrong — an unparseable or blank newline-terminated line, a missing/mistyped field, an unknown type, a `seq` that is not previous+1 (gap, duplicate, reorder, or not starting at 1), or an illegal transition recorded in the file — is **corruption**: `JournalError` with `code: 'CORRUPT'` and `line` set.

## 3. `replay(path)` — read-only

* Never writes, never truncates, never creates the file.
* Missing file → `{ last_seq: 0, torn: false, entries: {} }`.
* Otherwise returns `{ last_seq, torn, entries }` where `torn` says whether a torn tail was present (and ignored), and `entries` maps each key to `{ status, seq }`: `status` is `'pending'` or the terminal type, `seq` the seq of the last event applied to that key.
* Corruption → throws `CORRUPT` (with `line`).
* Two replays of the same file are deep-equal.

## 4. `openJournal(path)` → journal

* Creates the file if missing. If it exists, validates it exactly like `replay`; on corruption throws `CORRUPT` and **leaves the file byte-for-byte unchanged**.
* If the file has a torn tail, the tail is **truncated away** before the journal is returned (so later appends produce a valid file).
* `journal.lastSeq` — the last committed seq.
* `journal.append(event)` — validates the event (`INVALID_EVENT`) and the transition (`ILLEGAL_TRANSITION`); on success writes the line and makes it durable (written and fsync'd) **before returning**, then returns a frozen record `{ seq, type, command_id, target }`. A rejected append writes nothing and does **not** consume a seq.
* `journal.close()` — afterwards `append` throws `CLOSED`.
* A record returned by `append` is visible to `replay(path)` immediately, without closing the journal.

## 5. Out of scope for C3

Concurrent writers on one file, file locking, log rotation, compaction.
