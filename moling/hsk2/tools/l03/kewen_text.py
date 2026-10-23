"""第 5 集课文：HSK2 第 3 课原文（角色豆包配音，英文照录课本）+ 故事里的对应台词。"""

INTRO = ["大家好，我是蕾姐。", "今天我们读第三课的课文：左边那个红色的是我的。",
         "Listen to each line, then read it aloud. 听一句，跟读一句。"]
OUTRO = ["读完啦！你最喜欢哪一句？", "Great job! Which line do you like best?"]

# lines: (角色标记, 角色, 中文(| 为换行), 英文, 高亮)；配音素材 id 见 VOICE
# story: (角色, 中文, 英文, 高亮, 豆包配音素材, 秒)
TEXTS = [
    dict(n="一", title="在房间", en="In the Room", shot="s04", lines=[
        ("A", "阿灯", "这块手表是你的吗？", "Is this watch yours?", "手表 你的"),
        ("B", "呱掌柜", "不是我的。|是我爸爸的。", "No, it isn't. It's my father's.", "我的 我爸爸的"),
        ("A", "阿灯", "多少钱买的？", "How much is it?", "多少钱"),
        ("B", "呱掌柜", "三千多块。", "More than 3,000 yuan.", "三千多"),
    ], story=[
        ("阿灯", "这块手表是你的吗？", "Is this watch yours?", "手表 你的", "036230eba8", 1.128),
        ("呱掌柜", "是我爷爷的。", "It was my grandfather's.", "我爷爷的", "62355d2c5a", 1.224),
        ("阿灯", "多少钱买的？", "How much did it cost?", "多少钱", "7d8c87ecea", 0.96),
        ("呱掌柜", "三千多块！", "Over three thousand!", "三千多", "f1b5ebab86", 1.464),
    ]),
    dict(n="二", title="在家里", en="At Home", shot="s05", lines=[
        ("A", "小砚", "这是今天早上的报纸吗？", "Is it this morning's newspaper?", "报纸"),
        ("B", "阿灯", "不是，是昨天的。", "No, it isn't. It's yesterday's.", "昨天的"),
        ("A", "小砚", "你听，|是不是送报纸的来了？", "Listen. Is that the man who delivers newspaper?", "是不是 送报纸的"),
        ("B", "阿灯", "我看一下。|不是，是送牛奶的。", "Let me see. No, it's the milkman.", "一下 送牛奶的"),
    ], story=[
        ("小砚", "你听，|是不是送报纸的来了？", "Listen, is that the newspaper delivery?", "是不是 送报纸的", "93ada5d157", 2.664),
        ("阿灯", "我看一下。|不是，是送牛奶的。", "Let me take a look. No, it's the milk delivery.", "一下 送牛奶的", "bf45c8a0f4", 2.448),
    ]),
    dict(n="三", title="在家里", en="At Home", shot="s07", lines=[
        ("A", "小砚", "这是谁的房间？", "Whose room is this?", "房间"),
        ("B", "糖画婆婆", "这是我和我丈夫的，|旁边那个小的房间是我女儿的。", "It's my husband's and mine. The small one beside it is my daughter's.", "丈夫 旁边"),
        ("A", "小砚", "你女儿的房间真漂亮！|都是粉色的。", "Your daughter's room is so pretty! It's all pink.", "真 粉色的"),
        ("B", "糖画婆婆", "是啊，粉色是|我女儿最喜欢的颜色。", "Yes. Pink is her favorite color.", "粉色 颜色"),
    ], story=[
        ("小砚", "这是谁的房间？", "Whose room is this?", "房间", "1feec92c41", 1.632),
        ("糖画婆婆", "这是我和我丈夫的。|旁边那个小的，|是阿灯小时候的。", "This is my husband's and mine. The little one next to it was Adeng's when he was small.", "丈夫 旁边", "b779e8fcd3", 6.648),
        ("团团", "真漂亮！|都是粉色的！", "So pretty! They're all pink!", "真 粉色的", "6891701e04", 3.072),
        ("阿灯", "粉色是|我最喜欢的颜色。", "Pink is my favorite color.", "粉色 颜色", "eda657b32c", 1.632),
    ]),
    dict(n="四", title="在办公室", en="In the Office", shot="s02", lines=[
        ("A", "呱掌柜", "你看见我的杯子了吗？", "Have you seen my cup?", "杯子"),
        ("B", "阿灯", "这里有几个杯子，|哪个是你的？", "Here are a few cups. Which one is yours?", "哪个 你的"),
        ("A", "呱掌柜", "左边那个红色的|是我的。", "The red one on the left is mine.", "左边 红色的"),
        ("B", "阿灯", "给你。", "Here you are.", ""),
    ], story=[
        ("呱掌柜", "你看见我的杯子了吗？", "Have you seen my cup?", "杯子", "159f7ff569", 1.872),
        ("阿灯", "这里有几个杯子，|哪个是你的？", "There are a few cups here. Which one is yours?", "哪个 你的", "ec632fc9a2", 2.064),
        ("呱掌柜", "左边那个红色的|是我的！", "The red one on the left is mine!", "左边 红色的", "62d048a7f7", 2.256),
    ]),
]

# 课文逐句配音：故事里同句复用，其余为新生成的豆包角色配音。(素材 id, 秒)
VOICE = {
    "这块手表是你的吗？": ("036230eba8", 1.128),
    "多少钱买的？": ("7d8c87ecea", 0.96),
    "你听，是不是送报纸的来了？": ("93ada5d157", 2.664),
    "我看一下。不是，是送牛奶的。": ("bf45c8a0f4", 2.448),
    "这是谁的房间？": ("1feec92c41", 1.632),
    "你看见我的杯子了吗？": ("159f7ff569", 1.872),
    "这里有几个杯子，哪个是你的？": ("ec632fc9a2", 2.064),
    "左边那个红色的是我的。": ("62d048a7f7", 2.256),
    "不是我的。是我爸爸的。": ("c47cb451da", 2.04),
    "三千多块。": ("f7f4850ab8", 1.464),
    "这是今天早上的报纸吗？": ("60b9b09dbc", 2.28),
    "不是，是昨天的。": ("ba1c78e7f2", 1.488),
    "这是我和我丈夫的，旁边那个小的房间是我女儿的。": ("29bfe15a59", 6.264),
    "你女儿的房间真漂亮！都是粉色的。": ("6520a08e88", 4.056),
    "是啊，粉色是我女儿最喜欢的颜色。": ("229f78d84f", 5.232),
    "给你。": ("8eb9d6dfe6", 0.6),
}
# 蕾姐（ChatCut 克隆音色）开场 / 结尾
LEI = {"intro": ("8a39482faa", 14.655), "outro": ("2b439eab8a", 6.374)}
