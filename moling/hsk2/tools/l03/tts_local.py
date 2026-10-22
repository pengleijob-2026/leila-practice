"""第 5 集本地配音（sherpa-onnx kokoro，不调用外部模型）。

逐句合成 → 去首尾静音 → 拼成 lesson.wav（小课堂）和 kewen.wav（课文），
每句在文件里的起止秒数写进 timing.json，时间线脚本按它精确切片。
用法：python tts_local.py /tmp/ep05/local
"""
import json, os, re, sys
import numpy as np
import soundfile as sf

sys.path.insert(0, "/tmp/tts")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tts import tts  # noqa: E402
from script import S  # noqa: E402
from kewen_text import TEXTS, INTRO, OUTRO, SID, SPEED  # noqa: E402

LEI = 10
SR = 24000


def norm(t):
    t = t.replace("HSK 2", "H S K two").replace("Xiao Yan", "小燕")
    return re.sub(r"\s+", " ", t).strip()


def synth(text, sid, speed):
    a = tts.generate(norm(text), sid=sid, speed=speed)
    x = np.asarray(a.samples, dtype=np.float32)
    assert a.sample_rate == SR
    idx = np.where(np.abs(x) > 0.01)[0]
    if len(idx):
        x = x[max(0, idx[0] - int(0.03 * SR)): idx[-1] + int(0.08 * SR)]
    return x


class Track:
    def __init__(self):
        self.parts, self.t = [], 0.0

    def add(self, x, gap):
        a = self.t
        self.parts.append(x)
        self.t += len(x) / SR
        b = self.t
        self.parts.append(np.zeros(int(gap * SR), np.float32))
        self.t += gap
        return [round(a, 3), round(b, 3)]

    def save(self, path):
        sf.write(path, np.concatenate(self.parts), SR)


def main(out):
    os.makedirs(out, exist_ok=True)
    tm = {"lesson": {}, "kewen": {}}
    L = Track()
    L.add(np.zeros(int(0.3 * SR), np.float32), 0)
    for i, lines in S.items():
        rows = []
        for n, (spoken, _, _) in enumerate(lines):
            vocab = i == 1 and n > 0
            rows.append(L.add(synth(spoken, LEI, 0.8 if vocab else 0.95), 0.9 if vocab else 0.35))
        L.t += 0.8
        L.parts.append(np.zeros(int(0.8 * SR), np.float32))
        tm["lesson"][i] = rows
    L.save(f"{out}/lesson.wav")
    K = Track()
    K.add(np.zeros(int(0.3 * SR), np.float32), 0)
    tm["kewen"]["intro"] = [K.add(synth(t, LEI, 0.95), 0.3) for t in INTRO]
    for tx in TEXTS:
        tm["kewen"][tx["n"]] = [K.add(synth(zh.replace("|", ""), SID[who], SPEED.get(who, 0.9)), 0.6)
                                for _, who, zh, *_ in tx["lines"]]
    tm["kewen"]["outro"] = [K.add(synth(t, LEI, 0.95), 0.3) for t in OUTRO]
    K.save(f"{out}/kewen.wav")
    tm["dur"] = {"lesson": round(L.t, 3), "kewen": round(K.t, 3)}
    json.dump(tm, open(f"{out}/timing.json", "w"), ensure_ascii=False, indent=1)
    print(tm["dur"])


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "/tmp/ep05/local")
