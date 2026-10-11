// Node 22.13+; no install scripts or npm dependencies. Strips types, does not typecheck.
import {stripTypeScriptTypes} from 'node:module';
import {readFileSync, writeFileSync} from 'node:fs';
const source = new URL('./web/app.ts', import.meta.url);
writeFileSync(new URL('./web/app.js', import.meta.url), stripTypeScriptTypes(readFileSync(source,'utf8')));
