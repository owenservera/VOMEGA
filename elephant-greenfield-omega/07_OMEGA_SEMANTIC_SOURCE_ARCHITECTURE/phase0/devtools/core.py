"""Ω developer loop: source-grounded Wiki, non-executing cases, and impact detection.

No provider or agent execution. Integrates with Phase 0 via dependency injection.
"""
from __future__ import annotations
import copy
import hashlib
import json
import re
import time
import threading
from pathlib import Path


def sha(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def parse_omega(text: str) -> dict:
    """Read-only structural projection; NOT an ΩSL compiler/validator."""
    caps = {}
    current = None
    for line_no, line in enumerate(text.splitlines(), 1):
        m = re.match(r'^capability\s+(\S+)\s+@(\S+)', line)
        if m:
            name, revision = m.groups()
            if name in caps:
                raise ValueError('DUPLICATE_CAPABILITY')
            current = {'id':name, 'revision':revision, 'line':line_no,
                       'params':[], 'consequences':[], 'say':[], 'hear':[]}
            caps[name] = current
            continue
        if not line.startswith((' ', '\t')):
            current = None
        if not current:
            continue
        content = line.strip()
        p = re.match(r'^param\s+(\S+)\s+(\S+)\s+(required|optional)\b', content)
        if p:
            current['params'].append({'name':p[1], 'type':p[2], 'required':p[3]=='required', 'line':line_no})
        elif content.startswith('consequence '):
            current['consequences'].append({'value':content[len('consequence '):], 'line':line_no})
        else:
            s = re.match(r'^say\s+(\S+)\s+"(.*)"$', content)
            h = re.match(r'^hear\s+"(.*)"$', content)
            if s:current['say'].append({'status':s[1], 'template':s[2], 'line':line_no})
            if h:current['hear'].append({'template':h[1], 'line':line_no})
    return caps


def source_doc(declarations: str, capability: str, tests: list|None=None) -> dict:
    caps = parse_omega(declarations)
    if capability not in caps:
        return {'status':'NOT_DECLARED','capability':capability,'source_hash':sha(declarations)}
    cap = copy.deepcopy(caps[capability])
    references = [t for t in (tests or []) if t.get('capability') == capability]
    return {'status':'DECLARED_NOT_PROVEN', 'capability':capability,
            'source_hash':sha(declarations),'declaration':cap,
            'tests':[{'id':t['id'],'relationship':'DECLARED_COVERAGE','expected':t.get('expected')} for t in references],
            'provenance':{'path':'vendor/runA/omega.osl','line':cap['line'],'basis':'SOURCE_PARSED_NOT_RUNTIME_VERIFIED'},
            'derived':True, 'human_notes':None}


def impact_before_after(old_text: str, new_text: str, public_vectors: list|None=None) -> dict:
    """Conservative explicit-capability dependency map, never proof of no other impact."""
    old, new = parse_omega(old_text), parse_omega(new_text)
    changed = []
    for cap in sorted(set(old) | set(new)):
        a=copy.deepcopy(old.get(cap)); b=copy.deepcopy(new.get(cap))
        if a: a.pop('line',None)
        if b: b.pop('line',None)
        # Ignore line numbers for semantic comparison; preserve source in evidence hashes.
        for x in (a,b):
            if x:
                for field in ('params','consequences','say','hear'):
                    for member in x[field]:member.pop('line',None)
        if a!=b:changed.append(cap)
    vectors=public_vectors or []
    affected_tests=[t['id'] for t in vectors if t.get('capability') in changed]
    consequences=[]
    for cap in changed:
        before=[c['value'] for c in old.get(cap,{}).get('consequences',[])]
        after=[c['value'] for c in new.get(cap,{}).get('consequences',[])]
        if before != after: consequences.append(cap)
    return {'status':'IMPACT_PREVIEW_ONLY', 'from_hash':sha(old_text),'to_hash':sha(new_text),
            'changed_capabilities':changed, 'consequence_changes':consequences,
            'wiki_pages':[f'wiki:{cap}' for cap in changed],
            'tests_first':affected_tests,
            'must_run':['phase0 independent checker','phase0 gate tests','affected public vectors', 'held-out independent regression (NOT_RUN)'] if changed else [],
            'unmapped_risks':['cross-capability dependencies NOT_PROVEN','imported runtime behavior NOT_PROVEN', 'wiki editorial annotations require review'],
            'relationship_evidence':'DECLARED; observed dependencies require separate runtime traces',
            'safe_to_publish':False, 'safe_to_execute':False}


def compare_case(case: dict, candidate: dict) -> dict:
    """Only data comparisons. Does NOT run executable candidate code."""
    expected=case['expected']
    state=candidate.get('state',{}) if isinstance(candidate,dict) else {}
    diff={k:{'expected':v,'actual':state.get(k)} for k,v in expected.items() if state.get(k)!=v}
    reading=candidate.get('reading','') if isinstance(candidate,dict) else ''
    # Every effectful READY must show egress warning. Absence is failure.
    effects=state.get('capability') in ('cap:prompt.send','cap:prompt.fanout') and state.get('status')=='READY'
    if effects and 'leave this computer' not in reading:
        diff['reading.consequence']={'expected':'leave this computer','actual':'missing'}
    if state.get('status')=='READY' and state.get('ambiguous'):
        diff['unsafe_READY']={'expected':'BLOCK_EFFECTS','actual':'ambiguous READY'}
    # Bad candidates cannot earn a win merely by rejecting all valid requests.
    if expected.get('status')=='READY' and state.get('status')!='READY':
        diff['over_rejection']={'expected':'READY','actual':state.get('status')}
    return {'case_id':case['id'],'status':'FAIL' if diff else 'PASS','diff':diff,
            'expected_provenance':case.get('expected_provenance','UNKNOWN'),
            'candidate_executed':False}


class Tools:
    """One thread-safe read-only projection over the trusted Phase 0 Lab."""
    def __init__(self, lab, root:Path, clock=time.perf_counter):
        self.lab, self.root, self.clock=lab,Path(root),clock
        self.lock=threading.RLock()
        self.source_path=self.root/'vendor/runA/omega.osl'
        self.local=self.root/'devtools/.local'
        self.local.mkdir(parents=True,exist_ok=True)
        self.cases_path=self.local/'cases.jsonl'
        self.metrics={'interprets':0,'errors':0,'churn':0,'stale_source':0,'durations_ms':[],
                      'wiki_docs':0,'wiki_drift':0, 'experiments':0, 'confirmed_corrections':0}
        self.last_reading={}

    def declarations(self):return self.source_path.read_text(encoding='utf-8')

    def vectors(self):
        p=self.root/'goldens/public.jsonl'
        if not p.exists():return []
        out=[]
        for line in p.read_text(encoding='utf-8').splitlines():
            if not line.strip():continue
            v=json.loads(line)
            state=v.get('expected',{})
            if isinstance(state,dict) and 'capability' in state:
                out.append({'id':v['id'],'capability':state['capability'],'expected':state})
        return out

    def wiki(self, capability:str) ->dict:
        with self.lock:
            doc=source_doc(self.declarations(),capability,self.vectors())
            doc['runtime_source_fresh']=self.lab.snapshot()['source_hash']==self.lab.compiled_source
            doc['implementation_verified']=False
            self.metrics['wiki_docs']+=1
            if not doc['runtime_source_fresh']:self.metrics['wiki_drift']+=1
            return doc

    def interpret(self, sid:str, text:str, revision:int) ->dict:
        with self.lock:
            start=self.clock()
            try:
                out=self.lab.interpret(sid,text,revision)
                cap=out['state'].get('capability')
                out['wiki']=self.wiki(cap) if cap else None
                prior=self.last_reading.get(sid)
                out['reading_changed']=prior is not None and prior!=out['reading']
                self.last_reading[sid]=out['reading']
                if out['reading_changed']:self.metrics['churn']+=1
                self.metrics['interprets']+=1
                return out
            except (ValueError,KeyError,TypeError):
                self.metrics['errors']+=1
                if self.lab.snapshot()['source_hash']!=self.lab.compiled_source:self.metrics['stale_source']+=1
                raise
            finally:
                self.metrics['durations_ms'].append(round((self.clock()-start)*1000,3))
                self.metrics['durations_ms']=self.metrics['durations_ms'][-500:]

    def capture(self, payload:dict) ->dict:
        """Persist a USER-PROPOSED expectation, never silently publish as accepted ground truth."""
        from uuid import uuid4
        if not isinstance(payload.get('input'),str) or not payload['input'] or len(payload['input'])>2048:
            raise ValueError('INVALID_CASE_INPUT')
        expected=payload.get('expected')
        if not isinstance(expected,dict) or 'status' not in expected:raise ValueError('EXPECTED_STATUS_REQUIRED')
        if expected['status'] not in ('READY','NEEDS_CHOICE','NEEDS_INFO','INVALID','UNKNOWN'):raise ValueError('EXPECTED_STATUS_INVALID')
        if len(json.dumps(payload,ensure_ascii=False))>16384:raise ValueError('CASE_TOO_LARGE')
        with self.lock:
            case={'id':'case:'+uuid4().hex,'input':payload['input'],'expected':expected,
                  'expected_provenance':'USER_PROPOSED_NOT_INDEPENDENTLY_VERIFIED',
                  'observed':payload.get('observed'), 'feedback':payload.get('feedback',''),
                  'source_hash':self.lab.compiled_source,'status':'PROPOSED',
                  'created_unix':int(time.time())}
            with self.cases_path.open('a',encoding='utf-8') as f:
                f.write(json.dumps(case,ensure_ascii=False,sort_keys=True)+'\n')
            return case

    def cases(self)->list:
        if not self.cases_path.exists():return []
        return [json.loads(s) for s in self.cases_path.read_text(encoding='utf-8').splitlines() if s]

    def evaluate(self, candidates:dict)->dict:
        if not isinstance(candidates,dict):raise ValueError('CANDIDATE_RESPONSES_MUST_BE_OBJECT')
        cases=self.cases()
        results=[compare_case(case,candidates.get(case['id'],{})) for case in cases]
        self.metrics['experiments']+=1
        return {'mode':'DATA_ONLY_NO_CANDIDATE_EXECUTION','total':len(results),'passed':sum(x['status']=='PASS' for x in results),
                'results':results,'unreviewed_cases':sum(x['status']!='REVIEWED' for x in cases)}

    def impact(self,capability:str,new_consequence:str)->dict:
        if not isinstance(capability,str) or not isinstance(new_consequence,str) or len(new_consequence)>150:
            raise ValueError('INVALID_IMPACT_REQUEST')
        if re.search(r'[\n\r]',new_consequence):raise ValueError('MULTILINE_NOT_ALLOWED')
        source=self.declarations();parsed=parse_omega(source)
        if capability not in parsed:raise ValueError('UNKNOWN_CAPABILITY')
        old=parsed[capability]['consequences']
        if not old:raise ValueError('NO_CONSEQUENCE_DECLARATION')
        lines=source.splitlines(keepends=True)
        idx=old[0]['line']-1
        lines[idx]=re.sub(r'consequence .+?(\r?\n)?$',f'consequence {new_consequence}'+ ('\n' if lines[idx].endswith('\n') else ''),lines[idx])
        preview=impact_before_after(source,''.join(lines),self.vectors())
        preview['capability']=capability
        preview['preview_wiki']=source_doc(''.join(lines),capability,self.vectors())
        preview['runtime_executed']=False
        return preview

    def status(self)->dict:
        n=self.metrics['interprets'];d=sorted(self.metrics['durations_ms']);
        def percentile(q):return d[int((len(d)-1)*q)] if d else None
        return {'classification':'MEASURED_LOCAL_PROTOTYPE','interpret_count':n,
                'interpret_duration_ms_p50':percentile(.5),'interpret_duration_ms_p95':percentile(.95),
                'reading_churn':self.metrics['churn'],'wiki_docs_built':self.metrics['wiki_docs'],
                'wiki_drift_detected':self.metrics['wiki_drift'],'source_errors':self.metrics['errors'],
                'source_stale_events':self.metrics['stale_source'],'case_count':len(self.cases()),
                'candidate_eval_calls':self.metrics['experiments'],'runtime_fresh':self.lab.snapshot()['source_hash']==self.lab.compiled_source,
                'wiki_coherence_benchmark':'SOURCE_ONLY; BEHAVIORAL_COHERENCE_NOT_PROVEN',
                'user_comprehension':'NOT_RUN','accessibility_browser_validation':'NOT_RUN'}
