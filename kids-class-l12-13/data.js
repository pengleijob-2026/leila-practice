'use strict';
/**
 * Courier 星际快递员 — full ~120' classroom courseware (HSK1 L12 + L13)
 * Section order: HQ → Part A (vocab→phrase→text→grammar→dialog→planet) → Part B (same) → Finale
 */

const ART = {
  launch: 'assets/art/launch.webp',
  weather: 'assets/art/planet-weather.jpg',
  phone: 'assets/art/planet-phone.jpg',
  hero: 'assets/art/courier-hero.jpg',
  robot: 'assets/art/robot.webp'
};

/* —— Planet endgame missions (unchanged mechanics) —— */
const PLANETS = [
  {
    id: 'weather',
    name: '天气星球',
    py: 'Tiānqì Xīngqiú',
    en: 'Weather Planet',
    package: '天气预报包裹',
    packagePy: 'Tiānqì yùbào bāoguǒ',
    packageEn: 'Weather-forecast package',
    sub: '点亮气象站，送出天气预报',
    subEn: 'Power the weather station. Deliver the forecast.',
    bg: ART.weather,
    lesson: '第12课 · 闯关',
    minutes: 10,
    effect: 'storm',
    tasks: [
      {
        mechanic: 'hotspot',
        prompt: '今天太热了！点亮正确的气象灯。',
        py: 'Jīntiān tài rè le!',
        en: 'Light the HOT beacon.',
        target: 'hot',
        spots: [
          { id: 'hot', zh: '热', py: 'rè', en: 'hot', x: 22, y: 38 },
          { id: 'cold', zh: '冷', py: 'lěng', en: 'cold', x: 50, y: 28 },
          { id: 'rain', zh: '下雨', py: 'xià yǔ', en: 'rain', x: 76, y: 42 }
        ],
        say: '今天太热了！', sayPy: 'Jīntiān tài rè le!', sayEn: 'It is too hot today!'
      },
      {
        mechanic: 'words',
        prompt: '词语装进发光包裹。',
        py: 'Zhuāng jìn bāoguǒ.',
        en: 'Install word tiles into the package bay.',
        words: ['明天', '天气', '怎么样'],
        pys: ['míngtiān', 'tiānqì', 'zěnmeyàng'],
        engs: ['tomorrow', 'weather', 'how is it'],
        say: '明天天气怎么样？', sayPy: 'Míngtiān tiānqì zěnmeyàng?', sayEn: 'How is the weather tomorrow?'
      },
      {
        mechanic: 'levers',
        prompt: '明天会下雨吗？扳动风暴开关。',
        py: 'Míngtiān huì xià yǔ ma?',
        en: 'Will it rain? Pull the lever.',
        question: '明天会下雨吗？', questionPy: 'Míngtiān huì xià yǔ ma?',
        target: 'yes',
        say: '明天会下雨。', sayPy: 'Míngtiān huì xià yǔ.', sayEn: 'It will rain tomorrow.',
        bonusSay: '你身体怎么样？多吃些水果，多喝水。',
        bonusSayPy: 'Nǐ shēntǐ zěnmeyàng? Duō chī xiē shuǐguǒ, duō hē shuǐ.',
        bonusSayEn: 'How are you feeling? Eat more fruit and drink water.'
      }
    ]
  },
  {
    id: 'phone',
    name: '电话星球',
    py: 'Diànhuà Xīngqiú',
    en: 'Phone Planet',
    package: '电话任务包裹',
    packagePy: 'Diànhuà rènwu bāoguǒ',
    packageEn: 'Phone-mission package',
    sub: '接通信号，完成电话任务',
    subEn: 'Open the channel. Complete the call mission.',
    bg: ART.phone,
    lesson: '第13课 · 闯关',
    minutes: 10,
    effect: 'signal',
    tasks: [
      {
        mechanic: 'rings',
        prompt: '全息呼叫！点正确的接听信号。',
        py: 'Quánxī hūjiào!',
        en: 'Tap the right answer signal.',
        target: 'wei',
        options: [
          { id: 'wei', zh: '喂', py: 'wéi', en: 'Hello (phone)' },
          { id: 'nihao', zh: '你好', py: 'nǐ hǎo', en: 'Hello (face)' },
          { id: 'zaijian', zh: '再见', py: 'zàijiàn', en: 'Bye' }
        ],
        say: '喂，你在做什么呢？', sayPy: 'Wéi, nǐ zài zuò shénme ne?', sayEn: 'Hello, what are you doing?'
      },
      {
        mechanic: 'scan',
        prompt: '扫描大卫：他在做什么？',
        py: 'Sǎomiáo Dàwèi.',
        en: 'Scan what David is doing.',
        target: 'cook',
        cards: [
          { id: 'sleep', zh: '睡觉', py: 'shuìjiào', en: 'sleeping', icon: '😴' },
          { id: 'cook', zh: '学做中国菜', py: 'xué zuò Zhōngguó cài', en: 'Chinese cooking', icon: '🍜' },
          { id: 'tv', zh: '看电视', py: 'kàn diànshì', en: 'watching TV', icon: '📺' }
        ],
        say: '他在学做中国菜呢。', sayPy: 'Tā zài xué zuò Zhōngguó cài ne.', sayEn: 'He is learning to cook Chinese food.'
      },
      {
        mechanic: 'dial',
        prompt: '拨号，再组装建议口令。',
        py: 'Bōhào + kǒulìng.',
        en: 'Dial, then build the suggestion.',
        code: ['1', '3', '8'],
        codeLabel: '李老师短号 · 1=yāo',
        words: ['我', '给', '李老师', '打电话', '吧'],
        pys: ['wǒ', 'gěi', 'Lǐ lǎoshī', 'dǎ diànhuà', 'ba'],
        engs: ['I', 'to', 'Teacher Li', 'call', "(let's)"],
        say: '我给李老师打电话吧。', sayPy: 'Wǒ gěi Lǐ lǎoshī dǎ diànhuà ba.', sayEn: "I'll call Teacher Li."
      }
    ]
  }
];

/* —— Ordered course sections (~120') —— */
const SECTIONS = [
  {
    id: 'hq',
    type: 'briefing',
    part: 'HQ',
    partLabel: '总部出发',
    name: '接收双包任务',
    py: 'Jiēshōu shuāng bāo rènwu',
    en: 'Dual-package briefing',
    minutes: 5,
    bg: 'assets/bg/hq.webp',
    story: '总部呼叫星际快递员 Courier：今天要送两个包裹！'
  },

  /* ========== PART A · L12 ========== */
  {
    id: 'a-vocab',
    type: 'vocab',
    part: 'A',
    partLabel: 'PART A · 天气预报包裹',
    name: '生词舱',
    py: 'Shēngcí cāng',
    en: 'Vocab bay',
    minutes: 16,
    bg: 'assets/bg/a-vocab.webp',
    lesson: '第12课 · 13 个生词',
    story: '打开天气预报包裹前，先把气象密码词装进词库。',
    words: [
      { zh: '天气', py: 'tiānqì', en: 'weather', icon: '🌤️' },
      { zh: '怎么样', py: 'zěnmeyàng', en: 'how is it', icon: '❓' },
      { zh: '太', py: 'tài', en: 'too / extremely', icon: '⚡' },
      { zh: '热', py: 'rè', en: 'hot', icon: '🔥' },
      { zh: '冷', py: 'lěng', en: 'cold', icon: '❄️' },
      { zh: '下雨', py: 'xià yǔ', en: 'to rain', icon: '🌧️' },
      { zh: '小姐', py: 'xiǎojiě', en: 'Miss', icon: '👩' },
      { zh: '来', py: 'lái', en: 'to come', icon: '➡️' },
      { zh: '身体', py: 'shēntǐ', en: 'body / health', icon: '💪' },
      { zh: '爱', py: 'ài', en: 'to love / like', icon: '❤️' },
      { zh: '些', py: 'xiē', en: 'some', icon: '➕' },
      { zh: '水果', py: 'shuǐguǒ', en: 'fruit', icon: '🍎' },
      { zh: '水', py: 'shuǐ', en: 'water', icon: '💧' }
    ]
  },
  {
    id: 'a-phrase',
    type: 'phrase',
    part: 'A',
    partLabel: 'PART A · 天气预报包裹',
    name: '词组对接站',
    py: 'Cízǔ duìjiē zhàn',
    en: 'Phrase dock',
    minutes: 9,
    bg: 'assets/bg/a-phrase.webp',
    lesson: '第12课 · 常用块',
    story: '把词块装进通讯模块，气象站才能听懂你。',
    phrases: [
      { words: ['太', '热', '了'], pys: ['tài', 'rè', 'le'], engs: ['too', 'hot', 'LE'], say: '太热了', sayPy: 'Tài rè le', sayEn: 'Too hot' },
      { words: ['不太', '冷'], pys: ['bú tài', 'lěng'], engs: ['not too', 'cold'], say: '不太冷', sayPy: 'Bú tài lěng', sayEn: 'Not too cold' },
      { words: ['会', '下雨'], pys: ['huì', 'xià yǔ'], engs: ['will', 'rain'], say: '会下雨', sayPy: 'Huì xià yǔ', sayEn: 'Will rain' },
      { words: ['天气', '怎么样'], pys: ['tiānqì', 'zěnmeyàng'], engs: ['weather', 'how'], say: '天气怎么样', sayPy: 'Tiānqì zěnmeyàng', sayEn: 'How is the weather' },
      { words: ['身体', '怎么样'], pys: ['shēntǐ', 'zěnmeyàng'], engs: ['health', 'how'], say: '身体怎么样', sayPy: 'Shēntǐ zěnmeyàng', sayEn: 'How is your health' },
      { words: ['多吃些', '水果'], pys: ['duō chī xiē', 'shuǐguǒ'], engs: ['eat more', 'fruit'], say: '多吃些水果', sayPy: 'Duō chī xiē shuǐguǒ', sayEn: 'Eat more fruit' }
    ]
  },
  {
    id: 'a-text',
    type: 'text',
    part: 'A',
    partLabel: 'PART A · 天气预报包裹',
    name: '课文信号',
    py: 'Kèwén xìnhào',
    en: 'Text scenes',
    minutes: 11,
    bg: 'assets/bg/a-text.webp',
    lesson: '第12课 · 三个情景',
    story: '气象频道正在播放三段对话，点开听听。',
    scenes: [
      {
        title: '情景1 · 路上谈天气',
        titlePy: 'Lùshang tán tiānqì',
        titleEn: 'Talking about weather',
        lines: [
          { who: 'A', zh: '明天天气怎么样？', py: 'Míngtiān tiānqì zěnmeyàng?', en: 'How is the weather tomorrow?' },
          { who: 'B', zh: '明天会下雨。', py: 'Míngtiān huì xià yǔ.', en: 'It will rain tomorrow.' },
          { who: 'A', zh: '今天太热了！', py: 'Jīntiān tài rè le!', en: 'It is too hot today!' },
          { who: 'B', zh: '北京昨天很冷。', py: 'Běijīng zuótiān hěn lěng.', en: 'Beijing was very cold yesterday.' }
        ]
      },
      {
        title: '情景2 · 会不会',
        titlePy: 'Huì bu huì',
        titleEn: 'Will it or not',
        lines: [
          { who: 'A', zh: '明天会下雨吗？', py: 'Míngtiān huì xià yǔ ma?', en: 'Will it rain tomorrow?' },
          { who: 'B', zh: '明天不会下雨。', py: 'Míngtiān bú huì xià yǔ.', en: 'It will not rain tomorrow.' },
          { who: 'A', zh: '王小姐会来吗？', py: 'Wáng xiǎojiě huì lái ma?', en: 'Will Miss Wang come?' },
          { who: 'B', zh: '她会来。', py: 'Tā huì lái.', en: 'She will come.' }
        ]
      },
      {
        title: '情景3 · 身体怎么样',
        titlePy: 'Shēntǐ zěnmeyàng',
        titleEn: 'How is your health',
        lines: [
          { who: 'A', zh: '你身体怎么样？', py: 'Nǐ shēntǐ zěnmeyàng?', en: 'How is your health?' },
          { who: 'B', zh: '我身体很好。', py: 'Wǒ shēntǐ hěn hǎo.', en: 'I am very healthy.' },
          { who: 'A', zh: '多吃些水果，多喝水。', py: 'Duō chī xiē shuǐguǒ, duō hē shuǐ.', en: 'Eat more fruit and drink more water.' },
          { who: 'B', zh: '好。我爱吃水果。', py: 'Hǎo. Wǒ ài chī shuǐguǒ.', en: 'OK. I love eating fruit.' }
        ]
      }
    ]
  },
  {
    id: 'a-grammar',
    type: 'grammar',
    part: 'A',
    partLabel: 'PART A · 天气预报包裹',
    name: '语言点工位',
    py: 'Yǔyán diǎn gōngwèi',
    en: 'Grammar stations',
    minutes: 11,
    bg: 'assets/bg/a-grammar.webp',
    lesson: '第12课 · 怎么样 / 太…了 / 会(2)',
    story: '三个能量工位：修好语法核心，包裹才能充电。',
    stations: [
      {
        title: '……怎么样？',
        titlePy: '…zěnmeyàng?',
        titleEn: 'How is …?',
        tip: '问情况或意见。对比：怎么 + V（怎么去？）',
        tipEn: 'Ask about a situation. Contrast: 怎么 + verb.',
        mechanic: 'pick',
        prompt: '选正确的问法：问「天气」。',
        py: 'Xuǎn zhèngquè de wènfǎ.',
        en: 'Choose the correct way to ask about weather.',
        options: [
          { id: 'ok', zh: '今天天气怎么样？', py: 'Jīntiān tiānqì zěnmeyàng?', en: 'How is today’s weather?' },
          { id: 'bad1', zh: '今天天气怎么？', py: 'Jīntiān tiānqì zěnme?', en: '(incomplete)' },
          { id: 'bad2', zh: '怎么天气今天？', py: 'Zěnme tiānqì jīntiān?', en: '(wrong order)' }
        ],
        target: 'ok',
        say: '今天天气怎么样？', sayPy: 'Jīntiān tiānqì zěnmeyàng?', sayEn: 'How is today’s weather?'
      },
      {
        title: '太……了',
        titlePy: 'Tài…le',
        titleEn: 'Too …',
        tip: '太 + 形容词 + 了。不太 + 形容词。',
        tipEn: '太 + adj + 了. 不太 + adj.',
        mechanic: 'words',
        prompt: '组装：今天太热了。',
        py: 'Zǔzhuāng jùzi.',
        en: 'Build: It is too hot today.',
        words: ['今天', '太', '热', '了'],
        pys: ['jīntiān', 'tài', 'rè', 'le'],
        engs: ['today', 'too', 'hot', 'LE'],
        say: '今天太热了！', sayPy: 'Jīntiān tài rè le!', sayEn: 'It is too hot today!'
      },
      {
        title: '会(2) 表可能',
        titlePy: 'Huì = possibility',
        titleEn: '会 for possibility',
        tip: '明天会下雨吗？— 会 / 不会。',
        tipEn: 'Will it rain? — will / will not.',
        mechanic: 'levers',
        prompt: '王小姐会来吗？选「会」。',
        py: 'Wáng xiǎojiě huì lái ma?',
        en: 'Will Miss Wang come? Choose 会.',
        question: '王小姐会来吗？',
        questionPy: 'Wáng xiǎojiě huì lái ma?',
        target: 'yes',
        say: '她会来。', sayPy: 'Tā huì lái.', sayEn: 'She will come.'
      }
    ]
  },
  {
    id: 'a-dialog',
    type: 'dialog',
    part: 'A',
    partLabel: 'PART A · 天气预报包裹',
    name: '对讲机对练',
    py: 'Duìjiǎngjī duìliàn',
    en: 'Radio dialogue drill',
    minutes: 7,
    bg: 'assets/bg/a-dialog.webp',
    lesson: '第12课 · 回复选择',
    story: '总部对讲机来电！选正确的中文回复。',
    drills: [
      {
        cue: '明天天气怎么样？',
        cuePy: 'Míngtiān tiānqì zěnmeyàng?',
        cueEn: 'How is the weather tomorrow?',
        options: [
          { id: 'ok', zh: '明天会下雨。', py: 'Míngtiān huì xià yǔ.', en: 'It will rain.' },
          { id: 'bad', zh: '我爱吃水果。', py: 'Wǒ ài chī shuǐguǒ.', en: 'I love fruit.' }
        ],
        target: 'ok',
        say: '明天会下雨。', sayPy: 'Míngtiān huì xià yǔ.', sayEn: 'It will rain tomorrow.'
      },
      {
        cue: '今天太热了！',
        cuePy: 'Jīntiān tài rè le!',
        cueEn: 'Too hot today!',
        options: [
          { id: 'ok', zh: '北京昨天很冷。', py: 'Běijīng zuótiān hěn lěng.', en: 'Beijing was cold yesterday.' },
          { id: 'bad', zh: '喂，你好！', py: 'Wéi, nǐ hǎo!', en: 'Hello (phone).' }
        ],
        target: 'ok',
        say: '北京昨天很冷。', sayPy: 'Běijīng zuótiān hěn lěng.', sayEn: 'Beijing was very cold yesterday.'
      },
      {
        cue: '你身体怎么样？',
        cuePy: 'Nǐ shēntǐ zěnmeyàng?',
        cueEn: 'How is your health?',
        options: [
          { id: 'ok', zh: '我身体很好。', py: 'Wǒ shēntǐ hěn hǎo.', en: 'I am fine.' },
          { id: 'bad', zh: '明天会下雨吗？', py: 'Míngtiān huì xià yǔ ma?', en: 'Will it rain?' }
        ],
        target: 'ok',
        say: '我身体很好。', sayPy: 'Wǒ shēntǐ hěn hǎo.', sayEn: 'I am very healthy.'
      },
      {
        cue: '多吃些水果，多喝水。',
        cuePy: 'Duō chī xiē shuǐguǒ, duō hē shuǐ.',
        cueEn: 'Eat more fruit, drink water.',
        options: [
          { id: 'ok', zh: '好。我爱吃水果。', py: 'Hǎo. Wǒ ài chī shuǐguǒ.', en: 'OK. I love fruit.' },
          { id: 'bad', zh: '她会来。', py: 'Tā huì lái.', en: 'She will come.' }
        ],
        target: 'ok',
        say: '好。我爱吃水果。', sayPy: 'Hǎo. Wǒ ài chī shuǐguǒ.', sayEn: 'OK. I love eating fruit.'
      }
    ]
  },
  {
    id: 'a-planet',
    type: 'planet',
    part: 'A',
    partLabel: 'PART A · 天气预报包裹',
    name: '天气星球闯关',
    py: 'Tiānqì xīngqiú chuǎngguān',
    en: 'Weather planet run',
    minutes: 10,
    bg: 'assets/bg/a-planet.webp',
    lesson: '第12课 · 配送',
    story: '密码齐了！飞向天气星球，送出天气预报包裹。',
    planetIndex: 0
  },

  /* ========== PART B · L13 ========== */
  {
    id: 'b-vocab',
    type: 'vocab',
    part: 'B',
    partLabel: 'PART B · 电话任务包裹',
    name: '生词舱',
    py: 'Shēngcí cāng',
    en: 'Vocab bay',
    minutes: 14,
    bg: 'assets/bg/b-vocab.webp',
    lesson: '第13课 · 10 词 + 大卫',
    story: '电话任务包裹需要新通讯词。一个一个点亮。',
    words: [
      { zh: '喂', py: 'wéi / wèi', en: 'hello (on phone)', icon: '📞' },
      { zh: '也', py: 'yě', en: 'also', icon: '➕' },
      { zh: '学习', py: 'xuéxí', en: 'to study / learn', icon: '📚' },
      { zh: '上午', py: 'shàngwǔ', en: 'morning', icon: '🌅' },
      { zh: '睡觉', py: 'shuìjiào', en: 'to sleep', icon: '😴' },
      { zh: '电视', py: 'diànshì', en: 'TV', icon: '📺' },
      { zh: '喜欢', py: 'xǐhuan', en: 'to like', icon: '👍' },
      { zh: '给', py: 'gěi', en: 'to / for (give)', icon: '👉' },
      { zh: '打电话', py: 'dǎ diànhuà', en: 'to make a phone call', icon: '📱' },
      { zh: '吧', py: 'ba', en: 'suggestion particle', icon: '💬' },
      { zh: '大卫', py: 'Dàwèi', en: 'David (name)', icon: '👦' }
    ]
  },
  {
    id: 'b-phrase',
    type: 'phrase',
    part: 'B',
    partLabel: 'PART B · 电话任务包裹',
    name: '词组对接站',
    py: 'Cízǔ duìjiē zhàn',
    en: 'Phrase dock',
    minutes: 8,
    bg: 'assets/bg/b-phrase.webp',
    lesson: '第13课 · 在…呢 / 吧',
    story: '把电话口令块装进信号板。',
    phrases: [
      { words: ['在', '做什么', '呢'], pys: ['zài', 'zuò shénme', 'ne'], engs: ['-ing', 'what doing', 'NE'], say: '在做什么呢', sayPy: 'Zài zuò shénme ne', sayEn: 'What are you doing' },
      { words: ['在', '睡觉', '呢'], pys: ['zài', 'shuìjiào', 'ne'], engs: ['-ing', 'sleep', 'NE'], say: '在睡觉呢', sayPy: 'Zài shuìjiào ne', sayEn: 'Is sleeping' },
      { words: ['在', '学做中国菜', '呢'], pys: ['zài', 'xué zuò Zhōngguó cài', 'ne'], engs: ['-ing', 'learn Chinese cooking', 'NE'], say: '在学做中国菜呢', sayPy: 'Zài xué zuò Zhōngguó cài ne', sayEn: 'Learning Chinese cooking' },
      { words: ['没在', '看电视'], pys: ['méi zài', 'kàn diànshì'], engs: ['not -ing', 'watch TV'], say: '没在看电视', sayPy: 'Méi zài kàn diànshì', sayEn: 'Not watching TV' },
      { words: ['打电话', '吧'], pys: ['dǎ diànhuà', 'ba'], engs: ['call', 'BA'], say: '打电话吧', sayPy: 'Dǎ diànhuà ba', sayEn: "Let's call" },
      { words: ['喜欢', '看电视'], pys: ['xǐhuan', 'kàn diànshì'], engs: ['like', 'watch TV'], say: '喜欢看电视', sayPy: 'Xǐhuan kàn diànshì', sayEn: 'Like watching TV' }
    ]
  },
  {
    id: 'b-text',
    type: 'text',
    part: 'B',
    partLabel: 'PART B · 电话任务包裹',
    name: '课文信号',
    py: 'Kèwén xìnhào',
    en: 'Text scenes',
    minutes: 11,
    bg: 'assets/bg/b-text.webp',
    lesson: '第13课 · 三个情景',
    story: '通讯频道播放三段电话与日常对话。',
    scenes: [
      {
        title: '情景1 · 打电话',
        titlePy: 'Dǎ diànhuà',
        titleEn: 'Phone call',
        lines: [
          { who: 'A', zh: '喂，你好！你在做什么呢？', py: 'Wéi, nǐ hǎo! Nǐ zài zuò shénme ne?', en: 'Hello! What are you doing?' },
          { who: 'B', zh: '我在学做中国菜呢。', py: 'Wǒ zài xué zuò Zhōngguó cài ne.', en: 'I am learning to cook Chinese food.' },
          { who: 'A', zh: '大卫也在学习汉语吗？', py: 'Dàwèi yě zài xuéxí Hànyǔ ma?', en: 'Is David also studying Chinese?' },
          { who: 'B', zh: '对，他也在学习呢。', py: 'Duì, tā yě zài xuéxí ne.', en: 'Yes, he is studying too.' }
        ]
      },
      {
        title: '情景2 · 昨天上午 + 喜欢',
        titlePy: 'Zuótiān shàngwǔ',
        titleEn: 'Yesterday morning + likes',
        lines: [
          { who: 'A', zh: '昨天上午你在做什么呢？', py: 'Zuótiān shàngwǔ nǐ zài zuò shénme ne?', en: 'What were you doing yesterday morning?' },
          { who: 'B', zh: '我在睡觉呢。', py: 'Wǒ zài shuìjiào ne.', en: 'I was sleeping.' },
          { who: 'A', zh: '你喜欢看电视吗？', py: 'Nǐ xǐhuan kàn diànshì ma?', en: 'Do you like watching TV?' },
          { who: 'B', zh: '我喜欢看电影。我也喜欢看电视。', py: 'Wǒ xǐhuan kàn diànyǐng. Wǒ yě xǐhuan kàn diànshì.', en: 'I like movies. I also like TV.' }
        ]
      },
      {
        title: '情景3 · 打电话吧',
        titlePy: 'Dǎ diànhuà ba',
        titleEn: "Let's call",
        lines: [
          { who: 'A', zh: '李老师的电话号码是多少？', py: 'Lǐ lǎoshī de diànhuà hàomǎ shì duōshao?', en: "What's Teacher Li's number?" },
          { who: 'B', zh: '一三八……（1 读 yāo）', py: 'Yāo sān bā…', en: '138… (1 = yāo)' },
          { who: 'A', zh: '我给李老师打电话吧。', py: 'Wǒ gěi Lǐ lǎoshī dǎ diànhuà ba.', en: "I'll call Teacher Li." },
          { who: 'B', zh: '好。', py: 'Hǎo.', en: 'OK.' }
        ]
      }
    ]
  },
  {
    id: 'b-grammar',
    type: 'grammar',
    part: 'B',
    partLabel: 'PART B · 电话任务包裹',
    name: '语言点工位',
    py: 'Yǔyán diǎn gōngwèi',
    en: 'Grammar stations',
    minutes: 11,
    bg: 'assets/bg/b-grammar.webp',
    lesson: '第13课 · 喂 / 在…呢 / 号码 / 吧',
    story: '四个通讯工位，修好才能拨号配送。',
    stations: [
      {
        title: '叹词「喂」',
        titlePy: 'Wéi',
        titleEn: 'Phone hello',
        tip: '打电话开头用「喂」；当面用「你好」。',
        tipEn: '喂 on the phone; 你好 face to face.',
        mechanic: 'pick',
        prompt: '电话响了，你说？',
        py: 'Diànhuà xiǎng le.',
        en: 'The phone is ringing. You say…',
        options: [
          { id: 'ok', zh: '喂', py: 'wéi', en: 'Hello (phone)' },
          { id: 'bad1', zh: '你好', py: 'nǐ hǎo', en: 'Hello (face)' },
          { id: 'bad2', zh: '再见', py: 'zàijiàn', en: 'Bye' }
        ],
        target: 'ok',
        say: '喂，你好！', sayPy: 'Wéi, nǐ hǎo!', sayEn: 'Hello!'
      },
      {
        title: '在……呢',
        titlePy: 'Zài…ne',
        titleEn: 'Be doing…',
        tip: '正在做：我在学习呢。否定：没在……',
        tipEn: 'Ongoing action. Negative: 没在…',
        mechanic: 'words',
        prompt: '组装：我在学做中国菜呢。',
        py: 'Zǔzhuāng.',
        en: 'Build the sentence.',
        words: ['我', '在', '学做中国菜', '呢'],
        pys: ['wǒ', 'zài', 'xué zuò Zhōngguó cài', 'ne'],
        engs: ['I', '-ing', 'learn cooking', 'NE'],
        say: '我在学做中国菜呢。', sayPy: 'Wǒ zài xué zuò Zhōngguó cài ne.', sayEn: 'I am learning to cook Chinese food.'
      },
      {
        title: '电话号码 · 1=yāo',
        titlePy: 'Diànhuà hàomǎ',
        titleEn: 'Phone numbers',
        tip: '读号码时 1 读 yāo，不是 yī。',
        tipEn: 'In phone numbers, 1 is yāo.',
        mechanic: 'dial',
        prompt: '拨短号 138（1=yāo）。',
        py: 'Bō 138.',
        en: 'Dial 138 (1 = yāo).',
        code: ['1', '3', '8'],
        say: '一三八', sayPy: 'yāo sān bā', sayEn: 'yāo-sān-bā'
      },
      {
        title: '……吧',
        titlePy: '…ba',
        titleEn: 'Suggestion 吧',
        tip: '提建议：我给李老师打电话吧。',
        tipEn: 'Soft suggestion with 吧.',
        mechanic: 'words',
        prompt: '组装建议口令。',
        py: 'Zǔzhuāng jiànyì.',
        en: 'Build the suggestion.',
        words: ['我', '给', '李老师', '打电话', '吧'],
        pys: ['wǒ', 'gěi', 'Lǐ lǎoshī', 'dǎ diànhuà', 'ba'],
        engs: ['I', 'to', 'Teacher Li', 'call', 'BA'],
        say: '我给李老师打电话吧。', sayPy: 'Wǒ gěi Lǐ lǎoshī dǎ diànhuà ba.', sayEn: "I'll call Teacher Li."
      }
    ]
  },
  {
    id: 'b-dialog',
    type: 'dialog',
    part: 'B',
    partLabel: 'PART B · 电话任务包裹',
    name: '对讲机对练',
    py: 'Duìjiǎngjī duìliàn',
    en: 'Radio dialogue drill',
    minutes: 7,
    bg: 'assets/bg/b-dialog.webp',
    lesson: '第13课 · 回复选择',
    story: '电话频道测试：选正确回复。',
    drills: [
      {
        cue: '喂，你在做什么呢？',
        cuePy: 'Wéi, nǐ zài zuò shénme ne?',
        cueEn: 'Hello, what are you doing?',
        options: [
          { id: 'ok', zh: '我在学做中国菜呢。', py: 'Wǒ zài xué zuò Zhōngguó cài ne.', en: 'Learning Chinese cooking.' },
          { id: 'bad', zh: '今天太热了！', py: 'Jīntiān tài rè le!', en: 'Too hot!' }
        ],
        target: 'ok',
        say: '我在学做中国菜呢。', sayPy: 'Wǒ zài xué zuò Zhōngguó cài ne.', sayEn: 'I am learning to cook Chinese food.'
      },
      {
        cue: '昨天上午你在做什么呢？',
        cuePy: 'Zuótiān shàngwǔ nǐ zài zuò shénme ne?',
        cueEn: 'What were you doing yesterday morning?',
        options: [
          { id: 'ok', zh: '我在睡觉呢。', py: 'Wǒ zài shuìjiào ne.', en: 'I was sleeping.' },
          { id: 'bad', zh: '明天会下雨。', py: 'Míngtiān huì xià yǔ.', en: 'It will rain.' }
        ],
        target: 'ok',
        say: '我在睡觉呢。', sayPy: 'Wǒ zài shuìjiào ne.', sayEn: 'I was sleeping.'
      },
      {
        cue: '你喜欢看电视吗？',
        cuePy: 'Nǐ xǐhuan kàn diànshì ma?',
        cueEn: 'Do you like watching TV?',
        options: [
          { id: 'ok', zh: '我喜欢看电影。我也喜欢看电视。', py: 'Wǒ xǐhuan kàn diànyǐng. Wǒ yě xǐhuan kàn diànshì.', en: 'I like movies and TV.' },
          { id: 'bad', zh: '她会来。', py: 'Tā huì lái.', en: 'She will come.' }
        ],
        target: 'ok',
        say: '我也喜欢看电视。', sayPy: 'Wǒ yě xǐhuan kàn diànshì.', sayEn: 'I also like watching TV.'
      },
      {
        cue: '李老师的电话号码是多少？',
        cuePy: 'Lǐ lǎoshī de diànhuà hàomǎ shì duōshao?',
        cueEn: "What's Teacher Li's number?",
        options: [
          { id: 'ok', zh: '我给李老师打电话吧。', py: 'Wǒ gěi Lǐ lǎoshī dǎ diànhuà ba.', en: "I'll call her." },
          { id: 'bad', zh: '不太冷。', py: 'Bú tài lěng.', en: 'Not too cold.' }
        ],
        target: 'ok',
        say: '我给李老师打电话吧。', sayPy: 'Wǒ gěi Lǐ lǎoshī dǎ diànhuà ba.', sayEn: "I'll call Teacher Li."
      }
    ]
  },
  {
    id: 'b-planet',
    type: 'planet',
    part: 'B',
    partLabel: 'PART B · 电话任务包裹',
    name: '电话星球闯关',
    py: 'Diànhuà xīngqiú chuǎngguān',
    en: 'Phone planet run',
    minutes: 10,
    bg: 'assets/bg/b-planet.webp',
    lesson: '第13课 · 配送',
    story: '信号已通！飞向电话星球，送出电话任务包裹。',
    planetIndex: 1
  },

  {
    id: 'finale',
    type: 'finale',
    part: 'END',
    partLabel: '任务完成',
    name: '领取快递员奖章',
    py: 'Lǐngqǔ jiǎngzhāng',
    en: 'Courier medal',
    minutes: 5,
    bg: 'assets/bg/finale.webp',
    story: '两个包裹全部送达！Courier 是中文星际快递员。'
  }
];

const SECTION_INDEX = Object.fromEntries(SECTIONS.map((s, i) => [s.id, i]));

function countStarsForSection(sec) {
  if (sec.type === 'briefing' || sec.type === 'finale') return 1;
  if (sec.type === 'vocab') return sec.words.length;
  if (sec.type === 'phrase') return sec.phrases.length;
  if (sec.type === 'text') return sec.scenes.length;
  if (sec.type === 'grammar') return sec.stations.length;
  if (sec.type === 'dialog') return sec.drills.length;
  if (sec.type === 'planet') return PLANETS[sec.planetIndex].tasks.length;
  return 0;
}

const TOTAL_STARS = SECTIONS.reduce((n, s) => n + countStarsForSection(s), 0);

const TIMING_GUIDE = [
  { part: 'HQ · 出发', min: 5, detail: '双包任务简报、星图目标' },
  { part: 'A1 生词舱 L12', min: '15–18', detail: '13 词动画卡片 + 点选词义' },
  { part: 'A2 词组对接', min: '8–10', detail: '太热了 / 会下雨 / 怎么样…' },
  { part: 'A3 课文信号', min: '10–12', detail: '三情景气泡 + 角色扮演' },
  { part: 'A4 语言点工位', min: '10–12', detail: '怎么样 / 太…了 / 会(2)' },
  { part: 'A5 对讲机对练', min: '5–8', detail: '选回复 + 说给老师' },
  { part: 'A6 天气星球闯关', min: '8–10', detail: '热灯 / 组句 / 会不会杠杆' },
  { part: 'B1–B6 电话包裹', min: '~50', detail: '同结构：生词→词组→课文→语法→对话→闯关' },
  { part: 'Finale', min: 5, detail: '双包送达、奖章、LEILA' }
];

const BRIEFING = {
  title: '星际快递员',
  titlePy: 'Xīngjì Kuàidìyuán',
  titleEn: 'Space Courier',
  line: '总部派你送两个包裹。先学密码，再飞星球配送！约 120 分钟。',
  linePy: 'Xiān xué mìmǎ, zài fēi xīngqiú.',
  lineEn: 'Learn the codes first, then fly the planet deliveries. ~120 minutes.'
};
