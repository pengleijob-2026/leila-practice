from py import py
from script import VOCAB
TITLE=dict(lesson="HSK 2 · 第 3 课",lessonPy=py("第课"),title="左边那个红色的是我的",titlePy=py("左边那个红色的是我的"),
  titleEn="The red one on the left is mine",episode="《墨灵记》第 5 集 · 灯兔夜市 · 红",episodePy=py("墨灵记第集灯兔夜市红"),
  episodeEn="The Ink Spirits · Ep. 5 · Lantern Rabbit Night Market · Red",hanzi="红",pinyin="hóng",meaning="red")
INTRO=dict(words=";;".join(f"{w}|{py(w)}|{e}" for w,e in VOCAB))
def N(t,zh,en): return f"{t}|{zh}|{py(zh)}|{en}"
def REL(chars): return ";;".join(f"{c}|{py(c)}|{e}" for c,e in chars)
H_HONG=dict(label="汉字精讲 · 本集的字",labelPy=py("汉字精讲本集的字"),labelEn="Character Focus",hanzi="红",pinyin="hóng",meaning="red",
  ancient="silk",tRotate=-1,partA="纟",partAPy="sī",partB="工",partBPy="gōng",layout="lr",
  relatedLabel="绞丝旁 · 和线、布有关",relatedLabelPy=py("绞丝旁和线布有关"),relatedLabelEn="the silk radical",
  related=REL([("线","thread"),("纸","paper"),("红","red")]),extra="左边那个红色的是我的。",extraPy=py("左边那个红色的是我的"),
  extraEn="The red one on the left is mine.")
H_FANG=dict(label="汉字精讲 · 房",labelPy=py("汉字精讲房"),labelEn="Character Focus",hanzi="房",pinyin="fáng",meaning="room, house",
  ancient="door",tRotate=-1,partA="户",partAPy="hù",partB="方",partBPy="fāng",layout="tb",related="",relatedLabel="",tRelated=-1,
  extra="房间",extraPy=py("房间"),extraEn="room")
H_NIU=dict(label="汉字精讲 · 牛",labelPy=py("汉字精讲牛"),labelEn="Character Focus",hanzi="牛",pinyin="niú",meaning="ox, cow",ancient="ox",
  partA="",partB="",partAPy="",partBPy="",tRotate=-1,tCompose=-1,related="",relatedLabel="",tRelated=-1,
  extra="牛奶 · 送牛奶的",extraPy=py("牛奶送牛奶的"),extraEn="milk · the milk delivery person")
PATTERN=dict(p1="……的",p1Py=py("的"),p1En="the one that… (的 phrase)",
  ex1="左边那个红色的是我的。",ex1Py=py("左边那个红色的是我的"),ex1En="The red one on the left is mine.",hl1="红色的",
  p2="V + 一下",p2Py=py("一下"),p2En="do something briefly",ex2="我看一下。",ex2Py=py("我看一下"),
  ex2En="Let me take a look.",hl2="一下",
  prompt="你的杯子是什么颜色的？",promptPy=py("你的杯子是什么颜色的"),promptEn="What color is your cup?")
QUIZ=[dict(num="1 / 3",q="「纟」和什么有关？",qPy=py("和什么有关"),qEn="What is 纟 related to?",a="水",aPy="shuǐ",aEn="water",b="丝线",bPy=py("丝线"),bEn="silk thread",c="脚",cPy="jiǎo",cEn="foot",answer="B"),
 dict(num="2 / 3",q="左边那个红色的 ___ 我的。",qPy=py("左边那个红色的我的"),qEn="The red one on the left ___ mine.",a="是",aPy="shì",aEn="is",b="有",bPy="yǒu",bEn="have",c="在",cPy="zài",cEn="at",answer="A"),
 dict(num="3 / 3",q="我看 ___。",qPy=py("我看"),qEn="Let me take ___ (a look).",a="一下",aPy=py("一下"),aEn="a bit",b="一起",bPy=py("一起"),bEn="together",c="一个",cPy=py("一个"),cEn="one (thing)",answer="A")]
END=dict(q="你最喜欢什么颜色？为什么？",qPy=py("你最喜欢什么颜色为什么"),qEn="What's your favorite color? Why?",
  cta="和小砚说一说",ctaPy=py("和小砚说一说"),ctaEn="· Talk with Xiao Yan (AI partner)",
  next="下一课 · 第 4 课《这个工作是他帮我介绍的》",nextPy=py("下一课第课这个工作是他帮我介绍的"),nextEn="Next: Lesson 4 — He introduced this job to me")
