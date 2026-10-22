# 第 5 集墨灵小课堂讲稿（蕾姐数字人声音，中英双语）。内容依据《HSK标准教程2》第 3 课课本、教师用书（ref/L03-ref.md）。
# 每行：(朗读稿, 中文字幕, 英文字幕)。一行生成一条配音。
VOCAB = [("手表", "watch"), ("千", "thousand"), ("报纸", "newspaper"), ("送", "to send, to deliver"),
         ("一下", "(after a verb) a short action"), ("牛奶", "milk"), ("房间", "room"), ("丈夫", "husband"),
         ("旁边", "beside"), ("真", "really, indeed"), ("粉色", "pink"), ("颜色", "color"), ("左边", "left side"),
         ("红色", "red")]

S = {
"open": [
 ("大家好，我是蕾姐！Welcome to the Ink Spirits Mini Lesson.", "大家好，我是蕾姐！欢迎来到墨灵小课堂。", "Hi, I'm Lei Jie! Welcome to the Ink Spirits Mini Lesson."),
 ("今天我们学HSK二级第三课：左边那个红色的是我的。The red one on the left is mine.", "今天学 HSK 二级第三课：《左边那个红色的是我的》。", "Today: HSK 2, Lesson 3 — The red one on the left is mine."),
 ("这一集，小砚找回的字是：红，红色的红。", "这一集，小砚找回的字是「红」，红色的红。", "In this episode, Xiao Yan found the character 红, as in 红色 (red)."),
 ("Today: fourteen new words, three grammar points, and some characters. 我们开始吧！", "今天：十四个生词、三个语言点，还有汉字。我们开始吧！", "Today: 14 new words, 3 grammar points, and some characters. Let's go!"),
],
"vocab": [("First, new words. Listen, then repeat after me. 听一遍，跟我读一遍。", "先来读生词。听一遍，跟我读一遍。", "First, new words. Listen, then repeat after me.")]
   + [(f"{w}，{e.split(',')[0].replace('(after a verb) ', '')}，{w}。", w, e) for w, e in VOCAB],
"g1": [
 ("Grammar point one. 的字短语。The 的 phrase.", "语言点一：「的」字短语。", "Grammar point 1: the 的 phrase."),
 ("A pronoun, an adjective or a verb, plus 的, works like a noun. The noun after it is left out.", "代词、形容词、动词 + 的，相当于省略了中心语的名词。", "Pronoun / adjective / verb + 的 works like a noun — the noun after it is left out."),
 ("这本书不是我的。我的，就是我的书。", "这本书不是我的。（= 我的书）", "This book isn't mine. (我的 = my book)"),
 ("这个杯子是昨天买的。昨天买的，就是昨天买的杯子。", "这个杯子是昨天买的。（= 昨天买的杯子）", "This cup was bought yesterday. (= the cup bought yesterday)"),
 ("这块手表是你的吗？你的，就是你的手表。", "这块手表是你的吗？（= 你的手表）", "Is this watch yours? (你的 = your watch)"),
 ("Your turn. 你要红色的还是蓝色的？", "你来说：你要红色的还是蓝色的？", "Your turn: Do you want the red one or the blue one?"),
 ("我要红色的。", "我要红色的。", "I want the red one."),
],
"g2": [
 ("Grammar point two. 动词加一下。Verb plus 一下.", "语言点二：动词 + 一下。", "Grammar point 2: verb + 一下."),
 ("It means a short action — do something for a moment, or just try it.", "表示一次短暂的动作。", "It shows a short action: do something briefly, or give it a try."),
 ("我看一下。Let me take a look.", "我看一下。", "Let me take a look."),
 ("你休息一下吧。Take a little rest.", "你休息一下吧。", "Take a little rest."),
 ("我问一下老师。Let me ask the teacher.", "我问一下老师。", "Let me ask the teacher."),
 ("Your turn. 下课了，我们可以……？", "你来说：下课了，我们可以……？", "Your turn: Class is over. We can…?"),
 ("休息一下。", "休息一下。", "Take a break."),
],
"g3": [
 ("Grammar point three. 真，加形容词。真 plus an adjective.", "语言点三：真 + 形容词。", "Grammar point 3: 真 + adjective."),
 ("It shows strong feeling. It means really, or so.", "表示感叹的语气，意思是的确、实在。", "It expresses an exclamation: really, so."),
 ("你真好！You're so nice!", "你真好！", "You're so nice!"),
 ("今天天气真好！The weather is really nice today!", "今天天气真好！", "The weather is really nice today!"),
 ("你女儿的房间真漂亮！Your daughter's room is so pretty!", "你女儿的房间真漂亮！", "Your daughter's room is so pretty!"),
 ("Your turn. 今天天气怎么样？", "你来说：今天天气怎么样？", "Your turn: How's the weather today?"),
 ("今天天气真好！", "今天天气真好！", "The weather is really nice today!"),
],
"hong": [
 ("Now, characters. First, the character of this episode. 红，红色的红。", "汉字时间。先看本集的字：「红」，红色的红。", "Characters! First, this episode's character: 红, as in 红色 (red)."),
 ("Long ago, people drew silk thread like this: twisted threads.", "很久以前，人们这样画丝线：拧在一起的线。", "Long ago, silk thread was drawn like this: twisted strands."),
 ("Today, it sits on the left. 绞丝旁。", "今天它在左边，叫「绞丝旁」。", "Today it sits on the left: the silk radical 纟."),
 ("On the right is 工. It gives the sound. 工，红。", "右边是「工」，表示读音：工，红。", "On the right, 工 gives the sound: gōng, hóng."),
 ("People dyed silk thread red. So, silk plus 工 makes 红。", "古人把丝线染红，就有了「红」。", "Silk dyed red — 纟 + 工 makes 红."),
 ("报纸的纸，也有绞丝旁。纸，红。", "报纸的「纸」也有绞丝旁：纸，红。", "纸 in 报纸 (newspaper) has the silk radical too."),
],
"single": [
 ("Next, three single-component characters from the textbook.", "再看课本里的三个独体字。", "Next: three single-component characters from the textbook."),
 ("手，手表的手。", "「手」，手表的手。", "手, as in 手表 (watch)."),
 ("It is a picture of a hand, with five fingers.", "字形是一只手的形象。", "It's a picture of a hand."),
 ("丈，丈夫的丈。", "「丈」，丈夫的丈。", "丈, as in 丈夫 (husband)."),
 ("Long ago, it showed an old man holding a walking stick. Now it is a unit of length.", "本义是手持拐杖的老者，现在是长度单位。", "It once showed an old man with a walking stick; now it's a unit of length."),
 ("夫，丈夫的夫。", "「夫」，丈夫的夫。", "夫, as in 丈夫 (husband)."),
 ("It first meant a grown man. Now it often means a man in the family, a husband.", "本义是成年男子，现在多指家庭中的男性、丈夫。", "It first meant a grown man; now it often means a husband."),
],
"radical": [
 ("And two radicals. 木字旁。", "两个偏旁。先看「木字旁」。", "Two radicals. First: the wood radical 木."),
 ("Characters with 木 are usually about plants and wood. 杯子的杯，椅子的椅。", "木字旁的字一般和植物有关：杯、椅。", "木 is usually about plants and wood: 杯 (cup), 椅 (chair)."),
 ("立刀旁。", "再看「立刀旁」。", "Next: the knife radical 刂."),
 ("Characters with this radical are usually about knives. 别，到。", "立刀旁的字一般和刀有关：别、到。", "刂 is usually about knives: 别, 到."),
],
"quiz": [
 ("Quiz time! 小测试，准备好了吗？", "小测试，准备好了吗？", "Quiz time! Ready?"),
 ("Question one. 外面下雨，他们都在什么里呢？A，房间。B，报纸。C，牛奶。", "第一题：外面下雨，他们都在 ___ 里呢。", "Q1: It's raining outside. They're all in the ___."),
 ("答案是A，房间。外面下雨，他们都在房间里呢。", "答案是 A：房间。", "The answer is A: 房间 (room)."),
 ("Question two. 李先生的手表很好，三什么多块钱？A，千。B，真。C，一下。", "第二题：李先生的手表很好，三 ___ 多块钱。", "Q2: Mr. Li's watch is very nice — more than three ___ yuan."),
 ("答案是A，千。三千多块钱。", "答案是 A：千。三千多块钱。", "The answer is A: 千 (thousand)."),
 ("Question three. 小李说：左边那个红色的是我的。小李的自行车是什么颜色的？A，红色。B，黑色。C，白色。", "第三题：小李的自行车是什么颜色的？", "Q3: What color is Xiao Li's bike?"),
 ("答案是A，红色。", "答案是 A：红色。", "The answer is A: red."),
],
"end": [
 ("Today we learned the 的 phrase, verb plus 一下, and 真 plus an adjective.", "今天我们学了：“的”字短语、动词 + 一下、真 + 形容词。", "Today: the 的 phrase, verb + 一下, and 真 + adjective."),
 ("Now, describe your home. 你家有几个房间？哪个是你的？", "说一说：你家有几个房间？哪个是你的？", "Describe your home: How many rooms? Which one is yours?"),
 ("Go and tell 小砚! 下一课见，拜拜！", "去和小砚说一说吧！下一课见，拜拜！", "Go and tell Xiao Yan! See you next lesson. Bye!"),
],
}
