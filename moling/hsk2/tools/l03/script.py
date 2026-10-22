# 第 5 集墨灵小课堂讲稿（蕾姐，本地 TTS）。每行：(朗读稿, 中文字幕, 英文字幕)
# 朗读稿里「小砚」写作「小燕」（同音，读得准）；字幕仍写「小砚」。
VOCAB = [("手表", "watch"), ("千", "thousand"), ("报纸", "newspaper"), ("送", "to deliver"), ("一下", "a bit (after a verb)"),
         ("牛奶", "milk"), ("房间", "room"), ("丈夫", "husband"), ("旁边", "beside"), ("真", "really"),
         ("粉色", "pink"), ("颜色", "color"), ("左边", "left side"), ("红色", "red")]

S = {
0: [
 ("大家好，我是蕾姐！", "大家好，我是蕾姐！", "Hi everyone, I'm Lei Jie!"),
 ("Welcome to the Ink Spirits Mini Lesson. 墨灵小课堂。", "欢迎来到墨灵小课堂。", "Welcome to the Ink Spirits Mini Lesson."),
 ("Today, HSK 2, Lesson 3. 左边那个红色的是我的。 The red one on the left is mine.", "今天学 HSK 2 第 3 课：《左边那个红色的是我的》。", "Today: HSK 2, Lesson 3 — The red one on the left is mine."),
 ("In this episode, 小燕 found a character. 红。红色的红。 Red.", "这一集，小砚找回的字是「红」，红色的红。", "In this episode, Xiao Yan found the character 红, as in 红色 (red)."),
],
1: [("First, new words. Listen, then repeat after me.", "先来读生词。听一遍，跟我读一遍。", "First, new words. Listen, then repeat after me.")]
   + [(w + "。", w, e) for w, e in VOCAB],
2: [
 ("The most important character today. 红。红色的红。", "今天最重要的字是「红」，红色的红。", "The most important character today is 红, as in 红色 (red)."),
 ("Long ago, people drew silk thread like this. Twisted threads.", "很久以前，人们这样画丝线：拧在一起的线。", "Long ago, silk thread was drawn like this: twisted strands."),
 ("Today, it stands on the left. 绞丝旁。", "今天它在左边，叫「绞丝旁」。", "Today it sits on the left: the silk radical 纟."),
 ("On the right. 工。工人的工。 It gives the sound.", "右边是「工」，工人的工，告诉我们读音。", "On the right is 工, which gives the sound."),
 ("工，红。 Sound alike, right?", "工，红，像不像？", "gōng, hóng — sound alike, right?"),
 ("People dyed silk thread red. Silk, plus 工, makes 红。", "古人把丝线染红，就有了「红」。", "People dyed silk red — silk + 工 makes 红."),
 ("Characters with this part are about thread and cloth. 线，纸，红。", "带「纟」的字常和线、布有关：线、纸、红。", "Characters with 纟 are about thread and cloth: 线, 纸, 红."),
 ("左边那个红色的是我的。 The red one on the left is mine.", "左边那个红色的是我的。", "The red one on the left is mine."),
],
3: [
 ("Two more characters.", "再看两个字。", "Two more characters."),
 ("First one. 房。房间的房。", "第一个：「房」，房间的房。", "First: 房, as in 房间 (room)."),
 ("On top is 户。 A door.", "上面是「户」，一扇门。", "On top is 户 — a door."),
 ("Below is 方。 It gives the sound. 方，房。", "下面是「方」，告诉我们读音：方，房。", "Below is 方, which gives the sound: fāng, fáng."),
 ("A place with a door is a room. 房间。", "有门的地方，就是房间。", "A place with a door — that's a room, 房间."),
 ("Second one. 牛。牛奶的牛。", "第二个：「牛」，牛奶的牛。", "Second: 牛, as in 牛奶 (milk)."),
 ("It's an ox head, with two curved horns.", "「牛」画的是牛头和两只弯弯的角。", "牛 is drawn as an ox head with two curved horns."),
 ("牛奶。 Milk. 送牛奶的。 The milk delivery person.", "牛奶，送牛奶的。", "牛奶 milk · 送牛奶的 the milk delivery person."),
],
4: [
 ("Two sentence patterns.", "再学两个句型。", "Two sentence patterns."),
 ("One. 的。 Something, plus 的, means the one that is something.", "第一个：「的」字短语。", "One: the 的 phrase — \"the one that…\""),
 ("红色的。 The red one. 送报纸的。 The newspaper delivery person.", "红色的，送报纸的。", "红色的 the red one · 送报纸的 the newspaper delivery person."),
 ("左边那个红色的是我的。", "左边那个红色的是我的。", "The red one on the left is mine."),
 ("Two. A verb, plus 一下。 Do something for a moment.", "第二个：动词 + 一下。", "Two: verb + 一下 — do something briefly."),
 ("我看一下。 Let me take a look.", "我看一下。", "Let me take a look."),
 ("Your turn! 你的杯子是什么颜色的？", "你来说：你的杯子是什么颜色的？", "Your turn: What color is your cup?"),
],
5: [
 ("Quiz time! Ready?", "小测试，准备好了吗？", "Quiz time! Ready?"),
 ("Question one. 纟，和什么有关？ A，水。B，丝线。C，脚。", "第一题：「纟」和什么有关？", "Q1: What is 纟 related to?"),
 ("答案是B，丝线。", "答案是 B：丝线。", "The answer is B: silk thread."),
 ("Question two. Fill in the blank. 左边那个红色的，什么，我的？ A，是。B，有。C，在。", "第二题：左边那个红色的 ___ 我的。", "Q2: The red one on the left ___ mine."),
 ("答案是A。左边那个红色的是我的。", "答案是 A：左边那个红色的是我的。", "The answer is A: The red one on the left is mine."),
 ("Question three. 我看，什么？ A，一下。B，一起。C，一个。", "第三题：我看 ___。", "Q3: 我看 ___ (Let me take a look)."),
 ("答案是A。我看一下。", "答案是 A：我看一下。", "The answer is A: 我看一下."),
],
6: [
 ("你最喜欢什么颜色？为什么？ What's your favorite color? Why?", "你最喜欢什么颜色？为什么？", "What's your favorite color? Why?"),
 ("Go and tell Xiao Yan! 和小燕说一说吧！", "去和小砚说一说吧！", "Go and tell Xiao Yan!"),
 ("See you next lesson. 拜拜！", "我们下一课见，拜拜！", "See you next lesson. Bye!"),
],
}
