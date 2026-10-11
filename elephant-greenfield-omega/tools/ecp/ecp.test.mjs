import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {ECPKernel,FakeElephantAdapter,hash,isAllowedSourcePath,buildPack,validateRequest,gitBasis} from './core.mjs';
const a='a'.repeat(40), b='b'.repeat(40);
const req=(arm,id,domains=['command'],question='Review code')=>({version:'ecp/0.1',id,idempotency_key:id,kind:'REVIEW',arm,question,required_domains:domains});
const registered=()=>{const k=new ECPKernel();k.register({id:'C',domain:'command',baseSha:a,packSha:hash('c')});return k;};
test('E0 returns direct-source fallback with no nodes',async()=>{const k=new ECPKernel();const r=await k.request(req('e0','e0-1'));assert.equal(r.status,'FALLBACK_DIRECT_SOURCE');assert.equal(k.status().length,0);});
test('E1 one node returns basis and advisory status',async()=>{const k=registered();const r=await k.request(req('e1','e1-1'));assert.equal(r.status,'COMPLETED');assert.equal(r.responses[0].basis.incorporated_sha,a);assert.equal(r.responses[0].authority,'advisory_unverified');});
test('E2 simultaneously asks two distinct nodes and surfaces disagreement',async()=>{const k=registered();k.register({id:'S',domain:'surface',baseSha:a,packSha:hash('s')});const r=await k.request(req('e2','e2-1',['command','surface'],'Review shared-contract compatibility'));assert.equal(r.responses.length,2);assert.equal(r.disagreements.length,1);assert.deepEqual(r.disagreements[0].verdicts,['SAFE','UNSAFE']);});
test('single-node E2 request correctly reports degraded fallback',async()=>{const k=registered();const r=await k.request(req('e2','e2-2',['command','surface']));assert.equal(r.status,'DEGRADED_TO_E0');});
test('idempotency returns same logical result and one remote call',async()=>{const k=registered();const r=req('e1','dup-1');const [x,y]=await Promise.all([k.request(r),k.request(r)]);assert.deepEqual(x,y);assert.equal(k.nodes.get('C').adapter.calls,1);});
test('mock verified commit marks stale and sync restores',async()=>{const k=registered();k.simulateAcceptedCommit({sha:b,changedDomains:['command'],verified:true});const r=await k.request(req('e1','sta-1'));assert.equal(r.status,'STALE_ADVISORY');assert.equal(r.responses[0].basis.unincorporated_paths.length,1);k.syncNode('C',b);const n=await k.request(req('e1','sta-2'));assert.equal(n.status,'COMPLETED');});
test('simulated commit requires verified marker',()=>{const k=registered();assert.throws(()=>k.simulateAcceptedCommit({sha:b,changedDomains:['command']}));});
test('timeouts terminally record no deceptive success',async()=>{const k=new ECPKernel();k.register({id:'C',domain:'command',baseSha:a,packSha:hash('c'),adapter:new FakeElephantAdapter({delayMs:100})});const r=await k.request(req('e1','slow-1'),{deadlineMs:2});assert.equal(r.status,'DEADLINE_EXCEEDED');});
test('rotation requires external calibration; no false hidden-context flush claim',()=>{const k=registered();assert.throws(()=>k.rotate('C',{rebuiltPackSha:hash('new')}));k.rotate('C',{rebuiltPackSha:hash('new'),calibrated:true});assert.equal(k.status()[0].generation,2);});
test('bounded node capacity and invalid mutation request',()=>{const k=registered();k.register({id:'S',domain:'surface',baseSha:a,packSha:hash('s')});assert.throws(()=>k.register({id:'T',domain:'third',baseSha:a,packSha:hash('t')}));assert.throws(()=>validateRequest({...req('e1','prop-1'),kind:'PROPOSE_PATCH'}));});
test('pack rejects credentials, traversal, symlinks and binaries',()=>{assert.equal(isAllowedSourcePath('.env'),false);assert.equal(isAllowedSourcePath('src/../secret.txt'),false);assert.equal(isAllowedSourcePath('src/a.ts'),true);const root=mkdtempSync(join(tmpdir(),'ecptest-'));try{mkdirSync(join(root,'src'));writeFileSync(join(root,'src','a.txt'),'hello');writeFileSync(join(root,'.env'),'TOKEN=private');const pack=buildPack({root,files:['src/a.txt']});assert.equal(pack.files.length,1);assert.throws(()=>buildPack({root,files:['.env']}));}finally{rmSync(root,{force:true,recursive:true});}});

test('same idempotency key with different payload is rejected',async()=>{const k=registered();await k.request(req('e1','dupe-conflict'));await assert.rejects(k.request(req('e1','dupe-conflict',['command'],'different question')),/IDEMPOTENCY_KEY_CONFLICT/);});
test('Git basis detects actual committed in-domain diff',()=>{
 const check=spawnSync('git',['--version'],{encoding:'utf8'});if(check.status!==0)return;
 const repo=mkdtempSync(join(tmpdir(),'ecp-git-'));
 const run=(args)=>{const r=spawnSync('git',['-C',repo,...args],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
 try{run(['init','-q']);run(['config','user.email','test@invalid.local']);run(['config','user.name','ECP Test']);mkdirSync(join(repo,'src'));writeFileSync(join(repo,'src','contract.txt'),'v1');run(['add','src/contract.txt']);run(['commit','-qm','base']);const sha=run(['rev-parse','HEAD']);writeFileSync(join(repo,'src','contract.txt'),'v2');run(['add','src/contract.txt']);run(['commit','-qm','new']);const evidence=gitBasis(repo,sha,['src/contract.txt']);assert.equal(evidence.diverged,false);assert.deepEqual(evidence.changedPaths,['src/contract.txt']);}finally{rmSync(repo,{recursive:true,force:true});}
});
