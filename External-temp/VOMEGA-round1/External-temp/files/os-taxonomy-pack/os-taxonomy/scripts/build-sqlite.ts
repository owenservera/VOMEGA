// Build a queryable SQLite database from the JSON source of truth.
//   bun run packs/os-taxonomy/scripts/build-sqlite.ts [out.sqlite]
// JSON in data/ stays canonical (diffable, reviewable); the .sqlite is a derived artifact.
import { Database } from "bun:sqlite";
import { rmSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { CAPABILITIES, COVERAGE, REALIZATIONS, TAXONOMY, validateDatabase } from "../src/db.ts";

export function buildSqlite(out: string): void {
  const errs = validateDatabase();
  if (errs.length) throw new Error(errs.join("\n"));
  mkdirSync(dirname(out), { recursive: true });
  rmSync(out, { force: true });
  const db = new Database(out);
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE domains (id TEXT PRIMARY KEY, title TEXT NOT NULL, summary TEXT NOT NULL);
    CREATE TABLE effects (id TEXT PRIMARY KEY, risk TEXT NOT NULL, consent TEXT NOT NULL, meaning TEXT NOT NULL);
    CREATE TABLE capabilities (id TEXT PRIMARY KEY, domain TEXT NOT NULL REFERENCES domains(id), op TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL, summary TEXT NOT NULL, effect TEXT NOT NULL REFERENCES effects(id), risk TEXT NOT NULL, consent TEXT NOT NULL,
      tier TEXT NOT NULL, privacy TEXT NOT NULL, portability TEXT NOT NULL, inverse TEXT REFERENCES capabilities(id) DEFERRABLE INITIALLY DEFERRED);
    CREATE TABLE params (capability TEXT NOT NULL REFERENCES capabilities(id), position INTEGER NOT NULL, name TEXT NOT NULL, type TEXT NOT NULL,
      required INTEGER NOT NULL, description TEXT NOT NULL, enum_json TEXT, min REAL, max REAL, unit TEXT, default_json TEXT, pattern TEXT, entity TEXT,
      PRIMARY KEY (capability, name));
    CREATE TABLE verbs (capability TEXT NOT NULL REFERENCES capabilities(id), verb TEXT NOT NULL, PRIMARY KEY (capability, verb));
    CREATE TABLE examples (capability TEXT NOT NULL REFERENCES capabilities(id), example TEXT NOT NULL);
    CREATE TABLE realizations (id TEXT PRIMARY KEY, capability TEXT NOT NULL REFERENCES capabilities(id), platform TEXT NOT NULL,
      preference INTEGER NOT NULL, strategy TEXT NOT NULL, fidelity TEXT NOT NULL, elevation TEXT NOT NULL, os_json TEXT NOT NULL,
      targets_foreground INTEGER NOT NULL, spec_json TEXT NOT NULL, param_map_json TEXT, verify TEXT, note TEXT, evidence TEXT NOT NULL);
    CREATE TABLE coverage_tasks (task TEXT NOT NULL, phrasing TEXT NOT NULL, capability TEXT NOT NULL REFERENCES capabilities(id), params_json TEXT NOT NULL);
    CREATE VIRTUAL TABLE capability_search USING fts5(id UNINDEXED, title, summary, verbs, examples);
    CREATE VIEW capability_platform AS
      SELECT c.id, c.title, c.domain, c.risk, c.tier, r.platform, r.strategy, r.fidelity, r.elevation
      FROM capabilities c JOIN realizations r ON r.capability = c.id AND r.preference = 1;
  `);
  const tx = db.transaction(() => {
    const m = db.prepare("INSERT INTO meta VALUES (?, ?)");
    m.run("taxonomyVersion", TAXONOMY.taxonomyVersion); m.run("name", TAXONOMY.name); m.run("status", TAXONOMY.status);
    for (const d of TAXONOMY.domains) db.prepare("INSERT INTO domains VALUES (?, ?, ?)").run(d.id, d.title, d.summary);
    for (const [id, e] of Object.entries(TAXONOMY.effects)) db.prepare("INSERT INTO effects VALUES (?, ?, ?, ?)").run(id, e.risk, e.consent, e.meaning);
    const ci = db.prepare("INSERT INTO capabilities VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
    const pi = db.prepare("INSERT INTO params VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
    const vi = db.prepare("INSERT OR IGNORE INTO verbs VALUES (?,?)");
    const ei = db.prepare("INSERT INTO examples VALUES (?,?)");
    const si = db.prepare("INSERT INTO capability_search VALUES (?,?,?,?,?)");
    for (const c of CAPABILITIES) {
      ci.run(c.id, c.domain, c.op, c.title, c.summary, c.effect, c.risk, c.consent, c.tier, c.privacy, c.portability, c.inverse ?? null);
      c.params.forEach((p, i) => pi.run(c.id, i, p.name, p.type, p.required ? 1 : 0, p.description, p.enum ? JSON.stringify(p.enum) : null,
        p.min ?? null, p.max ?? null, p.unit ?? null, p.default === undefined ? null : JSON.stringify(p.default), p.pattern ?? null, p.entity ?? null));
      for (const v of c.verbs) vi.run(c.id, v);
      for (const e of c.examples) ei.run(c.id, e);
      si.run(c.id, c.title, c.summary, c.verbs.join(" | "), c.examples.join(" | "));
    }
    const ri = db.prepare("INSERT INTO realizations VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    for (const list of Object.values(REALIZATIONS)) for (const r of list) {
      ri.run(r.id, r.capability, r.platform, r.preference, r.strategy, r.fidelity, r.elevation, JSON.stringify(r.os), r.targetsForeground ? 1 : 0,
        JSON.stringify(r.spec), r.paramMap ? JSON.stringify(r.paramMap) : null, r.verify ?? null, r.note ?? null, r.evidence);
    }
    for (const t of COVERAGE.tasks) db.prepare("INSERT INTO coverage_tasks VALUES (?,?,?,?)").run(t.task, t.phrasing, t.capability, JSON.stringify(t.params));
  });
  tx();
  db.close();
}

if (import.meta.main) {
  const out = process.argv[2] ?? join(import.meta.dir, "../dist/os-taxonomy.sqlite");
  buildSqlite(out);
  console.log(`wrote ${out}`);
}
