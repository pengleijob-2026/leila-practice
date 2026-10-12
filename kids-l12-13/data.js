'use strict';
const PLANETS = [
  {
    id: 'weather',
    name: '天气星球',
    py: 'Tiānqì Xīngqiú',
    en: 'Weather',
    package: '天气预报包裹',
    bg: 'assets/art/planet-weather.jpg',
    effect: 'storm',
    tasks: [
      {
        mechanic: 'hotspot',
        prompt: '点亮「热」',
        py: 'Diǎnliàng 「rè」',
        en: 'Light HOT',
        target: 'hot',
        spots: [
          { id: 'hot', zh: '热', py: 'rè', en: 'hot', x: 22, y: 40 },
          { id: 'cold', zh: '冷', py: 'lěng', en: 'cold', x: 50, y: 30 },
          { id: 'rain', zh: '下雨', py: 'xià yǔ', en: 'rain', x: 76, y: 44 }
        ],
        say: '今天太热了！',
        sayPy: 'Jīntiān tài rè le!',
        sayEn: 'Too hot today!'
      },
      {
        mechanic: 'words',
        prompt: '组装口令',
        py: 'Zǔzhuāng kǒulìng',
        en: 'Build the code',
        words: ['明天', '天气', '怎么样'],
        pys: ['míngtiān', 'tiānqì', 'zěnmeyàng'],
        engs: ['tomorrow', 'weather', 'how'],
        say: '明天天气怎么样？',
        sayPy: 'Míngtiān tiānqì zěnmeyàng?',
        sayEn: 'How is tomorrow’s weather?'
      },
      {
        mechanic: 'levers',
        prompt: '明天会下雨吗？',
        py: 'Míngtiān huì xià yǔ ma?',
        en: 'Will it rain?',
        target: 'yes',
        say: '明天会下雨。',
        sayPy: 'Míngtiān huì xià yǔ.',
        sayEn: 'It will rain.'
      }
    ]
  },
  {
    id: 'phone',
    name: '电话星球',
    py: 'Diànhuà Xīngqiú',
    en: 'Phone',
    package: '电话任务包裹',
    bg: 'assets/art/planet-phone.jpg',
    effect: 'signal',
    tasks: [
      {
        mechanic: 'rings',
        prompt: '接听！点「喂」',
        py: 'Jiētīng! Diǎn 「wéi」',
        en: 'Answer with 喂',
        target: 'wei',
        options: [
          { id: 'wei', zh: '喂', py: 'wéi', en: 'Hello!' },
          { id: 'nihao', zh: '你好', py: 'nǐ hǎo', en: 'Hi' },
          { id: 'zaijian', zh: '再见', py: 'zàijiàn', en: 'Bye' }
        ],
        say: '喂，你在做什么呢？',
        sayPy: 'Wéi, nǐ zài zuò shénme ne?',
        sayEn: 'Hello, what are you doing?'
      },
      {
        mechanic: 'scan',
        prompt: '大卫在做什么？',
        py: 'Dàwèi zài zuò shénme?',
        en: 'What is David doing?',
        target: 'cook',
        cards: [
          { id: 'sleep', zh: '睡觉', py: 'shuìjiào', en: 'sleep', icon: '😴' },
          { id: 'cook', zh: '学做中国菜', py: 'xué zuò Zhōngguó cài', en: 'cook', icon: '🍜' },
          { id: 'tv', zh: '看电视', py: 'kàn diànshì', en: 'TV', icon: '📺' }
        ],
        say: '他在学做中国菜呢。',
        sayPy: 'Tā zài xué zuò Zhōngguó cài ne.',
        sayEn: 'He’s learning Chinese cooking.'
      },
      {
        mechanic: 'dial',
        prompt: '拨号 + 建议',
        py: 'Bōhào + jiànyì',
        en: 'Dial + suggest',
        code: ['1', '3', '8'],
        words: ['我', '给', '李老师', '打电话', '吧'],
        pys: ['wǒ', 'gěi', 'Lǐ lǎoshī', 'dǎ diànhuà', 'ba'],
        engs: ['I', 'to', 'Teacher Li', 'call', 'ba'],
        say: '我给李老师打电话吧。',
        sayPy: 'Wǒ gěi Lǐ lǎoshī dǎ diànhuà ba.',
        sayEn: "I'll call Teacher Li."
      }
    ]
  }
];
const STORAGE_KEY = 'courier-mobile-v2';
