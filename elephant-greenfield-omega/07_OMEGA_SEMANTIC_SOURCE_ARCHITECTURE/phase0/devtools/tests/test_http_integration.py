"""Live HTTP acceptance against REAL Phase 0 Lab; skips if runtime not installed."""
import json
import socket
import sys
import threading
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path

PHASE0=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(PHASE0))
try:
    from devtools.app import serve
    from runtime import Lab
    REAL_PHASE0_AVAILABLE = True
except ModuleNotFoundError:
    REAL_PHASE0_AVAILABLE = False


@unittest.skipUnless(REAL_PHASE0_AVAILABLE, 'Full Phase 0 runtime not present in standalone source snapshot')
class EndToEndHttpTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0))
            cls.port=sock.getsockname()[1]
        cls.base=f'http://127.0.0.1:{cls.port}'
        threading.Thread(target=serve,args=(cls.port,),daemon=True).start()
        for _ in range(50):
            try:
                cls.bootstrap=json.load(urllib.request.urlopen(cls.base+'/api/bootstrap',timeout=.5));break
            except (OSError,urllib.error.URLError):time.sleep(.05)
        else:raise RuntimeError('Local devtools server did not start')

    def post(self,path,body,csrf=None):
        payload=json.dumps({'session':self.bootstrap['session'],**body}).encode()
        req=urllib.request.Request(self.base+path,data=payload,headers={'Content-Type':'application/json',
                    'X-Omega-CSRF':self.bootstrap['csrf'] if csrf is None else csrf})
        with urllib.request.urlopen(req,timeout=5) as res:return json.load(res)

    def test_live_wiki_runner_impact_and_security(self):
        for uri,content_type in [('/','text/html'),('/ui.js','text/javascript'),('/style.css','text/css')]:
            with urllib.request.urlopen(self.base+uri,timeout=5) as res:
                self.assertEqual(res.status,200);self.assertIn(content_type,res.headers['Content-Type'])
        a=self.post('/api/interpret',{'input':'ask claude work to explain this error','revision':1})
        self.assertEqual(a['state']['status'],'READY')
        self.assertEqual(a['wiki']['capability'],'cap:prompt.send')
        self.assertTrue(a['wiki']['runtime_source_fresh'])
        self.assertIsNotNone(a['preview'])
        # Actual Phase 0 one-use gate yields a receipt; no network/provider dispatch.
        receipt=self.post('/api/confirm',{'preview':a['preview'],'consent':True})
        self.assertEqual(receipt['mode'],'MOCK_ONLY')
        with self.assertRaises(urllib.error.HTTPError) as already:
            self.post('/api/confirm',{'preview':a['preview'],'consent':True})
        self.assertEqual(already.exception.code,409)
        b=self.post('/api/interpret',{'input':'tell chatgpt personal account balance please','revision':2})
        self.assertTrue(b['state']['ambiguous'])
        self.assertIsNone(b['preview'])
        impact=self.post('/api/impact',{'capability':'cap:prompt.send','new_consequence':'stays-here'})
        self.assertIn('cap:prompt.send',impact['consequence_changes'])
        proposed=self.post('/api/capture',{'input':'make me a sandwich','expected':{'status':'UNKNOWN'}})
        self.assertEqual(proposed['status'],'PROPOSED')
        score=self.post('/api/evaluate',{'candidates':{proposed['id']:{'state':{'status':'UNKNOWN'},'reading':''}}})
        self.assertEqual(score['passed'],1)
        with self.assertRaises(urllib.error.HTTPError) as bad_csrf:
            self.post('/api/evaluate',{'candidates':{}},csrf='not-the-CSRF-token')
        self.assertEqual(bad_csrf.exception.code,403)


if __name__=='__main__':unittest.main()
