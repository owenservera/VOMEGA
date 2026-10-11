#!/usr/bin/env node
// Node 20+; read-only inventory; no dependencies or network access.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const data = JSON.parse(fs.readFileSync(path.join(here,'SEED_REGISTRY.json'),'utf8'));
const out = {schema_version:'0.1.0', generated_at:new Date().toISOString(), root, entries:[]};
function hashFile(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
for (const entry of data.entries) {
  const record={id:entry.id,kind:entry.kind,declared_path:entry.path,evidence:entry.evidence};
  if (!entry.path) { record.status='UNAVAILABLE_NOT_MIRRORED'; out.entries.push(record); continue; }
  const target=path.resolve(root,entry.path);
  if (target!==root && !target.startsWith(root+path.sep)) throw new Error('Unsafe manifest path: '+entry.path);
  if (!fs.existsSync(target)) {record.status='MISSING'; out.entries.push(record); continue;}
  const stat=fs.statSync(target); record.status=stat.isDirectory()?'PRESENT_DIRECTORY_UNAUDITED':'PRESENT_FILE_UNEXECUTED';
  if (stat.isFile()) {record.bytes=stat.size;record.sha256=hashFile(target);}
  else {
    let count=0, bytes=0;
    const stack=[target];
    while(stack.length) {
      const dir=stack.pop();
      for(const item of fs.readdirSync(dir,{withFileTypes:true})) {
        const full=path.join(dir,item.name);
        if(item.isSymbolicLink())continue;
        if(item.isDirectory())stack.push(full);
        else if(item.isFile()){count++;bytes+=fs.statSync(full).size;}
      }
    }
    record.file_count=count;record.bytes=bytes;
  }
  out.entries.push(record);
}
out.summary=Object.fromEntries([...new Set(out.entries.map(x=>x.status))].map(s=>[s,out.entries.filter(x=>x.status===s).length]));
console.log(JSON.stringify(out,null,2));
