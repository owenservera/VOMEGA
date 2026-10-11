# C1 — Command core contract (`pfm.plan/1`)

**Status:** FROZEN for R0–R1. Every behaviour below is tested by the public acceptance suite (`team/acceptance/C1.acceptance.test.mjs`), by the sealed hidden oracle, or by both. **The oracle tests nothing that this page does not say.** If something here is ambiguous, that is a contract defect: record it under `limitations` and pick the reading closest to "reject rather than guess" (product brief: *no silent action on ambiguous input*).

## 0. Module

| Item | Requirement |
|---|---|
| File | `<product>/src/c1/plan.mjs` (ESM). `<product>` is the arm's `product/` directory |
| Runtime | Node ≥ 20, **standard library only**, no I/O, no network, no global mutable state, synchronous |
| Exports | `plan(input, options?)`, `PlanError`, `DEFAULT_TARGETS` |
| `DEFAULT_TARGETS` | `['alpha', 'beta', 'gamma']`, frozen |
| `PlanError` | a class extending `Error`; every rejection throws an instance with an own string property `code` (one of §1) |

How the suites load it: `PFM_PRODUCT=<product dir> node --test team/acceptance/C1.acceptance.test.mjs`.

## 1. Validation — exact precedence (the first failing check wins)

| # | `code` | Fails when |
|---|---|---|
| 0 | `INVALID_REGISTRY` | `options.registry` is present and is not a non-empty array of unique strings each matching `^[a-z][a-z0-9_-]{0,31}$`. Checked **before** the input |
| 1 | `INVALID_INPUT` | `input` is not a non-null, non-array object |
| 2 | `UNKNOWN_FIELD` | `input` has an own enumerable key other than `command_id`, `prompt`, `target_ids`, `dry_run` (this includes keys such as `"__proto__"` or `"constructor"` produced by `JSON.parse`) |
| 3 | `INVALID_COMMAND_ID` | `command_id` is missing, not a string, or does not match `^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$` |
| 4 | `INVALID_PROMPT` | `prompt` is missing or not a primitive string |
| 5 | `BLANK_PROMPT` | the normalised prompt (§2) is empty |
| 6 | `PROMPT_TOO_LONG` | the normalised prompt has more than **8000 Unicode code points** |
| 7 | `INVALID_TARGETS` | `target_ids` is missing or not an array |
| 8 | `NO_TARGETS` | `target_ids` is an empty array |
| 9 | `INVALID_TARGET_ID` | an element of `target_ids` is not a string |
| 10 | `DUPLICATE_TARGET` | the same string occurs twice (exact, case-sensitive comparison). Checked before #11 |
| 11 | `UNKNOWN_TARGET` | an element is not in the registry (exact, **case-sensitive**: `'Alpha'` is unknown) |
| 12 | `INVALID_DRY_RUN` | `dry_run` is an own property whose value is not a boolean (`'true'`, `0`, `null` are invalid) |

Duplicates are rejected, not silently removed. Case variants are rejected, not folded.

## 2. Prompt normalisation

1. `p1 = prompt.normalize('NFC')`.
2. `p2 = p1` with every **leading and trailing** character from the set **INVISIBLE** removed, where INVISIBLE = the characters matched by the JavaScript regular expression `\s` (with the `u` flag) **plus** U+200B, U+200C, U+200D and U+2060.
3. `BLANK_PROMPT` iff `p2 === ''`. Length for `PROMPT_TOO_LONG` is `[...p2].length` (code points, after steps 1–2).
4. Characters inside the prompt are kept exactly as they are (no collapsing, no internal trimming).

## 3. Output — the plan

```js
{
  schema: 'pfm.plan/1',
  command_id,                     // as given
  prompt,                         // p2 from §2
  dry_run,                        // boolean; false when the field is absent
  targets,                        // the requested ids sorted by their position in the registry (not input order)
  steps: [ { seq, target, action, idempotency_key } ],   // one per target, in `targets` order, seq = 1..n
  fingerprint,                    // see below
}
```

* `action` is `'preview'` when `dry_run` is true, otherwise `'submit'`.
* `idempotency_key` is `` `${command_id}:${target}` ``.
* `fingerprint` = lowercase hex SHA-256 of the UTF-8 bytes of `canon({ schema, command_id, prompt, dry_run, targets })`, where `canon` is JSON with object keys sorted by the default JavaScript sort at every depth and no whitespace (strings, numbers and booleans as `JSON.stringify` renders them). It is the same `canon` as `outputs/claude/kernel/util.mjs`.
* **Key order is part of the contract:** `JSON.stringify(plan(x))` must be byte-identical for equal inputs, with top-level keys in the order shown and step keys in the order `seq, target, action, idempotency_key`.
* The JSON Schema for the output is `team/contracts/C1.plan.schema.json`.

## 4. Purity

* `plan` never mutates `input` or `options`.
* The returned plan shares no object or array with `input`/`options` (mutating `input.target_ids` afterwards changes nothing).
* The returned plan and every nested object/array are frozen (`Object.isFrozen`).
* Equal inputs give equal outputs regardless of call history.

## 5. `options.registry`

Replaces `DEFAULT_TARGETS` for that call. Target ordering in the plan follows the given registry's order.

## 6. Out of scope for C1

Execution, adapters, retries, timeouts (C2), events and journals (C3), UI (C4).
