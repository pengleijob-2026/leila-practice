from py import py
from script import VOCAB
TITLE=dict(lesson="HSK 2 · 第 3 课",lessonPy=py("第课"),title="左边那个红色的是我的",titlePy=py("左边那个红色的是我的"),
  titleEn="The red one on the left is mine",episode="《墨灵记》第 5 集 · 灯兔夜市 · 红",episodePy=py("墨灵记第集灯兔夜市红"),
  episodeEn="The Ink Spirits · Ep. 5 · Lantern Rabbit Night Market · Red",hanzi="红",pinyin="hóng",meaning="red")
INTRO=dict(words=";;".join(f"{w}|{py(w)}|{e}" for w,e in VOCAB))
def N(t,zh,en): return f"{t}|{zh}|{py(zh)}|{en}"
def REL(chars): return ";;".join(f"{c}|{py(c)}|{e}" for c,e in chars)
def EX(t,zh,en,hl): return f"{t}|{zh}|{py(zh)}|{en}|{hl}"

# 语言点（课本「注释」）：例句为 (中文, 英文, 高亮)，出现时间由 timeline.py 填入
def G(num,title,titleEn,formula,formulaEn,examples,prompt,promptEn,answer,answerEn,answerHl):
    return dict(num=num,title=title,titlePy=py(title),titleEn=titleEn,formula=formula,formulaPy=py(formula),formulaEn=formulaEn,
                ex=examples,prompt=prompt,promptPy=py(prompt),promptEn=promptEn,answer=answer,answerPy=py(answer),answerEn=answerEn,answerHl=answerHl)
G1=G("1 / 3","「的」字短语","The 的 phrase","代词 / 形容词 / 动词 + 的","pronoun / adjective / verb + 的 = a noun (the noun after it is left out)",
  [("这本书不是我的。","This book isn't mine.","我的"),("这个杯子是昨天买的。","This cup was bought yesterday.","昨天买的"),
   ("这块手表是你的吗？","Is this watch yours?","你的")],
  "你要红色的还是蓝色的？","Do you want the red one or the blue one?","我要红色的。","I want the red one.","红色的")
G2=G("2 / 3","动词 + 一下","Verb + 一下","动词 + 一下（+ 宾语）","a short action: do something briefly, or give it a try",
  [("我看一下。","Let me take a look.","一下"),("你休息一下吧。","Take a little rest.","一下"),("我问一下老师。","Let me ask the teacher.","一下")],
  "下课了，我们可以……","Class is over. We can…","休息一下。","Take a break.","一下")
G3=G("3 / 3","真 + 形容词","真 + adjective","真 + 形容词","an exclamation: really, so",
  [("你真好！","You're so nice!","真"),("今天天气真好！","The weather is really nice today!","真"),
   ("你女儿的房间真漂亮！","Your daughter's room is so pretty!","真")],
  "今天天气怎么样？","How's the weather today?","今天天气真好！","The weather is really nice today!","真好")

def H(label,labelEn,hanzi,pinyin,meaning,**kw):
    d=dict(label=label,labelPy=py(label),labelEn=labelEn,hanzi=hanzi,pinyin=pinyin,meaning=meaning,ancient="none",partA="",partB="",
           partAPy="",partBPy="",layout="lr",related="",relatedLabel="",relatedLabelPy="",relatedLabelEn="",extra="",extraPy="",extraEn="",
           tAncient=-1,tRotate=-1,tModern=-1,tCompose=-1,tRelated=-1,tExtra=-1,notes="")
    d.update(kw)
    if d["extra"]: d["extraPy"]=py(d["extra"])
    if d["relatedLabel"]: d["relatedLabelPy"]=py(d["relatedLabel"])
    return d
H_HONG=H("汉字精讲 · 本集的字","Character Focus","红","hóng","red",ancient="silk",partA="纟",partAPy="sī",partB="工",partBPy="gōng",
  relatedLabel="绞丝旁",relatedLabelEn="the silk radical",related=REL([("纸","paper"),("红","red")]),extra="红色",extraEn="red (color)")
H_SHOU=H("汉字精讲 · 独体字","Single-component character","手","shǒu","hand",ancient="hand",extra="手表",extraEn="watch")
H_ZHANG=H("汉字精讲 · 独体字","Single-component character","丈","zhàng","a unit of length",ancient="staff",extra="丈夫",extraEn="husband")
H_FU=H("汉字精讲 · 独体字","Single-component character","夫","fū","man, husband",ancient="man",extra="丈夫",extraEn="husband")
H_MU=H("汉字精讲 · 偏旁","Radical","木","mù","wood, tree",relatedLabel="木字旁 · 和植物有关",relatedLabelEn="usually about plants",
  related=REL([("杯","cup, glass"),("椅","chair")]))
H_DAO=H("汉字精讲 · 偏旁","Radical","刂","lì dāo páng","the knife radical",relatedLabel="立刀旁 · 和刀有关",relatedLabelEn="usually about knives",
  related=REL([("别","don't"),("到","to arrive")]))

# 小测试（教材样卷）
QUIZ=[dict(num="1 / 3",q="外面下雨，他们都在 ___ 里呢。",qPy=py("外面下雨他们都在里呢"),qEn="It's raining outside. They're all in the ___.",
   a="房间",aPy=py("房间"),aEn="room",b="报纸",bPy=py("报纸"),bEn="newspaper",c="牛奶",cPy=py("牛奶"),cEn="milk",answer="A"),
 dict(num="2 / 3",q="李先生的手表很好，三 ___ 多块钱。",qPy=py("李先生的手表很好三多块钱"),qEn="Mr. Li's watch is very nice — more than three ___ yuan.",
   a="千",aPy="qiān",aEn="thousand",b="真",bPy="zhēn",bEn="really",c="一下",cPy=py("一下"),cEn="a bit",answer="A"),
 dict(num="3 / 3",q="小李的自行车是什么颜色的？",qPy=py("小李的自行车是什么颜色的"),
   qEn="Xiao Li: \"The red one on the left is mine.\" What color is his bike?",
   a="红色",aPy=py("红色"),aEn="red",b="黑色",bPy=py("黑色"),bEn="black",c="白色",cPy=py("白色"),cEn="white",answer="A")]
END=dict(q="你家有几个房间？哪个是你的？",qPy=py("你家有几个房间哪个是你的"),qEn="How many rooms are in your home? Which one is yours?",
  cta="和小砚说一说",ctaPy=py("和小砚说一说"),ctaEn="· Talk with Xiao Yan (AI partner)",
  next="下一课 · 第 4 课《这个工作是他帮我介绍的》",nextPy=py("下一课第课这个工作是他帮我介绍的"),nextEn="Next: Lesson 4 — He introduced this job to me")
