# Run A — Saturation Description of `fixture/001-semantic-basics.ts`

**Instrument, not conclusion.** Per seed rule 3, this is a deliberately verbose research
instrument produced before any subtraction. It is **not** proposed final syntax and **not**
canon. Every line is labelled with an evidence class so a later pass can delete a whole
class without re-deriving the others.

- **Source pinned:** `1199b38c1fd174e997c92b22d18d8c20c952eb9e`
- **Fixture sha256:** `fe0c651e51936074346c7dcabfef52785783e5a3d87f110c8365952b40a386d5` (1001 bytes)
- **Derived by:** `extract-facts.mjs` (TypeScript compiler API typeChecker), `exp1`–`exp4`
- **Run date:** 2026-10-12 · Arm A · no shared canon was edited

## Evidence classes used

| Class | Means |
|---|---|
| `CODE_DERIVED` | A tool mechanically established it from the source. |
| `OBSERVED` | Executed against the pinned fixture and witnessed. |
| `AUTHOR_ASSERTION` | A human wrote it in a comment. Not established. |
| `INFERENCE` | My reading. Not established by any tool. |
| `UNKNOWN` | Open. Not determined by this run. |

---

## 1. CODE_DERIVED — the mechanical surface

`CODE_DERIVED` via the TypeScript typeChecker. These are the only facts in this document
that a tool can re-establish on demand.

| Symbol | Kind | Exported | Signature | Notes |
|---|---|---|---|---|
| `MAX_RETRIES` | const | yes | `3` | Literal type `3`, **not** `number`. Any other integer is a type error. |
| `add` | function | yes | `(a: number, b: number) => number` | 1 statement, no calls. |
| `repeat` | function | yes | `(count: number, emit: (value: number) => void) => void` | Calls the injected `emit`. Only symbol with an externally visible effect. |
| `classify` | function | yes | `(value: number) => "negative" \| "zero" \| "positive"` | Union of string literals. 3 statements. |
| `accumulate` | function | yes | `(values: number[]) => number` | Calls `add`. No doc comment. |

`CODE_DERIVED` under `--strict` with no errors.

`CODE_DERIVED` and worth noticing: the file has **no default export, no class, no generic,
no async, no I/O, no import, and no dependency**. It is closed. Every input arrives as an
argument; the only output is a return value or a callback invocation.

`CODE_DERIVED` and counter-intuitive: `MAX_RETRIES` is the **most** constrained symbol in the
file (literal type `3`) and is **referenced nowhere**. It constrains nothing and depends on
nothing. It is the least meaningful thing in the file expressed in the most rigid syntax.

## 2. AUTHOR_ASSERTION — the prose layer

Exactly two comments exist. Both are claims about meaning, and the compiler can enforce
neither.

1. File-level: *"Intentional research note: the claimed contract on repeat is NOT enforced.
   This discrepancy exists so agents can discover how to distinguish author's meaning from
   mechanically established or tested behavior."*
2. On `repeat`: *"Declared expectation: count is a nonnegative safe integer. Not enforced."*

`AUTHOR_ASSERTION` and notable: the file states its own epistemic weakness in prose and is
structurally incapable of demonstrating it. That is the whole experiment in miniature.

## 3. OBSERVED — what actually happens

From `exp1-results.json`, `exp2-results.json`, `exp4-results.json`.

### 3.1 `repeat` violates its own stated contract silently, in every returning case

`OBSERVED`. Each case ran in an isolated child process with a 4000 ms hard bound.

| `count` | Legal per comment? | Outcome | Emissions | Signalled? |
|---|---|---|---|---|
| 3 | yes | returned | 3 | — |
| 0 | yes | returned | 0 | — |
| −1 | **no** | returned | 0 | **no** |
| −5 | **no** | returned | 0 | **no** |
| 2.7 | **no** | returned | **3** | **no** |
| 0.4 | **no** | returned | **1** | **no** |
| NaN | **no** | returned | 0 | **no** |
| 1e7 | yes | returned | 10,000,000 | — |
| 1e9 | yes | **did not return** | — | — |
| 2^53 | **no** | **did not return** | — | — |
| Infinity | **no** | **did not return** | — | — |

`OBSERVED`: **not one of the seven contract violations produced a diagnostic.** Five returned
normally with behaviour the comment does not predict; two never returned at all. Silence is
the only failure mode this function has.

`OBSERVED`: `2.7` emits **three** values (`0,1,2`) and `0.4` emits **one** — fractional counts
behave as `ceil(count)`, which is not a documented behaviour and not an error.

`OBSERVED` and load-bearing: `1e9` **satisfies the stated precondition and still does not
return**. So even perfect enforcement of the author's contract would not have made this
function safe. The contract is necessary and not sufficient.

`OBSERVED` and worth separating: the failing set is not one set. 5 of the 7 violations return
normally, 2 never return, and the single largest *legal* input (`1e9`) is a third distinct
misbehaviour. A verifier keying on "did the contract hold?" would miss the last one entirely.

*(Count corrected from "six" to "seven" after `verify-run-note.mjs` re-derived the figure from
`exp1-results.json`; the original was an arithmetic slip of mine.)*

### 3.2 A type-level description is blind to a body-only mutation

`OBSERVED` (`exp2`). Mutation: `return a + b;` → `return a * b;`.

| Channel | Before | After | Detected? |
|---|---|---|---|
| Emitted `.d.ts` (type-derived) | `add(a: number, b: number): number` | `add(a: number, b: number): number` | **NO — byte-identical** |
| Executed `add(i, 10)` | `[10,11,12,13,14]` | `[0,10,20,30,40]` | **YES** |

`OBSERVED`: both versions typecheck cleanly under `--strict`. The entire machine-readable
surface of this file is unchanged by a change that inverts its arithmetic.

### 3.3 A type-conforming answer can be semantically false

`OBSERVED` (`exp4`). `classify(NaN)` returns the literal `"positive"`.

`OBSERVED`: NaN fails both `NaN < 0` and `NaN === 0`, so control falls through to the final
`return "positive"`. The answer is **inside** the declared union and **outside** common
sense. A verifier checking only type conformance passes this without noticing.

## 4. INFERENCE — my reading, not established

- `INFERENCE`: the file is deliberately built so that the type layer is maximally readable
  and maximally uninformative about behaviour. That is a design choice, not an accident.
- `INFERENCE`: `accumulate` is the only function with no comment and the only one whose
  behaviour is fully determined by another function (`add`). It needs the least prose because
  it composes. Documentation load appears to track *non-composition*, not importance.
- `INFERENCE`: `MAX_RETRIES` looks like scaffolding for a future run loop that was never
  written. `INFERENCE`, not established.
- `INFERENCE`: the header comment's phrase *"No semantic annotation syntax is prescribed"* is
  an instruction to the reader, not a property of the code.

## 5. UNKNOWN — open, and this run did not close them

- `UNKNOWN`: whether `1e9` would eventually return, given unbounded time. I bound the probe
  at 4000 ms and report non-return within that bound, not eternal non-termination.
- `UNKNOWN`: the intent or business purpose of any declaration.
- `UNKNOWN`: real-source cohort. I used only the controlled fixture. **REAL_SOURCE_UNAVAILABLE**
  for this arm — I did not run the private 191-file bundle, and I did not select a repo-available
  real cohort. This arm is a fixture-only control and must not be read as a real-code result.

### 5.1 Closed by exp5 — `repeat` is not atomic

This was `UNKNOWN` in the first pass of this document and is now `OBSERVED`
(`exp5-results.json`). A callback that rejects partway through leaves the caller holding a
**partial effect**: values already delivered, then an exception, with no rollback and no way
to tell from the return path which values landed.

| Callback throws at value | Values already delivered | Partial effect |
|---|---|---|
| 0 | 0 | no (fails before any emission) |
| 1 | 1 | **yes** |
| 2 | 2 | **yes** |
| 99 | 99 | **yes** |

`OBSERVED`: this is the most consequential property in the file and **nothing declares it** —
not the types, not the comments. It is the property most relevant to the launch policy's
boundary on external effects, and it is invisible to every channel except execution.

---

## What saturation bought, and what it cost

Deliberately **not** deleting yet, per seed rule 3. Recorded for the subtraction pass:

- Section 1 is cheap and re-derivable on demand; it is the only section worth regenerating.
- Section 2 is 2 comments. It is the *only* place honesty about the contract lives, and it
  cannot enforce itself.
- Section 3 is the only section that can ever contradict the source.
- Sections 4 and 5 are the parts most likely to be wrong and the cheapest to delete first.

`INFERENCE` to test next: if a claim must be both digest-bound **and** witnessed to survive
an edit, then the minimal truthful description of this file is much smaller than sections 1–5
together — plausibly one line per exported symbol plus one witness per behavioural claim.