// ECP v0.1 deterministic MOCK ONLY. Not a provider integration or sandbox.
import { createHash } from 'node:crypto';
import { readFileSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

export const hash = data => createHash('sha256').update(data).digest('hex');
const denySegment = /(^|\/)(\.git|\.env(?:\..*)?|node_modules|\.local|secrets?|credentials?|cookies?|browser-profile|dev-vault)(\/|$)/i;
const denySuffix = /\.(?:pem|key|p12|pfx|sqlite|db|zip|bin|exe|dll)$/i;
export function isAllowedSourcePath(p) {
  return typeof p === 'string' && p.length > 0 && !p.includes('\\') && !p.split('/').includes('..') && !p.startsWith('/') && !denySegment.test(p) && !denySuffix.test(p);
}
export function buildPack({root, files, maxBytes=500_000}) {
  if (!Array.isArray(files)) throw new Error('files must be array');
  const top = realpathSync(root), included = [];
  let total=0;
  for (const path of [...new Set(files)].sort()) {
    if (!isAllowedSourcePath(path)) throw new Error(`denied source path: ${path}`);
    const full = resolve(top, path);
    const rel = relative(top, full);
    if (rel.startsWith('..'+sep) || rel === '..' || lstatSync(full).isSymbolicLink()) throw new Error('symlink/path escape refused');
    const real = realpathSync(full);
    if (!real.startsWith(top + sep)) throw new Error('realpath escapes root');
    const contents = readFileSync(real);
    total += contents.length;
    if (total > maxBytes || contents.includes(0)) throw new Error('binary or pack size cap exceeded');
    included.push({path, bytes:contents.length, sha256:hash(contents), text:contents.toString('utf8')});
  }
  const packText = included.map(f=>`FILE ${f.path} SHA256 ${f.sha256}\n${f.text}`).join('\n====\n');
  return {sha256:hash(packText), bytes:total, files:included, packText};
}
export function gitBasis(repo, baseSha, manifestPaths) {
  // Actual Git-derived list for a real repo; uses argument arrays (not shell interpolation).
  if (!/^[a-f0-9]{40,64}$/i.test(baseSha)) throw new Error('full hex base SHA required');
  if (!Array.isArray(manifestPaths) || manifestPaths.some(p=>!isAllowedSourcePath(p))) throw new Error('invalid manifest');
  const run = args => {
    const p = spawnSync('git', ['-C', repo, ...args], {encoding:'utf8', timeout:5000});
    if (p.status !== 0) throw new Error(`Git check failed: ${String(p.stderr).slice(0,250)}`);
    return p.stdout.trim();
  };
  const head = run(['rev-parse','HEAD']);
  const anc = spawnSync('git', ['-C', repo,'merge-base','--is-ancestor',baseSha,head],{encoding:'utf8',timeout:5000});
  if (anc.status !== 0) return {head, baseSha, diverged:true, changedPaths:[]};
  const changed = manifestPaths.length ? run(['diff','--name-only', `${baseSha}..${head}`, '--',...manifestPaths]) : '';
  return {head, baseSha, diverged:false, changedPaths:changed ? changed.split(/\r?\n/) : []};
}
const okTypes = new Set(['ASK','REVIEW','IMPACT','TRACE','EXTRACT','PROPOSE_PATCH']);
export function validateRequest(r) {
  if (!r || r.version !== 'ecp/0.1' || !/^[\w:.-]{3,128}$/.test(r.id??'') || !/^[\w:.-]{3,128}$/.test(r.idempotency_key??'')) throw new Error('invalid envelope ids/version');
  if (!okTypes.has(r.kind) || !['e0','e1','e2'].includes(r.arm)) throw new Error('invalid request kind or arm');
  if (typeof r.question !== 'string' || r.question.trim().length === 0 || r.question.length > 20000) throw new Error('invalid question');
  if (r.kind === 'PROPOSE_PATCH' && r.allow_code_proposals !== true) throw new Error('patch proposal not explicitly authorized');
  if (!Array.isArray(r.required_domains) || r.required_domains.length < 1 || r.required_domains.length > 2) throw new Error('invalid domains');
  return r;
}
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
export class FakeElephantAdapter {
  constructor({delayMs=2, fail=false}={}) { this.delayMs=delayMs; this.fail=fail; this.calls=0; }
  async ask(node, r) {
    this.calls++;
    await sleep(this.delayMs);
    if (this.fail) throw new Error('MOCK_NODE_UNAVAILABLE');
    const contested = r.question.includes('shared-contract');
    const verdict = contested && node.domain === 'command' ? 'SAFE' : contested && node.domain === 'surface' ? 'UNSAFE' : 'UNKNOWN';
    return {findings:[{claim_key:contested?'shared-contract':'general', verdict, claim:contested?'mock contract impact':'mock consultation', confidence:'MOCK_ONLY', check:'independent source/test verification required'}], not_examined:['live code / actual provider cognition']};
  }
}
export class ECPKernel {
  constructor({maxNodes=2}={}) { this.maxNodes=maxNodes; this.nodes=new Map(); this.requests=new Map(); this.requestFingerprints=new Map(); this.journal=[]; this.sequence=0; }
  emit(event, fields={}) { const e={seq:++this.sequence, event, ...fields}; this.journal.push(e); return e; }
  register({id, domain, baseSha, packSha, adapter=new FakeElephantAdapter()}) {
    if (this.nodes.size>=this.maxNodes || this.nodes.has(id)) throw new Error('Elephant capacity or duplicate node');
    if (!id || !domain || !/^[a-f0-9]{40,64}$/i.test(baseSha) || !/^[a-f0-9]{64}$/i.test(packSha)) throw new Error('invalid node manifest/basis');
    this.nodes.set(id,{id,domain,baseSha,incorporatedSha:baseSha,packSha,adapter,changedPaths:[],status:'READY',generation:1,transactionCount:0});
    this.emit('REGISTER',{id,domain,baseSha});
  }
  status() { return [...this.nodes.values()].map(({adapter,...n})=>structuredClone(n)); }
  // Simulation-only: caller ASSERTS a verified Git commit; not a proof engine.
  simulateAcceptedCommit({sha,changedDomains=[],verified=false}) {
    if (!verified || !/^[a-f0-9]{40,64}$/i.test(sha)) throw new Error('mock accepted commit requires verified marker/full SHA');
    for (const node of this.nodes.values()) if (changedDomains.includes(node.domain)) {node.changedPaths.push(`simulated:${node.domain}`);node.status='STALE';}
    this.emit('SIMULATED_ACCEPTED_COMMIT',{sha,changedDomains});
  }
  syncNode(id, sha) {
    const node=this.nodes.get(id); if(!node) throw new Error('unknown node');
    if(!/^[a-f0-9]{40,64}$/i.test(sha)) throw new Error('invalid commit');
    node.incorporatedSha=sha; node.changedPaths=[]; node.status='READY';
    this.emit('SIMULATED_SYNC',{id,sha});
  }
  // A real model's hidden turns cannot be selectively erased: rotate/rebuild.
  rotate(id,{rebuiltPackSha,calibrated=false}={}) {
    const n=this.nodes.get(id);if(!n)throw new Error('unknown node');
    if (!calibrated || !/^[a-f0-9]{64}$/i.test(rebuiltPackSha??'')) throw new Error('rotation requires new pack + external calibration');
    n.packSha=rebuiltPackSha;n.generation++;n.transactionCount=0;n.status=n.changedPaths.length?'STALE':'READY';this.emit('ROTATE_MOCK',{id,generation:n.generation});
  }
  retire(id) {if(!this.nodes.has(id))throw new Error('unknown node');this.nodes.delete(id);this.emit('RETIRED',{id});}
  async request(r,{deadlineMs=1000}={}) {
    validateRequest(r);
    const fingerprint=hash(JSON.stringify(r));
    if(this.requests.has(r.idempotency_key)) {
      if(this.requestFingerprints.get(r.idempotency_key)!==fingerprint) throw new Error('IDEMPOTENCY_KEY_CONFLICT');
      return this.requests.get(r.idempotency_key);
    }
    const pending = this._execute(r,deadlineMs);
    this.requestFingerprints.set(r.idempotency_key,fingerprint);
    this.requests.set(r.idempotency_key,pending);
    return pending;
  }
  async _execute(r, deadlineMs) {
    this.emit('REQUEST',{id:r.id,key:r.idempotency_key,arm:r.arm});
    if(r.arm==='e0') { const result={request_id:r.id,status:'FALLBACK_DIRECT_SOURCE',responses:[],mock:true};this.emit('RESULT',{id:r.id,status:result.status});return result; }
    const desired=r.arm==='e1'?1:2;
    const matches=[...this.nodes.values()].filter(n=>r.required_domains.includes(n.domain)).slice(0,desired);
    if(matches.length!==desired) {const result={request_id:r.id,status:'DEGRADED_TO_E0',responses:[],mock:true};this.emit('RESULT',{id:r.id,status:result.status});return result;}
    const perNode=matches.map(async n=>{
      const basis={pack_sha:n.packSha,incorporated_sha:n.incorporatedSha,unincorporated_paths:[...n.changedPaths],generation:n.generation};
      n.transactionCount++;
      try {
        const answer=await n.adapter.ask(n,r);
        return {node_id:n.id,status:basis.unincorporated_paths.length?'STALE_ADVISORY':'COMPLETED',authority:'advisory_unverified',basis,...answer};
      } catch(e) {return {node_id:n.id,status:'ERROR',authority:'advisory_unverified',basis,error:String(e.message)}};
    });
    const outcomes = await Promise.race([Promise.all(perNode),sleep(Math.max(1,deadlineMs)).then(()=>null)]);
    if(!outcomes){ const res={request_id:r.id,status:'DEADLINE_EXCEEDED',responses:[],mock:true};this.emit('RESULT',{id:r.id,status:res.status});return res;}
    const claims=outcomes.flatMap(o=>(o.findings??[]).map(f=>({node:o.node_id,...f})));
    const disputes=[];
    for(let i=0;i<claims.length;i++) for(let j=i+1;j<claims.length;j++)if(claims[i].claim_key===claims[j].claim_key && claims[i].verdict!=='UNKNOWN' && claims[j].verdict!=='UNKNOWN' && claims[i].verdict!==claims[j].verdict)disputes.push({claim_key:claims[i].claim_key,nodes:[claims[i].node,claims[j].node],verdicts:[claims[i].verdict,claims[j].verdict],falsifier:'independent contract tests and source inspection'});
    const status=outcomes.some(o=>o.status==='ERROR')?'PARTIAL':outcomes.some(o=>o.status==='STALE_ADVISORY')?'STALE_ADVISORY':'COMPLETED';
    const res={request_id:r.id,status,responses:outcomes,disagreements:disputes,mock:true};this.emit('RESULT',{id:r.id,status,disagreements:disputes.length});return res;
  }
}
