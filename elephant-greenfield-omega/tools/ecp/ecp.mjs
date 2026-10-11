import {ECPKernel,FakeElephantAdapter,hash} from './core.mjs';

if(process.argv[2]!=='demo') {
  console.log('ECP mock harness only. Run: node tools/ecp/ecp.mjs demo');
  process.exit(0);
}
const shaA='a'.repeat(40), shaB='b'.repeat(40);
const req=(arm,id,domains,question)=>({version:'ecp/0.1',id,idempotency_key:id,arm,kind:'REVIEW',question,required_domains:domains,base_sha:shaA});
const kernel=new ECPKernel();
const e0=await kernel.request(req('e0','demo-e0',['command'],'Build command parser from source'));
kernel.register({id:'elephant:command',domain:'command',baseSha:shaA,packSha:hash('pack-command'),adapter:new FakeElephantAdapter({delayMs:5})});
const e1=await kernel.request(req('e1','demo-e1',['command'],'Review command parser'));
kernel.register({id:'elephant:surface',domain:'surface',baseSha:shaA,packSha:hash('pack-surface'),adapter:new FakeElephantAdapter({delayMs:5})});
const e2=await kernel.request(req('e2','demo-e2',['command','surface'],'Does shared-contract change look safe?'));
kernel.simulateAcceptedCommit({sha:shaB,changedDomains:['command'],verified:true});
const stale=await kernel.request(req('e1','demo-stale',['command'],'Review after simulated commit'));
kernel.syncNode('elephant:command',shaB);
kernel.rotate('elephant:command',{rebuiltPackSha:hash('new-pack'),calibrated:true});
console.log(JSON.stringify({NOTICE:'MOCK ONLY — no AI provider or real source mutation',e0,e1,e2,stale,finalNodes:kernel.status(),journal:kernel.journal},null,2));
