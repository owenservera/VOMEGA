import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const cli=path.join(import.meta.dirname,'source-preflight.mjs');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function fixture(){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'elephant-seed-'));
 fs.mkdirSync(path.join(dir,'zai'),{recursive:true});
 fs.writeFileSync(path.join(dir,'zai','seed.ts'),'safe');
 fs.writeFileSync(path.join(dir,'ARTIFACT-MANIFEST.json'),JSON.stringify({count:1,files:[{path:'zai/seed.ts',bytes:4,sha256:sha('safe')}]}));
 return dir;
}
function invoke(dir){const r=spawnSync(process.execPath,[cli,'--seed-root',dir],{encoding:'utf8',timeout:5000});return {...r,report:JSON.parse(r.stdout)};}
test('intact seed passes hash and exact inventory verification',()=>{const d=fixture();try{const x=invoke(d);assert.equal(x.status,0);assert.equal(x.report.verification,'PASS');assert.equal(x.report.files_checked,1)}finally{fs.rmSync(d,{recursive:true,force:true})}});
test('tamper and unexpected file fail closed',()=>{const d=fixture();try{fs.writeFileSync(path.join(d,'zai','seed.ts'),'evil');fs.writeFileSync(path.join(d,'zai','private.env'),'secret');const x=invoke(d);assert.equal(x.status,1);assert.ok(x.report.problems.some(x=>x.includes('SHA256 mismatch')));assert.ok(x.report.problems.some(x=>x.includes('unexpected object')))}finally{fs.rmSync(d,{recursive:true,force:true})}});
test('manifest traversal attempt rejected',()=>{const d=fixture();try{const manifest=path.join(d,'ARTIFACT-MANIFEST.json');fs.writeFileSync(manifest,JSON.stringify({count:1,files:[{path:'zai/../secret',bytes:4,sha256:sha('safe')}]}));const x=invoke(d);assert.equal(x.status,1);assert.ok(x.report.problems.some(x=>x.includes('unsafe')))}finally{fs.rmSync(d,{recursive:true,force:true})}});
test('missing and altered declared entries rejected',()=>{const d=fixture();try{fs.rmSync(path.join(d,'zai','seed.ts'));const x=invoke(d);assert.equal(x.status,1);assert.ok(x.report.problems.some(x=>x.includes('missing/unreadable')))}finally{fs.rmSync(d,{recursive:true,force:true})}});

test('externally pinned manifest rejects forged matching source and manifest',()=>{const d=fixture();try{const r=spawnSync(process.execPath,[cli,'--seed-root',d,'--expected-manifest-sha256','f'.repeat(64)],{encoding:'utf8'});assert.equal(r.status,1);assert.ok(JSON.parse(r.stdout).problems.includes('manifest pin mismatch'))}finally{fs.rmSync(d,{recursive:true,force:true})}});
