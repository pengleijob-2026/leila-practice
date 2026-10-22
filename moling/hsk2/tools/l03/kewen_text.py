"""第 5 集课文：HSK2 第 3 课原文（本地配音）+ 故事里的对应台词（豆包配音素材）。"""
# 本地 kokoro 音色编号（3–57 中文女声，58–102 中文男声）
SID = {"阿灯": 70, "呱掌柜": 60, "小砚": 3, "糖画婆婆": 30}
SPEED = {"糖画婆婆": 0.8}

INTRO = ["大家好，我是蕾姐。", "今天我们读第三课的课文：左边那个红色的是我的。",
         "Listen to each line, then read it aloud. 听一句，跟读一句。"]
OUTRO = ["读完啦！你最喜欢哪一句？", "Great job! Which line do you like best?"]

# lines: (角色标记, 角色, 中文(| 为换行), 英文, 高亮)
# story: (角色, 中文, 英文, 高亮, 豆包配音素材, 秒)
TEXTS = [
    dict(n="一", title="在房间", en="In the Room", shot="s04", lines=[
        ("A", "阿灯", "这块手表是你的吗？", "Is this watch yours?", "手表 你的"),
        ("B", "呱掌柜", "不是我的，|是我爸爸的。", "It's not mine. It's my dad's.", "我的 我爸爸的"),
        ("A", "阿灯", "多少钱买的？", "How much did it cost?", "多少钱"),
        ("B", "呱掌柜", "三千多块。", "Over three thousand yuan.", "三千多"),
    ], story=[
        ("阿灯", "这块手表是你的吗？", "Is this watch yours?", "手表 你的", "036230eba8", 1.128),
        ("呱掌柜", "是我爷爷的。", "It was my grandfather's.", "我爷爷的", "62355d2c5a", 1.224),
        ("阿灯", "多少钱买的？", "How much did it cost?", "多少钱", "7d8c87ecea", 0.96),
        ("呱掌柜", "三千多块！", "Over three thousand!", "三千多", "f1b5ebab86", 1.464),
    ]),
    dict(n="二", title="在家里", en="At Home", shot="s05", lines=[
        ("A", "小砚", "这是今天早上的报纸吗？", "Is this this morning's newspaper?", "报纸"),
        ("B", "阿灯", "不是，是昨天的。", "No, it's yesterday's.", "昨天的"),
        ("A", "小砚", "你听，|是不是送报纸的来了？", "Listen, is that the newspaper delivery?", "是不是 送报纸的"),
        ("B", "阿灯", "我看一下。|不是，是送牛奶的。", "Let me take a look. No, it's the milk delivery.", "一下 送牛奶的"),
    ], story=[
        ("小砚", "你听，|是不是送报纸的来了？", "Listen, is that the newspaper delivery?", "是不是 送报纸的", "93ada5d157", 2.664),
        ("阿灯", "我看一下。|不是，是送牛奶的。", "Let me take a look. No, it's the milk delivery.", "一下 送牛奶的", "bf45c8a0f4", 2.448),
    ]),
    dict(n="三", title="在家里", en="At Home", shot="s07", lines=[
        ("A", "小砚", "这是谁的房间？", "Whose room is this?", "房间"),
        ("B", "糖画婆婆", "这是我和我丈夫的，|旁边那个小的房间|是我女儿的。", "This is my husband's and mine. The small room next to it is my daughter's.", "丈夫 旁边"),
        ("A", "小砚", "你女儿的房间真漂亮！|都是粉色的。", "Your daughter's room is really pretty! It's all pink.", "真 粉色的"),
        ("B", "糖画婆婆", "是啊，粉色是|我女儿最喜欢的颜色。", "Yes, pink is my daughter's favorite color.", "粉色 颜色"),
    ], story=[
        ("小砚", "这是谁的房间？", "Whose room is this?", "房间", "1feec92c41", 1.632),
        ("糖画婆婆", "这是我和我丈夫的。|旁边那个小的，|是阿灯小时候的。", "This is my husband's and mine. The little one next to it was Adeng's when he was small.", "丈夫 旁边", "b779e8fcd3", 6.648),
        ("团团", "真漂亮！|都是粉色的！", "So pretty! They're all pink!", "真 粉色的", "6891701e04", 3.072),
        ("阿灯", "粉色是|我最喜欢的颜色。", "Pink is my favorite color.", "粉色 颜色", "eda657b32c", 1.632),
    ]),
    dict(n="四", title="在办公室", en="In the Office", shot="s02", lines=[
        ("A", "呱掌柜", "你看见我的杯子了吗？", "Have you seen my cup?", "杯子"),
        ("B", "阿灯", "这里有几个杯子，|哪个是你的？", "There are a few cups here. Which one is yours?", "哪个 你的"),
        ("A", "呱掌柜", "左边那个红色的|是我的。", "The red one on the left is mine.", "左边 红色的"),
        ("B", "阿灯", "给你。", "Here you are.", ""),
    ], story=[
        ("呱掌柜", "你看见我的杯子了吗？", "Have you seen my cup?", "杯子", "159f7ff569", 1.872),
        ("阿灯", "这里有几个杯子，|哪个是你的？", "There are a few cups here. Which one is yours?", "哪个 你的", "ec632fc9a2", 2.064),
        ("呱掌柜", "左边那个红色的|是我的！", "The red one on the left is mine!", "左边 红色的", "62d048a7f7", 2.256),
    ]),
]
