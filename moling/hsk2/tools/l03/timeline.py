"""第 5 集墨灵小课堂时间线（本地配音）。

读 tts_local.py 写出的 timing.json（每句在 lesson.wav 里的精确起止秒），
输出 ChatCut edit_item 的 adds（adds.json）。用法：python timeline.py /tmp/ep05/local/timing.json
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from script import S, VOCAB
from content import TITLE, INTRO, H_HONG, H_FANG, H_NIU, PATTERN, QUIZ, END, N
from py import py

TL = "d04c5e11-19ff-402f-9947-91906f1b2353"
FPS = 30
fr = lambda s: int(round(s * FPS))
VO = "a29fd5ff3e"
GAIN = 3
MG = dict(title="dff478c74e", intro="40ec7aa7b2", card="ea53b2d94f", hanzi="2ed6333525", pat="ab921ac5b4",
          quiz="154876f011", end="95bdd3d659", sub="03ac03b814")
CH = dict(xiaoyan="7161f1ecaf", tuantuan="e27bb77d5a", darong="1b6dda1d83", guazhanggui="6ec5d2fa90", adeng="50dc182e37",
          moxiansheng="329667733a", luming="5578831c7a", heweng="4280771742", wuming="3c4ccfff17")
LOGO = "5c244a6699"

TM = {int(k): v for k, v in json.load(open(sys.argv[1] if len(sys.argv) > 1 else "/tmp/ep05/local/timing.json"))["lesson"].items()}
ls = lambda i, l: TM[i][l][0]
le = lambda i, l: TM[i][l][1]

adds = []; marks = {}; subs = []; deco = []
def mg(k, start, dur, props=None, fade=0.0):
    d = {"type": "motion-graphic", "assetId": MG[k], "fromFrame": fr(start), "durationInFrames": fr(start + dur) - fr(start), "trackId": "V1"}
    if props: d["propertyOverrides"] = props
    if fade: d["fadeIn"] = fade
    adds.append(d)
def vo(start, src, dur):
    adds.append({"type": "audio", "assetId": VO, "fromFrame": fr(start), "durationInFrames": fr(start + dur) - fr(start),
                 "trackId": "A1", "sourceStartFromInSeconds": round(src, 3), "decibelAdjustment": GAIN})
def seg(i, lines, at, pad=0.08):
    """Play lines of section i so that the first line starts at timeline `at`; returns offset (timeline - source)."""
    a, b = ls(i, lines[0]) - pad, le(i, lines[-1]) + pad
    vo(at - pad, a, b - a)
    return at - ls(i, lines[0])
def subs_for(i, lines, off, hold_end=None):
    for n, l in enumerate(lines):
        a = off + ls(i, l) - 0.1
        b = off + le(i, l) + 0.4
        if n + 1 < len(lines): b = min(max(b, a + 1.2), off + ls(i, lines[n + 1]) - 0.12)
        elif hold_end is not None: b = max(b, hold_end)
        subs.append((a, max(b, a + 1.2), S[i][l][1], S[i][l][2]))
def char(name, a, b):
    deco.append((name, a, b))

T = 0.0
# 0 · title
marks["片头 Opening"] = T
A = 0.6
off = seg(0, range(4), T + A)
d0 = off + le(0, 3) - T + 1.2
mg("title", T, d0, dict(TITLE, revealAt=round(off + ls(0, 3) + 2.0 - T, 2)), 0.5)
subs_for(0, range(4), off)
char("xiaoyan", T + 1.0, T + d0)
T += d0

# 1 · vocab
marks["生词 New words"] = T
off = seg(1, [0], T + 0.3)
iend = off + le(1, 0) - T + 0.7
mg("intro", T, iend, INTRO, 0.25)
subs_for(1, [0], off)
char("tuantuan", T + 0.5, T + iend)
T += iend
for n, (w, en) in enumerate(VOCAB, 1):
    L = le(1, n) - ls(1, n) + 0.16
    dur = 0.25 + L + 2.0
    mg("card", T, dur, {"zh": w, "py": py(w), "en": en, "idx": n, "total": len(VOCAB), "echoAt": round(0.25 + L + 0.1, 2)})
    seg(1, [n], T + 0.33)
    char("tuantuan" if n <= 7 else "darong", T, T + dur)
    T += dur

# 2 · 红
marks["汉字 红"] = T
off = seg(2, range(8), T + 0.6)
r = lambda l: round(off + ls(2, l) - T, 2)
d2 = off + le(2, 7) - T + 1.2
mg("hanzi", T, d2, dict(H_HONG, tAncient=r(1), tModern=r(2), tCompose=r(3), tRelated=r(6), tExtra=r(7),
   notes=";;".join([N(r(2), "左边「纟」：丝线", "On the left, 纟: silk thread"),
                    N(r(3), "右边「工」表示读音：工 → 红", "On the right, 工 gives the sound: gōng → hóng"),
                    N(r(5), "丝线染红 → 红", "Silk dyed red → 红")])), 0.3)
subs_for(2, range(8), off)
char("adeng", T + 0.5, T + d2)
T += d2

# 3 · 房 / 牛 (one stretch of audio, two cards)
off = seg(3, range(8), T + 0.6)
T3 = T
b_niu = off + ls(3, 5) - 0.3
end3 = off + le(3, 7) + 1.2
rel = lambda base, l, dt=0.0: round(off + ls(3, l) + dt - base, 2)
marks["汉字 房"] = T3
mg("hanzi", T3, b_niu - T3, dict(H_FANG, tAncient=rel(T3, 2), tModern=rel(T3, 2, 1.4), tCompose=rel(T3, 3), tExtra=rel(T3, 4),
   notes=";;".join([N(rel(T3, 2), "上面「户」：一扇门", "On top, 户: a door"),
                    N(rel(T3, 3), "下面「方」表示读音：方 → 房", "Below, 方 gives the sound: fāng → fáng"),
                    N(rel(T3, 4), "有门的地方 → 房间", "A place with a door → a room")])), 0.3)
char("guazhanggui", T3 + 0.5, b_niu)
marks["汉字 牛"] = b_niu
mg("hanzi", b_niu, end3 - b_niu, dict(H_NIU, tAncient=rel(b_niu, 6), tModern=round(off + le(3, 6) - 0.4 - b_niu, 2), tExtra=rel(b_niu, 7),
   notes=";;".join([N(rel(b_niu, 6), "牛头和两只弯弯的角", "An ox head with two curved horns")])))
char("luming", b_niu, end3)
subs_for(3, range(8), off)
T = end3

# 4 · patterns
marks["句型 Patterns"] = T
off = seg(4, range(7), T + 0.6)
d4 = off + le(4, 6) - T + 2.0
mg("pat", T, d4, dict(PATTERN, t1=round(off + ls(4, 1) - T, 2), t2=round(off + ls(4, 4) - T, 2), tPrompt=round(off + ls(4, 6) - T, 2)), 0.3)
subs_for(4, range(7), off, hold_end=T + d4)
char("moxiansheng", T + 0.5, T + d4)
T += d4

# 5 · quiz: question, 3 s thinking gap, answer
marks["小测 Quiz"] = T
THINK = 3.0
for qi, (qlines, al) in enumerate([((0, 1), 2), ((3,), 4), ((5,), 6)]):
    qoff = seg(5, list(qlines), T + 0.4)
    tThink = qoff + le(5, qlines[-1]) - T + 0.2
    aStart = tThink + THINK
    aoff = seg(5, [al], T + aStart)
    total = aoff + le(5, al) - T + 1.6
    mg("quiz", T, total, dict(QUIZ[qi], tThink=round(tThink, 2), tReveal=round(aStart + 0.5, 2)), 0.3 if qi == 0 else 0)
    subs_for(5, list(qlines), qoff, hold_end=T + tThink + THINK - 0.2)
    subs_for(5, [al], aoff, hold_end=T + total - 0.3)
    char("heweng", T, T + total)
    T += total

# 6 · end
marks["结尾 Ending"] = T
off = seg(6, range(3), T + 0.5)
d6 = max(13.0, off + le(6, 2) - T + 2.5)
mg("end", T, d6, END, 0.3)
subs_for(6, range(3), off, hold_end=T + d6 - 0.5)
char("xiaoyan", T + 0.5, T + d6)
T += d6
TOTAL = T

merged = []
for name, a, b in deco:
    if merged and merged[-1][0] == name and abs(merged[-1][2] - a) < 0.05: merged[-1][2] = b
    else: merged.append([name, a, b])
for name, a, b in merged:
    adds.append({"type": "image", "assetId": CH[name], "fromFrame": fr(a), "durationInFrames": fr(b) - fr(a), "trackId": "V2",
                 "fit": "contain", "left": 1615, "top": 640, "width": 280, "height": 420, "fadeIn": 0.4})
adds.append({"type": "image", "assetId": LOGO, "fromFrame": 0, "durationInFrames": fr(TOTAL), "trackId": "V3",
             "left": 40, "top": 872, "width": 176, "height": 176, "fadeIn": 0.5})
# 空时间线上 ChatCut 按出现顺序建轨，字幕最后加才会在最上层
for a, b, zh, en in subs:
    adds.append({"type": "motion-graphic", "assetId": MG["sub"], "fromFrame": fr(a), "durationInFrames": max(fr(b) - fr(a), 30),
                 "trackId": "V4", "left": 340, "top": 905, "width": 1240, "height": 150, "propertyOverrides": {"zh": zh, "en": en}})

print("total", round(TOTAL, 2), "items", len(adds), "subs", len(subs), "deco", len(merged))
for k, v in marks.items(): print(f"  {k}: {int(v // 60)}:{v % 60:05.2f}")
json.dump(adds, open("/tmp/ep05/lesson_adds.json", "w"), ensure_ascii=False)
