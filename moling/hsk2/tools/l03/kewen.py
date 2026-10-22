"""第 5 集课文视频：逐句课文（本地配音 + 跟读停顿）+「故事里」对照（故事镜头 + 豆包台词）。

读 tts_local.py 写出的 timing.json，输出 ChatCut edit_item 的 adds（三批：底层 / Logo）。
用法：python kewen.py /tmp/ep05/local/timing.json
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from py import py
from kewen_text import TEXTS

FPS = 30
MG = "a64f09c26d"
LOGO = "5c244a6699"
VO = "c4a8ea6b05"
GAIN = 3
FRAME = dict(fit="cover", left=110, top=230, width=760, height=428)
KF = {"s04": "ab5000d3-0e1e-4211-93b3-9f3a80ae9b61", "s05": "55696305-9a5f-4625-9162-43ae7ebb86c1",
      "s07": "a4f68736-5825-48da-8b1f-15b56523dd64", "s02": "3870bffc-4f01-475c-a116-ea9962a4ad3a"}
SHOT = {"s02": ("3b3e577d-994d-4e30-9b88-40bfc4672185", 13.04), "s04": ("f135a382-5ae7-4868-83eb-74e5444b1f83", 9.04),
        "s05": ("b26e274e-ea68-492b-9d0a-f2835323bc5a", 11.04), "s07": ("6d35848b-749a-463c-b87d-9c789a1d66a5", 11.04),
        "s08": ("e17283ba-c1c3-426b-84ce-12f0732ba547", 8.04)}
# 课文三的故事对照前两句用 S7，后两句用 S8
ECHO_SHOTS = {"一": [("s04", 0)], "二": [("s05", 0)], "三": [("s07", 0), ("s08", 2)], "四": [("s02", 0)]}
NOTE = "听一句，跟读一句 · Listen, then read aloud"

TM = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "/tmp/ep05/local/timing.json"))["kewen"]
fr = lambda s: int(round(s * FPS))


def card(start, dur, **props):
    return dict(type="motion-graphic", assetId=MG, trackId="V1", fromFrame=start, durationInFrames=dur, propertyOverrides=props)


def local(start, a, b):
    """Local-TTS clip covering [a, b] seconds of kewen.wav, starting at timeline frame `start`."""
    a, b = a - 0.05, b + 0.08
    return dict(type="audio", assetId=VO, trackId="A1", fromFrame=start, durationInFrames=fr(b - a),
                sourceStartFromInSeconds=round(a, 3), decibelAdjustment=GAIN)


def shot(key, start, dur):
    asset, vdur = SHOT[key]
    d = dict(type="video", assetId=asset, trackId="V2", fromFrame=start, durationInFrames=dur, decibelAdjustment=-60, **FRAME)
    if dur / FPS > vdur - 0.05:
        d["playbackRate"] = round((vdur - 0.1) / (dur / FPS), 3)
    return d


def build():
    adds, pics = [], []
    t = 0
    ia, ib = TM["intro"][0][0], TM["intro"][-1][1]
    d = fr(ib - ia) + 45
    adds.append(card(t, d, mode="title", badge="第三课 · 课文", title="左边那个红色的是我的",
                     titlePy=py("左边那个红色的是我的"), titleEn="Lesson 3 · The Red One on the Left Is Mine", note=NOTE))
    adds.append(local(t + 15, ia, ib))
    t += d
    for tx in TEXTS:
        title = "课文" + tx["n"] + " · " + tx["title"]
        tpy = py("课文" + tx["n"] + tx["title"])
        ten = "Text " + str("一二三四".index(tx["n"]) + 1) + " · " + tx["en"]
        adds.append(card(t, 90, mode="title", badge="课文" + tx["n"], title=title, titlePy=tpy, titleEn=ten, note=NOTE))
        t += 90
        p0 = t
        n = len(tx["lines"])
        for i, ((role, who, zh, en, hl), (a, b)) in enumerate(zip(tx["lines"], TM[tx["n"]]), 1):
            v = fr(b - a + 0.13)
            gap = max(60, v) + 15
            dur = 9 + v + gap
            adds.append(card(t, dur, mode="line", title=title, titlePy=tpy, titleEn=ten, idx=i, total=n,
                             role=role, speaker=who, zh=zh, py=py(zh.replace("|", "")), en=en, hl=hl,
                             echoAt=round((9 + v + 6) / FPS, 2)))
            adds.append(local(t + 9, a, b))
            t += dur
        pics.append(dict(type="image", assetId=KF[tx["shot"]], trackId="V2", fromFrame=p0, durationInFrames=t - p0, **FRAME))
        n = len(tx["story"])
        starts = []
        for i, (who, zh, en, hl, asset, sec) in enumerate(tx["story"], 1):
            starts.append(t)
            v = fr(sec)
            dur = 8 + v + 18
            adds.append(card(t, dur, mode="story", title=title, titlePy=tpy, titleEn=ten, idx=i, total=n,
                             role="", speaker=who, zh=zh, py=py(zh.replace("|", "")), en=en, hl=hl, echoAt=0))
            adds.append(dict(type="audio", assetId=asset, trackId="A1", fromFrame=t + 8, durationInFrames=v))
            t += dur
        segs = ECHO_SHOTS[tx["n"]]
        for k, (key, li) in enumerate(segs):
            s0 = starts[li]
            s1 = starts[segs[k + 1][1]] if k + 1 < len(segs) else t
            pics.append(shot(key, s0, s1 - s0))
    oa, ob = TM["outro"][0][0], TM["outro"][-1][1]
    d = fr(ob - oa) + 60
    adds.append(card(t, d, mode="title", badge="课文", title="读完啦！", titlePy=py("读完啦"),
                     titleEn="Great job!", note="你最喜欢哪一句？ · Which line do you like best?"))
    adds.append(local(t + 15, oa, ob))
    t += d
    logo = [dict(type="image", assetId=LOGO, trackId="V3", fromFrame=0, durationInFrames=t,
                 left=40, top=872, width=176, height=176, fadeIn=0.5)]
    return adds + pics, logo, t


if __name__ == "__main__":
    base, logo, total = build()
    json.dump(base, open("/tmp/ep05/kewen_p1.json", "w"), ensure_ascii=False, separators=(",", ":"))
    json.dump(logo, open("/tmp/ep05/kewen_p2.json", "w"), ensure_ascii=False, separators=(",", ":"))
    print("total", round(total / FPS, 2), "s; items", len(base) + len(logo))
