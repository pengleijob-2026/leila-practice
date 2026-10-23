"""第 5 集故事《灯兔夜市》成片排版：镜头视频 + 逐句配音 + 双语字幕（说话人：中文 / English）。

用法：python3 story_cut.py > adds.json
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from py import py  # noqa: E402

FPS = 30
CARD = "a64f09c26d"
SUB = "03ac03b814"
# 沿用第 3 集春市配乐；A2 设为 follower、A1 设为 anchor，说话时自动压低
BGM = "4c8ad55ca0"

# (镜头, 角色, 中文, 英文, 配音素材, 实测时长秒)
LINES = [
    ("S1", "鹿鸣", ["天黑了，春市的夜市开张了。", "可是，灯笼一个一个变成了灰色。"],
     ["Night fell, and the Spring Market's night fair opened.", "But one by one, the lanterns turned grey."],
     "43865a1205", 5.856),
    ("S2", "呱掌柜", "你看见我的杯子了吗？", "Have you seen my cup?", "159f7ff569", 1.872),
    ("S2", "阿灯", "这里有几个杯子，哪个是你的？", "There are a few cups here. Which one is yours?", "ec632fc9a2", 2.064),
    ("S2", "呱掌柜", "左边那个红色的是我的！", "The red one on the left is mine!", "62d048a7f7", 2.256),
    ("S2", "阿灯", "左边那个？都是灰的！", "The one on the left? They're all grey!", "5fe6381bb6", 1.704),
    ("S3", "小砚", "颜色……没有了！", "The colors… are gone!", "67d57be6b0", 2.664),
    ("S4", "阿灯", "这块手表是你的吗？", "Is this watch yours?", "036230eba8", 1.128),
    ("S4", "呱掌柜", "是我爷爷的。", "It was my grandfather's.", "62355d2c5a", 1.224),
    ("S4", "阿灯", "多少钱买的？", "How much did it cost?", "7d8c87ecea", 0.96),
    ("S4", "呱掌柜", "三千多块！", "Over three thousand!", "f1b5ebab86", 1.464),
    ("S5", "小砚", "你听，是不是送报纸的来了？", "Listen, is that the newspaper delivery?", "93ada5d157", 2.664),
    ("S5", "阿灯", "我看一下。不是，是送牛奶的。", "Let me take a look. No, it's the milk delivery.", "bf45c8a0f4", 2.448),
    ("S5", "鹿鸣", "小鹅还带来了一张报纸。", "The little goose also brought a newspaper.", "0ac420a5bc", 1.872),
    ("S6", "阿灯", "「撑伞人……昨夜出现在夜市。」",
     "\"The umbrella man… appeared at the night market last night.\"", "44b2ad6644", 2.664),
    ("S7", "小砚", "这是谁的房间？", "Whose room is this?", "1feec92c41", 1.632),
    ("S7", "糖画婆婆", ["这是我和我丈夫的。", "旁边那个小的，是阿灯小时候的。"],
     ["This is my husband's and mine.", "The little one next to it was Adeng's when he was small."],
     "b779e8fcd3", 6.648),
    ("S8", "团团", "真漂亮！都是粉色的！", "So pretty! They're all pink!", "6891701e04", 3.072),
    ("S8", "阿灯", "粉色是我最喜欢的颜色。", "Pink is my favorite color.", "eda657b32c", 1.632),
    ("S9a", "阿灯", "我的灯笼，能照出藏起来的字！", "My lantern can light up hidden characters!", "299072ba06", 2.232),
    ("S9a", "小砚", "丝线，加上「工」……是「红」！", "Silk thread, plus \"gōng\"… makes \"hóng\"!", "ccdb7e2479", 3.624),
    ("S9b", "鹿鸣", "那天晚上，夜市找回了「红」。", "That night, the night market found \"hóng\" again.",
     "7020eb014e", 2.448),
    ("S10", "呱掌柜", "左边那个红色的是我的！", "The red one on the left is mine!", "7f284b7119", 2.04),
    ("S10", "阿灯", "是我的！", "It's mine!", "8ada1a30d9", 0.768),
    ("S10", "鹿鸣", "可是，远处的石桥上，一把灰伞慢慢走远了……",
     "But on the stone bridge far away, a grey umbrella slowly walked away…", "d2f26c3a1d", 4.032),
]

# 镜头前的旁白：先停在该镜头的首帧图上讲一句，再接视频，补上场景之间的因果
PRE = {
    "S2": ("3870bffc4f", ("鹿鸣", "宵夜摊上，呱掌柜和阿灯又吵起来了。",
                          "At the late-night snack stall, Shopkeeper Gua and Adeng were arguing again.",
                          "caa703f227", 3.456)),
    "S4": ("ab5000d30e", ("鹿鸣", ["呱掌柜赶紧拿出他最宝贝的手表。", "手表也变灰了！"],
                          ["Shopkeeper Gua quickly took out his most treasured watch.", "It had turned grey too!"],
                          "1407527e4a", 4.272)),
    "S7": ("a4f6873658", ("鹿鸣", ["撑伞人来过，颜色就没了。", "阿灯想起来：奶奶的小屋里，还有颜色！"],
                          ["Wherever the umbrella man goes, the colors vanish.",
                           "Then Adeng remembered: Grandma's little room still had color!"],
                          "72c204a99e", 5.64)),
    "S9a": ("8d2296ee3c", ("鹿鸣", ["整个夜市，只有这间小屋还有颜色。", "阿灯举起了他的红灯笼。"],
                           ["In the whole night market, only this little room still had color.",
                            "Adeng raised his red lantern."],
                           "6f9a9ee1f3", 5.064)),
}
PRE_LEAD = 0.4
PRE_TAIL = 0.8

# 镜头：(视频素材, 时长秒, 各句在镜头内的起点秒)
SHOTS = {
    "S1": ("310a2ac7-2f6c-42b4-9e5d-129f4881363b", 10, [1.8]),
    "S2": ("3b3e577d-994d-4e30-9b88-40bfc4672185", 13, [1.0, 3.5, 6.2, 9.1]),
    "S3": ("e2ac2629-3f04-459a-87c2-d91d7a49fc14", 6, [2.2]),
    "S4": ("f135a382-5ae7-4868-83eb-74e5444b1f83", 9, [0.8, 2.6, 4.5, 6.1]),
    "S5": ("b26e274e-ea68-492b-9d0a-f2835323bc5a", 11, [1.5, 5.0, 7.8]),
    "S6": ("f610738c-e031-4361-8f3b-dc46fdc5a48e", 7, [2.5]),
    "S7": ("6d35848b-749a-463c-b87d-9c789a1d66a5", 11, [2.0, 4.1]),
    "S8": ("e17283ba-c1c3-426b-84ce-12f0732ba547", 8, [0.8, 5.0]),
    "S9a": ("1818dcda-79cf-416b-bd5a-995aa8a89cd3", 10, [1.0, 5.6]),
    "S9b": ("4818e076-7e42-4dbf-adeb-0e102b3c1c25", 8, [4.0]),
    "S10": ("acd422c2-48f9-4ace-b5ea-ca3239c27325", 10, [0.2, 2.3, 3.8]),
}

TITLE = 90
END = 90


def f(sec):
    return round(sec * FPS)


def build():
    adds = []
    adds.append(dict(type="motion-graphic", assetId=CARD, trackId="V1", fromFrame=0, durationInFrames=TITLE,
                     propertyOverrides=dict(mode="title", badge="墨灵记 · 第五集", title="灯兔夜市",
                                            titlePy=py("灯兔夜市"),
                                            titleEn="Episode 5 · The Lantern Rabbit's Night Market",
                                            note="HSK 2 · 第三课《左边那个红色的是我的》")))
    t = TITLE
    subs = []
    li = 0
    def say(st, who, zh, en, va, vs):
        adds.append(dict(type="audio", assetId=va, trackId="A1", fromFrame=st,
                         durationInFrames=int(vs * FPS)))
        if isinstance(zh, str):
            subs.append([st, f(vs) + 9, who + "：" + zh, en])
        else:
            # 长句一行放不下，按字数比例拆成连续两条字幕
            n = sum(len(z) for z in zh)
            cut = st + f(vs * len(zh[0]) / n)
            subs.append([st, cut - st + 1, who + "：" + zh[0], en[0]])
            subs.append([cut, st + f(vs) + 9 - cut, who + "：" + zh[1], en[1]])

    for shot, (asset, dur, offs) in SHOTS.items():
        if shot in PRE:
            still, line = PRE[shot]
            pd = f(PRE_LEAD + line[4] + PRE_TAIL)
            adds.append(dict(type="image", assetId=still, trackId="V1", fromFrame=t, durationInFrames=pd, fit="cover"))
            say(t + f(PRE_LEAD), *line)
            t += pd
        adds.append(dict(type="video", assetId=asset, trackId="V1", fromFrame=t,
                         durationInFrames=f(dur), fit="cover", decibelAdjustment=-60))
        for off in offs:
            s, who, zh, en, va, vs = LINES[li]
            assert s == shot, (s, shot)
            assert off + vs <= dur, (shot, off, vs)
            say(t + f(off), who, zh, en, va, vs)
            li += 1
        t += f(dur)
    assert li == len(LINES)
    for i, s in enumerate(subs):
        nxt = subs[i + 1][0] if i + 1 < len(subs) else t
        s[1] = max(min(s[1], nxt - s[0] - 1), 30)
        adds.append(dict(type="motion-graphic", assetId=SUB, trackId="V2", fromFrame=s[0],
                         durationInFrames=s[1], left=340, top=905, width=1240, height=150,
                         propertyOverrides=dict(zh=s[2], en=s[3])))
    adds.append(dict(type="motion-graphic", assetId=CARD, trackId="V1", fromFrame=t, durationInFrames=END,
                     propertyOverrides=dict(mode="title", badge="第五集 · 完", title="下集见",
                                            titlePy=py("下集见"), titleEn="To be continued…",
                                            note="鹿鸣的琵琶为什么没有声音？ · Why is Luming's pipa silent?")))
    t += END
    adds.append(dict(type="audio", assetId=BGM, trackId="A2", fromFrame=0, durationInFrames=t,
                     sourceStartFromInSeconds=0, audioFadeIn=1, audioFadeOut=2.5))
    return dict(adds=adds, total=t)


if __name__ == "__main__":
    print(json.dumps(build(), ensure_ascii=False))
