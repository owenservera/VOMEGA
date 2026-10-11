"""Run A engine: renderer, reading parser, recognizer, digest, rule engine with derivation traces.
Everything user-visible comes from omega.osl. Standard library only."""
import hashlib
import json
import re

from osl import (load_osl, hear_parse, hear_slots, hear_regex, hear_expand, join_tokens,
                 say_parse, say_slots, say_render, say_regex)

NUMW = {2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'}
QUOTES = [('"', '"'), ('“', '”'), ("'", "'")]
RULES_IMPLEMENTED = {'R-READ', 'R-TEMPLATE', 'R-PARSE-SPECIFIC', 'R-POLITE', 'R-QUOTE', 'R-PROV-KNOWN', 'R-PROV-UNKNOWN',
                     'R-ACC-NAMED', 'R-ACC-DEFAULT', 'R-ACC-SINGLE', 'R-ACC-ASK', 'R-ACC-NONE',
                     'R-MODEL-OK', 'R-MODEL-MISMATCH', 'R-FAN-DISTINCT', 'R-NEED-INFO', 'R-READY',
                     'R-NO-MATCH'}


def canon(o):
    return json.dumps(o, sort_keys=True, separators=(',', ':'), ensure_ascii=False)


def sha(o):
    return hashlib.sha256(canon(o).encode('utf-8')).hexdigest()


def ws(s):
    return re.sub(r'\s+', ' ', s.strip())


def alt(strings):
    ss = sorted(set(strings), key=lambda x: (-len(x), x))
    return '(?:' + '|'.join(re.escape(x) for x in ss) + ')'


def phrase_alt(strings):
    ss = sorted(set(strings), key=lambda x: (-len(x), x))
    return '(?:' + '|'.join(r'\s+'.join(re.escape(w) for w in x.split(' ')) for x in ss) + ')'


def norm_text(s):
    """Trim; strip one surrounding pair of matching quotes only if the inside has no such quote."""
    t = s.strip()
    for a, b in QUOTES:
        if len(t) >= 2 and t[0] == a and t[-1] == b and a not in t[1:-1] and b not in t[1:-1]:
            return t[1:-1].strip(), True
    return t, False


class Omega:
    def __init__(self, osl_path, fixture_path, variant_path=None, variant=None):
        D = self.D = load_osl(osl_path, variant_path, variant)
        fx = self.fx = json.load(open(fixture_path, encoding='utf-8'))
        self.fixture_hash = sha(fx)
        if D['fixture'] != (fx['fixture_id'], self.fixture_hash):
            raise ValueError('declarations were compiled against a different fixture')
        missing = set(D['rules']) ^ RULES_IMPLEMENTED
        if missing:
            raise ValueError(f'rule declarations and implementation differ: {sorted(missing)}')
        self.lex = D['lex']
        # --- atlas from fixture
        self.prov = {p['id']: p for p in fx['providers']}
        self.pidx = {p['id']: i for i, p in enumerate(fx['providers'])}
        self.pname = {p['id']: p['name'] for p in fx['providers']}
        self.pshort = {p['id']: p['id'].split(':', 1)[1] for p in fx['providers']}
        self.alias = {}
        for p in fx['providers']:
            for a in p['aliases'] + [p['name'].lower()]:
                self.alias[a.lower()] = p['id']
        self.acct = {a['id']: a for a in fx['accounts']}
        self.label_disp = {}
        for a in fx['accounts']:
            self.label_disp.setdefault(a['label'].lower(), a['label'])
        self.acct_key = lambda aid: (self.pidx[self.acct[aid]['provider']], self.acct[aid]['label'].lower())
        self.acct_order = sorted(self.acct, key=self.acct_key)
        self.model = {m['id']: m for m in fx['models']}
        self.mname = {m['id']: m['name'] for m in fx['models']}
        self.model_by_hear = {m['name'].lower(): m['id'] for m in fx['models']}
        self.defaults = fx.get('defaults', {})
        self._compile()

    # ------------------------------------------------------------ compile
    def _compile(self):
        E = self.D['entities']['account']
        S = {k: say_parse(v) for k, v in E['say'].items()}
        self.ent_say = S
        self.acct_say = {aid: say_render(S['main'], {'label': a['label'], 'provider': self.pname[a['provider']]})
                         for aid, a in self.acct.items()}
        self.say_acct = {v: k for k, v in self.acct_say.items()}
        assert len(self.say_acct) == len(self.acct_say), 'account readings collide'
        # scopes
        self.scopes = [{'kind': 'provider', 'value': p} for p in self.prov] + \
                      [{'kind': 'label', 'value': d} for d in sorted(self.label_disp.values())] + [{'kind': 'any'}]
        self.scope_say = {}
        for sc in self.scopes:
            self.scope_say[canon(sc)] = self._render_scope(sc)
        self.say_scope = {v: json.loads(k) for k, v in self.scope_say.items()}
        assert len(self.say_scope) == len(self.scope_say), 'scope readings collide'
        assert not set(self.say_scope) & set(self.say_acct), 'scope reading equals an account reading'
        # option strings
        opts = set()
        for aid, a in self.acct.items():
            v = {'label': a['label'], 'provider': self.pname[a['provider']]}
            for k in ('option', 'option-same-provider', 'option-same-label'):
                opts.add(say_render(S[k], v))
        # phrase table (hear side of the account entity)
        self.phrase = {}
        self.phrase_src = {}
        labels = sorted(self.label_disp)
        for tpl, line in E['hear']:
            ast = hear_parse(tpl)
            sl = set(hear_slots(ast))
            provs = [(a, pid) for a, pid in self.alias.items()] if 'provider' in sl else [(None, None)]
            labs = labels if 'label' in sl else [None]
            for a, pid in provs:
                for lab in labs:
                    env = {}
                    if a: env['provider'] = [a]
                    if lab: env['label'] = [lab]
                    for toks in hear_expand(ast, env):
                        ph = join_tokens(toks).lower()
                        meta = (pid, lab)
                        if self.phrase.get(ph, meta) != meta:
                            raise ValueError(f'phrase {ph!r} means two things')
                        assert ' and ' not in f' {ph} ' and ',' not in ph
                        self.phrase[ph] = meta
                        self.phrase_src.setdefault(ph, line)
        PH = phrase_alt(self.phrase)
        MOD = phrase_alt(self.model_by_hear)
        self.hear_slot_rx = {
            'account': PH,
            'accounts': f'{PH}(?:\\s*,\\s*{PH})*\\s+and\\s+{PH}',
            'model': MOD, 'prompt': '.+', 'label': '.+', 'provider': '.+?', '_': '[^:]*?'}
        self.hear = []
        for cid in self.D['cap_order']:
            for i, (tpl, line) in enumerate(self.D['caps'][cid]['hear']):
                ast = hear_parse(tpl)
                rx = re.compile(hear_regex(ast, self.hear_slot_rx), re.I)
                self.hear.append({'cap': cid, 'id': f'{cid}#hear{i + 1}', 'line': line, 'tpl': tpl,
                                  'ast': ast, 'rx': rx, 'slots': set(hear_slots(ast))})
        pol = '|'.join(r'\s+'.join(map(re.escape, p.split())) for p in self.D['politeness'])
        self.polite_rx = re.compile(f'(?:{pol})\\b[\\s,]*', re.I)
        # say side
        A = alt(self.acct_say.values())
        SC = alt(self.say_scope)
        AS = alt(list(self.acct_say.values()) + list(self.say_scope))
        O = alt(opts)
        self.say_slot_rx = {
            'prompt': '.+', 'label': '.+', 'word': '.+',
            'account': A, 'target': AS, 'scope': SC,
            'accounts': f'{A}(?:, {A})* and {A}', 'items': f'{AS}(?:, {AS})* and {AS}',
            'options': f'{O}(?:, {O})* or {O}', 'count': alt(NUMW.values()),
            'provider': alt(self.pname.values()), 'model_provider': alt(self.pname.values()),
            'model': alt(self.mname.values()), 'known_label': alt(self.label_disp.values()),
            'leaves': re.escape(self.lex['leaves'])}
        self.say = []
        for cid in self.D['cap_order']:
            for key, tpl in self.D['caps'][cid]['say'].items():
                ast = say_parse(tpl)
                self.say.append({'cap': cid, 'key': key, 'ast': ast,
                                 'rx': re.compile(say_regex(ast, self.say_slot_rx))})
        self.say_index = {(s['cap'], s['key']): s for s in self.say}

    # ------------------------------------------------------------ helpers
    def _render_scope(self, sc):
        S = self.ent_say
        if sc['kind'] == 'provider':
            return say_render(S['scope-provider'], {'provider': self.pname[sc['value']]})
        if sc['kind'] == 'label':
            return say_render(S['scope-label'], {'label': sc['value']})
        return say_render(S['scope-any'], {})

    def scope_candidates(self, sc, model=None, exclude=()):
        out = []
        for aid in self.acct_order:
            a = self.acct[aid]
            if sc['kind'] == 'provider' and a['provider'] != sc['value']:
                continue
            if sc['kind'] == 'label' and a['label'].lower() != sc['value'].lower():
                continue
            if model and self.model[model]['provider'] != a['provider']:
                continue
            if aid in exclude:
                continue
            out.append(aid)
        return out

    def options_say(self, cands):
        S = self.ent_say
        provs = {self.acct[c]['provider'] for c in cands}
        labs = {self.acct[c]['label'].lower() for c in cands}
        key = 'option-same-provider' if len(provs) == 1 else 'option-same-label' if len(labs) == 1 else 'option'
        parts = [say_render(S[key], {'label': self.acct[c]['label'], 'provider': self.pname[self.acct[c]['provider']]})
                 for c in sorted(cands, key=self.acct_key)]
        return ', '.join(parts[:-1]) + ' or ' + parts[-1]

    @staticmethod
    def join_and(parts):
        return ', '.join(parts[:-1]) + ' and ' + parts[-1]

    def item_key(self, it):
        if 'account' in it:
            a = self.acct[it['account']]
            return (self.pidx[a['provider']], a['label'].lower(), 0)
        sc = it['scope']
        if sc['kind'] == 'provider':
            return (self.pidx[sc['value']], '', 1)
        if sc['kind'] == 'label':
            return (99, sc['value'].lower(), 1)
        return (100, '', 1)

    # ------------------------------------------------------------ digest
    def canon_state(self, st):
        st = {k: v for k, v in st.items() if k not in ('trace', 'reading', 'ambiguous')}
        st['args'] = dict(st.get('args', {}))
        if 'accounts' in st['args']:
            st['args']['accounts'] = sorted(st['args']['accounts'])
        if 'candidates' in st:
            st['candidates'] = sorted(st['candidates'])
        return st

    def digest(self, st):
        if st['status'] == 'READY':
            c = self.canon_state(st)
            return sha({'capability': c['capability'], 'args': c['args']})
        return sha(self.canon_state(st))

    # ------------------------------------------------------------ render
    def slot_values(self, st):
        cap, a, status = st.get('capability'), st.get('args', {}), st['status']
        v = {'leaves': self.lex['leaves']}
        if 'prompt' in a: v['prompt'] = a['prompt']
        if 'model' in a: v['model'] = self.mname[a['model']]
        if 'account' in a: v['account'] = self.acct_say[a['account']]
        if 'accounts' in a:
            accs = sorted(a['accounts'], key=self.acct_key)
            v['accounts'] = self.join_and([self.acct_say[x] for x in accs]); v['count'] = NUMW[len(accs)]
        if 'provider' in a: v['provider'] = self.pname[a['provider']]
        if 'label' in a: v['label'] = a['label']
        if status == 'NEEDS_CHOICE':
            p = st['partial']
            v['scope'] = self.scope_say[canon(p['scope'])]
            v['options'] = self.options_say(st['candidates'])
            if cap == 'cap:prompt.fanout':
                items = [{'account': x} for x in p['resolved']] + [{'scope': s} for s in [p['scope']] + p['pending']]
                items.sort(key=self.item_key)
                v['items'] = self.join_and([self.acct_say[i['account']] if 'account' in i
                                            else self.scope_say[canon(i['scope'])] for i in items])
                v['count'] = NUMW[len(items)]
        if status == 'INVALID':
            d = st['detail']
            if st['reason'] == 'model-provider-mismatch':
                v['model'] = self.mname[d['model']]
                v['model_provider'] = self.pname[self.model[d['model']]['provider']]
                v['target'] = self.acct_say[d['account']] if 'account' in d else self.scope_say[canon(d['scope'])]
            elif st['reason'] == 'duplicate-target':
                v['account'] = self.acct_say[d['account']]
            elif st['reason'] == 'unknown-provider':
                v['word'] = d['word']
            elif st['reason'] == 'unknown-account':
                v['known_label'] = d['label']; v['provider'] = self.pname[d['provider']]
        return v

    def render(self, st):
        if st['status'] == 'UNKNOWN':
            return self.lex['unknown']
        key = st['status'] + (':' + st['reason'] if st['status'] == 'INVALID' else '')
        return say_render(self.say_index[(st['capability'], key)]['ast'], self.slot_values(st))

    # ------------------------------------------------------------ parse a reading (inverse of render)
    def parse_reading(self, text):
        if text == self.lex['unknown']:
            return {'status': 'UNKNOWN'}
        hits = []
        for s in self.say:
            m = s['rx'].fullmatch(text)
            if not m:
                continue
            st = self._state_from_slots(s['cap'], s['key'], {k: v for k, v in m.groupdict().items() if v is not None})
            if st is not None and self.render(st) == text:
                hits.append(st)
        if len(hits) > 1:
            raise AssertionError(f'reading parses two ways: {text!r}')
        return hits[0] if hits else None

    def _state_from_slots(self, cap, key, g):
        status, _, reason = key.partition(':')
        st = {'status': status, 'capability': cap, 'args': {}}
        a = st['args']
        try:
            if 'prompt' in g: a['prompt'] = g['prompt']
            if 'model' in g and status != 'INVALID': a['model'] = {v: k for k, v in self.mname.items()}[g['model']]
            if 'account' in g and status != 'INVALID': a['account'] = self.say_acct[g['account']]
            if 'accounts' in g:
                a['accounts'] = sorted(self.say_acct[x] for x in re.split(', | and ', g['accounts']))
            if cap == 'cap:account.register' and 'provider' in g:
                a['provider'] = {v: k for k, v in self.pname.items()}[g['provider']]
            if 'label' in g: a['label'] = g['label']
            if status == 'NEEDS_CHOICE':
                sc = self.say_scope[g['scope']]
                model = a.get('model')
                if cap == 'cap:prompt.fanout':
                    items = re.split(', | and ', g['items'])
                    resolved = sorted((self.say_acct[x] for x in items if x in self.say_acct), key=self.acct_key)
                    scopes = [self.say_scope[x] for x in items if x in self.say_scope]
                    if sc not in scopes:
                        return None
                    scopes.remove(sc)
                    st['open'] = self._fan_open(sc)
                    st['candidates'] = self.scope_candidates(sc, exclude=resolved)
                    st['partial'] = {'resolved': resolved, 'scope': sc,
                                     'pending': sorted(scopes, key=lambda s: self.item_key({'scope': s}))}
                else:
                    st['open'] = 'account'
                    st['candidates'] = self.scope_candidates(sc, model)
                    st['partial'] = {'scope': sc}
            if status == 'NEEDS_INFO':
                st['open'] = 'label' if cap == 'cap:account.register' else 'prompt'
            if status == 'INVALID':
                st['reason'] = reason; st['args'] = {}
                if reason == 'model-provider-mismatch':
                    d = {'model': {v: k for k, v in self.mname.items()}[g['model']]}
                    if g['target'] in self.say_acct:
                        d['account'] = self.say_acct[g['target']]
                    else:
                        d['scope'] = self.say_scope[g['target']]
                    st['detail'] = d
                elif reason == 'duplicate-target':
                    st['detail'] = {'account': self.say_acct[g['account']]}
                elif reason == 'unknown-provider':
                    st['detail'] = {'word': g['word']}
                elif reason == 'unknown-account':
                    st['detail'] = {'provider': {v: k for k, v in self.pname.items()}[g['provider']],
                                    'label': g['known_label']}
        except (KeyError, IndexError):
            return None
        return st

    def _fan_open(self, sc):
        if sc['kind'] == 'provider':
            return f"accounts[{self.pshort[sc['value']]}]"
        if sc['kind'] == 'label':
            return f"accounts[label:{sc['value'].lower()}]"
        return 'accounts[any]'

    # ------------------------------------------------------------ recognize
    def recognize(self, text):
        t = text.strip()
        off = len(text) - len(text.lstrip())
        trace = []
        while True:
            m = self.polite_rx.match(t)
            if not m or m.end() == len(t):
                break
            trace.append({'rule': 'R-POLITE', 'span': [off, off + m.end()], 'text': t[:m.end()]})
            off += m.end(); t = t[m.end():]
        st = self.parse_reading(t)
        if st is not None:
            st['trace'] = trace + [{'rule': 'R-READ', 'span': [off, off + len(t)]}]
            return st
        best, nmatch = None, 0
        for order, h in enumerate(self.hear):
            m = h['rx'].fullmatch(t)
            if not m:
                continue
            nmatch += 1
            g = m.groupdict()
            ent = sum(len(g[k]) for k in ('account', 'accounts') if g.get(k))
            nb = sum(1 for k, v in g.items() if v is not None and k != '_f')
            key = (ent, nb, -order)
            if best is None or key > best[0]:
                best = (key, h, m)
        if best is None:
            return {'status': 'UNKNOWN', 'trace': trace + [{'rule': 'R-NO-MATCH'}]}
        _, h, m = best
        trace.append({'rule': 'R-TEMPLATE', 'template': h['id'], 'line': h['line'], 'span': [off, off + len(t)]})
        acc = m.groupdict().get('account')
        shorter = acc and any(ws(acc).lower().startswith(ph + ' ') for ph in self.phrase)
        alts = self.parses(t) if (nmatch > 1 or shorter) else {}
        if len(alts) > 1:
            trace.append({'rule': 'R-PARSE-SPECIFIC', 'alternatives': len(alts)})
        st = self._resolve(h, m, off, trace)
        if len(alts) > 1:
            st['ambiguous'] = sorted(r for _, r in alts.values() if r != self.render(st))
        return st

    def parses(self, text):
        """Diagnostic, not used to decide: every distinct state any hear template could give this text,
        including every alternative account-phrase boundary. More than one = the utterance is ambiguous."""
        t = text.strip()
        while True:
            m = self.polite_rx.match(t)
            if not m or m.end() == len(t):
                break
            t = t[m.end():]
        if self.parse_reading(t) is not None:
            return {}
        low = ' ' + ws(t).lower() + ' '
        present = [ph for ph in self.phrase if f' {ph} ' in low]
        out = {}
        if not hasattr(self, '_alt_rx'):
            self._alt_rx = {}
        for h in self.hear:
            rxs = [h['rx']]
            if 'account' in h['slots']:
                rxs = []
                for ph in present:
                    k = (h['id'], ph)
                    if k not in self._alt_rx:
                        sr = dict(self.hear_slot_rx); sr['account'] = phrase_alt([ph])
                        self._alt_rx[k] = re.compile(hear_regex(h['ast'], sr), re.I)
                    rxs.append(self._alt_rx[k])
            for rx in rxs:
                m = rx.fullmatch(t)
                if m:
                    st = self._resolve(h, m, 0, [])
                    out.setdefault(self.digest(st), (h['id'], self.render(st)))
        return out

    def _span(self, m, k, off):
        s, e = m.span(k)
        return [off + s, off + e]

    def _resolve(self, h, m, off, tr):
        cap = h['cap']
        g = {k: v for k, v in m.groupdict().items() if v is not None}
        args = {}

        def invalid(reason, detail):
            return {'status': 'INVALID', 'capability': cap, 'args': {}, 'reason': reason, 'detail': detail,
                    'trace': tr}

        if 'provider' in g:
            w = ws(g['provider']); pid = self.alias.get(w.lower())
            if pid is None:
                tr.append({'rule': 'R-PROV-UNKNOWN', 'slot': 'provider', 'span': self._span(m, 'provider', off), 'text': w})
                return invalid('unknown-provider', {'word': w})
            tr.append({'rule': 'R-PROV-KNOWN', 'slot': 'provider', 'span': self._span(m, 'provider', off), 'value': pid})
            args['provider'] = pid
        for k in ('prompt', 'label'):
            if k in g:
                v, stripped = norm_text(g[k])
                if stripped:
                    tr.append({'rule': 'R-QUOTE', 'slot': k, 'span': self._span(m, k, off)})
                if v:
                    args[k] = v
        model = None
        if 'model' in g:
            model = self.model_by_hear[ws(g['model']).lower()]
            args['model'] = model
        # ---- single account
        if cap in ('cap:prompt.send', 'cap:browser.show', 'cap:browser.hide'):
            meta = self.phrase[ws(g['account']).lower()] if 'account' in g else (None, None)
            span = self._span(m, 'account', off) if 'account' in g else None
            r = self._resolve_one(meta, model, (), tr, span)
            if r[0] == 'invalid':
                return invalid(r[1], r[2])
            if r[0] == 'bind':
                args['account'] = r[1]
                if model:
                    if self.model[model]['provider'] != self.acct[r[1]]['provider']:
                        tr.append({'rule': 'R-MODEL-MISMATCH', 'slot': 'model', 'span': self._span(m, 'model', off)})
                        return invalid('model-provider-mismatch', {'model': model, 'account': r[1]})
                    tr.append({'rule': 'R-MODEL-OK', 'slot': 'model', 'span': self._span(m, 'model', off)})
            else:  # choice
                st = {'status': 'NEEDS_CHOICE', 'capability': cap,
                      'args': {k: v for k, v in args.items() if k in ('prompt', 'model')},
                      'open': 'account', 'candidates': r[2], 'partial': {'scope': r[1]}, 'trace': tr}
                return st
            if cap == 'cap:prompt.send' and 'prompt' not in args:
                tr.append({'rule': 'R-NEED-INFO', 'slot': 'prompt'})
                return {'status': 'NEEDS_INFO', 'capability': cap, 'args': args, 'open': 'prompt', 'trace': tr}
        # ---- account set
        if cap == 'cap:prompt.fanout':
            parts = [ws(x).lower() for x in re.split(r'\s*,\s*|\s+and\s+', g['accounts'].strip(), flags=re.I)]
            bound, ambiguous = [], []
            for ph in parts:
                r = self._resolve_one(self.phrase[ph], None, (), tr, self._span(m, 'accounts', off), text=ph)
                if r[0] == 'invalid':
                    return invalid(r[1], r[2])
                if r[0] == 'bind':
                    if r[1] in bound:
                        tr.append({'rule': 'R-FAN-DISTINCT', 'slot': 'accounts', 'value': r[1]})
                        return invalid('duplicate-target', {'account': r[1]})
                    bound.append(r[1])
                else:
                    ambiguous.append(r[1])
            ambiguous.sort(key=lambda s: self.item_key({'scope': s}))
            still = []
            for sc in ambiguous:  # the distinct constraint can leave a single valid candidate
                c = self.scope_candidates(sc, exclude=bound)
                if not c:
                    tr.append({'rule': 'R-FAN-DISTINCT', 'slot': 'accounts', 'scope': sc})
                    return invalid('duplicate-target', {'account': self.scope_candidates(sc)[0]})
                if len(c) == 1 and not still:
                    tr.append({'rule': 'R-ACC-SINGLE', 'slot': 'accounts', 'scope': sc, 'value': c[0],
                               'note': 'after excluding accounts already named'})
                    bound.append(c[0])
                else:
                    still.append(sc)
            if still:
                sc = still[0]
                tr.append({'rule': 'R-ACC-ASK', 'slot': 'accounts', 'scope': sc})
                return {'status': 'NEEDS_CHOICE', 'capability': cap,
                        'args': {k: v for k, v in args.items() if k == 'prompt'},
                        'open': self._fan_open(sc), 'candidates': self.scope_candidates(sc, exclude=bound),
                        'partial': {'resolved': sorted(bound, key=self.acct_key), 'scope': sc, 'pending': still[1:]},
                        'trace': tr}
            args['accounts'] = sorted(bound)
            if 'prompt' not in args:
                tr.append({'rule': 'R-NEED-INFO', 'slot': 'prompt'})
                return {'status': 'NEEDS_INFO', 'capability': cap, 'args': args, 'open': 'prompt', 'trace': tr}
        if cap == 'cap:account.register' and 'label' not in args:
            tr.append({'rule': 'R-NEED-INFO', 'slot': 'label'})
            return {'status': 'NEEDS_INFO', 'capability': cap, 'args': args, 'open': 'label', 'trace': tr}
        tr.append({'rule': 'R-READY'})
        return {'status': 'READY', 'capability': cap, 'args': args, 'trace': tr}

    def _resolve_one(self, meta, model, exclude, tr, span, text=None):
        """Defaulting order: explicit mention > standing default > single valid candidate > ask."""
        pid, lab = meta
        base = {'slot': 'account', 'span': span}
        if text: base['text'] = text
        if pid and lab:
            c = [aid for aid in self.acct_order
                 if self.acct[aid]['provider'] == pid and self.acct[aid]['label'].lower() == lab]
            if len(c) == 1:
                tr.append({**base, 'rule': 'R-ACC-NAMED', 'value': c[0]})
                return ('bind', c[0])
            tr.append({**base, 'rule': 'R-ACC-NONE'})
            return ('invalid', 'unknown-account', {'provider': pid, 'label': self.label_disp[lab]})
        sc = ({'kind': 'provider', 'value': pid} if pid else
              {'kind': 'label', 'value': self.label_disp[lab]} if lab else {'kind': 'any'})
        dkey = canon(sc)
        if dkey in self.defaults:
            tr.append({**base, 'rule': 'R-ACC-DEFAULT', 'value': self.defaults[dkey]})
            return ('bind', self.defaults[dkey])
        c = self.scope_candidates(sc)
        if model:
            c2 = self.scope_candidates(sc, model)
            if not c2:
                tr.append({**base, 'rule': 'R-MODEL-MISMATCH'})
                return ('invalid', 'model-provider-mismatch', {'model': model, 'scope': sc})
            c = c2
        if len(c) == 1:
            tr.append({**base, 'rule': 'R-ACC-SINGLE', 'value': c[0]})
            return ('bind', c[0])
        tr.append({**base, 'rule': 'R-ACC-ASK', 'candidates': c})
        return ('choice', sc, c)

    # ------------------------------------------------------------ result shape for scoring
    @staticmethod
    def public(st):
        return {k: st[k] for k in ('status', 'capability', 'args', 'open', 'candidates', 'reason') if k in st}
