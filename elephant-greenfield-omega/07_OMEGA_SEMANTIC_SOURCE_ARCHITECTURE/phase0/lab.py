"""Reproducible Phase 0 command line. Run from any directory."""
import argparse
import copy
import gzip
import hashlib
import importlib.util
import io
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path
from runtime import ROOT, Lab, source_hash
import oracle
import evaluator
sys.path.insert(0,str(ROOT/'vendor/runA'))
import proofs
from osl import hear_expand, join_tokens


def write(path, value):
    path=ROOT/path;path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(value,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')


def line(value):return json.dumps(value,sort_keys=True,ensure_ascii=False,separators=(',',':'))+'\n'


def verify_sources():
    manifest=json.loads((ROOT/'SOURCE_MANIFEST.json').read_text())
    index={e['path']:e for e in manifest['entries']}
    for p in (ROOT/'vendor').rglob('*'):
        if not p.is_file() or '__pycache__' in p.parts:continue
        relative=p.relative_to(ROOT/'vendor').as_posix().replace('runB/','runB_executed/')
        original='07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/'+relative
        assert hashlib.sha256(p.read_bytes()).hexdigest()==index[original]['sha256'],str(p)
    frozen=hashlib.sha256(json.dumps(oracle.FIXTURE,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
    assert frozen==manifest['fixture_canonical_sha256']
    return frozen


def baseline():
    verify_sources()
    replay=ROOT/'.replay/runB';replay.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(ROOT/'vendor/runB/run.py',replay/'run.py')
    shutil.copyfile(ROOT/'vendor/runA/fixture.json',replay/'omega_core_fixture_v1.json')
    records=[]
    for name,script in [('runA',ROOT/'vendor/runA/proofs.py'),('runB',replay/'run.py')]:
        start=time.perf_counter()
        p=subprocess.run([sys.executable,str(script)],capture_output=True,text=True,encoding='utf-8',timeout=240,
                         env={**os.environ,'PYTHONUTF8':'1'})
        (ROOT/f'evidence/{name}.stdout').write_text(p.stdout,encoding='utf-8')
        (ROOT/f'evidence/{name}.stderr').write_text(p.stderr,encoding='utf-8')
        records.append({'name':name,'command':f'python {script.relative_to(ROOT).as_posix()}',
                        'exit_code':p.returncode,'elapsed_seconds':time.perf_counter()-start,'classification':'MEASURED',
                        'python':sys.version,'platform':platform.platform(),
                        'scratch_modification':'copy vendor/runA/fixture.json to .replay/runB/omega_core_fixture_v1.json' if name=='runB' else None})
        write('evidence/baseline-runs.json',records)
        if p.returncode:raise RuntimeError(name+' baseline failed; see stderr')


def generated(O, prompts):
    """Portable reconstruction of original cross_runB.gen; expected commands originate BEFORE parse."""
    explicit={a:[] for a in O.acct}
    for phrase,(pid,label) in O.phrase.items():
        candidates=[a for a in O.acct_order if (pid is None or O.acct[a]['provider']==pid) and
                    (label is None or O.acct[a]['label'].lower()==label)]
        if len(candidates)==1:explicit[candidates[0]].append(phrase)
    model_hear={v:k for k,v in O.model_by_hear.items()}
    for c in proofs.ready_space(O):
        variants=[c]
        if prompts is not None:
            if c['args'].get('prompt')!=O.fx['enumeration']['prompts'][0]:continue
            variants=[{**c,'args':{**c['args'],'prompt':p}} for p in prompts]
        for cmd in variants:
            a=cmd['args']
            for h in O.hear:
                if h['cap']!=cmd['capability'] or not set(a)<=h['slots']:continue
                if 'account' in a:envs=[{'account':[ph]} for ph in explicit[a['account']]]
                elif 'accounts' in a:
                    x,y=a['accounts'];ex,ey=explicit[x],explicit[y]
                    envs=[{'accounts':[f'{ex[i%len(ex)]} and {ey[(i*7)%len(ey)]}']} for i in range(max(len(ex),len(ey)))]
                elif 'provider' in a:envs=[{'provider':[al]} for al,pid in O.alias.items() if pid==a['provider']]
                else:envs=[{}]
                for env in envs:
                    for key in ('prompt','label'):
                        if key in a:env[key]=[a[key]]
                    if 'model' in a:env['model']=[model_hear[a['model']]]
                    env['_']=['this']
                    for tokens in hear_expand(h['ast'],env):
                        expected=copy.deepcopy(cmd)
                        # Frozen historical normalization contract, independently restated.
                        if 'prompt' in a:
                            text=a['prompt'].strip()
                            for left,right in [('"','"'),('“','”'),("'","'")]:
                                if len(text)>=2 and text[0]==left and text[-1]==right and left not in text[1:-1] and right not in text[1:-1]:
                                    text=text[1:-1].strip();break
                            expected['args']['prompt']=text
                        yield join_tokens(tokens),expected,h


def goldens():
    verify_sources();O=proofs.omega();vectors=[]
    for i,state in enumerate(proofs.ready_space(O)):
        reading=O.render(state)
        assert not oracle.check(state,reading)
        vectors.append({'id':f'ready-{i:03}','kind':'ready','expected':state,'reading':reading,
                        'semantic_digest':oracle.digest('omega-semantic/1',oracle.semantic(state)),
                        'derivation':{'declaration':'vendor/runA/omega.osl','capability':state['capability']}})
    for it in O.fx['corpus']:
        state=O.recognize(it['text'])
        assert oracle.corpus_match(state,it['expect'])
        vectors.append({'id':f"corpus-{it['n']:03}",'kind':'interpret','input':it['text'],'expected':it['expect'],
                        'reading':O.render(state),'semantic_digest':oracle.digest('omega-semantic/1',oracle.semantic(state)) if state['status']=='READY' else None,
                        'derivation':state['trace'],'observed_ambiguity':state.get('ambiguous',[])})
    (ROOT/'goldens/public.jsonl').write_text(''.join(line(v) for v in vectors),encoding='utf-8')
    # Capture actual reachable states without modifying immutable author source.
    observed={};recognize=O.recognize
    def observe(text):
        state=recognize(text);observed.setdefault(O.digest(state),(text,copy.deepcopy(state)));return state
    O.recognize=observe
    reachable=proofs.reachable_states(O);O.recognize=recognize
    states=[{'input':u,'state':s,'reading':O.render(s),'legacy_digest':d,'provenance':'SOURCE_DERIVED; not independent truth for non-READY'} for d,(u,s) in sorted(observed.items())]
    (ROOT/'goldens/reachable.jsonl').write_text(''.join(line(s) for s in states),encoding='utf-8')
    # The repaired Run B path is scratch only, including during fresh goldens runs.
    replay=ROOT/'.replay/runB';replay.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(ROOT/'vendor/runB/run.py',replay/'run.py');shutil.copyfile(ROOT/'vendor/runA/fixture.json',replay/'omega_core_fixture_v1.json')
    spec=importlib.util.spec_from_file_location('run_b_reference',replay/'run.py');B=importlib.util.module_from_spec(spec);spec.loader.exec_module(B)
    totals={};regressions=[]
    with (ROOT/'goldens/generated.jsonl.gz').open('wb') as raw:
        with gzip.GzipFile(fileobj=raw,mode='wb',filename='',mtime=0) as zipped:
            for cohort,prompts in [('frozen',None),('extra',proofs.EXTRA_PROMPTS)]:
                counts={'items':0,'A_wrong':0,'A_wrong_READY':0,'A_ambiguous':0,'A_unflagged_wrong_READY':0,'B_wrong':0,'B_wrong_READY':0}
                start=time.perf_counter()
                for text,expected,template in generated(O,prompts):
                    counts['items']+=1
                    a=O.recognize(text);b=B.recognize(text)
                    def correct(s):return s.get('status')=='READY' and s.get('capability')==expected['capability'] and s.get('args')==expected['args']
                    ca,cb=correct(a),correct(b)
                    counts['A_wrong']+=not ca;counts['A_wrong_READY']+=not ca and a['status']=='READY'
                    counts['A_ambiguous']+=bool(a.get('ambiguous'));counts['A_unflagged_wrong_READY']+=not ca and a['status']=='READY' and not a.get('ambiguous')
                    counts['B_wrong']+=not cb;counts['B_wrong_READY']+=not cb and b['status']=='READY'
                    record={'id':f'{cohort}-{counts["items"]:06}','input':text,'expected':expected,'template':template['id'],
                            'declaration_line':template['line'],'A':O.public(a),'A_ambiguity':a.get('ambiguous',[]),'B':b}
                    zipped.write(line(record).encode())
                    if not ca or (not cb and b['status']=='READY'):regressions.append(record)
                counts['elapsed_seconds']=time.perf_counter()-start;totals[cohort]=counts
    with (ROOT/'goldens/false-ready-regressions.jsonl.gz').open('wb') as raw:
        with gzip.GzipFile(fileobj=raw,mode='wb',filename='',mtime=0) as out:
            out.write(''.join(line(r) for r in regressions).encode())
    write('evidence/cross-comparison.json',{'classification':'MEASURED','command':'python lab.py goldens','cohort':'phase0-cross-source-v1',
          'warning':'Generated by A grammar; not unbiased B1 competition. Wrong READY != dispatched effect. A ambiguity is diagnostic only in original source.',
          'counts':totals,'reachable':reachable,'public_vectors':len(vectors),'regression_records':len(regressions)})
    files={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'goldens').iterdir() if p.is_file() and p.name!='manifest.json'}
    write('goldens/manifest.json',{'id':'phase0-public-v1','fixture_id':O.fx['fixture_id'],'fixture_hash':O.fixture_hash,
          'source_hash':source_hash(),'files':files,'generated_count':sum(v['items'] for v in totals.values()),
          'provenance':'Run A base; original command enumeration and hear grammar; non-READY readings are source-derived only',
          'private_holdouts':'NOT_RUN; no sealed inputs exist in this public package'})


def candidate():
    O=proofs.omega();directory=ROOT/'candidates/reference';directory.mkdir(parents=True,exist_ok=True)
    responses=[]
    for line_ in (ROOT/'goldens/public.jsonl').read_text(encoding='utf-8').splitlines():
        v=json.loads(line_);state=O.recognize(v['input']) if v['kind']=='interpret' else v['expected']
        responses.append({'id':v['id'],'state':O.public(state),'reading':O.render(state),
                          'semantic_digest':oracle.digest('omega-semantic/1',oracle.semantic(state)) if state['status']=='READY' else None})
    (directory/'responses.jsonl').write_text(''.join(line(r) for r in responses),encoding='utf-8')
    (directory/'README.md').write_text('Actual Run A adapter response bundle. Reproduce: python lab.py candidate from the phase0 directory. No arbitrary command is run by the evaluator. Public fixture scope only.\n',encoding='utf-8')
    write('candidates/reference/scorecard.json',{'status':'SELF_REPORTED','claim':'Evaluate independently with evaluator.py; self-scores are not used.'})
    write('candidates/reference/capability-pack.json',{'id':'runA-reference-response-bundle','maturity':'EXPERIMENTAL','source_hash':source_hash(),'runtime':'Python','limitations':['No TypeScript semantic core','No private holdout certification']})
    (directory/'tests.json').write_text(json.dumps({'command':'python -m unittest discover -s tests -v','path':'../../tests/test_gate.py'}))
    (directory/'run.ps1').write_text('Push-Location "$PSScriptRoot/../.."\ntry { py -3 lab.py candidate; if ($LASTEXITCODE -ne 0) { throw "Candidate generation failed" } } finally { Pop-Location }\n')
    files={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in directory.iterdir() if p.is_file() and p.name!='manifest.json'}
    write('candidates/reference/manifest.json',{'schema':'omega-intake/1','source_hash':oracle.digest('omega-candidate-files/1',files),
          'implementation_source_hash':source_hash(),'files':files,'endpoints':['interpret','render'],
          'tests':['tests.json'],'capability_packs':['capability-pack.json'],'limitations':['Data-only evaluation; no isolated live runner','Public vectors only'],
          'run_commands':['python lab.py candidate'],'scorecard':'scorecard.json'})
    result=evaluator.evaluate(directory);write('evidence/candidate-reference.json',result)
    assert result['verdict']=='PASS',result
    # Negative control: corruption with recomputed integrity must still fail semantic scoring.
    mutated=ROOT/'.replay/mutated-candidate';shutil.copytree(directory,mutated,dirs_exist_ok=True)
    rows=[json.loads(s) for s in (mutated/'responses.jsonl').read_text(encoding='utf-8').splitlines()]
    rows[0]['reading']=rows[0]['reading'].replace('Your words will leave this computer.','')
    (mutated/'responses.jsonl').write_text(''.join(line(r) for r in rows),encoding='utf-8')
    m=json.loads((mutated/'manifest.json').read_text());m['files']['responses.jsonl']=hashlib.sha256((mutated/'responses.jsonl').read_bytes()).hexdigest()
    m['source_hash']=oracle.digest('omega-candidate-files/1',m['files']);(mutated/'manifest.json').write_text(json.dumps(m))
    result=evaluator.evaluate(mutated);write('evidence/candidate-mutated.json',result);assert result['verdict']=='FAIL'


def tests():
    p=subprocess.run([sys.executable,'-m','unittest','discover','-s','tests','-v'],cwd=ROOT,capture_output=True,text=True,encoding='utf-8',env={**os.environ,'PYTHONUTF8':'1'})
    (ROOT/'evidence/gate-tests.log').write_text(p.stdout+p.stderr,encoding='utf-8')
    if p.returncode:raise RuntimeError(p.stderr)


def summary():
    cross=json.loads((ROOT/'evidence/cross-comparison.json').read_text());score=json.loads((ROOT/'evidence/candidate-reference.json').read_text())
    current=source_hash();gold=json.loads((ROOT/'goldens/manifest.json').read_text())
    test_log=(ROOT/'evidence/gate-tests.log').read_text(encoding='utf-8')
    test_count=int(re.search(r'Ran (\d+) tests',test_log).group(1))
    write('evidence/summary.json',{'status':'EXPERIMENTAL_MOCK_ONLY','classification':'MEASURED','source_hash':current,
          'source_freshness':'CURRENT' if gold['source_hash']==current else 'STALE','fixture_id':'omega-core-fixture-v1',
          'suite_command':'python lab.py verify','gate_log':'evidence/gate-tests.log','tests_passed':test_count if test_log.rstrip().endswith('OK') else None,'public_vectors':score['total'],
          'candidate_passed':score['passed'],'generated':cross['counts'],
          'false_READY_definition':'parser READY with wrong generated command, not effect count',
          'latest_known_failure':'Run A hostile generated misparse; diagnostic ambiguity blocks new runtime pending explicit choice',
          'effect_negative_tests':'evidence/gate-tests.log; zero receipts asserted on each rejected call',
          'heldout_coverage':'UNKNOWN / NOT_RUN','B1':'NOT_RUN as competition; source comparison only','B2':'NOT_RUN','B3':'NOT_RUN','B4':'NOT_RUN',
          'Windows_execution':'NOT_RUN','browser_visual_validation':'BLOCKED: Playwright browser unavailable; download returned invalid archive',
          'human_comprehension':'NOT_RUN','tokens_and_cost':'UNKNOWN'})


def benchmark(name):
    reasons={'B1':'Requires independently labelled blind corpus and external arms; no provider calls authorized.',
             'B2':'Requires tuned grep, code-mode, vector and capsule arms plus observed token accounting.',
             'B3':'Requires matched transport/relay arms and independent fault schedule.',
             'B4':'Requires an independently built TS twin, randomized tasks, equal budgets and token witnesses.'}
    value={'benchmark':name,'status':'NOT_RUN','reason':reasons[name],'available':'goldens, independent finite checker, mock execution gate, source comparisons'}
    write(f'evidence/{name}.json',value);print(json.dumps(value,indent=2))


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('command',choices=['baseline','goldens','candidate','test','verify','demo','status','B1','B2','B3','B4'])
    args=parser.parse_args()
    if args.command=='verify':
        baseline();goldens();tests();candidate()
        import checker
        write('evidence/independent-checker.json',checker.run())
        for name in ('B1','B2','B3','B4'):benchmark(name)
        summary();print((ROOT/'evidence/summary.json').read_text())
    elif args.command=='demo':
        from server import serve
        serve()
    elif args.command=='status':print((ROOT/'evidence/summary.json').read_text())
    elif args.command.startswith('B'):benchmark(args.command)
    else:{'baseline':baseline,'goldens':goldens,'candidate':candidate,'test':tests}[args.command]()
