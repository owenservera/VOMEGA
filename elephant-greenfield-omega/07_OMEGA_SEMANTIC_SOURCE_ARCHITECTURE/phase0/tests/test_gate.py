import copy
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from runtime import Lab
import oracle


class GateTests(unittest.TestCase):
    def setUp(self):
        self.now = 0
        self.lab = Lab(clock=lambda:self.now)
        self.sid = self.lab.session()
        self.text = 'ask claude work to explain this error'
        self.p = self.lab.interpret(self.sid, self.text, 1)['preview']

    def rejected(self, action, reason):
        before = len(self.lab.receipts)
        with self.assertRaisesRegex(ValueError, reason): action()
        self.assertEqual(before, len(self.lab.receipts), 'rejection created an effect')

    def authorize(self, p=None):
        return self.lab.authorize(self.sid, self.p if p is None else p, True)

    def test_success_then_replay(self):
        token = self.authorize()
        r = self.lab.dispatch(self.sid, token, self.p)
        self.assertEqual(r['command']['args']['prompt'], 'explain this error')
        self.assertEqual(r['mode'], 'MOCK_ONLY')
        self.rejected(lambda:self.lab.dispatch(self.sid,token,self.p),'USED_PERMIT')

    def test_each_display_field_is_bound(self):
        for field in ('reading','semantic_digest','display_digest','display_revision','mode','input'):
            with self.subTest(field=field):
                changed = copy.deepcopy(self.p); changed[field] += 'corruption'
                self.rejected(lambda:self.authorize(changed),'MISMATCH|STALE')

    def test_consequence_removed(self):
        changed = copy.deepcopy(self.p); changed['reading'] = changed['reading'].replace('Your words will leave this computer.','')
        self.rejected(lambda:self.authorize(changed),'MISMATCH')

    def test_input_changed_after_authorization(self):
        token = self.authorize()
        self.lab.interpret(self.sid,'ask gemini to different payload',2)
        self.rejected(lambda:self.lab.dispatch(self.sid,token,self.p),'STALE')

    def test_stale_revision(self):
        self.rejected(lambda:self.lab.interpret(self.sid,self.text,1),'STALE_INPUT')

    def test_new_display_same_text_invalidates(self):
        token = self.authorize(); self.lab.interpret(self.sid,self.text,2)
        self.rejected(lambda:self.lab.dispatch(self.sid,token,self.p),'STALE')

    def test_snapshot_mutations_at_dispatch(self):
        for target in ('session','account_provider','permission','epoch','policy'):
            with self.subTest(target=target):
                self.setUp(); token=self.authorize()
                world=self.lab.world
                if target=='session': world['accounts']['account:claude-work']['session']='changed'
                if target=='account_provider': world['accounts']['account:claude-work']['provider']='provider:gemini'
                if target=='permission': world['permission']='denied'
                if target=='epoch': world['epoch']+=1
                if target=='policy': world['policy_revision']+=1
                self.rejected(lambda:self.lab.dispatch(self.sid,token,self.p),'SNAPSHOT_CHANGED')

    def test_source_changed(self):
        token=self.authorize()
        original=self.lab.snapshot
        self.lab.snapshot=lambda:{**original(),'source_hash':'changed'}
        self.rejected(lambda:self.lab.dispatch(self.sid,token,self.p),'SNAPSHOT_CHANGED')

    def test_expired_preview(self):
        self.now=61; self.rejected(self.authorize,'EXPIRED_PREVIEW')

    def test_expired_permit(self):
        token=self.authorize();self.now=16
        self.rejected(lambda:self.lab.dispatch(self.sid,token,self.p),'EXPIRED_PERMIT')

    def test_consent_and_reauthorization(self):
        for consent in (False,1,'yes',None):
            self.rejected(lambda:self.lab.authorize(self.sid,self.p,consent),'CONSENT')
        self.authorize();self.rejected(self.authorize,'ALREADY_AUTHORIZED')

    def test_forged_and_wrong_session_permits(self):
        self.rejected(lambda:self.lab.dispatch(self.sid,self.p['semantic_digest'],self.p),'INVALID_PERMIT')
        token=self.authorize();other=self.lab.session()
        self.rejected(lambda:self.lab.dispatch(other,token,self.p),'INVALID_PERMIT')

    def test_ambiguous_ready_does_not_get_preview(self):
        result=self.lab.interpret(self.sid,'tell chatgpt personal account balance please',2)
        self.assertEqual(result['state']['status'],'READY')
        self.assertTrue(result['state']['ambiguous']);self.assertIsNone(result['preview'])
        self.rejected(lambda:self.authorize({'id':'invented'}),'UNKNOWN_PREVIEW')
        chosen=next(r for r in result['alternatives'] if '“account balance please”' in r)
        p=self.lab.choose(self.sid,2,chosen);token=self.authorize(p)
        r=self.lab.dispatch(self.sid,token,p)
        self.assertEqual(r['command']['args']['prompt'],'account balance please')

    def test_partial_choice(self):
        result=self.lab.interpret(self.sid,'ask claude to hello',2)
        self.assertEqual(result['state']['status'],'NEEDS_CHOICE');self.assertIsNone(result['preview'])
        self.assertEqual(len(result['alternatives']),2)
        p=self.lab.choose(self.sid,2,result['alternatives'][0]);token=self.authorize(p)
        self.lab.dispatch(self.sid,token,p)

    def test_bad_choice(self):
        self.lab.interpret(self.sid,'ask claude to hello',2)
        self.rejected(lambda:self.lab.choose(self.sid,2,'Send anything anywhere'),'INVALID_CHOICE')

    def test_partial_without_payload_never_executes(self):
        result=self.lab.interpret(self.sid,'ask claude',2)
        self.assertIsNone(result['preview']);self.assertEqual(result['alternatives'],[])

    def test_unknown_and_config_readonly(self):
        for rev,text in enumerate(('make me a sandwich','add my claude account called school'),2):
            result=self.lab.interpret(self.sid,text,rev);self.assertIsNone(result['preview'])

    def test_unicode_rejected_and_old_permit_invalidated(self):
        token=self.authorize()
        self.rejected(lambda:self.lab.interpret(self.sid,'ask gemini to hi\u202e',2),'UNICODE')
        self.rejected(lambda:self.lab.dispatch(self.sid,token,self.p),'STALE')

    def test_oracle_mutations(self):
        state=self.lab.engine.recognize(self.text);reading=self.lab.engine.render(state)
        self.assertEqual(oracle.check(state,reading),[])
        variants=[]
        for key,value in [('account','account:gemini-personal'),('prompt','changed'),('model','model:chatgpt/model-a')]:
            s=copy.deepcopy(state);s['args'][key]=value;variants.append(s)
        missing=copy.deepcopy(state);del missing['args']['prompt'];variants.append(missing)
        ambiguous=copy.deepcopy(state);ambiguous['ambiguous']=['another meaning'];variants.append(ambiguous)
        extra=copy.deepcopy(state);extra['args']['authority']='granted';variants.append(extra)
        for s in variants:self.assertTrue(oracle.check(s,reading))
        self.assertTrue(oracle.check(state,reading.replace('Your words will leave this computer.','')))

    def test_concurrent_permit_consumption(self):
        from concurrent.futures import ThreadPoolExecutor
        token=self.authorize()
        def run(_):
            try:return self.lab.dispatch(self.sid,token,self.p)['mode']
            except ValueError:return 'BLOCKED'
        with ThreadPoolExecutor(max_workers=8) as executor: outcomes=list(executor.map(run,range(8)))
        self.assertEqual(outcomes.count('MOCK_ONLY'),1);self.assertEqual(len(self.lab.receipts),1)

    def test_invalid_edit_cannot_reuse_previous_choices(self):
        result=self.lab.interpret(self.sid,'ask claude to hello',2)
        old_choice=result['alternatives'][0]
        self.rejected(lambda:self.lab.interpret(self.sid,'bad\u202e',3),'UNICODE')
        self.rejected(lambda:self.lab.choose(self.sid,3,old_choice),'INVALID_CHOICE')

    def test_all_observed_runA_false_ready_regressions_block(self):
        import gzip
        import json
        path=Path(__file__).resolve().parents[1]/'goldens/false-ready-regressions.jsonl.gz'
        checked=0
        with gzip.open(path,'rt',encoding='utf-8') as f:
            for row in map(json.loads,f):
                a,expected=row['A'],row['expected']
                wrong=a.get('capability')!=expected['capability'] or a.get('args')!=expected['args']
                if a['status']!='READY' or not wrong:continue
                checked+=1
                result=self.lab.interpret(self.sid,row['input'],checked+1)
                self.assertIsNone(result['preview'],row['id'])
                self.assertTrue(result['state'].get('ambiguous'),row['id'])
        self.assertEqual(checked,758)
        self.assertEqual(self.lab.receipts,[])


if __name__ == '__main__': unittest.main()
