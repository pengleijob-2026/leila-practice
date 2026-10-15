import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from script import S
from content import TITLE, INTRO, VOCAB, H_JING, H_TA, H_ZU, H_ZUI, PATTERN, QUIZ, END, N
from py import py

FPS = 30
fr = lambda s: int(round(s * FPS))
BV = {0: "5e92183d51", 1: "6988dd1eb2", 2: "52ccffefc3", 3: "eebf0c951c", 4: "f727060e8b", 5: "dc7944f99d", 6: "279111bce9"}
DUR = {0: 21.943, 1: 15.308, 2: 34.090, 3: 48.326, 4: 28.578, 5: 40.098, 6: 10.971}
MG = dict(title="dff478c74e", intro="40ec7aa7b2", card="ea53b2d94f", hanzi="bfb5554c59", pat="ab921ac5b4",
          quiz="154876f011", end="95bdd3d659", sub="03ac03b814")
CH = dict(xiaoyan="7161f1ecaf", tuantuan="e27bb77d5a", darong="1b6dda1d83", guazhanggui="6ec5d2fa90", adeng="50dc182e37",
          moxiansheng="329667733a", luming="5578831c7a", heweng="4280771742", wuming="3c4ccfff17")
LOGO = "5c244a6699"

TOK = re.compile(r"[\u3400-\u9fff]|[A-Za-z0-9']+|[.!?。！？]|[,，、]")
def syl(w):
    if w.isdigit(): return 2
    if w.isupper() and len(w) > 1: return len(w)
    if len(w) == 1: return 1
    n = len(re.findall(r"[aeiouy]+", w.lower()))
    if w.lower().endswith("e") and not w.lower().endswith(("le", "ee")) and n > 1: n -= 1
    return max(1, n)

def tokens(text):
    out = []; prev = None
    for m in TOK.finditer(text):
        t = m.group(0)
        if re.match(r"[\u3400-\u9fff]", t): kind, d = "han", 0.235
        elif re.match(r"[.!?。！？]", t): kind, d = "stop", 0.42
        elif re.match(r"[,，、]", t): kind, d = "comma", 0.2
        else: kind, d = "en", 0.06 + 0.15 * syl(t)
        if prev and {prev, kind} == {"han", "en"}: d += 0.08
        out.append((t, kind, d))
        if kind in ("han", "en"): prev = kind
    return out

def timing(i):
    """Per-line (start, end) and per-line token start times in clip seconds."""
    lines = []
    t = 0.0
    for li, l in enumerate(S[i]):
        toks = tokens(l[0])
        rows = []
        for tk, kind, d in toks:
            rows.append([tk, kind, t, t + d]); t += d
        lines.append(rows); t += 0.1
    lead, tail = 0.1, 0.25
    k = (DUR[i] - lead - tail) / t
    for rows in lines:
        for r in rows: r[2] = lead + r[2] * k; r[3] = lead + r[3] * k
    return lines

TM = {i: timing(i) for i in S}
def ls(i, l):
    return next(r[2] for r in TM[i][l] if r[1] in ("han", "en"))
def le(i, l):
    return [r[3] for r in TM[i][l] if r[1] in ("han", "en")][-1]
def find(i, l, sub):
    rows = TM[i][l]; text = [r[0] for r in rows]
    for j in range(len(rows)):
        acc = ""
        for k in range(j, len(rows)):
            acc += text[k] if rows[k][1] == "han" else text[k] + " "
            if acc.strip().startswith(sub) or acc.replace(" ", "").startswith(sub.replace(" ", "")):
                return rows[j][2]
            if len(acc.replace(" ", "")) >= len(sub.replace(" ", "")): break
    raise KeyError((i, l, sub))

adds = []; marks = {}; subs = []; deco = []
def mg(k, start, dur, props=None, fade=0.0):
    d = {"type": "motion-graphic", "assetId": MG[k], "fromFrame": fr(start), "durationInFrames": fr(start + dur) - fr(start), "trackId": "V1"}
    if props: d["propertyOverrides"] = props
    if fade: d["fadeIn"] = fade
    adds.append(d)
def vo(i, start, src=0.0, dur=None):
    if dur is None: dur = DUR[i] - src
    d = {"type": "audio", "assetId": BV[i], "fromFrame": fr(start), "durationInFrames": fr(start + dur) - fr(start), "trackId": "A1"}
    if src: d["sourceStartFromInSeconds"] = round(src, 3)
    adds.append(d)
def sub(i, l, a, b):
    subs.append((a, b, S[i][l][1], S[i][l][2]))
def subs_for(i, lines, off, src=0.0, hold_end=None):
    """Subtitles for lines of clip i placed with audio starting at timeline `off` from source offset `src`."""
    for n, l in enumerate(lines):
        a = off + ls(i, l) - src - 0.1
        nxt = off + ls(i, lines[n + 1]) - src - 0.15 if n + 1 < len(lines) else None
        b = off + le(i, l) - src + 0.45
        if nxt is not None: b = min(max(b, a + 1.2), nxt)
        elif hold_end is not None: b = max(b, hold_end)
        sub(i, l, a, max(b, a + 1.2))
def char(name, a, b):
    deco.append((name, a, b))

T = 0.0
# 0 · title
marks["片头 Opening"] = T
A = 0.5
mg("title", T, 23.4, dict(TITLE, revealAt=round(A + find(0, 3, "睛"), 2)), 0.5)
vo(0, T + A); subs_for(0, range(4), T + A)
char("xiaoyan", T + 1.0, T + 23.4)
T += 23.4

# 1 · vocab
marks["生词 New words"] = T
A = 0.3
iend = A + le(1, 0) + 0.7
mg("intro", T, iend, INTRO, 0.25)
cut0 = (le(1, 0) + ls(1, 1)) / 2
vo(1, T + A, 0, cut0); subs_for(1, [0], T + A)
char("tuantuan", T + 0.5, T + iend)
T += iend
for n, (w, en) in enumerate(VOCAB, 1):
    a = (le(1, n - 1) + ls(1, n)) / 2
    b = (le(1, n) + ls(1, n + 1)) / 2 if n < 12 else DUR[1]
    L = b - a
    dur = 0.25 + L + 2.0
    mg("card", T, dur, {"zh": w, "py": py(w), "en": en, "idx": n, "total": 12, "echoAt": round(0.25 + L + 0.1, 2)})
    vo(1, T + 0.25, a, L)
    char("tuantuan" if n <= 6 else "darong", T, T + dur)
    T += dur

# 2 · 睛
marks["汉字 睛"] = T
A = 0.5
r = lambda l: round(A + ls(2, l), 2)
props = dict(H_JING, tAncient=r(2), tRotate=r(3), tModern=round(A + find(2, 3, "目"), 2), tCompose=r(4), tRelated=r(6), tExtra=r(7),
             notes=";;".join([N(r(1), "左边「目」：一只眼睛", "On the left, 目: an eye"),
                              N(r(5), "右边「青」表示读音：青 → 睛", "On the right, 青 gives the sound: qīng → jīng")]))
d2 = A + DUR[2] + 1.0
mg("hanzi", T, d2, props, 0.3)
vo(2, T + A); subs_for(2, range(8), T + A)
char("guazhanggui", T + 0.5, T + d2)
T += d2

# 3 · 它 足 最 (one continuous audio, three stages)
A = 0.5
T3 = T
vo(3, T3 + A); subs_for(3, range(14), T3 + A)
b_zu = T3 + A + ls(3, 6) - 0.3
b_zui = T3 + A + ls(3, 10) - 0.3
end3 = T3 + A + DUR[3] + 1.0
rel = lambda base, l: round(T3 + A + ls(3, l) - base, 2)
relf = lambda base, l, s: round(T3 + A + find(3, l, s) - base, 2)
marks["汉字 它"] = T3
mg("hanzi", T3, b_zu - T3, dict(H_TA, tAncient=rel(T3, 2), tModern=rel(T3, 4), tExtra=rel(T3, 5),
   notes=";;".join([N(rel(T3, 2), "最早画的是一条蛇", "It was first drawn as a snake"),
                    N(rel(T3, 3), "古人见面问：「无它乎？」", "People asked: \u201cNo snakes today?\u201d"),
                    N(rel(T3, 4), "后来，用来说动物和东西", "Later: \u201cit\u201d, for animals and things")])), 0.3)
char("wuming", T3 + 0.5, b_zu)
marks["汉字 足"] = b_zu
mg("hanzi", b_zu, b_zui - b_zu, dict(H_ZU, tAncient=rel(b_zu, 7), tModern=rel(b_zu, 8), tRelated=relf(b_zu, 8, "踢"), tExtra=rel(b_zu, 9),
   notes=";;".join([N(rel(b_zu, 7), "上面是膝盖，下面是脚", "Knee on top, foot below"),
                    N(rel(b_zu, 8), "足字旁的字，都要用脚", "Characters with 足 use your feet")])))
char("luming", b_zu, b_zui)
marks["汉字 最"] = b_zui
mg("hanzi", b_zui, end3 - b_zui, dict(H_ZUI, tModern=-1, tCompose=rel(b_zui, 11), tExtra=rel(b_zui, 13),
   notes=";;".join([N(rel(b_zui, 11), "下面是「取」：耳 + 又（手）", "Below: 取 = ear 耳 + hand 又"),
                    N(relf(b_zui, 11, "A hand"), "一只手抓住一只耳朵", "A hand grabbing an ear"),
                    N(rel(b_zui, 12), "抢在最前面，拿到最多 → 最", "Grab first, take the most \u2192 最")])))
char("heweng", b_zui, end3)
T = end3

# 4 · patterns
marks["句型 Patterns"] = T
A = 0.5
d4 = A + DUR[4] + 1.2
mg("pat", T, d4, dict(PATTERN, t1=round(A + ls(4, 1), 2), t2=round(A + ls(4, 3), 2), tPrompt=round(A + ls(4, 5), 2)), 0.3)
vo(4, T + A); subs_for(4, range(6), T + A, hold_end=T + d4)
char("moxiansheng", T + 0.5, T + d4)
T += d4

# 5 · quiz: each question = question part, 3s thinking gap, answer part
marks["小测 Quiz"] = T
THINK = 3.0
qsplit = [((0, 1), 2), ((3,), 4), ((5,), 6)]
for qi, (qlines, al) in enumerate(qsplit):
    A = 0.3
    s0 = 0.0 if qi == 0 else (le(5, qlines[0] - 1) + ls(5, qlines[0])) / 2
    s1 = (le(5, al - 1) + ls(5, al)) / 2
    s2 = (le(5, al) + ls(5, al + 1)) / 2 if al + 1 < len(S[5]) else DUR[5]
    qdur = s1 - s0
    tThink = A + qdur
    aStart = tThink + THINK
    adur = s2 - s1
    total = aStart + adur + 1.6
    mg("quiz", T, total, dict(QUIZ[qi], tThink=round(tThink, 2), tReveal=round(aStart + 0.5, 2)), 0.3 if qi == 0 else 0)
    vo(5, T + A, s0, qdur)
    vo(5, T + aStart, s1, adur)
    subs_for(5, list(qlines), T + A, s0, hold_end=T + tThink + THINK - 0.2)
    subs_for(5, [al], T + aStart, s1, hold_end=T + total - 0.3)
    char("adeng", T, T + total)
    T += total

# 6 · end
marks["结尾 Ending"] = T
A = 0.4
d6 = 13.0
mg("end", T, d6, END, 0.3)
vo(6, T + A); subs_for(6, range(3), T + A, hold_end=T + d6 - 0.5)
char("xiaoyan", T + 0.5, T + d6)
T += d6
TOTAL = T

for a, b, zh, en in subs:
    adds.append({"type": "motion-graphic", "assetId": MG["sub"], "fromFrame": fr(a), "durationInFrames": max(fr(b) - fr(a), 30),
                 "trackId": "V4", "left": 340, "top": 905, "width": 1240, "height": 150, "propertyOverrides": {"zh": zh, "en": en}})
merged = []
for name, a, b in deco:
    if merged and merged[-1][0] == name and abs(merged[-1][2] - a) < 0.05: merged[-1][2] = b
    else: merged.append([name, a, b])
for name, a, b in merged:
    adds.append({"type": "image", "assetId": CH[name], "fromFrame": fr(a), "durationInFrames": fr(b) - fr(a), "trackId": "V2",
                 "fit": "contain", "left": 1615, "top": 640, "width": 280, "height": 420, "fadeIn": 0.4})
adds.append({"type": "image", "assetId": LOGO, "fromFrame": 0, "durationInFrames": fr(TOTAL), "trackId": "V3",
             "left": 40, "top": 872, "width": 176, "height": 176, "fadeIn": 0.5})

print("total", round(TOTAL, 2), "items", len(adds), "subs", len(subs), "deco", len(merged))
for k, v in marks.items(): print(f"  {k}: {int(v // 60)}:{v % 60:05.2f}")
json.dump(adds, open("adds.json", "w"), ensure_ascii=False)
json.dump({"subs": subs, "marks": marks, "total": TOTAL}, open("subs.json", "w"), ensure_ascii=False)
