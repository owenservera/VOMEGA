#!/usr/bin/env node
// Elephant curated seed verifier, with optional read-only synthetic baseline test.
// Node 20+, Git for the Claude simulation tests; no dependencies and no network.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const args=process.argv.slice(2);
const value=name=>{const i=args.indexOf(name);if(i<0)return null;if(!args[i+1]||args[i+1].startsWith('--'))throw Error(name+' requires a value');return args[i+1]};
const root=path.resolve(value('--seed-root')??path.join(here,'source'));
const output=value('--out');
const expectedManifest=value('--expected-manifest-sha256');
const runTests=args.includes('--run-tests');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const fail=(reason)=>({status:'FAIL',reason});
function inspect(root){
  const report={schema:'vomega.elephant.seed-preflight.v1',source_root:root,verification:'UNVERIFIED',files_checked:0,bytes_checked:0,problems:[],baseline:{status:'NOT_RUN'}};
  const m=path.join(root,'ARTIFACT-MANIFEST.json');
  if(!fs.existsSync(m)){report.problems.push('manifest missing');return report}
  let manifest;
  try {manifest=JSON.parse(fs.readFileSync(m,'utf8'));}catch(e){report.problems.push('manifest malformed');return report}
  if(!Array.isArray(manifest.files)||manifest.count!==manifest.files.length||manifest.files.length>2000){report.problems.push('manifest count invalid');return report}
  const actualManifestSha=sha(fs.readFileSync(m));
  if(expectedManifest && (!/^[a-f0-9]{64}$/i.test(expectedManifest)||expectedManifest.toLowerCase()!==actualManifestSha)) report.problems.push('manifest pin mismatch');
  const expected=new Set(['ARTIFACT-MANIFEST.json']);
  for(const item of manifest.files){
    const name=item.path;
    if(typeof name!=='string'||! /^(zai|claude)\//.test(name)||name.includes('\\')||name.includes('\0')||name.split('/').some(p=>!p||p==='.'||p==='..')||expected.has(name)){
      report.problems.push('unsafe or duplicate manifest path: '+String(name));continue;
    }
    expected.add(name);
    const resolved=path.resolve(root,name);
    if(!resolved.startsWith(root+path.sep)){report.problems.push('escaped root: '+name);continue}
    try {
      const stat=fs.lstatSync(resolved);
      if(!stat.isFile()||stat.isSymbolicLink()){report.problems.push('not a regular file: '+name);continue}
      if(stat.size!==item.bytes||stat.size>20*1024*1024){report.problems.push('byte mismatch/limit: '+name);continue}
      const rootReal=fs.realpathSync(root); const fileReal=fs.realpathSync(resolved);
      if(!fileReal.startsWith(rootReal+path.sep)){report.problems.push('symlink directory escape: '+name);continue}
      const hash=sha(fs.readFileSync(resolved));
      if(hash!==item.sha256){report.problems.push('SHA256 mismatch: '+name);continue}
      report.files_checked++;report.bytes_checked+=stat.size;
    }catch{report.problems.push('missing/unreadable: '+name)}
  }
  const stack=[root];
  while(stack.length){
    const dir=stack.pop();
    for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
      const full=path.join(dir,ent.name);const rel=path.relative(root,full).split(path.sep).join('/');
      if(ent.isSymbolicLink()){report.problems.push('symlink disallowed: '+rel);continue}
      if(ent.isDirectory())stack.push(full);
      else if(!ent.isFile()||!expected.has(rel))report.problems.push('unexpected object: '+rel);
    }
  }
  if(report.problems.length===0&&report.files_checked===manifest.files.length){
    report.verification='PASS';report.manifest_sha256=sha(fs.readFileSync(m));
  }else report.verification='FAIL';
  return report;
}
function baseline(report){
  if(report.verification!=='PASS'){report.baseline=fail('seed verification failed');return}
  const entry=path.join(root,'claude','claude-ecp-lab','runs','r1-b1-capsule-epoch','kernel-copy','kernel.test.mjs');
  const git=spawnSync('git',['--version'],{encoding:'utf8',timeout:5000});
  if(git.status!==0){report.baseline={status:'NOT_RUN',reason:'Git CLI missing'};return}
  const start=process.hrtime.bigint();
  const r=spawnSync(process.execPath,['--test',entry],{cwd:path.dirname(entry),encoding:'utf8',timeout:90000,maxBuffer:4*1024*1024,env:{...process.env,CI:'1'}});
  const elapsed=Number(process.hrtime.bigint()-start)/1e6;
  const outputText=(r.stdout??'')+'\n'+(r.stderr??'');
  const nums=Object.fromEntries([...outputText.matchAll(/^# (tests|pass|fail|skipped|cancelled|todo) (\d+)$/gm)].map(m=>[m[1],Number(m[2])]));
  report.baseline={status:r.status===0&&nums.fail===0&&nums.pass>0?'PASS':'FAIL',type:'SYNTHETIC_MOCK_TEST_NOT_LIVE_ELEPHANT',command:'node --test claude/claude-ecp-lab/runs/r1-b1-capsule-epoch/kernel-copy/kernel.test.mjs',exit_code:r.status,signal:r.signal||null,elapsed_ms:Math.round(elapsed),...nums,stdout_sha256:sha(outputText),tail:outputText.split('\n').slice(-16).join('\n')};
}
const result=inspect(root);if(runTests)baseline(result);
const data=JSON.stringify(result,null,2)+'\n';
if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(path.resolve(output),data)}
console.log(data);
if(result.verification!=='PASS'||(runTests&&result.baseline.status==='FAIL'))process.exitCode=1;
