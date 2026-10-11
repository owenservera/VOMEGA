// Deterministic throwaway Git repo shaped like Prompt Fanout Mini, for tests and the trace demo.
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';

export const MANIFESTS = [
  { domain: 'contracts', version: 1, include: ['product/core/**'], exclude: [], contracts: ['product/core/contract.ts'], reference: [] },
  { domain: 'execution-surface', version: 1, include: ['product/exec/**', 'product/ui/**'], exclude: [], contracts: ['product/core/contract.ts'], reference: ['product/core/contract.ts'] },
];

export const BASE_FILES = {
  'product/core/contract.ts': [
    '// Shared command contract (canonical).',
    'export type TargetId = "alpha" | "beta" | "gamma";',
    'export interface Command { command_id: string; prompt: string; target_ids: TargetId[]; dry_run: boolean }',
    'export type TargetStatus = "submitted" | "accepted" | "rejected" | "cancelled" | "timed_out";',
    '',
  ].join('\n'),
  'product/core/plan.ts': [
    'import { Command } from "./contract";',
    'export function plan(c: Command) {',
    '  if (!c.prompt.trim()) throw new Error("blank prompt");',
    '  return c.target_ids.map(t => ({ key: `${c.command_id}:${t}`, target: t }));',
    '}',
    '',
  ].join('\n'),
  'product/exec/fanout.ts': [
    'import { TargetStatus } from "../core/contract";',
    '// Idempotency key is command_id:target — a retry must reuse it.',
    'export const terminal: TargetStatus[] = ["accepted", "rejected", "cancelled", "timed_out"];',
    '',
  ].join('\n'),
  'product/ui/panel.ts': 'export const LABELS = { timed_out: "Timed out" };\n',
  'product/core/plan.test.ts': 'import { plan } from "./plan";\n',
};

export function makeRepo(prefix = 'ecp-fixture-') {
  const repo = mkdtempSync(join(tmpdir(), prefix));
  let tick = 0;
  const git = (...args) => {
    tick++;
    const date = `2026-10-11T03:${String(tick % 60).padStart(2, '0')}:00Z`;
    const p = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } });
    if (p.status !== 0) throw new Error(`git ${args.join(' ')}: ${p.stderr}`);
    return p.stdout.trim();
  };
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'fixture@invalid.local'); git('config', 'user.name', 'ECP Fixture');
  git('config', 'commit.gpgsign', 'false');
  const commit = (files, msg) => {
    for (const [p, c] of Object.entries(files)) {
      const full = join(repo, p); mkdirSync(dirname(full), { recursive: true });
      if (c === null) rmSync(full); else writeFileSync(full, c);
    }
    git('add', '-A'); git('commit', '-qm', msg);
    return git('rev-parse', 'HEAD');
  };
  const base = commit(BASE_FILES, 'seed: Prompt Fanout Mini contracts');
  return { repo, git, commit, base, cleanup: () => rmSync(repo, { recursive: true, force: true }) };
}

/** A finding whose anchor quotes real text at the base commit. */
export const goodFinding = (subject, verdict, extra = {}) => ({
  subject, verdict, claim: `${subject} is ${verdict}`, check: 'run fixture T2-dup-retry', confidence: 'medium',
  anchors: [{ path: 'product/exec/fanout.ts', start_line: 2, end_line: 2, quote: 'Idempotency key is command_id:target' }], ...extra,
});
