from py import py
TITLE=dict(lesson="HSK 2 · 第 1 课",lessonPy=py("第课"),title="九月去北京旅游最好",titlePy=py("九月去北京旅游最好"),
  titleEn="September is the best time to visit Beijing",episode="《墨灵记》第 3 集 · 呱呱当铺 · 点睛",episodePy=py("墨灵记第集呱呱当铺点睛"),
  episodeEn="The Ink Spirits · Ep. 3 · Guagua Pawnshop · Dotting the Eyes",hanzi="睛",pinyin="jīng",meaning="eye")
VOCAB=[("旅游","to travel"),("觉得","to think, to feel"),("最","most"),("为什么","why"),("也","also, too"),("运动","sport; to exercise"),("踢足球","to play football"),("一起","together"),("要","to want to"),("新","new"),("它","it"),("眼睛","eye")]
INTRO=dict(words=";;".join(f"{w}|{py(w)}|{e}" for w,e in VOCAB))
def N(t,zh,en): return f"{t}|{zh}|{py(zh)}|{en}"
def REL(chars): return ";;".join(f"{c}|{py(c)}|{e}" for c,e in chars)
H_JING=dict(label="汉字精讲 · 本集的字",labelPy=py("汉字精讲本集的字"),labelEn="Character Focus",hanzi="睛",pinyin="jīng",meaning="eye",
  ancient="eye",partA="目",partAPy="mù",partB="青",partBPy="qīng",layout="lr",
  relatedLabel="目字旁 · 和眼睛有关",relatedLabelPy=py("目字旁和眼睛有关"),relatedLabelEn="the eye radical",
  related=REL([("眼","eye"),("睛","eyeball"),("看","to look")]),extra="画龙点睛",extraPy=py("画龙点睛"),extraEn="paint the eyes on a dragon — the finishing touch")
H_TA=dict(label="汉字精讲 · 它",labelPy=py("汉字精讲它"),labelEn="Character Focus",hanzi="它",pinyin="tā",meaning="it",ancient="snake",
  partA="",partB="",partAPy="",partBPy="",tRotate=-1,tCompose=-1,related="",relatedLabel="",tRelated=-1,
  extra="它叫花花。",extraPy=py("它叫花花"),extraEn="Its name is Huahua.")
H_ZU=dict(label="汉字精讲 · 足 → 踢",labelPy=py("汉字精讲足踢"),labelEn="Character Focus",hanzi="足",pinyin="zú",meaning="foot",ancient="foot",
  partA="",partB="",partAPy="",partBPy="",tRotate=-1,tCompose=-1,
  relatedLabel="足字旁 · 和脚有关",relatedLabelPy=py("足字旁和脚有关"),relatedLabelEn="the foot radical",
  related=REL([("踢","kick"),("跑","run"),("跳","jump")]),extra="踢足球！",extraPy=py("踢足球"),extraEn="Play football!")
H_ZUI=dict(label="汉字精讲 · 最",labelPy=py("汉字精讲最"),labelEn="Character Focus",hanzi="最",pinyin="zuì",meaning="most",ancient="none",tAncient=-1,tRotate=-1,
  partA="曰",partAPy="yuē",partB="取",partBPy="qǔ",layout="tb",related="",relatedLabel="",tRelated=-1,
  extra="最好 · 最喜欢",extraPy=py("最好最喜欢"),extraEn="the best · like the most")
PATTERN=dict(p1="什么时候去最好？",p1Py=py("什么时候去最好"),p1En="When is the best time to go?",
  ex1="九月去北京旅游最好。",ex1Py=py("九月去北京旅游最好"),ex1En="September is the best time to visit Beijing.",hl1="最好",
  p2="不 A 也不 B",p2Py=py("不也不"),p2En="neither A nor B",ex2="九月的北京，不冷也不热。",ex2Py=py("九月的北京不冷也不热"),
  ex2En="Beijing in September is neither cold nor hot.",hl2="不 也不",
  prompt="几月去你的国家旅游最好？为什么？",promptPy=py("几月去你的国家旅游最好为什么"),promptEn="Which month is best to visit your country? Why?")
QUIZ=[dict(num="1 / 3",q="哪个字是目字旁？",qPy=py("哪个字是目字旁"),qEn="Which character has the eye radical 目?",a="踢",aPy="tī",aEn="kick",b="睛",bPy="jīng",bEn="eye",c="新",cPy="xīn",cEn="new",answer="B"),
 dict(num="2 / 3",q="「它」最早画的是什么动物？",qPy=py("它最早画的是什么动物"),qEn="What animal was 它 first drawn as?",a="猫",aPy="māo",aEn="cat",b="鱼",bPy="yú",bEn="fish",c="蛇",cPy="shé",cEn="snake",answer="C"),
 dict(num="3 / 3",q="我 ___ 喜欢踢足球。",qPy=py("我喜欢踢足球"),qEn="I ___ like playing football.",a="最",aPy="zuì",aEn="most",b="为什么",bPy=py("为什么"),bEn="why",c="",answer="A")]
END=dict(q="你最喜欢什么运动？为什么？",qPy=py("你最喜欢什么运动为什么"),qEn="What's your favorite sport? Why?",
  cta="和小砚说一说",ctaPy=py("和小砚说一说"),ctaEn="· Talk with Xiao Yan (AI partner)",
  next="下一课 · 第 2 课《我每天六点起床》",nextPy=py("下一课第课我每天六点起床"),nextEn="Next: Lesson 2 — I get up at six every day")
