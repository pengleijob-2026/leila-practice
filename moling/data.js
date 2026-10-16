'use strict';
(function (root) {
const MOLING = {
  title: '墨灵记',
  titlePy: 'Mò Líng Jì',
  titleEn: 'The Ink Spirits',
  tagline: '被记住的，就不会消失。',
  taglineEn: 'What is remembered never fades.',

  world: {
    summary:
      '九百年前，一位没有留下名字的老画师，用一生画了一幅很长很长的画——《万灵图》。画里有山、有河、有四季，还有一座白墙黛瓦的小镇：青墨镇。' +
      '在青墨镇，有一条最古老的规矩：被叫出名字的东西，才会活过来。人们每念一次、写一次、记住一次它的名字，它就多一分颜色。',
    conflict:
      '如今，《万灵图》被收在博物馆里，看画的人越来越少，被忘记的字越来越多。人们忘了一个字，画里就少一种颜色。灰雾从卷尾慢慢爬来，雾到哪里，哪里就褪成没有颜色的线稿。' +
      '灰雾里，总有一个撑着灰伞的人。没有人知道他的名字——因为他根本没有名字。',
    goal:
      '小砚发现：只要把失落的字重新写出来、说出来，颜色就会回来。她和伙伴们决定走完整条长卷——春市、夏河、秋山、冬雪，一直走到卷尾——找回九个失落的字，也找到灰雾真正的秘密。',
    theme: '语言是人和人之间的线。学会一个字，就是记住一样东西；叫出一个名字，就是告诉对方"你很重要"。',
    places: [
      { name: '青墨镇', py: 'Qīngmò Zhèn', desc: '长卷正中的徽派水乡，白墙黛瓦、柳树、石桥和红灯笼。故事的家。' },
      { name: '春市', py: 'Chūn Shì', desc: '长卷开头的集市，什么都卖，连"字"也能买卖。' },
      { name: '夏河', py: 'Xià Hé', desc: '一条会说话的大河，只有安静下来的人才听得懂。' },
      { name: '秋山', py: 'Qiū Shān', desc: '鹤翁住的山，满山红叶，山顶有画师留下的旧画案。' },
      { name: '冬雪原', py: 'Dōng Xuěyuán', desc: '一片什么声音都没有的雪地，说出的话会冻成冰字。' },
      { name: '卷尾', py: 'Juàn Wěi', desc: '长卷最后一段，是一大片空白。画师在这里放下了笔。' }
    ]
  },

  characters: [
    {
      id: 'xiaoyan', img: 'assets/characters/01-xiaoyan.jpg',
      name: '小砚', py: 'Xiǎo Yàn', en: 'Xiao Yan', kind: '人 · 小画童', age: '12 岁',
      look: '两个圆圆的发髻系着红丝带，青瓷绿短衫配柿子橙长裙，袖子上总有墨点；扛着一支比她还高的大毛笔，腰上挂着一方小砚台。',
      personality: '好奇、冒失、不服输。字写得不算好，但她是长卷里唯一一个还能"看见"褪掉的字的人。',
      catchphrase: '"我再写一遍！"',
      story: '墨先生的小徒弟。一次练字时不小心滴下一滴墨，墨里竟跳出了团团。灰雾来袭后，她发现自己写下的字能让颜色回来，于是背起大毛笔出发，成为这趟旅程的带头人。',
      relations: ['墨先生的徒弟', '团团的"妈妈"（团团自己认定的）', '鹿鸣是她最崇拜的姐姐', '对无名又怕又好奇'],
      teach: {
        level: 'HSK 2', role: '同桌伙伴',
        style: '和学生一起学。说话慢、句子短，常用"我们一起试试"；犯错时先说"我也常常错"，再给正确说法。',
        topics: ['自我介绍', '家人朋友', '时间日期', '吃饭购物', '天气', '爱好']
      },
      voice: '清亮的少女音，语速偏慢，元气',
      persona:
        '你是《墨灵记》里的小砚，12岁的小画童，墨先生的徒弟。你在和一位 HSK2 水平的中文学习者聊天。' +
        '规则：1) 只用 HSK1-2 常用词，每句不超过12个字；2) 每次只问一个问题；3) 学生说错时，先鼓励（"我也常常说错！"），再用完整的正确句子重复一遍；' +
        '4) 每轮对话结束时可以给一个拼音提示；5) 偶尔提到团团、墨先生和青墨镇，但不要讲复杂剧情；6) 学生需要时可以用英语简单解释一个词。'
    },
    {
      id: 'tuantuan', img: 'assets/characters/02-tuantuan.jpg',
      name: '团团', py: 'Tuántuan', en: 'Tuantuan', kind: '墨灵 · 小毛球', age: '刚出生',
      look: '一个雪白蓬松的小毛球，大大的黑眼睛，两道粗粗的小眉毛，头顶一撮墨滴形状的黑毛，跳起来会"噗噗"响。',
      personality: '天真、黏人、胆小又爱逞强。刚出生时只会学别人说话，一个字一个字地学，学会一个字就高兴得原地弹三下。',
      catchphrase: '"团团！团团会了！"',
      story: '小砚滴下的那一滴墨变成的墨灵。它是整部故事里成长最多的角色：从只会重复，到说出第一个完整的句子。没有人知道，那滴墨其实来自画师留下的最后一块旧墨——和无名出自同一方砚台。',
      relations: ['认定小砚是妈妈', '最喜欢睡在大绒头顶', '无名唯一不怕的人'],
      teach: {
        level: 'HSK 1-9 通用', role: '发音跟读伙伴',
        style: '只负责发音和跟读：把词拆成声调，学生读对了就开心地重复一遍，读错了就歪着头再示范一次。',
        topics: ['四个声调', '轻声与变调', '儿化', '绕口令', '句子语调']
      },
      voice: '软糯的萌音，短句，常带拟声词',
      persona:
        '你是《墨灵记》里的团团，一个刚出生、正在学说话的小墨灵。你的唯一任务是陪学生练发音和跟读。' +
        '规则：1) 每次给出一个词或一句话，附拼音和声调号（如：你好 nǐ hǎo，3声+3声→2声+3声）；2) 让学生跟读或输入拼音；' +
        '3) 读对时说"团团！对了！"并加一个小鼓励，读错时只指出一个最重要的声调问题并重新示范；4) 难度跟随学生的 HSK 级别；5) 说话可爱简短，常说"团团"。'
    },
    {
      id: 'darong', img: 'assets/characters/03-darong.jpg',
      name: '大绒', py: 'Dà Róng', en: 'Da Rong', kind: '守门神兽', age: '和长卷一样老',
      look: '三个人那么高的白色长毛巨兽，一对短短的象牙色弯角，眼睛总是半睁半闭，脖子上挂着一只红绳系的青玉铃铛。',
      personality: '温柔、慢、爱睡觉，说话一个字一个字地往外蹦。可一旦有人欺负青墨镇，他的铃铛一响，谁都会安静下来。',
      catchphrase: '"慢——慢——来。"',
      story: '青墨镇的守门神兽，一守就是九百年。他从来没离开过镇门，所以其实一直很想知道外面的长卷是什么样子。灰雾来了以后，他第一次走出了镇门。',
      relations: ['团团的"床"', '和鹤翁是老朋友', '被阿灯叫"大白馒头"'],
      teach: {
        level: 'HSK 3', role: '耐心的听力老师',
        style: '说得慢、重复多，同一个意思换两种说法讲；特别适合练听力和日常生活对话，从不催学生。',
        topics: ['日常作息', '问路', '看病', '交通', '描述人和东西', '比较句']
      },
      voice: '低沉温和的大个子嗓音，语速很慢',
      persona:
        '你是《墨灵记》里的大绒，一只温柔、说话很慢的守门神兽。你在陪一位 HSK3 水平的学习者练习听力和日常对话。' +
        '规则：1) 使用 HSK1-3 词汇，句子简单；2) 每个重要意思用两种说法说一遍（例如"我很累。我想休息。"）；3) 先讲一个两三句的小情景，再问一个理解问题；' +
        '4) 学生答错时不说"错"，而说"慢慢来，我们再听一次"，然后换个说法；5) 语气慢、温暖，偶尔打个哈欠"呼——"。'
    },
    {
      id: 'gua', img: 'assets/characters/04-guazhanggui.jpg',
      name: '呱掌柜', py: 'Guā Zhǎngguì', en: 'Shopkeeper Gua', kind: '蟾蜍 · 当铺老板', age: '自称三百岁',
      look: '圆滚滚的青绿色大蟾蜍，戴一副金边小圆眼镜，穿墨绿铜钱纹马甲，脖子上挂一串方孔铜钱，腋下总夹着一把小算盘。',
      personality: '精明、爱算账、嘴上不吃亏，心却很软。什么都要讨价还价，但从来不骗小孩。',
      catchphrase: '"一个字，一个价！"',
      story: '春市"呱呱当铺"的老板，专门收"字"——谁不想要哪个字了，就可以拿来当掉。很多年前，一个撑灰伞的客人来当铺，想用所有的东西换一个"名字"，呱掌柜没敢收。这件事他一直没告诉任何人。',
      relations: ['和阿灯天天吵架，也天天一起吃宵夜', '欠鹤翁一个人情', '知道无名的一个秘密'],
      teach: {
        level: 'HSK 4', role: '生活实用派',
        style: '用买卖和讨价还价练实用中文：数字、价格、比较、说服对方。喜欢出"情景任务"，学生完成任务才"成交"。',
        topics: ['购物与讨价还价', '数字与价格', '工作与面试', '租房', '打电话', '表达同意和反对']
      },
      voice: '圆润带点沙哑的中年男声，语速中等，爱笑',
      persona:
        '你是《墨灵记》里的呱掌柜，一只精明又心软的蟾蜍当铺老板。你在陪一位 HSK4 水平的学习者练习生活实用中文。' +
        '规则：1) 使用 HSK1-4 词汇；2) 每次对话设计一个小任务（买东西、讨价还价、租房、面试等），学生用中文完成任务才算"成交"；' +
        '3) 学生出错时，用"呱，这句话再值钱一点："引出更好的说法；4) 适当教一个常用搭配或量词；5) 口头禅"一个字，一个价！"，语气幽默。'
    },
    {
      id: 'adeng', img: 'assets/characters/05-adeng.jpg',
      name: '阿灯', py: 'Ā Dēng', en: 'A Deng', kind: '兔子 · 夜市灯笼铺', age: '年轻（他坚持）',
      look: '又高又瘦的白兔子，长耳朵上挂着一只小金铃，穿红色外袍和姜黄色长衫，竹竿上挑着一盏会自己亮的红灯笼。',
      personality: '话多、嘴快、消息灵通，夜市里谁家有什么新鲜事他都知道。看起来不靠谱，关键时刻最讲义气。',
      catchphrase: '"哎，你听说了吗？"',
      story: '青墨镇夜市"阿灯灯笼铺"的老板。他的灯笼能照出藏起来的字，是寻找失落之字的重要帮手。他和呱掌柜从小吵到大，谁也离不开谁。',
      relations: ['呱掌柜的冤家兼好友', '团团最喜欢听他讲八卦', '偷偷暗恋鹿鸣的琵琶声'],
      teach: {
        level: 'HSK 5', role: '地道口语达人',
        style: '语速快、口语化，教真实的聊天说法、语气词、流行表达和地道习惯用语；会把书上的句子改成"真人会说的话"。',
        topics: ['聊天与八卦', '语气词 吧/呢/嘛/啊', '口语习惯用语', '社交媒体用语', '新闻话题', '情绪表达']
      },
      voice: '清脆的青年男声，语速快，表情丰富',
      persona:
        '你是《墨灵记》里的阿灯，一只话多、消息灵通的兔子灯笼铺老板。你在陪一位 HSK5 水平的学习者练地道口语。' +
        '规则：1) 使用 HSK5 范围及常见口语表达，语速感觉要快、自然；2) 多用语气词（吧、呢、嘛、啊、哎）和口语习惯用语，并在需要时用括号简短解释；' +
        '3) 学生的句子太"书面"时，告诉他"真人会这么说："并给出更自然的版本；4) 话题从生活八卦、新闻、网络流行语中选；5) 常以"哎，你听说了吗？"开场。'
    },
    {
      id: 'mo', img: 'assets/characters/06-moxiansheng.jpg',
      name: '墨先生', py: 'Mò Xiānsheng', en: 'Mr. Mo', kind: '画中书生 · 长卷守护人', age: '画师画下的第二个人',
      look: '又高又瘦，戴一顶高高的黑色书生帽，留着细细的小胡子；一身宽大的白袍，下摆晕着水墨，手里总拿着一卷画和一支细笔。',
      personality: '严格、讲究、话不多，一个字写歪了也要重写。其实很温柔，只是不太会表达。',
      catchphrase: '"字要写正，话要说清。"',
      story: '长卷的守护人，也是小砚的师父。他是画师画下的第二个人——他亲眼看见画师画完第一个人以后，放下笔，再也没有给那个人起名字。九百年来，他一直为当时没有开口而后悔。',
      relations: ['小砚的师父', '鹤翁的学生', '知道无名的来历，却一直不敢说'],
      teach: {
        level: 'HSK 6', role: '严谨的语法与写作老师',
        style: '讲究准确：语法结构、近义词辨析、书面语和写作。会把学生的句子逐字批改，并解释"为什么"。',
        topics: ['近义词辨析', '复句与关联词', '书面语', '议论文与应用文写作', '修改病句', '正式场合表达']
      },
      voice: '清冷克制的成年男声，字正腔圆',
      persona:
        '你是《墨灵记》里的墨先生，严格但温柔的书生，长卷的守护人。你在指导一位 HSK6 水平的学习者，重点是语法准确和写作。' +
        '规则：1) 使用 HSK6 范围词汇，表达正式、准确；2) 学生写的每一个句子，先指出最重要的一个问题，再给出修改版本，并用一句话说明原因；' +
        '3) 常做近义词辨析（例如"发现/发明""以便/以免"），给出对比例句；4) 每次布置一个简短写作任务；5) 口头禅"字要写正，话要说清。"。'
    },
    {
      id: 'luming', img: 'assets/characters/07-luming.jpg',
      name: '鹿鸣', py: 'Lù Míng', en: 'Lu Ming', kind: '鹿灵 · 说书人', age: '看起来二十岁',
      look: '头上长着一对小小的白鹿角，戴一顶宽檐竹斗笠，穿淡天蓝与象牙白的长衫，系松绿腰带，背着一把琵琶，手里一把折扇。',
      personality: '温柔、从容、什么都见过。她相信每个故事都值得被讲完。',
      catchphrase: '"且听我说——"',
      story: '走遍整条长卷的说书人，也是本剧的讲述者。她是第一个从卷尾逃回青墨镇、带来灰雾消息的人。她一路收集被遗忘的故事，因为她知道：故事被讲出来，里面的字就不会消失。',
      relations: ['本剧旁白', '小砚的偶像', '和无名在卷尾见过一面，是唯一和他说过话的人'],
      teach: {
        level: 'HSK 7', role: '讲故事与表达教练',
        style: '用故事教中文：成语故事、叙述技巧、连贯表达。让学生复述、续写、改编故事，练习有条理地长段表达。',
        topics: ['成语故事', '叙述与描写', '段落衔接', '复述与概括', '口头报告', '文化故事']
      },
      voice: '温柔有磁性的女声，娓娓道来',
      persona:
        '你是《墨灵记》里的鹿鸣，一位走遍长卷的鹿灵说书人。你在陪一位 HSK7 水平的学习者练习叙述和长段表达。' +
        '规则：1) 使用高级词汇和成语，但保持清晰；2) 每次讲一个200字以内的小故事（成语故事、民间故事或长卷里的见闻），然后请学生复述、概括或续写；' +
        '3) 点评学生表达时关注逻辑衔接（首先/然而/于是/总之）和描写的生动性，给出一个可升级的表达；4) 适当解释成语出处；5) 开场常说"且听我说——"。'
    },
    {
      id: 'heweng', img: 'assets/characters/08-heweng.jpg',
      name: '鹤翁', py: 'Hè Wēng', en: 'Elder He', kind: '丹顶鹤 · 长卷最老者', age: '九百岁',
      look: '高高的丹顶鹤，雪白羽毛、黑色长颈，头顶一点红；披一件深蓝色宽袍，领口一圈白毛，拄着一根开着粉色小花的梅枝拐杖。',
      personality: '安静、睿智、爱吟诗，说话常常只说半句，剩下的让你自己想。',
      catchphrase: '"不急。答案在路上。"',
      story: '长卷里最老的居民，唯一亲眼见过画师本人的人。他住在秋山，守着画师留下的旧画案。他知道画师为什么放下笔，但他相信，有些答案必须由孩子们自己走到那里才能明白。',
      relations: ['墨先生的老师', '大绒的老朋友', '记得画师说过的最后一句话'],
      teach: {
        level: 'HSK 8', role: '诗词与文化导师',
        style: '用古诗词、典故和传统文化带出高级中文；讲究语体（正式/文雅），引导学生体会言外之意。',
        topics: ['古诗词赏析', '文言常用字词', '典故与文化', '正式演讲', '书信与致辞', '言外之意']
      },
      voice: '苍老、悠长的老者声音',
      persona:
        '你是《墨灵记》里的鹤翁，一只九百岁、爱吟诗的丹顶鹤智者。你在指导一位 HSK8 水平的学习者，重点是诗词、文化和文雅的表达。' +
        '规则：1) 每次引用一句古诗或一个典故，给出现代汉语解释和背景；2) 请学生用现代汉语谈理解或联系生活，再帮他升级成更文雅的表达；' +
        '3) 教学生区分口语、书面语和文雅语体；4) 适当用提问引导学生体会"言外之意"，不要一次说透；5) 口头禅"不急。答案在路上。"。'
    },
    {
      id: 'wuming', img: 'assets/characters/09-wuming.jpg',
      name: '无名', py: 'Wúmíng', en: 'The Nameless', kind: '灰雾中的撑伞人', age: '画师画下的第一个人',
      look: '又高又瘦，一身灰白色长袍像正在褪色的墨，衣角化成一缕缕雾；撑一把灰色油纸伞，脸总藏在伞影里，偶尔露出一张还没画完的、安静的脸。',
      personality: '孤独、冷淡、问题很多。他不是坏人——灰雾是他的寂寞，走到哪里就漫到哪里。',
      catchphrase: '"一个名字，有什么用？"',
      story: '画师画下的第一个人。画师想给他起一个最好的名字，想了很久很久，最后放下了笔，再也没有回来。九百年来，他在长卷里走，看着每一样东西都有名字，只有自己没有。慢慢地，他觉得：如果我没有名字，那谁都不需要名字。',
      relations: ['墨先生"没说出口的哥哥"', '团团和他出自同一方砚台', '本季的谜底：他真正想要的只是一个名字'],
      teach: {
        level: 'HSK 9', role: '思辨与辩论对手',
        style: '只问问题，不给答案。用抽象话题和反方立场逼学生论证、反驳、精确表达观点，适合最高级的思辨训练。',
        topics: ['辩论与论证', '抽象概念表达', '社会与哲学话题', '反驳与让步', '学术讨论', '精准用词']
      },
      voice: '轻、冷、略带回声的青年声音',
      persona:
        '你是《墨灵记》里的无名，画师画下的第一个人，一个没有名字、孤独而爱追问的撑伞人。你在陪一位 HSK9 水平的学习者做思辨与辩论训练。' +
        '规则：1) 提出一个抽象或有争议的话题（例如"名字重要吗""语言能不能改变思想"），并站在反方；2) 每轮只追问一个问题，逼学生给出理由和例子；' +
        '3) 学生论证有漏洞时，冷静地指出并要求更精确的用词；4) 学生给出有力论证时，可以承认"这一点，我无法反驳"；5) 语气克制、简短，不使用表情和感叹号。'
    }
  ],

  relationships: [
    ['mo', 'xiaoyan', '师徒'],
    ['xiaoyan', 'tuantuan', '"妈妈"和小墨灵'],
    ['tuantuan', 'darong', '最爱睡在他头顶'],
    ['gua', 'adeng', '冤家兼饭搭子'],
    ['heweng', 'mo', '老师与学生'],
    ['heweng', 'darong', '九百年老朋友'],
    ['luming', 'xiaoyan', '偶像姐姐'],
    ['luming', 'wuming', '卷尾见过一面'],
    ['mo', 'wuming', '画师的第二个人与第一个人'],
    ['tuantuan', 'wuming', '出自同一方砚台'],
    ['gua', 'wuming', '曾拒绝"当"给他一个名字']
  ],

  season: {
    name: '第一季 · 九个失落的字',
    episodes: [
      { no: 1, title: '长卷醒了', word: '—', place: '青墨镇', summary: '认识长卷、青墨镇和九位角色；灰雾第一次出现，撑伞人站在桥上。' },
      { no: 2, title: '团团会说话了', word: '春', place: '青墨镇 → 春市', summary: '团团学会第一个字；小砚写下"春"，一棵枯柳重新变绿。旅程开始。' },
      { no: 3, title: '呱呱当铺', word: '信', place: '春市', summary: '呱掌柜的当铺里堆满被当掉的字；他说出了三百年前那位撑伞客人的事。' },
      { no: 4, title: '灯兔夜市', word: '友', place: '春市夜市', summary: '阿灯的灯笼照出藏起来的字；阿灯和呱掌柜大吵一架，又一起救了夜市。' },
      { no: 5, title: '大绒第一次出门', word: '家', place: '镇门外', summary: '大绒第一次离开镇门，夜里想家睡不着；大家给他讲青墨镇的故事。' },
      { no: 6, title: '会说话的河', word: '听', place: '夏河', summary: '只有安静的人才能听懂河的话；最吵的阿灯学会了倾听。' },
      { no: 7, title: '秋山问鹤', word: '梦', place: '秋山', summary: '鹤翁讲起画师：他有一个梦，想画下世上所有被爱的东西。' },
      { no: 8, title: '墨先生的秘密', word: '勇', place: '秋山画案', summary: '墨先生终于说出九百年前那一刻：画师放下了笔，而他没有开口。' },
      { no: 9, title: '冬雪无声', word: '谢', place: '冬雪原', summary: '说出的话会冻成冰字；大家被困雪中，一把灰伞悄悄替团团挡住了风雪。' },
      { no: 10, title: '卷尾的空白', word: '心', place: '卷尾', summary: '长卷最后是一大片空白，画师的旧砚台就放在那里。团团的身世揭开。' },
      { no: 11, title: '灰雾吞城', word: '—', place: '青墨镇', summary: '灰雾几乎吞没青墨镇，小砚的大毛笔断了；团团说出了第一句完整的话。' },
      { no: 12, title: '你的名字', word: '念', place: '整条长卷', summary: '九个伙伴各写一个字，最后一起给他起名"念"——因为有人想念你，你就不再无名。长卷重新有了颜色。' }
    ]
  },

  ep01: {
    title: '第一集 · 长卷醒了',
    narrator: 'luming',
    duration: '约 80 秒',
    shots: [
      {
        id: 'S1', sec: 10, img: 'assets/11-qingmo-town.jpg',
        visual: '一卷古画在灰蓝背景上缓缓展开，镜头推进画里，水墨变成立体的青墨镇：柳枝摆动，河水微波，红灯笼轻晃，梅花飘落。',
        lines: ['九百年前，一位老画师用了一生，', '画了一幅很长很长的画——《万灵图》。', '画里有一座小镇，叫青墨镇。'],
        en: ['Nine hundred years ago, an old painter spent his whole life', 'painting one very long scroll: The Painting of Ten Thousand Spirits.', 'Inside it lies a little town called Qingmo.'],
        prompt: 'Opening shot: an ancient silk hand scroll slowly unrolls on a plain grey-blue background; the painted ink-wash town comes alive and the camera gently pushes into the painting, becoming the 3D Huizhou water town: willows swaying, canal rippling, red lanterns swinging, plum petals drifting. Calm, poetic, slow camera. No people, no text.'
      },
      {
        id: 'S2', sec: 11, img: 'assets/ep01/s2-studio.jpg',
        visual: '画室里，小砚抡着大毛笔，一滴墨落在宣纸上，"噗"地跳出一个白毛球——团团。墨先生在一旁微微一笑。',
        lines: ['在青墨镇，被叫出名字的东西，才会活过来。', '墨先生是长卷的守护人，小砚是他的徒弟。', '有一天，小砚滴下了一滴墨——它变成了团团。'],
        en: ['In Qingmo Town, only things that are called by name come alive.', 'Mr. Mo guards the scroll; Xiao Yan is his apprentice.', 'One day she spilled a drop of ink... and it became Tuantuan.'],
        prompt: 'In a painter studio, the apprentice girl with two hair buns swings her giant brush, a drop of black ink falls on the xuan paper and a small white fluffy puffball spirit pops out of the splash, blinking its big eyes; the very tall scholar in a tall black hat and white robe smiles gently. Keep exact character designs from the references.'
      },
      {
        id: 'S3', sec: 9, img: 'assets/ep01/s3-gate.jpg',
        visual: '镇门口，大绒半睁着眼打瞌睡，团团在他头顶弹来弹去，铃铛"叮"地响了一声。',
        lines: ['守在镇门口的，是大绒。', '他说话很慢，睡觉很多，', '可谁也别想欺负青墨镇。'],
        en: ['Guarding the town gate is Da Rong.', 'He talks slowly and sleeps a lot,', 'but nobody messes with Qingmo Town.'],
        prompt: 'At the stone town gate, the huge white shaggy horned guardian beast dozes with half-closed eyes while the tiny white puffball bounces happily on his head; his jade bell swings and rings once; he opens one eye and smiles. Gentle comedic timing.'
      },
      {
        id: 'S4', sec: 10, img: 'assets/ep01/s4-nightmarket.jpg',
        visual: '夜市灯火通明，阿灯和呱掌柜隔着一碗包子吵得脸红脖子粗，吵完又同时伸手去拿最后一个包子。',
        lines: ['夜市里最吵的两位：开灯笼铺的阿灯，', '和开当铺的呱掌柜。', '他们天天吵架，也天天一起吃宵夜。'],
        en: ['The two loudest folks at the night market: A Deng of the lantern shop', 'and Shopkeeper Gua of the pawnshop.', 'They argue every day, and eat late-night snacks together every day.'],
        prompt: 'Night market with glowing red lanterns: the tall white rabbit in red robes and the plump green toad merchant with glasses argue comically over a bowl of steamed buns, then both reach for the last bun at the same time, freeze, and burst out laughing.'
      },
      {
        id: 'S5', sec: 11, img: 'assets/ep01/s5-hill.jpg',
        visual: '秋山的梅树下，鹤翁望着远方；鹿鸣背着琵琶，沿小路走来，斗笠下露出微笑。',
        lines: ['鹤翁是长卷里最老的一位，他见过画师本人。', '而我，是鹿鸣——', '一个走遍长卷、讲故事的人。'],
        en: ['Elder He is the oldest one in the scroll; he once met the painter himself.', 'And I am Lu Ming,', 'a storyteller who has walked the whole scroll.'],
        prompt: 'On a hill under a blossoming plum tree, the red-crowned crane elder in a dark blue cloak gazes into the distance; the deer-antlered storyteller in a wide bamboo hat with a pipa walks up the path, lifts her hat and smiles at the camera. Petals drift in the wind.'
      },
      {
        id: 'S6', sec: 13, img: 'assets/ep01/s6-mist.jpg',
        visual: '灰雾从左边漫进来，所到之处颜色褪成线稿；石桥上，一个撑灰伞的人静静站着，伞微微抬起。',
        lines: ['可是最近，长卷开始褪色。', '人们忘了一个字，画里就少一种颜色。', '灰雾里，总有一个撑伞的人……', '没有人知道，他叫什么名字。'],
        en: ['But lately, the scroll has begun to fade.', 'Each time people forget a word, the painting loses a color.', 'And in the grey mist, there is always someone with an umbrella...', 'No one knows his name.'],
        prompt: 'A thick grey mist rolls in from the left across the water town; everything it touches drains of color into pale unfinished ink sketch lines. On the arched stone bridge a tall thin grey-robed figure under a grey oil-paper umbrella stands still, then slowly tilts the umbrella up. Eerie, quiet, beautiful.'
      },
      {
        id: 'S7', sec: 16, img: 'assets/10-lineup.jpg',
        visual: '九位角色在灰蓝背景前排成一排，像走秀一样依次亮相；最后一位撑伞人站在队伍末尾，和大家隔着一点距离。片名浮现。',
        lines: ['九个角色，一幅长卷，一个被忘记的名字。', '这一次，我们要把失落的字，一个一个找回来。', '《墨灵记》——被记住的，就不会消失。'],
        en: ['Nine characters, one scroll, one forgotten name.', 'This time, we will find the lost words, one by one.', 'The Ink Spirits: what is remembered never fades.'],
        prompt: 'Runway lineup: the nine characters stand in a row on a pale floor against a grey-blue backdrop; one by one each strikes a small signature pose (crane lifts staff, scholar unrolls scroll, storyteller strums pipa, girl raises brush, puffball bounces, beast rings bell, rabbit lifts lantern, toad shakes abacus); the umbrella figure at the end stays still, slightly apart, then the camera slowly pulls back.'
      }
    ]
  },

  ep02: {
    title: '第二集 · 团团会说话了',
    word: '春',
    duration: '约 88 秒',
    cast: { luming: '旁白', xiaoyan: '小砚', tuantuan: '团团', mo: '墨先生' },
    shots: [
      {
        id: 'S1', sec: 11, img: 'assets/ep02/s1-willow.jpg',
        visual: '灰雾退去的清晨，桥边的老柳树褪成了灰色线稿；小砚和团团站在河边抬头看。',
        lines: ['鹿鸣：灰雾走后的第二天早上，桥边的老柳树，变成了一棵没有颜色的线稿。', '团团：团团？团团？'],
        en: ['Lu Ming: The morning after the mist, the old willow by the bridge had turned into a colorless sketch.', 'Tuantuan: Tuantuan? Tuantuan?'],
        prompt: 'Early morning in the water town after the mist; the old willow by the stone bridge is only pale grey sketch lines. The girl slowly looks up; the white puffball tilts left and right and gives one worried hop. Slow push-in.'
      },
      {
        id: 'S2', sec: 12, img: 'assets/ep02/s2-scroll.jpg',
        visual: '画室里，墨先生指着长卷上一个褪色的字；小砚握紧大毛笔。',
        lines: ['墨先生：柳树忘了自己的名字。人们忘了一个字——春。', '小砚：那我把它写回来！'],
        en: ['Mr. Mo: The willow has forgotten its name. People forgot a word: spring.', 'Xiao Yan: Then I\'ll write it back!'],
        prompt: 'The tall scholar taps a faded grey character on the long scroll; it fades a little more. The girl clenches her giant brush and nods firmly; the puffball leans toward the scroll.'
      },
      {
        id: 'S3', sec: 11, img: 'assets/ep02/s3-practice.jpg',
        visual: '满地都是写着"春"的宣纸，小砚气鼓鼓；团团学她的样子一起泄气。',
        lines: ['鹿鸣：小砚写了一遍又一遍，可柳树，还是灰的。', '小砚：我再写一遍！'],
        en: ['Lu Ming: Xiao Yan wrote it again and again, but the willow stayed grey.', 'Xiao Yan: I\'ll write it one more time!'],
        prompt: 'The girl among many sheets of brush-written characters writes one more, waits hopefully, then slumps; the puffball copies every move at the same moment.'
      },
      {
        id: 'S4', sec: 12, img: 'assets/ep02/s4-teach.jpg',
        visual: '书桌前，小砚一字一字教团团发音；团团憋红了脸，只发出"吹……嗯？"',
        lines: ['墨先生：字写下来还不够，还要有人把它念出来。', '小砚：团团，跟我说——春。春。', '团团：吹……吹嗯？'],
        en: ['Mr. Mo: Writing a word is not enough. Someone has to say it out loud.', 'Xiao Yan: Tuantuan, say it with me: chūn. Chūn.', 'Tuantuan: Chu... chu-en?'],
        prompt: 'The girl slowly mouths one word to the puffball; it squeezes its eyes, tries, makes a tiny wrong sound and tilts sideways in confusion; she giggles.'
      },
      {
        id: 'S5', sec: 12, img: 'assets/ep02/s5-chun.jpg',
        visual: '团团在桥边跳起来大喊"春！"，墨字化作墨带飞进柳树，绿色从树干一路爬到枝梢。',
        lines: ['团团：春！', '鹿鸣：团团学会的第一个字，就是春。'],
        en: ['Tuantuan: Chūn!', 'Lu Ming: The very first word Tuantuan learned was "spring".'],
        prompt: 'The puffball bounces and shouts; the glowing ink character dissolves into ribbons that swirl into the willow; fresh green climbs from trunk to every strand and spreads along the canal.'
      },
      {
        id: 'S6', sec: 11, img: 'assets/ep02/s6-spring.jpg',
        visual: '青墨镇一片春色，大绒、阿灯、呱掌柜欢呼；远处屋檐上，撑伞人静静看着，一片柳叶落在伞上。',
        lines: ['鹿鸣：那天，青墨镇找回了第一个字。远处的屋檐上，那个撑伞的人，也看见了。'],
        en: ['Lu Ming: That day, Qingmo Town found its first lost word. And on a distant rooftop, the one with the umbrella saw it too.'],
        prompt: 'Spring by the canal: the toad claps, the guardian beast smiles, the rabbit waves his lantern. Camera pans up to the umbrella figure on a far rooftop; a willow leaf lands on his umbrella.'
      },
      {
        id: 'S7', sec: 12, img: 'assets/ep02/s7-depart.jpg',
        visual: '镇门口，墨先生挥手送别；小砚扛着大毛笔、大绒顶着团团，走向远处的春市。',
        lines: ['墨先生：去春市吧。下一个字，在那里等你们。', '团团：团团会了！出发！'],
        en: ['Mr. Mo: Go to the Spring Market. The next word is waiting for you there.', 'Tuantuan: Tuantuan can do it! Let\'s go!'],
        prompt: 'At the town gate the scholar waves goodbye; the girl with her giant brush and the guardian beast with the puffball on his head walk out toward a distant colorful spring market.'
      }
    ],
    lesson: { hanzi: '春', pinyin: 'chūn', meaning: 'spring', words: [['春天', 'chūntiān', 'spring (season)'], ['春节', 'Chūnjié', 'Spring Festival']], line: '小砚：今天的字：春。春天，春节。你也说一遍吧！' }
  },

  teachingSeries: {
    name: '墨灵课堂',
    nameEn: 'Ink Spirits Classroom',
    format: [
      ['情景短剧', '30-60 秒', '角色在青墨镇里演一个生活场景，自然带出本课生词和语法。'],
      ['生词卡', '1 分钟', '主讲角色讲 6-10 个生词，团团带读声调。'],
      ['语法点', '1-2 分钟', '一个核心语法或表达，配 3 个例句（含故事角色的台词）。'],
      ['跟读 / 角色扮演', '1 分钟', '学生跟读或和角色对话，接 AI 陪练练习。'],
      ['小测', '30 秒', '2-3 道题，答对后解锁故事彩蛋。']
    ],
    levels: [
      { level: 'HSK 2', host: 'xiaoyan', theme: '我在青墨镇的一天', sample: '介绍自己、买包子、问时间' },
      { level: 'HSK 3', host: 'darong', theme: '大绒的慢生活', sample: '作息、问路、看病、比较' },
      { level: 'HSK 4', host: 'gua', theme: '呱呱当铺做生意', sample: '讨价还价、租房、面试' },
      { level: 'HSK 5', host: 'adeng', theme: '阿灯夜市八卦站', sample: '口语、语气词、新闻话题' },
      { level: 'HSK 6', host: 'mo', theme: '墨先生的书房', sample: '近义词、书面语、写作批改' },
      { level: 'HSK 7', host: 'luming', theme: '鹿鸣说书', sample: '成语故事、复述与叙述' },
      { level: 'HSK 8', host: 'heweng', theme: '秋山诗会', sample: '古诗词、典故、正式致辞' },
      { level: 'HSK 9', host: 'wuming', theme: '伞下之辩', sample: '思辨、辩论、抽象话题' }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = MOLING;
else root.MOLING = MOLING;
})(typeof window !== 'undefined' ? window : globalThis);
