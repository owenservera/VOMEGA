"""Ω developer tools loopback server; reuses phase0 Lab and its approval gates."""
from __future__ import annotations
import json
import secrets
import sys
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PHASE0=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(PHASE0))
from devtools.core import Tools  # noqa: E402
from runtime import Lab           # noqa: E402


def serve(port=8770):
    if port<1024 or port>65535: raise ValueError('PORT_OUT_OF_RANGE')
    lab=Lab();tools=Tools(lab,PHASE0)
    csrf=secrets.token_urlsafe(32)
    class Handler(BaseHTTPRequestHandler):
        def _send(self,status,data,kind='application/json'):
            body=json.dumps(data,ensure_ascii=False).encode('utf-8') if kind=='application/json' else data
            self.send_response(status)
            self.send_header('Content-Type',kind+'; charset=utf-8')
            self.send_header('Content-Length',str(len(body)))
            self.send_header('Cache-Control','no-store')
            self.send_header('X-Content-Type-Options','nosniff')
            self.send_header('Referrer-Policy','no-referrer')
            self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'")
            self.end_headers();self.wfile.write(body)

        def _allowed(self):
            return self.headers.get('Host') in (f'127.0.0.1:{port}',f'localhost:{port}')

        def do_GET(self):
            if not self._allowed():return self._send(403,{'error':'HOST_DENIED'})
            if self.path=='/':return self._send(200,(PHASE0/'devtools/dashboard.html').read_bytes(),'text/html')
            if self.path=='/ui.js':return self._send(200,(PHASE0/'devtools/ui.js').read_bytes(),'text/javascript')
            if self.path=='/style.css':return self._send(200,(PHASE0/'devtools/style.css').read_bytes(),'text/css')
            if self.path=='/api/bootstrap':return self._send(200,{'session':lab.session(),'csrf':csrf})
            if self.path=='/api/metrics':return self._send(200,tools.status())
            if self.path=='/api/cases':return self._send(200,{'cases':tools.cases()})
            return self._send(404,{'error':'NOT_FOUND'})

        def do_POST(self):
            if not self._allowed() or self.headers.get('X-Omega-CSRF')!=csrf:
                return self._send(403,{'error':'REQUEST_DENIED'})
            origin=self.headers.get('Origin')
            if origin and origin not in (f'http://127.0.0.1:{port}',f'http://localhost:{port}'):
                return self._send(403,{'error':'ORIGIN_DENIED'})
            try:
                n=int(self.headers.get('Content-Length','0'))
                if n<=0 or n>32768:raise ValueError('BODY_LIMIT')
                req=json.loads(self.rfile.read(n))
                if not isinstance(req,dict):raise ValueError('BODY_MUST_BE_OBJECT')
                sid=req.get('session')
                if not isinstance(sid,str) or sid not in lab.sessions:raise ValueError('UNKNOWN_SESSION')
                path=self.path
                if path=='/api/interpret':
                    out=tools.interpret(sid,req['input'],req['revision'])
                elif path=='/api/choose':
                    out=lab.choose(sid,req['revision'],req['reading'])
                elif path=='/api/confirm':
                    preview=req['preview']
                    token=lab.authorize(sid,preview,req.get('consent'))
                    out=lab.dispatch(sid,token,preview)
                elif path=='/api/wiki':
                    out=tools.wiki(req['capability'])
                elif path=='/api/capture':
                    out=tools.capture(req)
                elif path=='/api/evaluate':
                    out=tools.evaluate(req['candidates'])
                elif path=='/api/impact':
                    out=tools.impact(req['capability'],req['new_consequence'])
                else:raise ValueError('UNKNOWN_ENDPOINT')
                return self._send(200,out)
            except (ValueError,KeyError,TypeError,IndexError) as e:
                return self._send(409,{'error':str(e)})
            except Exception:
                return self._send(500,{'error':'UNEXPECTED_SERVER_ERROR'})

    print(f'Ω developer tools (mock only): http://127.0.0.1:{port}',flush=True)
    ThreadingHTTPServer(('127.0.0.1',port),Handler).serve_forever()


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=8770)
    args=p.parse_args();serve(args.port)
