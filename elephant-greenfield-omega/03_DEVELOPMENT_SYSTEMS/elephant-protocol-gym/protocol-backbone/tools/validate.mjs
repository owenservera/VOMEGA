// Dependency-free semantic/provenance validator for compact EPG protocol cards.
// This is structural and referential validation, NOT a full JSON Schema interpreter,
// not a correctness oracle, and not an executor. Run from this folder: node tools/validate.mjs
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
const home=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(readFileSync(join(home,p),'utf8'));
const acceptableStates=new Set(['PROPOSED','APPROVED_DIRECTION','FROZEN','EXPERIMENTAL','VERIFIED_MECHANICS','RETIRED']);
const acceptableEvidence=new Set(['SOURCE_INSPECTED','AUTHOR_REPORTED','LOCAL_REPRODUCED','HOST_OBSERVED','DESIGN_ONLY','UNAVAILABLE']);
const kinds=new Set(['experiment','executor','evaluator','task','economy','publication','semantic','visual','governance','feeder','composition']);
const uniq=(arr,what,errors)=>{for(const [i,id] of arr.entries()) if(arr.indexOf(id)!==i) errors.push(what+' duplicate '+id+' at '+i)};
export function validate({root=home}={}){
  const errors=[],warnings=[];
  const load=p=>JSON.parse(readFileSync(join(root,p),'utf8'));
  const registry=load('registry.json');
  if(registry.schema!=='epg.registry/0.1')errors.push('registry schema mismatch');
  const ids=registry.protocols.map(p=>p.id);uniq(ids,'protocol',errors);
  uniq(registry.assets.map(a=>a.id),'asset',errors);
  const protocols=[];
  for(const item of registry.protocols){
    if(item.path.startsWith('/')||item.path.split('/').includes('..')) {errors.push('unsafe protocol path '+item.path);continue}
    if(!existsSync(join(root,item.path))){errors.push('missing '+item.path);continue}
    const p=load(item.path);protocols.push(p);
    if(p.schema!=='epg.protocol/0.1')errors.push(p.id+': schema mismatch');
    if(p.id!==item.id)errors.push(item.path+': ID mismatch');
    if(!acceptableStates.has(p.state))errors.push(p.id+': invalid lifecycle');
    if(!kinds.has(p.kind))errors.push(p.id+': invalid kind');
    if(typeof p.purpose!=='string'||p.purpose.length<12)errors.push(p.id+': missing purpose');
    for(const k of ['sources','phases','gates','outputs'])if(!Array.isArray(p[k]))errors.push(p.id+': '+k+' missing');
    if(p.conditions?.readiness==='BLOCKED'&&!p.conditions.blockers?.length)errors.push(p.id+': blocked without blockers');
    if(p.authority==='operator_authorized_execution'&&p.conditions?.readiness!=='READY_TO_ATTEMPT')errors.push(p.id+': execution authorization without readiness');
    uniq((p.phases||[]).map(x=>x.id),p.id+' phase',errors);
    uniq((p.gates||[]).map(x=>x.id),p.id+' gate',errors);
    for(const s of (p.sources||[])){if(!acceptableEvidence.has(s.evidence)) errors.push(p.id+': unknown evidence '+s.evidence);if(!s.uri)errors.push(p.id+': empty source uri');if(s.uri.startsWith('attachment://')&&!s.sha256)warnings.push(p.id+': attachment integrity pinned in note; prefer machine sha256 field')}
    for(const x of (p.modules||[]))if(!ids.includes(x))errors.push(p.id+': missing module '+x);
    if(p.provenance?.mapping_status!=='FULL_SOURCE_BOUND')warnings.push(p.id+': '+p.provenance?.mapping_status+'; source narrative remains necessary');
  }
  for(const a of registry.assets){for(const x of a.mapped_to||[])if(!ids.includes(x))errors.push('asset '+a.id+' unknown protocol '+x)}
  const crosswalk=load('crosswalk.json');
  if(crosswalk.schema!=='epg.crosswalk/0.1')errors.push('crosswalk schema mismatch');
  for(const e of crosswalk.entries){
    if(!ids.includes(e.protocol))errors.push('crosswalk '+e.id+' missing protocol '+e.protocol);
    if(!Array.isArray(e.normalized_paths)||!Array.isArray(e.unmapped_requirements))errors.push('crosswalk '+e.id+' incomplete mappings');
  }
  const profiles=load('profiles.json');
  if(profiles.schema!=='epg.composition/0.1')errors.push('profiles schema mismatch');
  for(const p of profiles.profiles){for(const m of [...p.protocols,...(p.runner_options||[]),...(p.economy_options||[])])if(!ids.includes(m))errors.push('profile '+p.id+' unknown module '+m);}
  const tc=protocols.find(x=>x.id==='epg.economy.timecredit');
  if(!tc?.extensions?.['epg.time_credit']?.deferred_tasks?.includes('SDK-FAIL-01'))errors.push('Time Credit deferred SDK benchmark blocker lost');
  const run=load('examples/not-run.json');
  if(run.schema!=='epg.run/0.1'||!ids.includes(run.protocol_id))errors.push('run example bad protocol ref');
  if(run.status==='NOT_RUN'&&run.events.length)warnings.push('NOT_RUN example unexpectedly has events');
  if(run.status==='NOT_RUN'&&run.publication.status==='PUBLISHED')errors.push('NOT_RUN example cannot self claim turn publication');
  return {ok:errors.length===0,protocol_cards:protocols.length,assets:registry.assets.length,crosswalk_entries:crosswalk.entries.length,composition_profiles:profiles.profiles.length,errors,warnings};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const r=validate();console.log(JSON.stringify(r,null,2));if(!r.ok)process.exitCode=1;
}
