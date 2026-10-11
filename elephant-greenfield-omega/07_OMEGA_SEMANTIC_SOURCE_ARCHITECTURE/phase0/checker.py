"""Independent finite checker: no author engine import, no generated score trusted."""
import hashlib
import json
from pathlib import Path
import oracle


def run():
    root=Path(__file__).resolve().parent
    manifest=json.loads((root/'goldens/manifest.json').read_text())
    for name,sha in manifest['files'].items():
        assert hashlib.sha256((root/'goldens'/name).read_bytes()).hexdigest()==sha,name
    vectors=[json.loads(s) for s in (root/'goldens/public.jsonl').read_text(encoding='utf-8').splitlines()]
    seen={};ready=0;mutations=0
    for v in vectors:
        state=v['expected']
        if state['status']!='READY':continue
        errors=oracle.check(state,v['reading']);assert not errors,(v['id'],errors)
        digest=oracle.digest('omega-semantic/1',oracle.semantic(state))
        assert digest==v['semantic_digest']
        assert seen.setdefault(v['reading'],digest)==digest,'NON_INJECTIVE'
        assert oracle.check(state,v['reading']+' altered'),'mutation escaped'
        mutations+=1;ready+=1
    # Corpus expectations are fixed operator seed assertions, not model-generated answer keys.
    corpus={f"corpus-{it['n']:03}":it['expect'] for it in oracle.FIXTURE['corpus']}
    for v in vectors:
        if v['kind']=='interpret':assert v['expected']==corpus[v['id']]
    result={'classification':'MEASURED','command':'python checker.py','verified_READY_rows':ready,
            'rejected_reading_mutations':mutations,'manifest_files_checked':len(manifest['files']),
            'scope':'six fixture capabilities; partial renderings are source-derived, not independently proved'}
    print(json.dumps(result,indent=2));return result


if __name__=='__main__':run()
