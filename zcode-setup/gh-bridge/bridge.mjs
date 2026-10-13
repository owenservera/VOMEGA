#!/usr/bin/env node
/**
 * VOMEGA GitHub -> Oracle task intake, bootstrap v0.1.
 * Dependency-free Node 20+; does not execute remote instructions or change checkout.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
export const REPOSITORY = 'owenservera/VOMEGA';
export const TASK_PREFIX = 'zcode-setup/gh-bridge/tasks/';
export const SCHEMA = 'vomega.oracle-bridge.task/1';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const STATE = join(ROOT, '.local/gh-bridge');
const MAX_BYTES = 16384;
const ID = /^[a-z0-9][a-z0-9-]{2,63}$/;
export function validateTask(task) {
  if (!task || typeof task !== 'object' || Array.isArray(task)) throw Error('task must be an object');
  const required = ['schema','id','target','mode','instruction'];
  for (const key of required) if (!Object.prototype.hasOwnProperty.call(task,key)) throw Error('missing '+key);
  const permitted = new Set([...required,'reference','created_at']);
  for (const key of Object.keys(task)) if (!permitted.has(key)) throw Error('unsupported field: '+key);
  if (task.schema !== SCHEMA) throw Error('unexpected schema');
  if (typeof task.id !== 'string' || !ID.test(task.id)) throw Error('invalid task id');
  if (task.target !== 'oracle') throw Error('unsupported target');
  if (task.mode !== 'review_only') throw Error('only review_only is supported');
  if (typeof task.instruction !== 'string' || !task.instruction.trim() || task.instruction.length > 4000) throw Error('invalid instruction');
  if (task.reference !== undefined && (typeof task.reference !== 'string' || task.reference.length > 512)) throw Error('invalid reference');
  if (task.created_at !== undefined && (typeof task.created_at !== 'string' || Number.isNaN(Date.parse(task.created_at)))) throw Error('invalid created_at');
  return task;
}
function git(...args) {
  return execFileSync('git',['-C',ROOT,...args],{encoding:'utf8',timeout:45000,maxBuffer:3000000}).trim();
}
function assertOrigin() {
  const origin = git('remote','get-url','origin');
  const okay = ['https://github.com/owenservera/VOMEGA','https://github.com/owenservera/VOMEGA.git','git@github.com:owenservera/VOMEGA','git@github.com:owenservera/VOMEGA.git','ssh://git@github.com/owenservera/VOMEGA.git'];
  if (!okay.includes(origin)) throw Error('Unexpected origin: '+origin);
}
function writeNew(path,data) {
  try { writeFileSync(path,JSON.stringify(data,null,2)+'\n',{flag:'wx',mode:0o600}); return true; }
  catch(e) { if (e.code === 'EEXIST') return false; throw e; }
}
function ensureLocal() {
  mkdirSync(join(STATE,'inbox'),{recursive:true});
  mkdirSync(join(STATE,'outbox'),{recursive:true});
}
export function digest(s) { return createHash('sha256').update(s).digest('hex'); }
function scan(ref='HEAD',dryRun=false) {
  ensureLocal();
  const sha=git('rev-parse','--verify',ref+'^{commit}');
  const paths=git('ls-tree','-r','--name-only',sha,'--',TASK_PREFIX).split('\n').filter(Boolean);
  let imported=0,duplicate=0,rejected=0;
  for (const path of paths) {
    if (!path.startsWith(TASK_PREFIX) || !path.endsWith('.json')) continue;
    try {
      const source=git('show',sha+':'+path);
      if (Buffer.byteLength(source,'utf8') > MAX_BYTES) throw Error('task too large');
      const task=validateTask(JSON.parse(source));
      if (path !== TASK_PREFIX+task.id+'.json') throw Error('filename must match task id');
      const envelope={schema:'vomega.oracle-bridge.intake/1',task,
        source:{repo:REPOSITORY,commit:sha,path,sha256:digest(source)},
        trust:'untrusted_review_only',observed_at:new Date().toISOString()};
      const destination=join(STATE,'inbox',task.id+'.json');
      if (existsSync(destination)) {
        const old=JSON.parse(readFileSync(destination,'utf8'));
        if (old.source.sha256 !== envelope.source.sha256) throw Error('task ID reused with different content');
        duplicate++;
      } else if (dryRun) { console.log('WOULD_INTAKE '+task.id); imported++; }
      else if (writeNew(destination,envelope)) { console.log('INTAKE '+task.id); imported++; }
      else duplicate++;
    } catch(e) { rejected++; console.error('REJECT '+path+': '+e.message); }
  }
  console.log(JSON.stringify({mode:dryRun?'dry_run':'intake',ref,commit:sha,tasks:paths.length,imported,duplicate,rejected,authoritativeExecution:false}));
  if (rejected) process.exitCode=2;
}
function status() {
  ensureLocal();
  const inbox=readdirSync(join(STATE,'inbox')).filter(x=>x.endsWith('.json'));
  const outbox=readdirSync(join(STATE,'outbox')).filter(x=>x.endsWith('.json'));
  console.log(JSON.stringify({repo:REPOSITORY,workspace:ROOT,localInbox:join(STATE,'inbox'),pending:inbox.length,receipts:outbox.length,enabledExecution:false},null,2));
}
function ack(id,outcome) {
  ensureLocal();
  if (!ID.test(id)) throw Error('invalid task id');
  if (!['RECEIVED','REVIEWED','BLOCKED','DONE'].includes(outcome)) throw Error('invalid outcome');
  const path=join(STATE,'inbox',id+'.json');
  if (!existsSync(path)) throw Error('task has not been imported');
  const origin=JSON.parse(readFileSync(path,'utf8'));
  const receipt={schema:'vomega.oracle-bridge.receipt/1',id,outcome,source:origin.source,at:new Date().toISOString(),author:'local-bridge-cli',verification:'self_report_only'};
  const dest=join(STATE,'outbox',id+'-'+outcome+'.json');
  console.log((writeNew(dest,receipt)?'RECEIPT_LOCAL ':'RECEIPT_ALREADY_PRESENT ')+dest);
  console.log('NOTE: Receipt is local only; PR publication is an approval-gated next step.');
}
function main() {
  const [cmd='status',...args]=process.argv.slice(2);
  switch(cmd) {
    case 'status': status(); break;
    case 'scan': {
      const pos=args.indexOf('--ref'),ref=pos>=0?args[pos+1]:'HEAD';
      if (!ref || !/^(HEAD|origin\/main|[a-f0-9]{40})$/.test(ref)) throw Error('invalid ref');
      scan(ref,args.includes('--dry-run')); break;
    }
    case 'once':
      assertOrigin();
      git('fetch','--no-tags','--quiet','origin','main');
      scan('origin/main',args.includes('--dry-run')); break;
    case 'ack': ack(args[0]||'',args[1]||''); break;
    default: throw Error('Usage: node bridge.mjs status | scan [--ref HEAD|origin/main] [--dry-run] | once [--dry-run] | ack <id> <RECEIVED|REVIEWED|BLOCKED|DONE>');
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch(e) { console.error('BRIDGE_ERROR '+e.message); process.exitCode=1; }
}
