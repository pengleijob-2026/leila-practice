"""第 3 集故事成片排版：镜头视频 + 逐句配音 + 双语字幕（说话人：中文 / English）。

用法：python story_cut.py > adds.json
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from py import py  # noqa: E402
from story import LINES  # noqa: E402

FPS = 30
TL = "4f16b1c085"
CARD = "a64f09c26d"
SUB = "03ac03b814"

# 镜头：(视频素材, 时长秒, 各句在镜头内的起点秒)
SHOTS = {
    "S1": ("eb8973f42b", 10, [0.6, 3.2, 6.5]),
    "S2": ("685a083c95", 6, [0.8]),
    "S3": ("21fa75b549", 7, [0.6]),
    "S4": ("8a7f4c60e8", 15, [0.5, 2.8, 5.82, 7.65, 11.38, 12.97]),
    "S5": ("4b33dfeeaf", 16, [0.3, 6.13, 8.38, 9.73, 14.13]),
    "S6": ("dbc0aeb5f4", 7, [1.0, 5.0]),
    "S7": (None, 14, [0.5, 4.3, 6.6]),
    "S8": (None, 8, [2.5, 6.2]),
    "S9": (None, 10, [1.0, 3.0, 7.3]),
    "S10": (None, 9, [1.8]),
}

VOICE = [
    ("9a084c1526", 2.14), ("5f1f09028a", 2.86), ("2e308b1bca", 3.1), ("7aee2a10b0", 4.52),
    ("0e6901a5db", 5.71), ("213cb7ba29", 1.9), ("477ede37b2", 2.62), ("ac094c192e", 1.43),
    ("fcbd1e0f3d", 3.33), ("a70f4c4985", 1.19), ("d0a3f3603a", 1.19), ("df0c6c11f1", 5.48),
    ("e813ba4abb", 1.9), ("1f10b70843", 1.0), ("1c61a17d7c", 4.05), ("5dd849584a", 1.43),
    ("8bfecd5b6e", 3.81), ("888d2a381c", 1.9), ("ce8eab29d7", 3.33), ("11a74fd880", 1.9),
    ("ba67e3ccfa", 5.71), ("ba201dac81", 1.67), ("f28943bfd5", 1.19), ("03af858fec", 1.19),
    ("fe5d6f4f97", 2.86), ("fb9e9a9869", 2.38), ("0a533abc74", 6.67),
]

TITLE = 90
END = 90


def f(sec):
    return round(sec * FPS)


def build():
    adds, videos = [], []
    adds.append(dict(timelineId=TL, type="motion-graphic", assetId=CARD, trackId="V1", fromFrame=0,
                     durationInFrames=TITLE,
                     propertyOverrides=dict(mode="title", badge="墨灵记 · 第三集", title="呱呱当铺 · 点睛",
                                            titlePy=py("呱呱当铺点睛"),
                                            titleEn="Episode 3 · Gua's Pawnshop: Dotting the Eyes",
                                            note="HSK 2 · 第一课《九月去北京旅游最好》")))
    t = TITLE
    subs = []
    li = 0
    for shot, (asset, dur, offs) in SHOTS.items():
        videos.append(dict(shot=shot, asset=asset, fromFrame=t, durationInFrames=f(dur)))
        if asset:
            adds.append(dict(timelineId=TL, type="video", assetId=asset, trackId="V1", fromFrame=t,
                             durationInFrames=f(dur), fit="cover", decibelAdjustment=-60))
        for off in offs:
            s, who, zh, en = LINES[li]
            assert s == shot, (s, shot)
            va, vs = VOICE[li]
            st = t + f(off)
            adds.append(dict(timelineId=TL, type="audio", assetId=va, trackId="A1", fromFrame=st,
                             durationInFrames=f(vs)))
            subs.append([st, f(vs) + 9, who + "：" + zh, en])
            li += 1
        t += f(dur)
    assert li == len(LINES)
    for i, s in enumerate(subs):
        nxt = subs[i + 1][0] if i + 1 < len(subs) else t
        s[1] = max(min(s[1], nxt - s[0] - 1), 30)
        adds.append(dict(timelineId=TL, type="motion-graphic", assetId=SUB, trackId="V2", fromFrame=s[0],
                         durationInFrames=s[1], left=340, top=905, width=1240, height=150,
                         propertyOverrides=dict(zh=s[2], en=s[3])))
    adds.append(dict(timelineId=TL, type="motion-graphic", assetId=CARD, trackId="V1", fromFrame=t,
                     durationInFrames=END,
                     propertyOverrides=dict(mode="title", badge="第三集 · 完", title="下集见",
                                            titlePy=py("下集见"), titleEn="To be continued…",
                                            note="撑灰伞的客人是谁？ · Who is the guest with the grey umbrella?")))
    t += END
    return dict(adds=adds, videos=videos, total=t)


if __name__ == "__main__":
    print(json.dumps(build(), ensure_ascii=False))
