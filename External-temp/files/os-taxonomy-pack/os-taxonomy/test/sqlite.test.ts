import { expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { buildSqlite } from "../scripts/build-sqlite.ts";
import { CAPABILITIES, REALIZATIONS } from "../src/db.ts";

test("SQLite build is complete and searchable", () => {
  const out = join(tmpdir(), `os-taxonomy-${Date.now()}.sqlite`);
  buildSqlite(out);
  const db = new Database(out, { readonly: true });
  expect((db.query("select count(*) n from capabilities").get() as { n: number }).n).toBe(CAPABILITIES.length);
  expect((db.query("select count(*) n from realizations").get() as { n: number }).n).toBe(REALIZATIONS.windows!.length);
  const hit = db.query("select id from capability_search where capability_search match 'recycle'").all() as Array<{ id: string }>;
  expect(hit.map((h) => h.id)).toContain("files.recycle-bin.empty");
  expect(db.query("PRAGMA foreign_key_check").all()).toEqual([]);
  db.close();
});
