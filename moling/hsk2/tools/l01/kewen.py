"""第 3 集课文视频：逐句课文（角色朗读 + 跟读停顿）+「故事里」对照。

输出 ChatCut edit_item 的 adds 列表（JSON）。用法：python kewen.py > adds.json
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from py import py  # noqa: E402

FPS = 30
TL = "83f6c91bcb"
MG = "a64f09c26d"
LOGO = "476e1866"
FRAME = dict(fit="cover", left=110, top=230, width=760, height=428)

# (角色标记, 角色, 中文(| 为换行), 英文, 高亮, 配音素材, 时长ms)
TEXTS = [
    dict(n="一", title="在学校", en="At School", key="S5", kf="15c15240", lines=[
        ("A", "团团", "我要去北京旅游，|你觉得什么时候去最好？", "I want to travel to Beijing. When do you think is the best time to go?", "什么时候 最好", "c2843a2f31", 4524),
        ("B", "小砚", "九月去北京旅游最好。", "September is the best time to visit Beijing.", "最好", "6b5e867172", 2381),
        ("A", "团团", "为什么？", "Why?", "为什么", "ba8ea8f22d", 1000),
        ("B", "小砚", "九月的北京天气|不冷也不热。", "In September, Beijing's weather is neither cold nor hot.", "不冷也不热", "0d63a4e232", 3095),
    ], story=[
        ("呱掌柜", "一个字，一个价！|先回答我：|什么时候来春市最好？", "One character, one price! First, tell me: when is the best time to come to the Spring Market?", "什么时候 最好", "df0c6c11f1", 5480),
        ("小砚", "三月来春市最好！", "March is the best time!", "最好", "e813ba4abb", 1900),
        ("呱掌柜", "为什么？", "Why?", "为什么", "1f10b70843", 1000),
        ("小砚", "三月的春市，|不冷也不热，|花也最多！", "In March it's neither cold nor hot, and there are the most flowers too!", "不冷也不热 最", "1c61a17d7c", 4050),
    ]),
    dict(n="二", title="看照片", en="Looking at Photos", key="S7", kf="8f1adc53", lines=[
        ("A", "呱掌柜", "你喜欢什么运动？", "What sport do you like?", "什么运动", "d8512f343b", 1905),
        ("B", "小砚", "我最喜欢踢足球。", "I like playing football the most.", "最喜欢 踢足球", "3fa7c49379", 1905),
        ("A", "呱掌柜", "下午我们|一起去踢足球吧。", "Let's go and play football together this afternoon.", "一起 吧", "695b415e0c", 2857),
        ("B", "小砚", "好啊！", "OK!", "", "93826cb57c", 1000),
    ], story=[
        ("呱掌柜", "第二个价：|你们喜欢什么运动？", "Second price: what sport do you like?", "什么运动", "ce8eab29d7", 3330),
        ("小砚", "我最喜欢踢足球！", "I like playing football the most!", "最喜欢 踢足球", "11a74fd880", 1900),
        ("呱掌柜", "好！下午我们|一起去踢足球吧。|赢了，睛字就给你们。", "Great! Let's play football together this afternoon. Win, and the character is yours.", "一起 吧", "ba67e3ccfa", 5710),
    ]),
    dict(n="三", title="在家里", en="At Home", key="S6", kf="b0755d75", lines=[
        ("A", "呱掌柜", "我们要不要买|几个新的椅子？", "Shall we buy a few new chairs?", "要不要 新的", "28bcc49045", 3095),
        ("B", "大绒", "好啊。|什么时候去买？", "Sure. When shall we go and buy them?", "什么时候", "841f008ca8", 2381),
        ("A", "呱掌柜", "明天下午怎么样？|你明天几点能回来？", "How about tomorrow afternoon? What time can you be back tomorrow?", "怎么样 几点", "3f178e10cd", 4048),
        ("B", "大绒", "三点多。", "A little after three.", "多", "9ddd2b0da8", 1000),
    ], story=[
        ("呱掌柜", "我的椅子！|你要赔我几个新的椅子！", "My chair! You owe me a few new chairs!", "要 新的", "8bfecd5b6e", 3810),
        ("大绒", "慢——慢——来。", "Take… it… slow.", "", "888d2a381c", 1900),
    ]),
    dict(n="四", title="在家里", en="At Home", key="S4", kf="61d23dc9", lines=[
        ("A", "团团", "桌子下面有个猫。", "There's a cat under the table.", "下面", "ee59c9294a", 1905),
        ("B", "呱掌柜", "那是我的猫，|它叫花花。", "That's my cat. Its name is Huahua.", "它", "0f2c093571", 2619),
        ("A", "团团", "它很漂亮。", "It's very pretty.", "漂亮", "5965f738df", 1190),
        ("B", "呱掌柜", "是啊，|我觉得它的眼睛最漂亮。", "Yes. I think its eyes are the prettiest.", "觉得 眼睛 最", "ecad407bd0", 3333),
        ("A", "团团", "它多大了？", "How old is it?", "多大", "47f8db7dd2", 1190),
        ("B", "呱掌柜", "六个多月。", "A little over six months.", "多", "d24584266a", 1190),
    ], story=[
        ("团团", "桌子下面有个猫！", "There's a cat under the table!", "下面", "213cb7ba29", 1900),
        ("呱掌柜", "那是我的猫，|它叫花花。", "That's my cat. Its name is Huahua.", "它", "477ede37b2", 2620),
        ("呱掌柜", "以前，|我觉得它的眼睛最漂亮。", "I used to think its eyes were the most beautiful.", "觉得 眼睛 最", "fcbd1e0f3d", 3330),
        ("团团", "它多大了？", "How old is it?", "多大", "a70f4c4985", 1190),
        ("呱掌柜", "六百多岁。", "Over six hundred.", "多", "d0a3f3603a", 1190),
    ]),
]

INTRO = ("e2cce0221d", 15203)
OUTRO = ("17978616ef", 9300)


def fr(ms):
    return round(ms / 1000 * FPS)


def card(start, dur, **props):
    return dict(timelineId=TL, type="motion-graphic", assetId=MG, trackId="V1",
                fromFrame=start, durationInFrames=dur, propertyOverrides=props)


def voice(start, asset, ms, track="A1"):
    return dict(timelineId=TL, type="audio", assetId=asset, trackId=track,
                fromFrame=start, durationInFrames=fr(ms))


def build():
    adds, pics, echoes = [], [], []
    t = 0
    d = fr(INTRO[1]) + 30
    adds.append(card(t, d, mode="title", badge="第一课 · 课文", title="九月去北京旅游最好",
                     titlePy=py("九月去北京旅游最好"), titleEn="Lesson 1 · September Is the Best Time to Visit Beijing",
                     note="听一句，跟读一句 · Listen, then read aloud"))
    adds.append(voice(t + 15, *INTRO))
    t += d
    for tx in TEXTS:
        title = "课文" + tx["n"] + " · " + tx["title"]
        tpy = py("课文" + tx["n"] + tx["title"])
        ten = "Text " + str("一二三四".index(tx["n"]) + 1) + " · " + tx["en"]
        adds.append(card(t, 90, mode="title", badge="课文" + tx["n"], title=title, titlePy=tpy, titleEn=ten,
                         note="听一句，跟读一句 · Listen, then read aloud"))
        t += 90
        p0 = t
        n = len(tx["lines"])
        for i, (role, who, zh, en, hl, asset, ms) in enumerate(tx["lines"], 1):
            v = fr(ms)
            gap = max(60, v) + 15
            dur = 9 + v + gap
            adds.append(card(t, dur, mode="line", title=title, titlePy=tpy, titleEn=ten, idx=i, total=n,
                             role=role, speaker=who, zh=zh, py=py(zh.replace("|", "")), en=en, hl=hl,
                             echoAt=round((9 + v + 6) / FPS, 2)))
            adds.append(voice(t + 9, asset, ms))
            t += dur
        pics.append(dict(timelineId=TL, type="image", assetId=tx["kf"], trackId="V2",
                         fromFrame=p0, durationInFrames=t - p0, **FRAME))
        e0 = t
        n = len(tx["story"])
        for i, (who, zh, en, hl, asset, ms) in enumerate(tx["story"], 1):
            v = fr(ms)
            dur = 8 + v + 18
            adds.append(card(t, dur, mode="story", title=title, titlePy=tpy, titleEn=ten, idx=i, total=n,
                             role="", speaker=who, zh=zh, py=py(zh.replace("|", "")), en=en, hl=hl, echoAt=0))
            adds.append(voice(t + 8, asset, ms))
            t += dur
        echoes.append(dict(shot=tx["key"], fromFrame=e0, durationInFrames=t - e0))
    d = fr(OUTRO[1]) + 45
    adds.append(card(t, d, mode="title", badge="课文", title="读完啦！", titlePy=py("读完啦"),
                     titleEn="Great job!", note="你最喜欢哪一句？ · Which line do you like best?"))
    adds.append(voice(t + 15, *OUTRO))
    t += d
    adds.append(dict(timelineId=TL, type="image", assetId=LOGO, trackId="V3", fromFrame=0, durationInFrames=t,
                     left=40, top=872, width=176, height=176, fadeIn=0.5))
    return dict(adds=adds, pics=pics, echoes=echoes, total=t)


if __name__ == "__main__":
    print(json.dumps(build(), ensure_ascii=False))
