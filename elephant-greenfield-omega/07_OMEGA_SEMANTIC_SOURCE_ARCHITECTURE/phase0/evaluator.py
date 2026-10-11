"""Data-only intake: NEVER executes a candidate's commands or imports its code.

PASS is finite public-vector conformance, not independent execution certification.
Untrusted live execution stays BLOCKED until an isolated runner is provided.
"""
import argparse
import hashlib
import json
from pathlib import Path
import oracle

ROOT = Path(__file__).resolve().parent


def evaluate(path):
    path = Path(path).resolve()
    witnesses=[]
    result={'schema':'omega-scorecard/1','classification':'MEASURED','verdict':'UNKNOWN','disposition':'DEFER',
            'scope':'public finite response conformance; candidate source is NOT executed',
            'execution':'BLOCKED_NO_ISOLATED_RUNNER','holdouts':'NOT_RUN','witnesses':witnesses}
    try:
        manifest=json.loads((path/'manifest.json').read_text(encoding='utf-8'))
        required={'schema','source_hash','files','endpoints','tests','capability_packs','limitations','run_commands','scorecard'}
        if not required <= manifest.keys() or manifest['schema']!='omega-intake/1':raise ValueError('MANIFEST_SHAPE')
        if not all(manifest[k] for k in ('tests','capability_packs','run_commands','files')):raise ValueError('EMPTY_DECLARATION')
        for name,sha in manifest['files'].items():
            p=path/name
            if p.is_symlink() or not p.resolve().is_relative_to(path) or not p.is_file():raise ValueError('UNSAFE_OR_MISSING_PATH')
            if p.stat().st_size>20_000_000:raise ValueError('FILE_LIMIT')
            if hashlib.sha256(p.read_bytes()).hexdigest()!=sha:raise ValueError('INTEGRITY:'+name)
        for name in ['responses.jsonl',manifest['scorecard']]+manifest['tests']+manifest['capability_packs']:
            if name not in manifest['files']:raise ValueError('UNHASHED_REQUIRED_FILE:'+name)
        # Source identity binds listed content; caller-supplied scores are ignored.
        if manifest['source_hash']!=oracle.digest('omega-candidate-files/1',manifest['files']):raise ValueError('SOURCE_HASH')
        rows=[json.loads(s) for s in (path/'responses.jsonl').read_text(encoding='utf-8').splitlines()]
        by_id={r['id']:r for r in rows}
        if len(rows)!=len(by_id):raise ValueError('DUPLICATE_RESPONSE')
        expected=[json.loads(s) for s in (ROOT/'goldens/public.jsonl').read_text(encoding='utf-8').splitlines()]
        expected_ids={v['id'] for v in expected}
        for extra in by_id.keys()-expected_ids:witnesses.append({'id':extra,'error':'UNEXPECTED_RESPONSE'})
        passed=0
        for vector in expected:
            got=by_id.get(vector['id']);errors=[]
            if got is None:errors=['MISSING_RESPONSE']
            else:
                if not oracle.corpus_match(got['state'],vector['expected']):errors.append('SEMANTIC_MISMATCH')
                if got['reading']!=vector['reading']:errors.append('READING_MISMATCH')
                if got['state']['status']=='READY':errors.extend(oracle.check(got['state'],got['reading']))
                if got.get('semantic_digest')!=vector.get('semantic_digest'):errors.append('DIGEST_MISMATCH')
            if errors:witnesses.append({'id':vector['id'],'errors':errors,'got':got,'expected':vector})
            else:passed+=1
        result.update(verdict='FAIL' if witnesses else 'PASS',disposition='ADAPT' if witnesses else 'ACCEPT',
                      passed=passed,total=len(expected),source_hash=manifest['source_hash'])
    except (OSError,ValueError,KeyError,TypeError) as e:
        result.update(verdict='BLOCKED',disposition='DEFER');witnesses.append({'error':str(e)})
    return result


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('candidate');parser.add_argument('--output')
    args=parser.parse_args();report=evaluate(args.candidate);text=json.dumps(report,indent=2,ensure_ascii=False)+'\n'
    if args.output:Path(args.output).write_text(text,encoding='utf-8')
    print(text);raise SystemExit(0 if report['verdict']=='PASS' else 1)
