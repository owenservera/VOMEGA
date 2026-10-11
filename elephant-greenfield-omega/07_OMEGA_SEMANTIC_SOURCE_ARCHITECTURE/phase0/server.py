"""Loopback-only local demo. No third-party dependencies or external provider calls."""
import argparse
import json
import secrets
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from runtime import Lab, ROOT


def serve(port=8765):
    lab = Lab()
    csrf = secrets.token_urlsafe(32)
    class Handler(BaseHTTPRequestHandler):
        def send(self, status, data, kind='application/json'):
            body = json.dumps(data, ensure_ascii=False).encode() if kind == 'application/json' else data
            self.send_response(status)
            self.send_header('Content-Type', kind+'; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'")
            self.end_headers(); self.wfile.write(body)

        def valid_host(self):
            return self.headers.get('Host') in (f'127.0.0.1:{port}', f'localhost:{port}')

        def do_GET(self):
            if not self.valid_host(): return self.send(403, {'error':'HOST_DENIED'})
            if self.path == '/bootstrap': return self.send(200, {'session':lab.session(), 'csrf':csrf})
            if self.path == '/status':
                p = ROOT/'evidence/summary.json'
                return self.send(200, json.loads(p.read_text()) if p.exists() else {'status':'NOT_RUN'})
            files = {'/':('index.html','text/html'), '/app.js':('app.js','text/javascript'), '/style.css':('style.css','text/css')}
            if self.path not in files: return self.send(404, {'error':'NOT_FOUND'})
            name, kind = files[self.path]
            self.send(200, (ROOT/'web'/name).read_bytes(), kind)

        def do_POST(self):
            if not self.valid_host() or self.headers.get('X-Omega-CSRF') != csrf:
                return self.send(403, {'error':'REQUEST_DENIED'})
            origin = self.headers.get('Origin')
            if origin and origin not in (f'http://127.0.0.1:{port}', f'http://localhost:{port}'):
                return self.send(403, {'error':'ORIGIN_DENIED'})
            try:
                n = int(self.headers.get('Content-Length','0'))
                if not 0 < n <= 32768: raise ValueError('BODY_LIMIT')
                req = json.loads(self.rfile.read(n))
                sid = req['session']
                if self.path == '/interpret': out = lab.interpret(sid, req['input'], req['revision'])
                elif self.path == '/choose': out = lab.choose(sid, req['revision'], req['reading'])
                elif self.path == '/authorize': out = {'permit':lab.authorize(sid, req['preview'], req['consent'])}
                elif self.path == '/dispatch': out = lab.dispatch(sid, req['permit'], req['preview'])
                else: raise ValueError('UNKNOWN_ENDPOINT')
                self.send(200, out)
            except (ValueError, KeyError, TypeError) as e:
                self.send(409, {'error':str(e)})

    print(f'Ω mock lab: http://127.0.0.1:{port} — Ctrl+C to stop', flush=True)
    HTTPServer(('127.0.0.1', port), Handler).serve_forever()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(); parser.add_argument('--port', type=int, default=8765)
    serve(parser.parse_args().port)
