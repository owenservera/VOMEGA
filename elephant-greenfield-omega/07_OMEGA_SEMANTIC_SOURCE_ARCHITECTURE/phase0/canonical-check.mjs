// Independent Node serialization/digest check over public Python-generated vectors.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
function canonical(v) {
  if (v === null || typeof v === 'boolean') return JSON.stringify(v);
  if (typeof v === 'number' && Number.isSafeInteger(v)) return JSON.stringify(v);
  if (typeof v === 'string') {
    if (v.normalize('NFC') !== v || /[\p{Cc}\p{Cf}\p{Cs}]/u.test(v)) throw Error('UNICODE_NOT_CANONICAL');
    return JSON.stringify(v);
  }
  if (Array.isArray(v)) return '['+v.map(canonical).join(',')+']';
  if (v && typeof v === 'object') {
    const keys=Object.keys(v).sort();
    if(keys.some(k=>/[^\x00-\x7f]/.test(k))) throw Error('NON_ASCII_KEY');
    return '{'+keys.map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
  }
  throw Error('JSON_NOT_CANONICAL');
}
const rows=readFileSync(new URL('./goldens/public.jsonl',import.meta.url),'utf8').trim().split('\n').map(JSON.parse);
let count=0;
for(const row of rows) {
  if(row.expected.status!=='READY')continue;
  const value={capability:row.expected.capability,args:row.expected.args};
  const hash=createHash('sha256').update('omega-semantic/1\n'+canonical(value),'utf8').digest('hex');
  if(hash!==row.semantic_digest)throw Error(row.id+' digest differs');
  count++;
}
for(const v of ['e\u0301','a\u202eb',1.5,Infinity,NaN,9007199254740992]) {
  let rejected=false;try{canonical(v);}catch{rejected=true;}
  if(!rejected)throw Error('noncanonical mutation accepted');
}
console.log(JSON.stringify({classification:'MEASURED',command:'node canonical-check.mjs',ready_rows:count,invalid_values_rejected:6,node:process.version}));
