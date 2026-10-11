#!/usr/bin/env python3
import json, hashlib, re, time, statistics, random, platform, copy
from pathlib import Path

FIXTURE_PATH = Path(__file__).with_name("omega_core_fixture_v1.json")
fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))

def canon(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")

FIXTURE_HASH = hashlib.sha256(canon(fixture)).hexdigest()

PROVIDERS = {p["id"]: p for p in fixture["providers"]}
ACCOUNTS = {a["id"]: a for a in fixture["accounts"]}
MODELS = {m["id"]: m for m in fixture["models"]}
CAPS = {c["id"]: c for c in fixture["capabilities"]}

PROVIDER_ALIASES = {}
for p in fixture["providers"]:
    PROVIDER_ALIASES[p["name"].lower()] = p["id"]
    for al in p["aliases"]:
        PROVIDER_ALIASES[al.lower()] = p["id"]

PROVIDER_BY_NAME = {p["name"].lower(): p["id"] for p in fixture["providers"]}
MODEL_ALIASES = {}
for m in fixture["models"]:
    MODEL_ALIASES[m["name"].lower()] = m["id"]
    MODEL_ALIASES[m["id"]] = m["id"]
    MODEL_ALIASES[m["name"].split()[-1].lower()] = m["id"]

MODEL_BY_PROVIDER = {m["provider"]: m["id"] for m in fixture["models"]}
ACCOUNT_IDS = sorted(ACCOUNTS)
ACCOUNTS_BY_PROVIDER = {}
ACCOUNTS_BY_LABEL = {}
for aid in ACCOUNT_IDS:
    a = ACCOUNTS[aid]
    ACCOUNTS_BY_PROVIDER.setdefault(a["provider"], []).append(aid)
    ACCOUNTS_BY_LABEL.setdefault(a["label"].lower(), []).append(aid)
for d in (ACCOUNTS_BY_PROVIDER, ACCOUNTS_BY_LABEL):
    for k in d:
        d[k] = sorted(d[k])

KNOWN_ACCOUNT_LABELS = set(ACCOUNTS_BY_LABEL)

BASE_W = {
    "send_verb": "Send",
    "words_phrase": "the words",
    "to_phrase": "to your",
    "your_word": "your",
    "account_on": "account on",
    "model_prefix": ", using",
    "leave": "Your words will leave this computer.",
    "fanout_to": "to",
    "accounts_word": "accounts",
    "register_verb": "Add",
    "account_word": "account",
    "register_to": "to this computer",
    "show_verb": "Show",
    "hide_verb": "Hide",
    "browser_phrase": "the browser for your",
    "list_reading": "Show the accounts you have added.",
    "question": "Which one",
    "info_prompt": "What should I send?",
    "info_label": "What should it be called?",
    "option_or": "or",
    "option_comma": ", ",
}

BASE_SYN = {
    "politeness": ["please", "can you", "could you", "would you"],
    "ask_verbs": ["ask", "tell", "request"],
    "send_verbs": ["send", "forward"],
    "use_verbs": ["use"],
    "show_verbs": ["show", "display"],
    "hide_verbs": ["hide", "conceal"],
    "register_verbs": ["add", "register", "create"],
    "list_regex": [r"^what accounts do i have$", r"^list my accounts$"],
}

CURRENT_W = copy.deepcopy(BASE_W)
CURRENT_SYN = copy.deepcopy(BASE_SYN)

def escape_text(s):
    return s.replace("\\", "\\\\").replace("\"", "\\\"")

def scan_quoted(s, start):
    if start >= len(s) or s[start] != "\"":
        return None, start
    i = start + 1
    buf = []
    while i < len(s):
        c = s[i]
        if c == "\\" and i + 1 < len(s) and s[i + 1] in ("\"", "\\"):
            buf.append(s[i + 1])
            i += 2
            continue
        if c == "\"":
            return "".join(buf), i + 1
        buf.append(c)
        i += 1
    return None, start

def consume_prefix(s, prefix):
    return s[len(prefix):] if s.startswith(prefix) else None

def collapse(s):
    return re.sub(r"\s+", " ", s).strip()

def clean_target(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\b(my|the|a|an|account|accounts|browser)\b", " ", s)
    return collapse(s)

def find_provider(phrase):
    for alias in sorted(PROVIDER_ALIASES, key=len, reverse=True):
        m = re.search(rf"(?<!\w){re.escape(alias)}(?!\w)", phrase)
        if m:
            pid = PROVIDER_ALIASES[alias]
            rem = phrase[:m.start()] + " " + phrase[m.end():]
            return pid, collapse(rem)
    return None, phrase

def find_label(phrase):
    for lab in sorted(KNOWN_ACCOUNT_LABELS, key=len, reverse=True):
        if re.search(rf"(?<!\w){re.escape(lab)}(?!\w)", phrase):
            return lab
    return None

def resolve_target(phrase):
    p = clean_target(phrase)
    if not p:
        return {"candidates": ACCOUNT_IDS[:], "provider": None}
    pid, rem = find_provider(p)
    if pid:
        if not rem:
            cands = ACCOUNTS_BY_PROVIDER.get(pid, [])
        else:
            lab = find_label(rem)
            if lab:
                cands = [aid for aid in ACCOUNTS_BY_PROVIDER.get(pid, []) if ACCOUNTS[aid]["label"].lower() == lab]
            else:
                cands = []
        return {"candidates": sorted(cands), "provider": pid}
    lab = find_label(p)
    if lab:
        return {"candidates": sorted(ACCOUNTS_BY_LABEL.get(lab, [])), "provider": None}
    return {"candidates": [], "provider": None}

MODEL_CLAUSE_RE = re.compile(r"\b(?:using|with)\s+(.+)$", re.I)

def extract_model(phrase):
    m = MODEL_CLAUSE_RE.search(phrase)
    if m:
        return phrase[:m.start()].strip(), m.group(1).strip()
    return phrase, None

def resolve_model_text(mt):
    if not mt:
        return None
    t = mt.lower().strip()
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    t = collapse(t)
    if t in MODEL_ALIASES:
        return MODEL_ALIASES[t]
    if t.startswith("model "):
        tail = t[6:].strip()
        if tail in MODEL_ALIASES:
            return MODEL_ALIASES[tail]
    return None

def account_from_label_provider(label, pname):
    pid = PROVIDER_BY_NAME.get(pname.lower())
    if not pid:
        return None
    for aid in ACCOUNTS_BY_PROVIDER.get(pid, []):
        if ACCOUNTS[aid]["label"].lower() == label.lower():
            return aid
    return None

def find_outside(text, delim, last=False):
    inq = False
    i = 0
    found = -1
    while i < len(text):
        c = text[i]
        if c == "\\" and inq and i + 1 < len(text):
            i += 2
            continue
        if c == "\"":
            inq = not inq
            i += 1
            continue
        if not inq and text.startswith(delim, i):
            found = i
            if not last:
                return found
            i += len(delim)
            continue
        i += 1
    return found

def split_outside(text, delim):
    res = []
    inq = False
    start = 0
    i = 0
    while i < len(text):
        c = text[i]
        if c == "\\" and inq and i + 1 < len(text):
            i += 2
            continue
        if c == "\"":
            inq = not inq
            i += 1
            continue
        if not inq and text.startswith(delim, i):
            res.append(text[start:i])
            i += len(delim)
            start = i
            continue
        i += 1
    res.append(text[start:])
    return [x.strip() for x in res if x.strip()]

def normalize_prompt(p):
    if p is None:
        return None
    p = p.strip()
    if len(p) >= 2 and p[0] == p[-1] == "\"":
        p = p[1:-1]
    return p.strip()

def normalize_label(l):
    if l is None:
        return None
    l = l.strip()
    if len(l) >= 2 and l[0] == l[-1] == "\"":
        l = l[1:-1]
    return l.strip()

def res(status, capability=None, args=None, open_=None, candidates=None, reason=None):
    r = {"status": status}
    if capability is not None:
        r["capability"] = capability
    if args is not None:
        r["args"] = args
    if open_ is not None:
        r["open"] = open_
    if candidates is not None:
        r["candidates"] = sorted(candidates)
    if reason is not None:
        r["reason"] = reason
    return r

def strip_politeness(s):
    changed = True
    while changed:
        changed = False
        ls = s.lower().strip()
        for p in CURRENT_SYN.get("politeness", []):
            if ls.startswith(p + " "):
                s = s[len(p) + 1:].lstrip()
                changed = True
                break
            if ls.endswith(" " + p):
                s = s[:-(len(p) + 1)].rstrip()
                changed = True
                break
            if ls.endswith("," + p):
                s = s[:-(len(p) + 1)].rstrip()
                changed = True
                break
    return s

def match_verb(text, verbs):
    tl = text.lower()
    for v in sorted(verbs, key=len, reverse=True):
        if tl.startswith(v + " "):
            return v, text[len(v) + 1:]
    return None, None

def make_send(target_phrase, payload, model_text=None):
    prompt = normalize_prompt(payload)
    t, mt = extract_model(target_phrase or "")
    if model_text is None:
        model_text = mt
    r = resolve_target(t)
    cands = r["candidates"]
    model_id = resolve_model_text(model_text)
    if model_text and model_id is None:
        return res("UNKNOWN")
    if not cands:
        return res("UNKNOWN")
    if len(cands) > 1:
        args = {}
        if prompt is not None:
            args["prompt"] = prompt
        if model_id:
            args["model"] = model_id
        return res("NEEDS_CHOICE", "cap:prompt.send", args, "account", cands)
    aid = cands[0]
    if prompt is None or prompt == "":
        return res("NEEDS_INFO", "cap:prompt.send", {"account": aid}, "prompt")
    args = {"account": aid, "prompt": prompt}
    if model_id:
        if MODELS[model_id]["provider"] != ACCOUNTS[aid]["provider"]:
            return res("INVALID", "cap:prompt.send", None, reason="model-provider-mismatch")
        args["model"] = model_id
    return res("READY", "cap:prompt.send", args)

def make_fanout(targets, payload):
    prompt = normalize_prompt(payload)
    if prompt is None or prompt == "":
        return res("NEEDS_INFO", "cap:prompt.fanout", {}, "prompt")
    resolved = []
    seen = set()
    ambiguity = None
    for t in targets:
        tt, _ = extract_model(t)
        r = resolve_target(tt)
        cands = r["candidates"]
        if not cands:
            return res("UNKNOWN")
        if len(cands) > 1:
            if ambiguity is None:
                ambiguity = (r.get("provider"), cands)
        else:
            aid = cands[0]
            if aid in seen:
                return res("INVALID", "cap:prompt.fanout", None, reason="duplicate-target")
            seen.add(aid)
            resolved.append(aid)
    if ambiguity:
        pid, cands = ambiguity
        short = pid.split(":")[1] if pid else "account"
        return res("NEEDS_CHOICE", "cap:prompt.fanout", {"prompt": prompt}, f"accounts[{short}]", cands)
    return res("READY", "cap:prompt.fanout", {"accounts": sorted(resolved), "prompt": prompt})

def parse_send(text, verb):
    after = text[len(verb):].strip()
    idx = find_outside(after, " to ", last=True)
    if idx == -1:
        return res("UNKNOWN")
    payload = after[:idx].strip()
    target_clause = after[idx + 4:].strip()
    target_clause, model_text = extract_model(target_clause)
    targets = split_outside(target_clause, " and ")
    if not targets:
        return res("UNKNOWN")
    if len(targets) > 1:
        return make_fanout(targets, payload)
    return make_send(targets[0], payload, model_text)

def parse_ask_to(text, verb):
    after = text[len(verb):].strip()
    if after.lower().startswith("to "):
        pre = ""
        payload = after[3:].strip()
    else:
        idx = find_outside(after, " to ", last=False)
        if idx == -1:
            return make_send(after, None)
        pre = after[:idx].strip()
        payload = after[idx + 4:].strip()
    targets = split_outside(pre, " and ") if pre else [""]
    if len(targets) > 1:
        return make_fanout(targets, payload)
    return make_send(targets[0], payload)

def parse_ask_no_to(text, verb):
    after = text[len(verb):].strip()
    return make_send(after, None)

def parse_tell_no_to(text, verb):
    after = text[len(verb):].strip()
    tokens = after.split()
    best = None
    for i in range(1, len(tokens)):
        prefix = " ".join(tokens[:i])
        payload = " ".join(tokens[i:])
        r = resolve_target(prefix)
        if r["candidates"]:
            score = (1 if len(r["candidates"]) == 1 else 0, i)
            if best is None or score > best[0]:
                best = (score, prefix, payload)
    if best is None:
        r = resolve_target(after)
        if r["candidates"]:
            return make_send(after, None)
        return res("UNKNOWN")
    return make_send(best[1], best[2])

def parse_colon(text):
    idx = find_outside(text, ":", last=False)
    if idx == -1:
        return None
    pre = text[:idx].strip()
    payload = text[idx + 1:].strip()
    tpre = pre.lower()
    target = pre
    for v in CURRENT_SYN["ask_verbs"] + CURRENT_SYN["use_verbs"]:
        if tpre.startswith(v + " "):
            target = pre[len(v) + 1:].strip()
            break
    if tpre.startswith("use "):
        fidx = find_outside(target, " for ", last=False)
        if fidx != -1:
            target = target[:fidx].strip()
    targets = split_outside(target, " and ") if target else [""]
    if len(targets) > 1:
        return make_fanout(targets, payload)
    return make_send(targets[0], payload)

def parse_register(text):
    verbs = "|".join(re.escape(v) for v in CURRENT_SYN["register_verbs"])
    rx = re.compile(
        rf"^(?:{verbs})\s+(?:(?:my|the|an?)\s+)?(?P<provider>.+?)\s+account"
        rf"(?:\s+(?:and\s+call\s+it|called)\s+(?P<label>.+))?$",
        re.I,
    )
    m = rx.match(text)
    if not m:
        return None
    provider_text = m.group("provider")
    label = normalize_label(m.group("label"))
    pid, _ = find_provider(clean_target(provider_text))
    if not pid:
        return res("INVALID", "cap:account.register", None, reason="unknown-provider")
    if label is None or label == "":
        return res("NEEDS_INFO", "cap:account.register", {"provider": pid}, "label")
    return res("READY", "cap:account.register", {"provider": pid, "label": label})

def parse_browser(text):
    verbs = "|".join(re.escape(v) for v in CURRENT_SYN["show_verbs"] + CURRENT_SYN["hide_verbs"])
    m = re.match(rf"^(?:{verbs})\b\s*(?P<rest>.*)$", text, re.I)
    if not m:
        return None
    verb = m.group(0).split()[0].lower()
    rest = m.group("rest").strip()
    rest = re.sub(r"^(my|the)\s+", "", rest, flags=re.I)
    rest = re.sub(r"\s+browser$", "", rest, flags=re.I)
    target = rest.strip()
    cap = "cap:browser.show" if verb in CURRENT_SYN["show_verbs"] else "cap:browser.hide"
    r = resolve_target(target)
    cands = r["candidates"]
    if len(cands) == 1:
        return res("READY", cap, {"account": cands[0]})
    if len(cands) > 1:
        return res("NEEDS_CHOICE", cap, {}, "account", cands)
    return res("UNKNOWN")

def recognize(utterance):
    text = strip_politeness(utterance.strip())
    if not text:
        return res("UNKNOWN")
    tl = text.lower().rstrip("?.!")
    if any(re.match(p, tl) for p in CURRENT_SYN["list_regex"]):
        return res("READY", "cap:accounts.list", {})
    reg = parse_register(text)
    if reg is not None:
        return reg
    br = parse_browser(text)
    if br is not None:
        return br
    v, _ = match_verb(text, CURRENT_SYN["send_verbs"])
    if v:
        return parse_send(text, v)
    v, _ = match_verb(text, CURRENT_SYN["use_verbs"])
    if v and find_outside(text, ":") != -1:
        out = parse_colon(text)
        if out is not None:
            return out
    v, _ = match_verb(text, CURRENT_SYN["ask_verbs"])
    if v:
        if find_outside(text, ":") != -1:
            out = parse_colon(text)
            if out is not None:
                return out
        after = text[len(v):].strip()
        if after.lower().startswith("to ") or find_outside(after, " to ") != -1:
            return parse_ask_to(text, v)
        if v == "tell":
            return parse_tell_no_to(text, v)
        return parse_ask_no_to(text, v)
    return res("UNKNOWN")

def digest_cmd(cmd):
    args = copy.deepcopy(cmd.get("args", {}))
    if "accounts" in args and isinstance(args["accounts"], list):
        args["accounts"] = sorted(args["accounts"])
    obj = {"capability": cmd["capability"], "args": args}
    return hashlib.sha256(canon(obj)).hexdigest()

def render_ready(cmd):
    w = CURRENT_W
    cap = cmd["capability"]
    args = cmd["args"]
    if cap == "cap:prompt.send":
        acct = ACCOUNTS[args["account"]]
        prov = PROVIDERS[acct["provider"]]
        core = f'{w["send_verb"]} {w["words_phrase"]} "{escape_text(args["prompt"])}" {w["to_phrase"]} {acct["label"]} {w["account_on"]} {prov["name"]}'
        if "model" in args:
            core += f'{w["model_prefix"]} {MODELS[args["model"]]["name"]}'
        return core + ". " + w["leave"]
    if cap == "cap:prompt.fanout":
        aids = sorted(args["accounts"])
        segs = []
        for aid in aids:
            acct = ACCOUNTS[aid]
            prov = PROVIDERS[acct["provider"]]
            segs.append(f'{w["your_word"]} {acct["label"]} {w["account_on"]} {prov["name"]}')
        joined = " and ".join(segs) if len(segs) == 2 else (w["option_comma"].join(segs[:-1]) + " and " + segs[-1])
        core = f'{w["send_verb"]} {w["words_phrase"]} "{escape_text(args["prompt"])}" {w["fanout_to"]} {len(aids)} {w["accounts_word"]}: {joined}'
        return core + ". " + w["leave"]
    if cap == "cap:account.register":
        prov = PROVIDERS[args["provider"]]
        return f'{w["register_verb"]} a {prov["name"]} {w["account_word"]} called "{escape_text(args["label"])}" {w["register_to"]}.'
    if cap in ("cap:browser.show", "cap:browser.hide"):
        acct = ACCOUNTS[args["account"]]
        prov = PROVIDERS[acct["provider"]]
        verb = w["show_verb"] if cap == "cap:browser.show" else w["hide_verb"]
        return f'{verb} {w["browser_phrase"]} {acct["label"]} {w["account_on"]} {prov["name"]}.'
    if cap == "cap:accounts.list":
        return w["list_reading"]
    raise ValueError(f"unknown capability {cap}")

def split_reading_segments(s):
    s = re.sub(r", and ", "|", s)
    s = re.sub(r" and ", "|", s)
    s = re.sub(r", ", "|", s)
    return [x.strip() for x in s.split("|") if x.strip()]

def parse_send_reading(text):
    w = CURRENT_W
    suffix = ". " + w["leave"]
    if not text.endswith(suffix):
        return None
    core = text[:-len(suffix)]
    prefix = f'{w["send_verb"]} {w["words_phrase"]} "'
    if not core.startswith(prefix):
        return None
    prompt, idx = scan_quoted(core, len(prefix) - 1)
    if prompt is None:
        return None
    rest = consume_prefix(core[idx:], " " + w["to_phrase"] + " ")
    if rest is None:
        return None
    mp = w["model_prefix"]
    model_name = None
    if mp in rest:
        account_part, model_name = rest.split(mp, 1)
        model_name = model_name.strip()
    else:
        account_part = rest
    sep = " " + w["account_on"] + " "
    if sep not in account_part:
        return None
    label, pname = account_part.split(sep, 1)
    aid = account_from_label_provider(label, pname)
    if not aid:
        return None
    args = {"account": aid, "prompt": prompt}
    if model_name:
        mid = MODEL_ALIASES.get(model_name.lower())
        if not mid:
            return None
        args["model"] = mid
    return {"capability": "cap:prompt.send", "args": args}

def parse_fanout_reading(text):
    w = CURRENT_W
    suffix = ". " + w["leave"]
    if not text.endswith(suffix):
        return None
    core = text[:-len(suffix)]
    prefix = f'{w["send_verb"]} {w["words_phrase"]} "'
    if not core.startswith(prefix):
        return None
    prompt, idx = scan_quoted(core, len(prefix) - 1)
    if prompt is None:
        return None
    rest = consume_prefix(core[idx:], " " + w["fanout_to"] + " ")
    if rest is None:
        return None
    m = re.match(r"(\d+) " + re.escape(w["accounts_word"]) + r": ", rest)
    if not m:
        return None
    n = int(m.group(1))
    segstr = rest[m.end():]
    segs = split_reading_segments(segstr)
    if len(segs) != n:
        return None
    aids = []
    for seg in segs:
        seg = consume_prefix(seg, w["your_word"] + " ")
        if seg is None:
            return None
        sep = " " + w["account_on"] + " "
        if sep not in seg:
            return None
        label, pname = seg.split(sep, 1)
        aid = account_from_label_provider(label, pname)
        if not aid:
            return None
        aids.append(aid)
    if len(set(aids)) != n:
        return None
    return {"capability": "cap:prompt.fanout", "args": {"accounts": sorted(aids), "prompt": prompt}}

def parse_register_reading(text):
    w = CURRENT_W
    prefix = f'{w["register_verb"]} a '
    if not text.startswith(prefix):
        return None
    rest = text[len(prefix):]
    marker = f' {w["account_word"]} called "'
    pos = rest.find(marker)
    if pos < 0:
        return None
    pname = rest[:pos]
    quote_start = pos + len(marker) - 1
    label, end = scan_quoted(rest, quote_start)
    if label is None:
        return None
    if rest[end:] != f' {w["register_to"]}.':
        return None
    pid = PROVIDER_BY_NAME.get(pname.lower())
    if not pid:
        return None
    return {"capability": "cap:account.register", "args": {"provider": pid, "label": label}}

def parse_browser_reading(text):
    w = CURRENT_W
    for verb, cap in ((w["show_verb"], "cap:browser.show"), (w["hide_verb"], "cap:browser.hide")):
        if not text.startswith(verb + " "):
            continue
        rest = text[len(verb) + 1:]
        prefix = w["browser_phrase"] + " "
        if not rest.startswith(prefix):
            continue
        rest = rest[len(prefix):]
        if not rest.endswith("."):
            continue
        body = rest[:-1]
        sep = " " + w["account_on"] + " "
        if sep not in body:
            continue
        label, pname = body.split(sep, 1)
        aid = account_from_label_provider(label, pname)
        if not aid:
            continue
        return {"capability": cap, "args": {"account": aid}}
    return None

def parse_list_reading(text):
    if text == CURRENT_W["list_reading"]:
        return {"capability": "cap:accounts.list", "args": {}}
    return None

def parse_reading(text):
    for fn in (parse_send_reading, parse_fanout_reading, parse_register_reading, parse_browser_reading, parse_list_reading):
        try:
            out = fn(text)
            if out:
                return out
        except Exception:
            pass
    return None

def enumerate_ready():
    enum = []
    prompts = fixture["enumeration"]["prompts"]
    labels = fixture["enumeration"]["labels"]
    for aid in ACCOUNT_IDS:
        acct = ACCOUNTS[aid]
        mid = MODEL_BY_PROVIDER.get(acct["provider"])
        for model in (None, mid):
            for p in prompts:
                args = {"account": aid, "prompt": p}
                if model:
                    args["model"] = model
                enum.append({"capability": "cap:prompt.send", "args": args})
    for a, b in [(x, y) for i, x in enumerate(ACCOUNT_IDS) for y in ACCOUNT_IDS[i + 1:]]:
        for p in prompts:
            enum.append({"capability": "cap:prompt.fanout", "args": {"accounts": sorted([a, b]), "prompt": p}})
    for pid in PROVIDERS:
        for lab in labels:
            enum.append({"capability": "cap:account.register", "args": {"provider": pid, "label": lab}})
    for aid in ACCOUNT_IDS:
        enum.append({"capability": "cap:browser.show", "args": {"account": aid}})
        enum.append({"capability": "cap:browser.hide", "args": {"account": aid}})
    enum.append({"capability": "cap:accounts.list", "args": {}})
    return enum

def completeness_violations(cmd, reading, parsed):
    w = CURRENT_W
    cap = cmd["capability"]
    args = cmd["args"]
    viol = []
    cons = CAPS[cap]["consequence"]
    if cons.get("leaves_this_computer") and w["leave"] not in reading:
        viol.append("leaves-this-computer")
    if parsed is None:
        viol.append("unparsed")
        return viol
    if cap == "cap:prompt.send":
        acct = ACCOUNTS[args["account"]]
        prov = PROVIDERS[acct["provider"]]
        if escape_text(args["prompt"]) not in reading:
            viol.append("prompt")
        if acct["label"] not in reading:
            viol.append("label")
        if prov["name"] not in reading:
            viol.append("provider")
        if "model" in args and MODELS[args["model"]]["name"] not in reading:
            viol.append("model")
    elif cap == "cap:prompt.fanout":
        if escape_text(args["prompt"]) not in reading:
            viol.append("prompt")
        for aid in args["accounts"]:
            acct = ACCOUNTS[aid]
            prov = PROVIDERS[acct["provider"]]
            if acct["label"] not in reading:
                viol.append(f"label:{aid}")
            if prov["name"] not in reading:
                viol.append(f"provider:{aid}")
    elif cap == "cap:account.register":
        prov = PROVIDERS[args["provider"]]
        if prov["name"] not in reading:
            viol.append("provider")
        if escape_text(args["label"]) not in reading:
            viol.append("label")
    elif cap in ("cap:browser.show", "cap:browser.hide"):
        acct = ACCOUNTS[args["account"]]
        prov = PROVIDERS[acct["provider"]]
        if acct["label"] not in reading:
            viol.append("label")
        if prov["name"] not in reading:
            viol.append("provider")
    return viol

def option_text(aid):
    acct = ACCOUNTS[aid]
    prov = PROVIDERS[acct["provider"]]
    return f'{acct["label"]} {prov["name"]}'

def join_options(opts):
    w = CURRENT_W
    if not opts:
        return ""
    if len(opts) == 1:
        return opts[0]
    if len(opts) == 2:
        return f'{opts[0]} {w["option_or"]} {opts[1]}'
    return w["option_comma"].join(opts[:-1]) + f' {w["option_or"]} {opts[-1]}'

def render_partial(state):
    w = CURRENT_W
    cap = state["capability"]
    args = state.get("args", {})
    open_ = state.get("open")
    cands = state.get("candidates", [])
    status = state["status"]
    if cap == "cap:prompt.send":
        if status == "NEEDS_CHOICE" and open_ == "account":
            opts = [option_text(aid) for aid in cands]
            return f'{w["send_verb"]} {w["words_phrase"]} "{escape_text(args.get("prompt", ""))}" to an account. {w["question"]}: {join_options(opts)}?'
        if status == "NEEDS_INFO" and open_ == "prompt":
            acct = ACCOUNTS[args["account"]]
            prov = PROVIDERS[acct["provider"]]
            return f'{w["send_verb"]} {w["words_phrase"]} {w["to_phrase"]} {acct["label"]} {w["account_on"]} {prov["name"]}. {w["info_prompt"]}'
    if cap == "cap:prompt.fanout":
        if status == "NEEDS_CHOICE" and open_.startswith("accounts["):
            pid = "provider:" + open_[open_.find("[") + 1:-1]
            prov = PROVIDERS[pid]
            opts = [ACCOUNTS[aid]["label"] for aid in cands]
            return f'{w["send_verb"]} {w["words_phrase"]} "{escape_text(args.get("prompt", ""))}" to your {prov["name"]} account. {w["question"]}: {join_options(opts)}?'
    if cap == "cap:account.register":
        if status == "NEEDS_INFO" and open_ == "label":
            prov = PROVIDERS[args["provider"]]
            return f'{w["register_verb"]} a {prov["name"]} {w["account_word"]}. {w["info_label"]}'
    if cap in ("cap:browser.show", "cap:browser.hide"):
        verb = w["show_verb"] if cap == "cap:browser.show" else w["hide_verb"]
        if status == "NEEDS_CHOICE" and open_ == "account":
            opts = [option_text(aid) for aid in cands]
            return f'{verb} the browser. {w["question"]}: {join_options(opts)}?'
    return json.dumps(state, sort_keys=True)

def sample_partials():
    states = []
    prompts = fixture["enumeration"]["prompts"]
    for p in prompts[:2]:
        states.append({"status": "NEEDS_CHOICE", "capability": "cap:prompt.send", "args": {"prompt": p}, "open": "account", "candidates": ACCOUNT_IDS})
        for pid, aids in ACCOUNTS_BY_PROVIDER.items():
            if len(aids) > 1:
                states.append({"status": "NEEDS_CHOICE", "capability": "cap:prompt.send", "args": {"prompt": p}, "open": "account", "candidates": aids})
    for aid in ACCOUNT_IDS:
        states.append({"status": "NEEDS_INFO", "capability": "cap:prompt.send", "args": {"account": aid}, "open": "prompt"})
    p0 = prompts[0]
    for pid, aids in ACCOUNTS_BY_PROVIDER.items():
        if len(aids) > 1:
            states.append({"status": "NEEDS_CHOICE", "capability": "cap:prompt.fanout", "args": {"prompt": p0}, "open": f"accounts[{pid.split(':')[1]}]", "candidates": aids})
    for pid in PROVIDERS:
        states.append({"status": "NEEDS_INFO", "capability": "cap:account.register", "args": {"provider": pid}, "open": "label"})
    for cap in ("cap:browser.show", "cap:browser.hide"):
        states.append({"status": "NEEDS_CHOICE", "capability": cap, "args": {}, "open": "account", "candidates": ACCOUNT_IDS})
        for pid, aids in ACCOUNTS_BY_PROVIDER.items():
            if len(aids) > 1:
                states.append({"status": "NEEDS_CHOICE", "capability": cap, "args": {}, "open": "account", "candidates": aids})
    return states

def partial_injectivity():
    d = {}
    collisions = 0
    for st in sample_partials():
        reading = render_partial(st)
        key = canon(st).decode("utf-8")
        if reading in d and d[reading] != key:
            collisions += 1
        d.setdefault(reading, key)
    return collisions

def remove_quoted_spans(s):
    out = []
    i = 0
    inq = False
    while i < len(s):
        c = s[i]
        if c == "\\" and i + 1 < len(s):
            if inq:
                i += 2
                continue
        if c == "\"":
            inq = not inq
            i += 1
            continue
        if not inq:
            out.append(c)
        i += 1
    return "".join(out)

def syllables(word):
    w = word.lower()
    n = len(re.findall(r"[aeiouy]+", w))
    if w.endswith("e") and len(w) > 2:
        n -= 1
    return max(1, n)

def fk_grade(text):
    text = remove_quoted_spans(text)
    sentences = [s for s in re.split(r"[.!?]+", text) if s.strip()]
    if not sentences:
        sentences = [""]
    words = re.findall(r"[A-Za-z']+", " ".join(sentences))
    if not words:
        return 0.0, 0
    syl = sum(syllables(w) for w in words)
    ws = len(words) / len(sentences)
    sywl = syl / len(words)
    return 0.39 * ws + 11.8 * sywl - 15.59, len(words)

def norm_args(args):
    out = copy.deepcopy(args or {})
    if "accounts" in out and isinstance(out["accounts"], list):
        out["accounts"] = sorted(out["accounts"])
    return out

def equal_result(got, exp):
    if got.get("status") != exp.get("status"):
        return False
    if "capability" in exp and got.get("capability") != exp["capability"]:
        return False
    if exp.get("status") == "INVALID":
        return got.get("reason") == exp.get("reason")
    if norm_args(got.get("args", {})) != norm_args(exp.get("args", {})):
        return False
    if "open" in exp and got.get("open") != exp["open"]:
        return False
    if "candidates" in exp and sorted(got.get("candidates", [])) != sorted(exp["candidates"]):
        return False
    return True

def score_corpus():
    ok = 0
    for item in fixture["corpus"]:
        try:
            got = recognize(item["text"])
        except Exception:
            got = {"status": "UNKNOWN"}
        if equal_result(got, item["expect"]):
            ok += 1
    return ok / len(fixture["corpus"])

def run_proofs(enum):
    rt_ok = 0
    inj = {}
    comp_count = 0
    ce = []
    readings = []
    for cmd in enum:
        reading = render_ready(cmd)
        readings.append(reading)
        parsed = parse_reading(reading)
        if parsed and digest_cmd(parsed) == digest_cmd(cmd):
            rt_ok += 1
        else:
            ce.append(("roundtrip", cmd, reading))
        key = canon(cmd).decode("utf-8")
        inj.setdefault(reading, set()).add(key)
        viol = completeness_violations(cmd, reading, parsed)
        if viol:
            comp_count += len(viol)
            ce.append(("completeness", cmd, reading, viol))
    collisions = sum(len(v) * (len(v) - 1) // 2 for v in inj.values())
    return rt_ok / len(enum), collisions, comp_count, readings, ce

def latency_us(enum):
    times = []
    for cmd in enum:
        t0 = time.perf_counter()
        reading = render_ready(cmd)
        parse_reading(reading)
        digest_cmd(cmd)
        times.append((time.perf_counter() - t0) * 1_000_000)
    times.sort()
    return statistics.median(times), times[int(0.95 * (len(times) - 1))]

def fuzz(enum):
    rng = random.Random(99)
    ce = []
    for _ in range(100):
        cmd = rng.choice(enum)
        reading = render_ready(cmd)
        parsed = parse_reading(reading)
        if not parsed or digest_cmd(parsed) != digest_cmd(cmd):
            ce.append(("fuzz-roundtrip", cmd, reading))
    for item in fixture["corpus"]:
        base = item["text"]
        for pref in ["", "please ", "can you "]:
            for suf in ["", " please"]:
                ut = pref + base + suf
                try:
                    got = recognize(ut)
                    if got.get("status") == "READY":
                        cmd = {"capability": got["capability"], "args": got.get("args", {})}
                        reading = render_ready(cmd)
                        parsed = parse_reading(reading)
                        if not parsed or digest_cmd(parsed) != digest_cmd(cmd):
                            ce.append(("fuzz-recognize", ut, reading))
                except Exception as e:
                    ce.append(("exception", ut, str(e)))
    return ce

def declaration_size(variant):
    data = {
        "capabilities": fixture["capabilities"],
        "wording": variant["wording"],
        "synonyms": variant["synonyms"],
    }
    text = json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False)
    return len([line for line in text.splitlines() if line.strip()])

ENUM_READY = None

def evaluate_variant(variant):
    global CURRENT_W, CURRENT_SYN
    CURRENT_W = copy.deepcopy(variant["wording"])
    CURRENT_SYN = copy.deepcopy(variant["synonyms"])
    m1 = score_corpus()
    rt, m3, m4, readings, proof_ce = run_proofs(ENUM_READY)
    m3p = partial_injectivity()
    grades = []
    wc = []
    for r in readings:
        g, w = fk_grade(r)
        grades.append(g)
        wc.append(w)
    m5a = sum(grades) / len(grades)
    m5b = max(grades)
    m5c = sum(wc) / len(wc)
    med, p95 = latency_us(ENUM_READY)
    m7 = declaration_size(variant)
    fuzz_ce = fuzz(ENUM_READY)
    hard = abs(rt - 1.0) < 1e-12 and m3 == 0 and m4 == 0
    metrics = {
        "M1_corpus_accuracy": m1,
        "M2_roundtrip_pass": rt,
        "M3_injectivity_collisions": m3,
        "M3_partial_collisions": m3p,
        "M4_completeness_violations": m4,
        "M5a_mean_grade": m5a,
        "M5b_max_grade": m5b,
        "M5c_mean_words": m5c,
        "M6_latency_median_us": med,
        "M6_latency_p95_us": p95,
        "M7_declaration_lines": m7,
        "hard_pass": hard,
    }
    return metrics, proof_ce + fuzz_ce

POOLS = {
    "send_verb": ["Send", "Transmit", "Deliver", "Route"],
    "words_phrase": ["the words", "the text", "the message"],
    "to_phrase": ["to your", "to the"],
    "your_word": ["your", "the"],
    "account_on": ["account on", "account at"],
    "model_prefix": [", using", ", with", " using", " with"],
    "leave": [
        "Your words will leave this computer.",
        "These words will leave this computer.",
        "Your text will leave this computer.",
    ],
    "fanout_to": ["to", "toward"],
    "accounts_word": ["accounts", "targets"],
    "register_verb": ["Add", "Create", "Register"],
    "account_word": ["account", "profile"],
    "register_to": ["to this computer", "on this computer"],
    "show_verb": ["Show", "Display"],
    "hide_verb": ["Hide", "Conceal"],
    "browser_phrase": ["the browser for your", "the browser of your", "browser for your"],
    "list_reading": ["Show the accounts you have added.", "List the accounts you have added.", "Show added accounts."],
    "question": ["Which one", "Choose one", "Pick one"],
    "info_prompt": ["What should I send?", "What text should I send?"],
    "info_label": ["What should it be called?", "What label should it have?"],
    "option_or": ["or", "and"],
    "option_comma": [", ", "; "],
}

SYN_POOLS = {
    "politeness": ["please", "can you", "could you", "would you", "kindly"],
    "ask_verbs": ["ask", "tell", "request", "query"],
    "send_verbs": ["send", "forward", "dispatch"],
    "use_verbs": ["use", "employ"],
    "show_verbs": ["show", "display", "open"],
    "hide_verbs": ["hide", "conceal", "close"],
    "register_verbs": ["add", "register", "create", "insert"],
}

def mutate(parent, next_id):
    v = copy.deepcopy(parent)
    v["id"] = next_id
    op = random.choice(list(POOLS.keys()) + ["synonym"])
    if op == "synonym":
        key = random.choice(list(SYN_POOLS.keys()))
        pool = SYN_POOLS[key]
        cur = v["synonyms"].get(key, [])
        if len(cur) > 1 and random.random() < 0.5:
            v["synonyms"][key] = [x for x in cur if x != random.choice(cur)]
        else:
            add = random.choice(pool)
            if add not in cur:
                v["synonyms"][key] = cur + [add]
    else:
        choices = [x for x in POOLS[op] if x != v["wording"][op]]
        if choices:
            v["wording"][op] = random.choice(choices)
    return v

def score(metrics):
    return (
        -metrics["M1_corpus_accuracy"],
        metrics["M5a_mean_grade"],
        metrics["M5b_max_grade"],
        metrics["M5c_mean_words"],
        metrics["M7_declaration_lines"],
    )

def dominates(a, b):
    return all(x <= y for x, y in zip(a, b)) and any(x < y for x, y in zip(a, b))

def pareto_front(items):
    uniq = {}
    for item in items:
        s = score(item[1])
        if s not in uniq:
            uniq[s] = item
    arr = list(uniq.values())
    front = []
    for a in arr:
        sa = score(a[1])
        dom = False
        for b in arr:
            if a is b:
                continue
            if dominates(score(b[1]), sa):
                dom = True
                break
        if not dom:
            front.append(a)
    return front

def print_metrics_table(metrics):
    print("| Metric | Value |")
    print("| --- | --- |")
    for k, v in metrics.items():
        if isinstance(v, float):
            print(f"| {k} | {v:.6f} |")
        else:
            print(f"| {k} | {v} |")

def main():
    global ENUM_READY
    ENUM_READY = enumerate_ready()
    print("# Run B T1 raw output")
    print()
    print(f"fixture_hash={FIXTURE_HASH}")
    print(f"os={platform.platform()}")
    print(f"python={platform.python_version()}")
    print(f"cpu={platform.processor() or platform.machine()}")
    print(f"enumerated_ready_commands={len(ENUM_READY)}")
    print()

    random.seed(1337)
    base = {"id": 0, "wording": copy.deepcopy(BASE_W), "synonyms": copy.deepcopy(BASE_SYN)}
    base_metrics, base_ce = evaluate_variant(base)
    print("## Iteration 0")
    print_metrics_table(base_metrics)
    print()

    front = [(base, base_metrics)]
    last_scores = {score(base_metrics)}
    no_improve = 0
    log = []
    next_id = 1
    all_ce = [("variant", base["id"], x) for x in base_ce]

    for it in range(1, 31):
        candidates = []
        for j in range(8):
            parent = front[j % len(front)][0]
            mut = mutate(parent, next_id)
            next_id += 1
            try:
                m, ce = evaluate_variant(mut)
            except Exception as e:
                m = {"hard_pass": False, "error": str(e)}
                ce = [("exception", str(e))]
            candidates.append((mut, m, ce))
            all_ce.extend([(mut["id"], x) for x in ce])
        passing = [(v, m) for v, m, ce in candidates if m.get("hard_pass")]
        new_front = pareto_front(front + passing)
        new_scores = {score(m) for _, m in new_front}
        improved = new_scores != last_scores
        if improved:
            last_scores = new_scores
            no_improve = 0
        else:
            no_improve += 1
        front_ids = {v["id"] for v, _ in new_front}
        for v, m, ce in candidates:
            kept = v["id"] in front_ids and m.get("hard_pass")
            reason = "kept" if kept else ("hard-fail" if not m.get("hard_pass") else "dominated")
            log.append({
                "iteration": it,
                "variant_id": v["id"],
                "hard_pass": m.get("hard_pass"),
                "M1": m.get("M1_corpus_accuracy"),
                "M5a": m.get("M5a_mean_grade"),
                "M7": m.get("M7_declaration_lines"),
                "kept": kept,
                "reason": reason,
            })
        print(f"## Iteration {it}")
        print(f"front_size={len(new_front)} no_improve={no_improve}")
        print()
        front = new_front
        if no_improve >= 5:
            break

    print("## Full iteration log")
    print("| iteration | variant_id | hard_pass | M1 | M5a | M7 | kept | reason |")
    print("| ---: | ---: | --- | ---: | ---: | ---: | --- | --- |")
    for row in log:
        m1 = f"{row['M1']:.6f}" if isinstance(row.get("M1"), float) else row.get("M1")
        m5a = f"{row['M5a']:.6f}" if isinstance(row.get("M5a"), float) else row.get("M5a")
        print(f"| {row['iteration']} | {row['variant_id']} | {row['hard_pass']} | {m1} | {m5a} | {row['M7']} | {row['kept']} | {row['reason']} |")
    print()

    print("## Best 3 variants")
    best = sorted(front, key=lambda x: score(x[1]))[:3]
    for rank, (v, m) in enumerate(best, 1):
        print(f"### Best {rank}")
        print_metrics_table(m)
        print("```json")
        print(json.dumps({"id": v["id"], "wording": v["wording"], "synonyms": v["synonyms"]}, indent=2, sort_keys=True, ensure_ascii=False))
        print("```")
        print()

    print("## Counterexamples (unique, first 200)")
    seen = set()
    n = 0
    for vid, ce in all_ce:
        s = json.dumps(ce, sort_keys=True, ensure_ascii=False, default=str)
        if s in seen:
            continue
        seen.add(s)
        print(f"- variant {vid}: {s}")
        n += 1
        if n >= 200:
            break
    if n == 0:
        print("- none")

if __name__ == "__main__":
    main()
