"""ΩSL-mini reader and template compiler. Standard library only.

One template language per direction pair:
  hear templates -> regex (recognize) AND expansion (generate test utterances)
  say templates  -> render AND regex (parse a reading back)
"""
import re

_LINE_TOK = re.compile(r'"(?:[^"\\]|\\.)*"|\S+')


def _strip_comment(line):
    out, inq, prev = [], False, ''
    for ch in line:
        if ch == '"' and prev != '\\':
            inq = not inq
        prev = ch
        if ch == '#' and not inq:
            break
        out.append(ch)
    return ''.join(out).rstrip()


def load_osl(path, variant_path=None, variant=None):
    D = {'fixture': None, 'politeness': [], 'lex': {}, 'entities': {}, 'caps': {},
         'cap_order': [], 'rules': {}, 'rule_order': [], 'lines': 0, 'lines_with_comments': 0}
    _read(path, D, variants=None)
    if variant:
        V = {}
        _read(variant_path, None, variants=V)
        if variant not in V:
            raise KeyError(variant)
        for (target, key), tpl in V[variant]['say'].items():
            if target == 'lex':
                D['lex'][key] = tpl
            elif target in D['entities']:
                D['entities'][target]['say'][key] = tpl
            else:
                D['caps'][target]['say'][key] = tpl
        D['variant_note'] = V[variant]['note']
    return D


def _read(path, D, variants):
    cur = None
    with open(path, encoding='utf-8') as f:
        text = f.read()
    for n, raw in enumerate(text.splitlines(), 1):
        if raw.strip() and D is not None:
            D['lines_with_comments'] += 1
        line = _strip_comment(raw)
        if not line.strip():
            continue
        if D is not None:
            D['lines'] += 1
        raw_toks = _LINE_TOK.findall(line)
        toks = [t[1:-1].replace('\\"', '"') if t.startswith('"') else t for t in raw_toks]
        where = f'{path}:{n}'
        if not line[0].isspace():
            kw = toks[0]
            if variants is not None:
                if kw != 'variant':
                    raise SyntaxError(f'{where}: only variant blocks allowed here')
                cur = ('variant', toks[1])
                variants[toks[1]] = {'note': toks[2] if len(toks) > 2 else '', 'say': {}}
            elif kw == 'fixture':
                D['fixture'] = (toks[1], toks[2]); cur = None
            elif kw == 'politeness':
                D['politeness'] = toks[1:]; cur = None
            elif kw == 'lex':
                D['lex'][toks[1]] = toks[2]; cur = None
            elif kw == 'entity':
                cur = ('entity', toks[1]); D['entities'][toks[1]] = {'say': {}, 'hear': []}
            elif kw == 'capability':
                cur = ('cap', toks[1])
                D['caps'][toks[1]] = {'version': toks[2], 'params': [], 'consequence': None,
                                      'say': {}, 'hear': [], 'line': n}
                D['cap_order'].append(toks[1])
            elif kw == 'rules':
                cur = ('rules',)
            else:
                raise SyntaxError(f'{where}: unknown declaration {kw!r}')
            continue
        if cur is None:
            raise SyntaxError(f'{where}: indented line outside a block')
        kind = cur[0]
        if kind == 'variant':
            assert toks[0] == 'say', where
            variants[cur[1]]['say'][(toks[1], toks[2])] = toks[3]
        elif kind == 'rules':
            D['rules'][toks[0]] = toks[1]; D['rule_order'].append(toks[0])
        elif kind == 'entity':
            E = D['entities'][cur[1]]
            if toks[0] == 'say':
                E['say'][toks[1]] = toks[2]
            elif toks[0] == 'hear':
                E['hear'].append((toks[1], n))
            else:
                raise SyntaxError(f'{where}: {toks[0]!r}')
        elif kind == 'cap':
            C = D['caps'][cur[1]]
            if toks[0] == 'param':
                C['params'].append({'name': toks[1], 'type': toks[2], 'required': toks[3] == 'required'})
            elif toks[0] == 'consequence':
                C['consequence'] = toks[1]
            elif toks[0] == 'say':
                C['say'][toks[1]] = toks[2]
            elif toks[0] == 'hear':
                C['hear'].append((toks[1], n))
            else:
                raise SyntaxError(f'{where}: {toks[0]!r}')


# ---------------------------------------------------------------- hear templates
_HEAR_TOK = re.compile(r'\{[^}]+\}|[\[\]()|]|[:,?]|[^\s\[\]()|{}:,?]+')
PUNCT = ':,?'


def hear_parse(s):
    toks = _HEAR_TOK.findall(s)
    pos = 0

    def seq():
        nonlocal pos
        items = []
        while pos < len(toks) and toks[pos] not in (']', ')', '|'):
            t = toks[pos]
            if t in ('[', '('):
                pos += 1
                alts = [seq()]
                while toks[pos] == '|':
                    pos += 1
                    alts.append(seq())
                assert toks[pos] == (']' if t == '[' else ')'), s
                pos += 1
                items.append(('opt' if t == '[' else 'alt', alts))
            elif t.startswith('{'):
                items.append(('slot', t[1:-1])); pos += 1
            elif t in PUNCT:
                items.append(('punct', t)); pos += 1
            else:
                items.append(('word', t)); pos += 1
        return items

    ast = seq()
    assert pos == len(toks), s
    return ast


def hear_slots(items):
    out = []
    for it in items:
        if it[0] == 'slot':
            out.append(it[1])
        elif it[0] in ('alt', 'opt'):
            for a in it[1]:
                out += hear_slots(a)
    return out


def _starts_punct(it):
    if it[0] == 'punct':
        return True
    if it[0] in ('alt', 'opt'):
        return all(a and _starts_punct(a[0]) for a in it[1])
    return False


def hear_regex(items, slot_rx):
    out, at_start = '', True
    for it in items:
        frag = _item_rx(it, slot_rx)
        lead = r'\s*' if _starts_punct(it) else r'\s+'
        if it[0] == 'opt':
            out += f'(?:{frag}\\s+)?' if at_start else f'(?:{lead}{frag})?'
        else:
            out += ('' if at_start else lead) + frag
            at_start = False
    return out


def _item_rx(it, slot_rx):
    k = it[0]
    if k in ('word', 'punct'):
        return re.escape(it[1])
    if k == 'slot':
        name = '_f' if it[1] == '_' else it[1]
        return f'(?P<{name}>{slot_rx[it[1]]})'
    return '(?:' + '|'.join(hear_regex(a, slot_rx) for a in it[1]) + ')'


def hear_expand(items, env):
    """All token sequences the template can produce with slot values from env (slot -> list).
    Optional groups containing a slot are included iff that slot is bound; literal-only optionals both ways."""
    results = [[]]
    for it in items:
        k = it[0]
        if k in ('word', 'punct'):
            opts = [[it]]
        elif k == 'slot':
            vals = env.get(it[1])
            if not vals:
                return []
            opts = [[('val', v)] for v in vals]
        elif k == 'alt':
            opts = [x for a in it[1] for x in hear_expand(a, env)]
        else:  # opt
            inner = [x for a in it[1] for x in hear_expand(a, env)]
            if any(hear_slots(a) for a in it[1]):
                opts = inner if inner else [[]]
            else:
                opts = [[]] + inner
        results = [r + o for r in results for o in opts]
    return results


def join_tokens(toks):
    s = ''
    for t in toks:
        if t[0] == 'punct':
            s += t[1]
        else:
            s += (' ' if s else '') + t[1]
    return s


# ---------------------------------------------------------------- say templates
_SAY_TOK = re.compile(r'\{[^}]+\}|\[|\]|[^\[\]{}]+')


def say_parse(s):
    toks = _SAY_TOK.findall(s)
    pos = 0

    def seq():
        nonlocal pos
        items = []
        while pos < len(toks) and toks[pos] != ']':
            t = toks[pos]; pos += 1
            if t == '[':
                inner = seq(); assert toks[pos] == ']', s; pos += 1
                items.append(('opt', inner))
            elif t.startswith('{'):
                items.append(('slot', t[1:-1]))
            else:
                items.append(('lit', t))
        return items

    ast = seq(); assert pos == len(toks), s
    return ast


def say_slots(items):
    out = []
    for it in items:
        if it[0] == 'slot':
            out.append(it[1])
        elif it[0] == 'opt':
            out += say_slots(it[1])
    return out


def say_render(items, vals):
    out = []
    for it in items:
        if it[0] == 'lit':
            out.append(it[1])
        elif it[0] == 'slot':
            if vals.get(it[1]) is None:
                raise KeyError(f'slot {it[1]} unbound')
            out.append(vals[it[1]])
        else:
            if all(vals.get(s) is not None for s in say_slots(it[1])):
                out.append(say_render(it[1], vals))
    return ''.join(out)


def say_regex(items, slot_rx):
    out = ''
    for it in items:
        if it[0] == 'lit':
            out += re.escape(it[1])
        elif it[0] == 'slot':
            out += f'(?P<{it[1]}>{slot_rx[it[1]]})'
        else:
            out += f'(?:{say_regex(it[1], slot_rx)})?'
    return out
