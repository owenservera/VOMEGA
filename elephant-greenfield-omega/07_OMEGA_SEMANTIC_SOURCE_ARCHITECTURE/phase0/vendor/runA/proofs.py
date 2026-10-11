"""Run A proofs and scorer. Exhaustive where the space is finite. Standard library only.
Usage: python3 proofs.py [variant]   -> prints JSON results"""
import itertools
import json
import platform
import re
import statistics
import sys
import time

from engine import Omega, canon, sha
from osl import hear_expand, join_tokens

HERE = __file__.rsplit('/', 1)[0]
EXTRA_PROMPTS = [  # hostile prompts beyond the frozen enumeration; reported separately
    'work hard', 'personal stuff', 'account balance please', 'and gemini too', 'to be or not to be',
    '"fully quoted"', '“curly quoted”', 'a "b" c', 'using model b', 'claude work', 'Send “x” to your Work account on Claude.',
    '” to your Work account on Claude. Your words will leave this computer.', 'what is a monad?', 'please help', '  spaced  ']


def omega(variant=None):
    return Omega(f'{HERE}/omega.osl', f'{HERE}/fixture.json', f'{HERE}/variants.osl' if variant else None, variant)


# ------------------------------------------------------------------ enumeration (pack §7.4)
def ready_space(O):
    fx = O.fx; P = fx['enumeration']['prompts']; L = fx['enumeration']['labels']
    out = []
    for aid in O.acct_order:
        a = O.acct[aid]
        models = [None] + [m for m in O.model if O.model[m]['provider'] == a['provider']]
        for mod in models:
            for p in P:
                args = {'account': aid, 'prompt': p}
                if mod: args['model'] = mod
                out.append({'status': 'READY', 'capability': 'cap:prompt.send', 'args': args})
    for x, y in itertools.combinations(O.acct_order, 2):
        for p in P:
            out.append({'status': 'READY', 'capability': 'cap:prompt.fanout', 'args': {'accounts': sorted([x, y]), 'prompt': p}})
    for pid in O.prov:
        for lab in L:
            out.append({'status': 'READY', 'capability': 'cap:account.register', 'args': {'provider': pid, 'label': lab}})
    for cap in ('cap:browser.show', 'cap:browser.hide'):
        for aid in O.acct_order:
            out.append({'status': 'READY', 'capability': cap, 'args': {'account': aid}})
    out.append({'status': 'READY', 'capability': 'cap:accounts.list', 'args': {}})
    return out


# ------------------------------------------------------------------ metrics helpers
def strip_quoted(s):
    s = re.sub(r'“[^”]*”', ' ', s)
    return re.sub(r'"[^"]*"', ' ', s)


def syllables(w):
    w = w.lower()
    n = len(re.findall(r'[aeiouy]+', w))
    if w.endswith('e') and n > 1 and not w.endswith(('le', 'ee')) and re.search(r'[aeiouy][^aeiouy]+e$', w):
        n -= 1
    return max(1, n)


def syllables_pack(w):
    """Pack §6 literal rule: vowel groups minus 1 for a trailing 'e', minimum 1."""
    w = w.lower()
    n = len(re.findall(r'[aeiouy]+', w))
    if w.endswith('e'):
        n -= 1
    return max(1, n)


def fk(reading, syl=syllables_pack):
    t = strip_quoted(reading)
    words = re.findall(r"[A-Za-z0-9]+(?:'[A-Za-z]+)?", t)
    sents = max(1, len(re.findall(r'[.!?]+', t)))
    if not words:
        return 0.0, 0
    s = sum(syl(w) for w in words)
    return 0.39 * (len(words) / sents) + 11.8 * (s / len(words)) - 15.59, len(words)


def completeness(O, st, r):
    a = st['args']; miss = []
    accs = [a['account']] if 'account' in a else a.get('accounts', [])
    for x in accs:
        acc = O.acct[x]
        if O.pname[acc['provider']] not in r: miss.append('provider')
        if acc['label'] not in r: miss.append('label')
    if 'model' in a and O.mname[a['model']] not in r: miss.append('model')
    if 'prompt' in a and not any(q1 + a['prompt'] + q2 in r for q1, q2 in [('“', '”'), ('"', '"')]):
        miss.append('prompt')
    if st['capability'] == 'cap:account.register':
        if O.pname[a['provider']] not in r: miss.append('provider')
        if not any(q1 + a['label'] + q2 in r for q1, q2 in [('“', '”'), ('"', '"')]): miss.append('label')
    if O.D['caps'][st['capability']]['consequence'] == 'leaves-this-computer' and 'leave this computer' not in r:
        miss.append('leaves')
    return miss


def corpus_match(got, exp):
    for k in ('status', 'capability', 'open', 'reason'):
        if k in exp and got.get(k) != exp[k]:
            return False, k
    if 'args' in exp:
        g = dict(got.get('args', {})); e = dict(exp['args'])
        for d in (g, e):
            if 'accounts' in d: d['accounts'] = sorted(d['accounts'])
        if 'label' in g and 'label' in e:  # labels compared case-insensitively (§7.3)
            if g.pop('label').lower() != e.pop('label').lower(): return False, 'label'
        if g != e: return False, 'args'
    if 'candidates' in exp and sorted(got.get('candidates', [])) != sorted(exp['candidates']):
        return False, 'candidates'
    return True, None


# ------------------------------------------------------------------ the run
def run(variant=None, full=True):
    O = omega(variant)
    R = {'variant': variant or 'base', 'fixture_hash': O.fixture_hash}
    space = ready_space(O)
    R['ready_space'] = len(space)
    # M2 round-trip / M3 injectivity / M4 completeness / M5 readability
    rt_fail, readings, comp_fail, grades, words = [], {}, [], [], []
    for cmd in space:
        r = O.render(cmd)
        back = O.recognize(r)
        if O.digest(back) != O.digest(cmd) or back['trace'][-1]['rule'] != 'R-READ':
            rt_fail.append({'cmd': cmd, 'reading': r, 'got': O.public(back)})
        readings.setdefault(r, []).append(O.digest(cmd))
        miss = completeness(O, cmd, r)
        if miss: comp_fail.append({'reading': r, 'missing': miss})
        g, n = fk(r); grades.append(g); words.append(n)
    coll = sum(len(v) * (len(v) - 1) // 2 for v in readings.values() if len(v) > 1)
    R['M2_round_trip'] = 1 - len(rt_fail) / len(space)
    R['M2_failures'] = rt_fail[:10]
    R['M3_ready_collisions'] = coll
    R['M4_violations'] = len(comp_fail)
    R['M4_examples'] = comp_fail[:5]
    R['M5a_mean_grade'] = statistics.mean(grades)
    R['M5b_max_grade'] = max(grades)
    R['M5c_mean_words'] = statistics.mean(words)
    R['M5_alt_syllable_rule'] = {'mean': statistics.mean(fk(O.render(c), syllables)[0] for c in space),
                                 'max': max(fk(O.render(c), syllables)[0] for c in space)}
    R['M5_worst'] = sorted(((fk(O.render(c))[0], O.render(c)) for c in space), reverse=True)[:3]
    # M1 corpus
    ok, fails, traces = 0, [], {}
    for it in O.fx['corpus']:
        st = O.recognize(it['text'])
        good, why = corpus_match(st, it['expect'])
        ok += good
        if not good: fails.append({'n': it['n'], 'why': why, 'got': O.public(st)})
        traces[it['n']] = {'reading': O.render(st), 'trace': st['trace'], 'public': O.public(st)}
    R['M1_corpus'] = ok / len(O.fx['corpus']); R['M1_failures'] = fails
    R['corpus_readings'] = traces
    # M6 latency
    lat = []
    for _ in range(20):
        for cmd in space:
            t0 = time.perf_counter_ns()
            r = O.render(cmd); b = O.recognize(r); O.digest(b)
            lat.append((time.perf_counter_ns() - t0) / 1000)
    lat.sort()
    R['M6_median_us'] = lat[len(lat) // 2]; R['M6_p95_us'] = lat[int(len(lat) * 0.95)]
    R['M6_env'] = f'{platform.python_implementation()} {platform.python_version()} on {platform.machine()} ({platform.processor() or "cpu n/a"})'
    # M7 declaration size
    R['M7_decl_lines'] = O.D['lines']; R['M7_decl_lines_with_comments'] = O.D['lines_with_comments']
    if not full:
        return R
    n = f = 0
    for c in space:
        if 'prompt' in c['args']:
            for p in EXTRA_PROMPTS:
                cmd = {**c, 'args': {**c['args'], 'prompt': p}}; n += 1
                f += O.digest(O.recognize(O.render(cmd))) != O.digest(cmd)
    R['extra_reading_roundtrip'] = {'readings': n, 'failures': f}
    n = f = 0
    for it in O.fx['corpus']:
        base = O.digest(O.recognize(it['text']))
        for pre in ('please ', 'can you ', 'could you please ', 'hey, '):
            n += 1; f += O.digest(O.recognize(pre + it['text'])) != base
    R['politeness'] = {'utterances': n, 'failures': f}
    R.update(reachable_states(O))
    R.update(hear_roundtrip(O))
    R['rule_coverage'] = rule_coverage(O, traces)
    return R


def reachable_states(O):
    """Generate utterances from every hear template over every slot value (incl. ambiguous, unknown and
    mismatching ones), recognize, then prove reading round-trip and injectivity over ALL reachable states."""
    P = O.fx['enumeration']['prompts'] + [None]
    reps = {}
    for ph, meta in sorted(O.phrase.items(), key=lambda kv: (len(kv[0]), kv[0])):
        reps.setdefault(meta, ph)
    rep_phrases = list(reps.values()) + ['gemini work', 'chatgpt school']  # unknown-account phrases are not in the table
    rep_phrases = [p for p in rep_phrases if p in O.phrase]
    models = list(O.model_by_hear) + [None]
    states, n_utt = {}, 0
    for h in O.hear:
        sl = h['slots']
        envs = [{}]
        def mul(name, vals):
            nonlocal envs
            envs = [{**e, **({name: [v]} if v is not None else {})} for e in envs for v in vals]
        if 'account' in sl: mul('account', rep_phrases)
        if 'accounts' in sl:
            envs = [{**e, 'accounts': [f'{x} and {y}']} for e in envs for x in rep_phrases for y in rep_phrases]
        if 'model' in sl: mul('model', models)
        if 'prompt' in sl: mul('prompt', P)
        if 'label' in sl: mul('label', O.fx['enumeration']['labels'] + [None])
        if 'provider' in sl: mul('provider', list(O.alias) + ['perplexity', 'my space'])
        if '_' in sl: mul('_', ['this'])
        for env in envs:
            for toks in hear_expand(h['ast'], env)[:2]:
                st = O.recognize(join_tokens(toks)); n_utt += 1
                states.setdefault(O.digest(st), st)
    by_reading, rt_fail, by_status = {}, [], {}
    for d, st in states.items():
        r = O.render(st)
        by_status[st['status']] = by_status.get(st['status'], 0) + 1
        by_reading.setdefault(r, set()).add(d)
        if st['status'] == 'UNKNOWN':
            continue
        back = O.parse_reading(r)
        if back is None or O.digest(back) != d:
            rt_fail.append({'reading': r, 'state': O.public(st), 'back': back and O.public(back)})
    coll = [(r, len(ds)) for r, ds in by_reading.items() if len(ds) > 1]
    ready = {d for d, st in states.items() if st['status'] == 'READY'}
    space = {O.digest(c) for c in ready_space(O)}
    return {'reach_utterances': n_utt, 'reach_states': len(states), 'reach_by_status': by_status,
            'reach_roundtrip_failures': len(rt_fail), 'reach_roundtrip_examples': rt_fail[:5],
            'reach_collisions': len(coll), 'reach_collision_examples': coll[:5],
            'reach_ready_covers_space': space <= ready, 'reach_ready_outside_space': len(ready - space)}


def hear_roundtrip(O):
    """GF-style proof: for every READY command, generate every utterance each hear template can say for it
    (every explicit phrase for each account), recognize it, and require the same digest. Oracle = the command."""
    explicit = {aid: [] for aid in O.acct}
    for ph, (pid, lab) in O.phrase.items():
        c = [a for a in O.acct_order if (pid is None or O.acct[a]['provider'] == pid) and
             (lab is None or O.acct[a]['label'].lower() == lab)]
        if len(c) == 1:
            explicit[c[0]].append(ph)
    model_hear = {v: k for k, v in O.model_by_hear.items()}
    out = {}
    for label, prompts in (('frozen', O.fx['enumeration']['prompts']), ('extra', EXTRA_PROMPTS)):
        n, fails = 0, []
        cmds = [c for c in ready_space(O)]
        if label == 'extra':
            cmds = []
            for c in ready_space(O):
                if 'prompt' in c['args'] and c['args']['prompt'] == O.fx['enumeration']['prompts'][0]:
                    for p in prompts:
                        cmds.append({**c, 'args': {**c['args'], 'prompt': p}})
        for cmd in cmds:
            a = cmd['args']
            for h in O.hear:
                if h['cap'] != cmd['capability']:
                    continue
                if not set(a) <= h['slots']:  # the template cannot say every argument; required slots are
                    continue                  # enforced by hear_expand (returns nothing if one is unbound)
                envs = []
                if 'account' in a:
                    envs = [{'account': [ph]} for ph in explicit[a['account']]]
                elif 'accounts' in a:
                    x, y = a['accounts']; ex, ey = explicit[x], explicit[y]
                    envs = [{'accounts': [f'{ex[i % len(ex)]} and {ey[(i * 7) % len(ey)]}']}
                            for i in range(max(len(ex), len(ey)))]
                elif 'provider' in a:
                    envs = [{'provider': [al]} for al, pid in O.alias.items() if pid == a['provider']]
                else:
                    envs = [{}]
                for e in envs:
                    if 'prompt' in a: e['prompt'] = [a['prompt']]
                    if 'label' in a: e['label'] = [a['label']]
                    if 'model' in a: e['model'] = [model_hear[a['model']]]
                    e['_'] = ['this']
                    for toks in hear_expand(h['ast'], e):
                        u = join_tokens(toks)
                        st = O.recognize(u); n += 1
                        exp = dict(cmd); exp['args'] = dict(a)
                        if 'prompt' in exp['args']:
                            from engine import norm_text
                            exp['args']['prompt'] = norm_text(exp['args']['prompt'])[0]
                        if O.digest(st) != O.digest(exp):
                            fails.append({'utterance': u, 'template': h['id'], 'expected': O.public(exp),
                                          'got': O.public(st), 'reading': O.render(st),
                                          'flagged': 'ambiguous' in st, 'prompt': a.get('prompt')})
        cls = {}
        for f in fails:
            cls.setdefault(f['template'], 0); cls[f['template']] += 1
        byp = {}
        for f in fails:
            k = f['prompt']; byp.setdefault(k, [0, 0]); byp[k][0] += 1; byp[k][1] += f['flagged']
        silent = [f for f in fails if not f['flagged']]
        out[f'hear_{label}'] = {'utterances': n, 'failures': len(fails), 'by_template': cls,
                                'by_prompt_failed_flagged': byp, 'silent_failures': len(silent),
                                'silent_examples': silent[:8], 'examples': fails[:6]}
    return out


def rule_coverage(O, traces):
    fired = set()
    for t in traces.values():
        for step in t['trace']:
            fired.add(step['rule'])
    return {'declared': len(O.D['rules']), 'fired_on_corpus': sorted(fired),
            'never_fired_on_corpus': sorted(set(O.D['rules']) - fired)}


if __name__ == '__main__':
    v = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] != 'base' else None
    full = '--quick' not in sys.argv
    print(json.dumps(run(v, full), ensure_ascii=False, indent=1, default=str))
