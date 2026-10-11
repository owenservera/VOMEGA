import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from devtools.core import Tools, compare_case, impact_before_after, parse_omega, source_doc

class RefLab:
    """Original Run A engine in a lightweight test adapter; no permission to execute."""
    def __init__(self,source):
        sys.path.insert(0,str(ROOT/'vendor/runA'))
        from engine import Omega
        self.engine=Omega(str(source),str(ROOT/'vendor/runA/fixture.json'))
        self.source=source
        self.compiled_source=self.snapshot()['source_hash']
        self.sessions={}
    def snapshot(self):
        from devtools.core import sha
        return {'source_hash':sha(self.source.read_text(encoding='utf-8'))}
    def session(self):
        sid='test';self.sessions[sid]={'revision':0};return sid
    def interpret(self,sid,text,revision):
        if revision<=self.sessions[sid]['revision']:raise ValueError('STALE_INPUT_REVISION')
        self.sessions[sid]['revision']=revision
        if self.compiled_source!=self.snapshot()['source_hash']:raise ValueError('SOURCE_CHANGED_RESTART_REQUIRED')
        state=self.engine.recognize(text)
        return {'state':state,'reading':self.engine.render(state),'preview':None if state.get('ambiguous') else {'mode':'MOCK_ONLY'} if state['status']=='READY' else None,
                'alternatives':state.get('ambiguous',[]),'input_revision':revision}

class DevToolTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name);(self.root/'vendor/runA').mkdir(parents=True)
        for n in ('omega.osl','fixture.json'):
            shutil.copyfile(ROOT/'vendor/runA'/n,self.root/'vendor/runA'/n)
        self.source=self.root/'vendor/runA/omega.osl'
        self.original=self.source.read_text(encoding='utf-8')
        self.lab=RefLab(self.source);self.sid=self.lab.session()
        self.tools=Tools(self.lab,self.root)

    def test_declaration_inventory_and_source_grounded_wiki(self):
        doc=self.tools.wiki('cap:prompt.send')
        self.assertEqual(doc['status'],'DECLARED_NOT_PROVEN')
        self.assertTrue(doc['runtime_source_fresh'])
        self.assertTrue(doc['declaration']['consequences'])
        self.assertIn('prompt',[p['name'] for p in doc['declaration']['params']])
        self.assertGreaterEqual(len(parse_omega(self.original)),6)
        self.assertEqual(doc['provenance']['basis'],'SOURCE_PARSED_NOT_RUNTIME_VERIFIED')

    def test_live_interpretation_and_ambiguity_gate(self):
        a=self.tools.interpret(self.sid,'ask claude work to explain this error',1)
        self.assertEqual(a['state']['status'],'READY')
        self.assertIsNotNone(a['wiki'])
        b=self.tools.interpret(self.sid,'tell chatgpt personal account balance please',2)
        self.assertTrue(b['state'].get('ambiguous'))
        self.assertIsNone(b['preview'])
        self.assertTrue(b['reading_changed'])
        status=self.tools.status()
        self.assertEqual(status['interpret_count'],2)
        self.assertIsNotNone(status['interpret_duration_ms_p95'])

    def test_change_lab_declared_consequence_impact(self):
        r=self.tools.impact('cap:prompt.send','stays-here')
        self.assertEqual(r['consequence_changes'],['cap:prompt.send'])
        self.assertIn('wiki:cap:prompt.send',r['wiki_pages'])
        self.assertNotEqual(r['from_hash'],r['to_hash'])
        self.assertFalse(r['safe_to_execute'])
        self.assertEqual(r['preview_wiki']['declaration']['consequences'][0]['value'],'stays-here')
        self.assertEqual(self.source.read_text(),self.original,'impact preview must not modify source')

    def test_source_change_invalidates_live_runtime_and_refreshes_wiki(self):
        self.tools.interpret(self.sid,'ask claude work to hi',1)
        self.source.write_text(self.original.replace('consequence leaves-this-computer','consequence stays-here',1))
        changed=self.tools.wiki('cap:prompt.send')
        self.assertFalse(changed['runtime_source_fresh'])
        self.assertEqual(changed['declaration']['consequences'][0]['value'],'stays-here')
        with self.assertRaisesRegex(ValueError,'SOURCE_CHANGED'):self.tools.interpret(self.sid,'ask claude work to hi',2)
        self.assertEqual(self.tools.status()['source_stale_events'],1)

    def test_case_capture_is_proposed_not_automatically_truth(self):
        c=self.tools.capture({'input':'tell chatgpt personal account balance please','expected':{'status':'NEEDS_CHOICE'},
                              'feedback':'The phrase account balance belongs to the prompt'})
        self.assertEqual(c['status'],'PROPOSED')
        self.assertEqual(c['expected_provenance'],'USER_PROPOSED_NOT_INDEPENDENTLY_VERIFIED')
        self.assertEqual(len(self.tools.cases()),1)
        self.assertTrue(self.tools.cases_path.exists())
        self.assertNotIn('/evidence/',str(self.tools.cases_path))

    def test_runner_detects_wrong_ready_and_over_rejecting(self):
        c=self.tools.capture({'input':'ask claude work to hello','expected':{'status':'READY','capability':'cap:prompt.send',
                                       'args':{'account':'account:claude-work','prompt':'hello'}}})
        empty=self.tools.evaluate({c['id']:{'state':{'status':'UNKNOWN'},'reading':''}})
        self.assertEqual(empty['passed'],0)
        self.assertIn('over_rejection',empty['results'][0]['diff'])
        wrong=self.tools.evaluate({c['id']:{'state':{'status':'READY','capability':'cap:prompt.send',
                                  'args':{'account':'account:gemini-personal','prompt':'hello'}},'reading':'Send hello'}})
        self.assertEqual(wrong['passed'],0)
        self.assertIn('reading.consequence',wrong['results'][0]['diff'])
        good=self.tools.evaluate({c['id']:{'state':c['expected'],
                                           'reading':'Send “hello” to your Work account on Claude. Your words will leave this computer.'}})
        self.assertEqual(good['passed'],1)
        self.assertEqual(good['mode'],'DATA_ONLY_NO_CANDIDATE_EXECUTION')
        self.assertEqual(good['unreviewed_cases'],1)

    def test_impact_comparison_does_not_claim_unmapped_safety(self):
        out=impact_before_after(self.original,self.original)
        self.assertFalse(out['changed_capabilities'])
        self.assertTrue(out['unmapped_risks'])
        out2=impact_before_after(self.original,self.original.replace('consequence stays-here','consequence leaves-this-computer',1))
        self.assertTrue(out2['changed_capabilities'])

    def test_invalid_payloads_fail_without_writing_case(self):
        with self.assertRaisesRegex(ValueError,'EXPECTED_STATUS_REQUIRED'):
            self.tools.capture({'input':'hello','expected':{}})
        self.assertFalse(self.tools.cases_path.exists())
        with self.assertRaisesRegex(ValueError,'MULTILINE_NOT_ALLOWED'):
            self.tools.impact('cap:prompt.send','something\ncapability cap:evil')

if __name__=='__main__':unittest.main()
