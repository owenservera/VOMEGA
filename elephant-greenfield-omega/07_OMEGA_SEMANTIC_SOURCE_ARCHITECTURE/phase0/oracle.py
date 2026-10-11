"""Independent, fixture-specific oracle. Does not import either author engine.

This deliberately duplicates the six frozen READY meanings, not the full grammar.
Unknown capabilities and extra/missing fields fail closed.
"""
import hashlib
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FIXTURE = json.loads((ROOT / 'vendor/runA/fixture.json').read_text(encoding='utf-8'))
ACCOUNTS = {a['id']: a for a in FIXTURE['accounts']}
PROVIDERS = {p['id']: p for p in FIXTURE['providers']}
MODELS = {m['id']: m for m in FIXTURE['models']}


def canonical(value):
    """Restricted interoperable JSON: NFC strings, ASCII keys, safe integers, no floats."""
    def validate(v):
        if v is None or isinstance(v, bool):
            return
        if isinstance(v, int) and abs(v) <= 9007199254740991:
            return
        if isinstance(v, str):
            if unicodedata.normalize('NFC', v) != v or any(unicodedata.category(c) in ('Cc', 'Cf', 'Cs') for c in v):
                raise ValueError('UNICODE_NOT_CANONICAL')
            return
        if isinstance(v, list):
            for item in v: validate(item)
            return
        if isinstance(v, dict) and all(isinstance(k, str) and k.isascii() for k in v):
            for item in v.values(): validate(item)
            return
        raise ValueError('JSON_NOT_CANONICAL')
    validate(value)
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False)


def digest(domain, value):
    return hashlib.sha256((domain + '\n' + canonical(value)).encode('utf-8')).hexdigest()


def semantic(state):
    return {'capability': state['capability'], 'args': state['args']}


def expected_reading(state):
    if state.get('status') != 'READY' or state.get('ambiguous'):
        raise ValueError('NOT_UNAMBIGUOUS_READY')
    cap, args = state['capability'], state['args']
    required = {
        'cap:prompt.send': {'account', 'prompt'}, 'cap:prompt.fanout': {'accounts', 'prompt'},
        'cap:account.register': {'provider', 'label'}, 'cap:browser.show': {'account'},
        'cap:browser.hide': {'account'}, 'cap:accounts.list': set(),
    }
    if cap not in required: raise ValueError('UNKNOWN_CAPABILITY')
    optional = {'model'} if cap == 'cap:prompt.send' else set()
    if not required[cap] <= args.keys() or not args.keys() <= required[cap] | optional:
        raise ValueError('ARGUMENT_SHAPE')
    canonical(semantic(state))
    def account(aid):
        a = ACCOUNTS[aid]
        return f"your {a['label']} account on {PROVIDERS[a['provider']]['name']}"
    for key in ('prompt', 'label'):
        if key in args and (not isinstance(args[key], str) or not args[key].strip()):
            raise ValueError('EMPTY_TEXT')
    if cap == 'cap:prompt.send':
        model = ''
        if 'model' in args:
            m = MODELS[args['model']]
            if m['provider'] != ACCOUNTS[args['account']]['provider']: raise ValueError('MODEL_PROVIDER')
            model = ', using ' + m['name']
        return f"Send “{args['prompt']}” to {account(args['account'])}{model}. Your words will leave this computer."
    if cap == 'cap:prompt.fanout':
        ids = args['accounts']
        if not isinstance(ids, list) or len(ids) != len(set(ids)) or not 2 <= len(ids) <= 5 or ids != sorted(ids):
            raise ValueError('TARGET_SET')
        order = {p['id']: i for i, p in enumerate(FIXTURE['providers'])}
        names = [account(i) for i in sorted(ids, key=lambda i: (order[ACCOUNTS[i]['provider']], ACCOUNTS[i]['label'].lower()))]
        joined = ', '.join(names[:-1]) + ' and ' + names[-1]
        count = {2:'two',3:'three',4:'four',5:'five'}[len(ids)]
        return f"Send “{args['prompt']}” to {count} accounts: {joined}. Your words will leave this computer."
    if cap == 'cap:account.register':
        return f"Add a {PROVIDERS[args['provider']]['name']} account called “{args['label']}” to this computer."
    if cap in ('cap:browser.show', 'cap:browser.hide'):
        return f"{'Show' if cap.endswith('show') else 'Hide'} the browser for {account(args['account'])}."
    return 'Show the accounts you have added.'


def check(state, reading):
    try:
        expected = expected_reading(state)
        return [] if reading == expected else ['READING_OR_CONSEQUENCE_MISMATCH']
    except (ValueError, KeyError, TypeError) as e:
        return [str(e)]


def corpus_match(got, expected):
    # Fixture expectations intentionally omit diagnostic/detail fields.
    return all(got.get(k) == v for k, v in expected.items())
