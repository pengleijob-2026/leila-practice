"""第 5 集墨灵小课堂时间线（蕾姐逐句配音）。

每句一条配音素材（lei_assets.py），按顺序排布；生词留跟读停顿，练习 / 小测在答案前留思考停顿。
输出 ChatCut edit_item 的 adds，分三批写入 /tmp/ep05/lesson_p{1,2,3}.json（底层 / 蕾姐数字人层 / 字幕，空时间线按出现顺序建轨）。
左下角：水墨圆框里常驻蕾姐墨灵书房造型照片，蕾姐每说一句叠上这一句的数字人口播视频（avatar.py），跟读和思考停顿时回到静态照片。
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from script import S, VOCAB
from content import TITLE, INTRO, G1, G2, G3, H_HONG, H_SHOU, H_ZHANG, H_FU, H_MU, H_DAO, QUIZ, END, N, EX
from lei_assets import LEI
import avatar
from py import py

FPS = 30
fr = lambda s: int(round(s * FPS))
GAP = 0.35
REPEAT = 2.5
THINK = 3.0
MG = dict(title="dff478c74e", intro="40ec7aa7b2", card="ea53b2d94f", hanzi="2ed6333525", grammar="ba210a5ee1",
          quiz="154876f011", end="95bdd3d659", sub="03ac03b814")
CH = dict(xiaoyan="7161f1ecaf", tuantuan="e27bb77d5a", darong="1b6dda1d83", guazhanggui="6ec5d2fa90", adeng="50dc182e37",
          moxiansheng="329667733a", luming="5578831c7a", heweng="4280771742", wuming="3c4ccfff17")

adds, subs, deco, marks, SUBI = [], [], [], {}, {}


def mg(k, start, dur, props=None, fade=0.0):
    d = {"type": "motion-graphic", "assetId": MG[k], "fromFrame": fr(start), "durationInFrames": fr(start + dur) - fr(start), "trackId": "V1"}
    if props: d["propertyOverrides"] = props
    if fade: d["fadeIn"] = fade
    adds.append(d)


def say(sec, i, at):
    """Place line i of section `sec` at `at`; returns (start, end)."""
    asset, dur = LEI[f"L {sec}-{i}"]
    adds.append({"type": "audio", "assetId": asset, "fromFrame": fr(at), "durationInFrames": fr(dur), "trackId": "A1"})
    SUBI[(sec, i)] = len(subs)
    subs.append([at - 0.1, at + dur + 0.4, S[sec][i][1], S[sec][i][2]])
    return at, at + dur


def run(sec, idx, at, pauses=None):
    """Say lines idx in order from `at`; pauses maps line -> extra silence before it. Returns {line: (start, end)}."""
    out, t = {}, at
    for n, i in enumerate(idx):
        if n: t += GAP + (pauses or {}).get(i, 0)
        out[i] = say(sec, i, t)
        t = out[i][1]
    return out


def char(name, a, b):
    deco.append((name, a, b))


T = 0.0
# 片头
marks["片头 Opening"] = T
L = run("open", range(4), T + 0.6)
d = L[3][1] - T + 1.2
mg("title", T, d, dict(TITLE, revealAt=round(L[3][0] + 2.0 - T, 2)), 0.5)
char("xiaoyan", T + 1.0, T + d)
T += d

# 生词跟读
marks["生词 New words"] = T
L = run("vocab", [0], T + 0.3)
d = L[0][1] - T + 0.7
mg("intro", T, d, INTRO, 0.25)
char("tuantuan", T + 0.5, T + d)
T += d
for n, (w, en) in enumerate(VOCAB, 1):
    a, b = say("vocab", n, T + 0.3)
    d = b - T + REPEAT
    subs[-1][1] = T + d - 0.1
    mg("card", T, d, {"zh": w, "py": py(w), "en": en, "idx": n, "total": len(VOCAB), "echoAt": round(b - T + 0.1, 2)})
    char("tuantuan" if n <= 7 else "darong", T, T + d)
    T += d

# 语言点
for k, g, who in (("g1", G1, "moxiansheng"), ("g2", G2, "luming"), ("g3", G3, "darong")):
    marks["语言点 " + g["title"]] = T
    L = run(k, range(7), T + 0.6, {6: THINK})
    r = lambda i: round(L[i][0] - T, 2)
    d = L[6][1] - T + 1.8
    props = {x: v for x, v in g.items() if x != "ex"}
    props.update(examples=";;".join(EX(r(2 + j), zh, en, hl) for j, (zh, en, hl) in enumerate(g["ex"])),
                 tFormula=r(1), tPractice=r(5), tAnswer=r(6))
    subs[SUBI[(k, 5)]][1] = L[6][0] - 0.15
    mg("grammar", T, d, props, 0.3)
    char(who, T + 0.5, T + d)
    T += d

# 汉字：红
marks["汉字 红"] = T
L = run("hong", range(6), T + 0.6)
r = lambda i, dt=0.0: round(L[i][0] + dt - T, 2)
d = L[5][1] - T + 1.5
mg("hanzi", T, d, dict(H_HONG, tAncient=r(1), tModern=r(2), tCompose=r(3), tExtra=r(4), tRelated=r(5),
   notes=";;".join([N(r(2), "左边「纟」：丝线", "On the left, 纟: silk thread"),
                    N(r(3), "右边「工」表示读音：工 → 红", "On the right, 工 gives the sound: gōng → hóng"),
                    N(r(4), "丝线染红 → 红", "Silk dyed red → 红")])), 0.3)
char("adeng", T + 0.5, T + d)
T += d

# 汉字：独体字 手 / 丈 / 夫
marks["汉字 手丈夫"] = T
L = run("single", range(7), T + 0.6, {3: 0.6, 5: 0.6})
cuts = [T, L[3][0] - 0.4, L[5][0] - 0.4, L[6][1] + 1.5]
for (h, lines, notes), a, b in zip(
        [(H_SHOU, (1, 2), [(2, "字形是一只手的形象", "A picture of a hand")]),
         (H_ZHANG, (3, 4), [(4, "本义：手持拐杖的老者", "Originally: an old man with a walking stick"),
                            (4, "现在：长度单位", "Now: a unit of length")]),
         (H_FU, (5, 6), [(6, "本义：成年男子", "Originally: a grown man"),
                         (6, "现在：家庭中的男性、丈夫", "Now: a man in the family, a husband")])],
        cuts[:-1], cuts[1:]):
    r = lambda i, dt=0.0: round(L[i][0] + dt - a, 2)
    i0, i1 = lines
    mg("hanzi", a, b - a, dict(h, tExtra=r(i0, 0.4), tAncient=r(i1), tModern=round(L[i1][1] + 0.2 - a, 2),
       notes=";;".join(N(r(i, 0.6 * j), zh, en) for j, (i, zh, en) in enumerate(notes))), 0.3 if a == T else 0)
char("guazhanggui", T + 0.5, cuts[-1])
T = cuts[-1]

# 汉字：偏旁 木 / 刂
marks["汉字 偏旁"] = T
L = run("radical", range(4), T + 0.6, {2: 0.6})
mid, end = L[2][0] - 0.4, L[3][1] + 1.8
mg("hanzi", T, mid - T, dict(H_MU, tRelated=round(L[1][0] + 1.5 - T, 2)), 0.3)
mg("hanzi", mid, end - mid, dict(H_DAO, tRelated=round(L[3][0] + 1.5 - mid, 2)))
char("wuming", T + 0.5, end)
T = end

# 小测试：题目 → 思考 → 答案
marks["小测 Quiz"] = T
for qi, (qlines, al) in enumerate([((0, 1), 2), ((3,), 4), ((5,), 6)]):
    L = run("quiz", list(qlines) + [al], T + 0.4, {al: THINK})
    tThink = L[qlines[-1]][1] - T + 0.2
    subs[SUBI[("quiz", qlines[-1])]][1] = L[al][0] - 0.15
    d = L[al][1] - T + 1.6
    mg("quiz", T, d, dict(QUIZ[qi], tThink=round(tThink, 2), tReveal=round(L[al][0] - T + 0.3, 2)), 0.3 if qi == 0 else 0)
    char("heweng", T, T + d)
    T += d

# 结尾
marks["结尾 Ending"] = T
L = run("end", range(3), T + 0.5)
d = max(13.0, L[2][1] - T + 2.5)
mg("end", T, d, END, 0.3)
subs[-1][1] = T + d - 0.5
char("xiaoyan", T + 0.5, T + d)
T += d
TOTAL = T

# 字幕：不与下一句重叠，最短 1.2 s
subs.sort(key=lambda s: s[0])
for n, s in enumerate(subs):
    if n + 1 < len(subs): s[1] = min(s[1], subs[n + 1][0] - 0.05)
    s[1] = max(s[1], s[0] + 1.0)

merged = []
for name, a, b in deco:
    if merged and merged[-1][0] == name and abs(merged[-1][2] - a) < 0.05: merged[-1][2] = b
    else: merged.append([name, a, b])
for name, a, b in merged:
    adds.append({"type": "image", "assetId": CH[name], "fromFrame": fr(a), "durationInFrames": fr(b) - fr(a), "trackId": "V2",
                 "fit": "contain", "left": 1615, "top": 640, "width": 280, "height": 420, "fadeIn": 0.4})
lei_lines = [(a["fromFrame"], a["durationInFrames"], a["assetId"]) for a in adds if a["type"] == "audio"]
logo = avatar.layer(lei_lines, fr(TOTAL), "V3", "V5", "V6")


sub_adds = [{"type": "motion-graphic", "assetId": MG["sub"], "fromFrame": fr(a), "durationInFrames": fr(b) - fr(a),
             "trackId": "V4", "left": 340, "top": 905, "width": 1240, "height": 150, "propertyOverrides": {"zh": zh, "en": en}}
            for a, b, zh, en in subs]

if __name__ == "__main__":
    print("total", round(TOTAL, 2), "items", len(adds) + 1 + len(sub_adds), "subs", len(subs), "deco", len(merged))
    for k, v in marks.items(): print(f"  {k}: {int(v // 60)}:{v % 60:05.2f}")
    os.makedirs("/tmp/ep05", exist_ok=True)
    print("talking videos", sum(x["type"] == "video" for x in logo), "of", len(lei_lines))
    for n, part in enumerate((adds, logo, sub_adds), 1):
        json.dump(part, open(f"/tmp/ep05/lesson_p{n}.json", "w"), ensure_ascii=False, separators=(",", ":"))
