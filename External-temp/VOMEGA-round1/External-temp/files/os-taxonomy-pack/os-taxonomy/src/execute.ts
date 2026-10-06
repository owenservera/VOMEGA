// pack.os-taxonomy — execute.ts
// Runs a Plan through the platform seam (@vivim/omega-platform is the only
// module allowed to create processes, D-372/D-374). Bounded by a deadline: a
// timeout is reported as UNCERTAIN, never as success (INVARIANTS: an uncertain
// external effect stays uncertain until reconciled).
import { platformSpawn } from "@vivim/omega-platform";

export interface ExecResult {
  outcome: "completed" | "failed" | "uncertain";
  value?: unknown;
  error?: string;
  exitCode: number | null;
  stderr?: string;
  ms: number;
}

const STDERR_CAP = 4096;

export function runArgv(argv: string[], timeoutMs: number, now: () => number = Date.now): Promise<ExecResult> {
  return new Promise((resolve) => {
    const t0 = now();
    let last: unknown = undefined;
    let stderr = "";
    let settled = false;
    const h = platformSpawn(argv);
    const finish = (r: ExecResult) => { if (!settled) { settled = true; clearTimeout(timer); resolve(r); } };
    const timer = setTimeout(() => {
      try { h.kill(); } catch { /* already gone */ }
      finish({ outcome: "uncertain", error: `no result within ${timeoutMs}ms — effect unknown`, exitCode: null, ms: now() - t0 });
    }, timeoutMs);
    h.onLine((obj) => { last = obj; });
    h.onStderr((c) => { if (stderr.length < STDERR_CAP) stderr += c.slice(0, STDERR_CAP - stderr.length); });
    h.proc.on("error", (e) => finish({ outcome: "failed", error: `spawn failed: ${String(e)}`, exitCode: null, ms: now() - t0 }));
    h.onExit((code) => {
      const o = last as { ok?: unknown; value?: unknown; error?: unknown } | undefined;
      if (o && o.ok === true) finish({ outcome: "completed", value: o.value, exitCode: code, ms: now() - t0, ...(stderr ? { stderr } : {}) });
      else if (o && o.ok === false) finish({ outcome: "failed", error: String(o.error), exitCode: code, ms: now() - t0, ...(stderr ? { stderr } : {}) });
      else finish({ outcome: "uncertain", error: "process exited without a structured result", exitCode: code, ms: now() - t0, ...(stderr ? { stderr } : {}) });
    });
  });
}
