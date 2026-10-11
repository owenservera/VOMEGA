"""Mock-only trusted runtime; original Python recognizer behind an explicit adapter."""
import copy
import hashlib
import json
import secrets
import sys
import threading
import time
from pathlib import Path
import oracle

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'vendor/runA'))
from engine import Omega


def source_hash():
    files = ['vendor/runA/engine.py', 'vendor/runA/osl.py', 'vendor/runA/omega.osl', 'vendor/runA/fixture.json', 'oracle.py', 'runtime.py']
    return oracle.digest('omega-source/1', {p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest() for p in files})


class Lab:
    def __init__(self, clock=time.monotonic):
        self.engine = Omega(str(ROOT/'vendor/runA/omega.osl'), str(ROOT/'vendor/runA/fixture.json'))
        self.clock = clock
        self.compiled_source = source_hash()
        self.lock = threading.RLock()
        self.sessions, self.previews, self.permits, self.receipts = {}, {}, {}, []
        self.world = {'epoch': 1, 'policy_revision': 1, 'permission': 'mock-only',
                      'accounts': {k: {'provider': a['provider'], 'session': 'mock-session:'+k, 'epoch': 1}
                                   for k, a in oracle.ACCOUNTS.items()}}

    def session(self):
        with self.lock:
            sid = secrets.token_urlsafe(24)
            self.sessions[sid] = {'revision': 0, 'input': '', 'preview_id': None}
            return sid

    def snapshot(self):
        return {'source_hash': source_hash(), 'world': copy.deepcopy(self.world)}

    def interpret(self, sid, text, revision):
        with self.lock:
            current = self.sessions[sid]
            if type(revision) is not int or revision <= current['revision']: raise ValueError('STALE_INPUT_REVISION')
            # Invalidate first, including malformed input.
            current.update(revision=revision, input=text, preview_id=None, result=None)
            if source_hash() != self.compiled_source: raise ValueError('SOURCE_CHANGED_RESTART_REQUIRED')
            if not isinstance(text, str) or len(text) > 2048: raise ValueError('INPUT_LIMIT')
            oracle.canonical(text)
            state = self.engine.recognize(text)
            reading = self.engine.render(state)
            alternatives = []
            if state.get('ambiguous'):
                alternatives = list(dict.fromkeys([reading] + state['ambiguous']))
            elif state['status'] == 'NEEDS_CHOICE' and state['capability'] in ('cap:prompt.send', 'cap:browser.show', 'cap:browser.hide'):
                for aid in state['candidates']:
                    args = {**state['args'], 'account': aid}
                    chosen = {'status':'READY', 'capability':state['capability'], 'args':args}
                    try:
                        chosen_reading = oracle.expected_reading(chosen)
                        if not oracle.check(chosen, self.engine.render(chosen)):
                            alternatives.append(chosen_reading)
                    except (KeyError, ValueError):
                        pass  # unresolved required fields need another input, never an effect
            result = {'state': state, 'reading': reading, 'input_revision':revision, 'alternatives':alternatives,
                      'source_hash': source_hash(), 'preview':None}
            current['result'] = copy.deepcopy(result)
            if state['status'] == 'READY' and not state.get('ambiguous'):
                result['preview'] = self._preview(sid, state, reading, None)
            return copy.deepcopy(result)

    def choose(self, sid, revision, reading):
        with self.lock:
            s = self.sessions[sid]
            if s['revision'] != revision or not s.get('result') or reading not in s['result']['alternatives']: raise ValueError('INVALID_CHOICE')
            state = self.engine.parse_reading(reading)
            if not state or oracle.check(state, reading): raise ValueError('CHOICE_NOT_READY')
            return self._preview(sid, state, reading, reading)

    def _preview(self, sid, state, reading, choice):
        if source_hash() != self.compiled_source: raise ValueError('SOURCE_CHANGED_RESTART_REQUIRED')
        errors = oracle.check(state, reading)
        if errors: raise ValueError(errors[0])
        if state['capability'] == 'cap:account.register': return None  # configuration stays read-only
        s = self.sessions[sid]
        pid = secrets.token_urlsafe(24)
        semantic_digest = oracle.digest('omega-semantic/1', oracle.semantic(state))
        binding = {'input':s['input'], 'input_revision':s['revision'], 'display_revision':pid,
                   'reading':reading, 'semantic_digest':semantic_digest, 'snapshot':self.snapshot(),
                   'choice':choice, 'mode':'MOCK_ONLY'}
        public = {**binding, 'id':pid, 'display_digest':oracle.digest('omega-display/1', binding)}
        self.previews[pid] = {'public':copy.deepcopy(public), 'state':copy.deepcopy(state), 'sid':sid,
                              'expires':self.clock()+60, 'authorized':False}
        s['preview_id'] = pid
        return copy.deepcopy(public)

    def _validate(self, sid, shown):
        if not isinstance(shown, dict): raise ValueError('NO_PREVIEW')
        p = self.previews.get(shown.get('id'))
        if not p or p['sid'] != sid: raise ValueError('UNKNOWN_PREVIEW')
        s = self.sessions[sid]
        if s['preview_id'] != shown['id'] or s['revision'] != shown.get('input_revision') or s['input'] != shown.get('input'):
            raise ValueError('STALE_DISPLAY_OR_INPUT')
        if shown != p['public']: raise ValueError('DISPLAY_BINDING_MISMATCH')
        if self.clock() >= p['expires']: raise ValueError('EXPIRED_PREVIEW')
        if shown['snapshot'] != self.snapshot(): raise ValueError('SNAPSHOT_CHANGED')
        if self.world['permission'] != 'mock-only': raise ValueError('PERMISSION_DENIED')
        # Reinterpret at the dispatch boundary, not a client-provided READY flag.
        now = self.engine.recognize(s['input'])
        choice = shown['choice']
        if choice is None:
            if now['status'] != 'READY' or now.get('ambiguous'): raise ValueError('AMBIGUOUS_OR_NOT_READY')
        else:
            if choice not in s['result']['alternatives']: raise ValueError('CHOICE_CHANGED')
            now = self.engine.parse_reading(choice)
        if not now or oracle.semantic(now) != oracle.semantic(p['state']): raise ValueError('SEMANTICS_CHANGED')
        errors = oracle.check(now, shown['reading'])
        if errors: raise ValueError(errors[0])
        return p

    def authorize(self, sid, shown, consent):
        with self.lock:
            if consent is not True: raise ValueError('EXPLICIT_CONSENT_REQUIRED')
            p = self._validate(sid, shown)
            if p['authorized']: raise ValueError('PREVIEW_ALREADY_AUTHORIZED')
            p['authorized'] = True
            token = secrets.token_urlsafe(32)
            self.permits[token] = {'sid':sid, 'preview':shown['id'], 'expires':min(p['expires'],self.clock()+15), 'used':False}
            return token

    def dispatch(self, sid, token, shown):
        with self.lock:
            permit = self.permits.get(token)
            if not permit or permit['sid'] != sid or permit['preview'] != shown.get('id'): raise ValueError('INVALID_PERMIT')
            if permit['used']: raise ValueError('USED_PERMIT')
            if self.clock() >= permit['expires']: raise ValueError('EXPIRED_PERMIT')
            p = self._validate(sid, shown)
            # Atomic in this single process; no real I/O, no retry after consume.
            permit['used'] = True
            receipt = {'id':'mock:'+secrets.token_hex(12), 'mode':'MOCK_ONLY', 'effect':'RECORDED_ONLY',
                       'semantic_digest':shown['semantic_digest'], 'display_digest':shown['display_digest'],
                       'command':oracle.semantic(p['state']), 'snapshot':shown['snapshot'], 'sequence':len(self.receipts)+1}
            self.receipts.append(copy.deepcopy(receipt))
            return copy.deepcopy(receipt)
