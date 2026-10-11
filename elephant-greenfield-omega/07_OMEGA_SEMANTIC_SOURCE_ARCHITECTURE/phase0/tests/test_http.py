"""Real loopback HTTP boundary test, including CSRF/Host and stale dispatch."""
import json
import socket
import subprocess
import sys
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path


class HTTPTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0));cls.port=sock.getsockname()[1]
        cls.base=f'http://127.0.0.1:{cls.port}'
        cls.proc=subprocess.Popen([sys.executable,str(Path(__file__).resolve().parents[1]/'server.py'),'--port',str(cls.port)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        for _ in range(100):
            try:
                with urllib.request.urlopen(cls.base+'/bootstrap',timeout=1) as r:cls.boot=json.load(r)
                return
            except OSError:time.sleep(.02)
        cls.proc.terminate();raise RuntimeError('server failed to start')

    @classmethod
    def tearDownClass(cls):cls.proc.terminate();cls.proc.wait(timeout=5)

    def call(self,path,data,headers=None):
        req=urllib.request.Request(self.base+path,data=json.dumps({'session':self.boot['session'],**data}).encode(),
            headers=headers or {'Content-Type':'application/json','X-Omega-CSRF':self.boot['csrf']})
        try:
            with urllib.request.urlopen(req,timeout=3) as r:return r.status,json.load(r)
        except urllib.error.HTTPError as e:return e.code,json.load(e)

    def test_real_flow_and_stale_dispatch(self):
        status,out=self.call('/interpret',{'input':'ask gemini to hello','revision':1});self.assertEqual(status,200)
        p=out['preview'];status,auth=self.call('/authorize',{'preview':p,'consent':True});self.assertEqual(status,200)
        status,receipt=self.call('/dispatch',{'preview':p,'permit':auth['permit']});self.assertEqual(status,200)
        self.assertEqual(receipt['mode'],'MOCK_ONLY')
        self.assertEqual(self.call('/dispatch',{'preview':p,'permit':auth['permit']})[0],409)
        _,out=self.call('/interpret',{'input':'ask gemini to hello','revision':2});p=out['preview']
        _,auth=self.call('/authorize',{'preview':p,'consent':True})
        self.call('/interpret',{'input':'ask gemini to changed','revision':3})
        status,body=self.call('/dispatch',{'preview':p,'permit':auth['permit']})
        self.assertEqual(status,409);self.assertEqual(body['error'],'STALE_DISPLAY_OR_INPUT')

    def test_cross_origin_blocked(self):
        headers={'X-Omega-CSRF':self.boot['csrf'],'Origin':'https://untrusted.invalid'}
        self.assertEqual(self.call('/interpret',{},headers)[0],403)
        self.assertEqual(self.call('/interpret',{}, {'Content-Type':'application/json'})[0],403)

    def test_page_and_assets(self):
        for path in ('/','/app.js','/style.css'):
            with urllib.request.urlopen(self.base+path,timeout=3) as response:
                self.assertEqual(response.status,200);self.assertGreater(len(response.read()),100)
                self.assertIn('frame-ancestors',response.headers['Content-Security-Policy'])
        req=urllib.request.Request(self.base+'/',headers={'Host':'untrusted.invalid'})
        with self.assertRaises(urllib.error.HTTPError) as ctx:urllib.request.urlopen(req,timeout=3)
        self.assertEqual(ctx.exception.code,403)
