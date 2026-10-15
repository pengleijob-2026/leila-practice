from pypinyin import pinyin, Style, load_phrases_dict
load_phrases_dict({'觉得':[['jué'],['de']],'眼睛':[['yǎn'],['jing']],'什么':[['shén'],['me']],'为什么':[['wèi'],['shén'],['me']],'想一想':[['xiǎng'],['yi'],['xiǎng']],'说一说':[['shuō'],['yi'],['shuō']],'当铺':[['dàng'],['pù']],'无它乎':[['wú'],['tā'],['hū']],'花花':[['huā'],['hua']],'喜欢':[['xǐ'],['huan']],'东西':[['dōng'],['xi']],'时候':[['shí'],['hou']],'什么时候':[['shén'],['me'],['shí'],['hou']],'膝盖':[['xī'],['gài']],'一只':[['yì'],['zhī']],'一条':[['yì'],['tiáo']],'一起':[['yì'],['qǐ']],'耳朵':[['ěr'],['duo']],'小砚':[['xiǎo'],['yàn']],'不冷':[['bù'],['lěng']],'不热':[['bú'],['rè']],'不A':[['bù']],'呱呱':[['guā'],['guā']],'下一课':[['xià'],['yí'],['kè']],'一遍':[['yí'],['biàn']]})
def isHan(c): return 0x3400<=ord(c)<=0x9fff
def py(text):
    out=[]
    for seg in pinyin(text,style=Style.TONE,errors=lambda x:[None]*len(x) if False else [[None] for _ in x]):
        pass
    toks=pinyin(text,style=Style.TONE,errors='ignore')
    return ' '.join(t[0] for t in toks)
if __name__=='__main__':
    for t in ['九月去北京旅游最好','我觉得踢足球最好','为什么','不A也不B','九月的北京，不冷也不热。','它叫花花。','左边「目」：一只眼睛','什么时候去最好？','和小砚说一说','画龙点睛']:
        print(t,'|',py(t))
