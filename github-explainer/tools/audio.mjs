// Procedural ambient soundtrack: slow pad chords + soft bell pings on key animation beats.
// Writes ../out/soundtrack.wav (44.1 kHz, 16-bit stereo).
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../out');
mkdirSync(out, { recursive: true });

const SR = 44100, DUR = 194, N = SR * DUR;
const L = new Float32Array(N), Rt = new Float32Array(N);

const CHORDS = [
  [110, 220, 261.63, 329.63], // Am
  [87.31, 174.61, 220, 261.63], // F
  [130.81, 196, 261.63, 329.63], // C
  [98, 146.83, 196, 246.94], // G
];
const CH = 8;
const swell = t => 1 + 0.35 * Math.exp(-(((t - 9) / 4) ** 2)) + 0.3 * Math.exp(-(((t - 80) / 8) ** 2)) + 0.45 * Math.exp(-(((t - 187) / 6) ** 2));

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const pos = t / CH, idx = Math.floor(pos), frac = pos - idx;
  const xf = frac > 0.8 ? 0.5 - 0.5 * Math.cos(Math.PI * (frac - 0.8) / 0.2) : 0;
  let l = 0, r = 0;
  for (const [c, w] of [[idx, 1 - xf], [idx + 1, xf]]) {
    if (w <= 0) continue;
    const notes = CHORDS[c % 4];
    notes.forEach((f, k) => {
      const amp = (k === 0 ? 0.55 : 0.32) * w;
      const trem = 0.85 + 0.15 * Math.sin(2 * Math.PI * (0.13 + k * 0.05) * t + k);
      l += amp * trem * (Math.sin(2 * Math.PI * f * 0.998 * t) + 0.25 * Math.sin(2 * Math.PI * f * 2.003 * t));
      r += amp * trem * (Math.sin(2 * Math.PI * f * 1.002 * t + 1) + 0.25 * Math.sin(2 * Math.PI * f * 1.997 * t + 2));
    });
  }
  const g = 0.09 * swell(t);
  L[i] = l * g; Rt[i] = r * g;
}

const PINGS = [];
for (let i = 0; i < 7; i++) PINGS.push(30 + 1.2 + i * 1.4);
[0.5, 0.8, 1.1, 3.8, 6.2, 7, 8.8, 12.6, 14].forEach(x => PINGS.push(52 + x));
[2.6, 9.8, 16.4, 21, 31.4, 34.8].forEach(x => PINGS.push(112 + x));
[7.2, 12].forEach(x => PINGS.push(148 + x));
[6.5, 74.5, 86.5, 180.5].forEach(x => PINGS.push(x));
const SCALE = [880, 1046.5, 1318.5, 1174.7, 784, 987.8];
PINGS.sort((a, b) => a - b).forEach((t0, k) => {
  const f = SCALE[k % SCALE.length], s0 = Math.floor(t0 * SR), len = SR * 3;
  const pan = 0.5 + 0.3 * Math.sin(k * 1.7);
  for (let j = 0; j < len && s0 + j < N; j++) {
    const tt = j / SR;
    const env = Math.min(1, tt / 0.004) * Math.exp(-tt * 2.2);
    const v = 0.07 * env * (Math.sin(2 * Math.PI * f * tt) + 0.3 * Math.sin(2 * Math.PI * f * 2.76 * tt) * Math.exp(-tt * 4));
    L[s0 + j] += v * (1 - pan); Rt[s0 + j] += v * pan;
  }
});

function reverb(x, seed) {
  const combs = [1557, 1617, 1491, 1422].map(d => ({ d: d + seed, buf: new Float32Array(d + seed), i: 0 }));
  const aps = [225, 556].map(d => ({ d, buf: new Float32Array(d), i: 0 }));
  const y = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    let s = 0;
    for (const c of combs) { const o = c.buf[c.i]; c.buf[c.i] = x[n] + o * 0.84; c.i = (c.i + 1) % c.d; s += o; }
    s *= 0.25;
    for (const a of aps) { const o = a.buf[a.i]; const v = s + o * 0.5; a.buf[a.i] = v; a.i = (a.i + 1) % a.d; s = o - v * 0.5; }
    y[n] = s;
  }
  return y;
}
const rl = reverb(L, 0), rr = reverb(Rt, 23);
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 2.5, (DUR - t) / 3);
  L[i] = (L[i] * 0.7 + rl[i] * 0.55) * fade; Rt[i] = (Rt[i] * 0.7 + rr[i] * 0.55) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(Rt[i]));
}
const norm = 0.6 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, Rt[i] * norm)) * 32767), 46 + i * 4);
}
writeFileSync(path.join(out, 'soundtrack.wav'), buf);
console.log('wrote soundtrack.wav', DUR, 's');
