// One-command developer launcher (D1-082): `bun run d1` from omega-baseline/.
// STUB. startTwin must serve the product twin (renderHtml over project(state))
// on localhost and dispatch UI events as semantic Actions only.
import { notImplemented } from "./not-implemented.ts";

export interface Twin { url: string; stop(): void }

export function startTwin(opts: { port?: number; world?: string } = {}): Twin {
  return notImplemented("D1-082", `startTwin(port ${opts.port ?? "default"}, world ${opts.world ?? "W0"})`);
}

if (import.meta.main) {
  const twin = startTwin({ port: Number(process.env.PORT ?? 4317) });
  console.log(`D1 product twin (SIMULATED) at ${twin.url}`);
}
