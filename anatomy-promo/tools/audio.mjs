// Procedural soundtrack: dark pad, a pulse that drives the case sections, risers into each
// cut and low impacts on the cuts. Writes ../out/soundtrack.wav (44.1 kHz, 16-bit stereo).
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../out');
mkdirSync(out, { recursive: true });

const SR = 44100, DUR = 118, N = SR * DUR;
const L = new Float32Array(N), Rt = new Float32Array(N);
const TAU = Math.PI * 2;
let seed = 7;
const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2147483648 - 1; };

const CHORDS = [
  [73.42, 146.83, 220, 293.66, 349.23], // Dm
  [58.27, 116.54, 233.08, 293.66, 349.23], // Bb
  [87.31, 130.81, 261.63, 329.63, 392], // F
  [65.41, 130.81, 196, 261.63, 329.63], // C
];
const CH = 4.8;
const BEAT = 0.6;
const CUTS = [9.3, 31.2, 49, 68, 87, 101.2];
const energy = t => {
  if (t < 9.3) return 0.55;
  if (t < 21) return 0.75;
  if (t < 31.2) return 0.85;
  if (t < 101.2) return 1;
  return Math.max(0.6, 1 - (t - 101.2) * 0.03);
};

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const pos = t / CH, idx = Math.floor(pos), frac = pos - idx;
  const xf = frac > 0.85 ? 0.5 - 0.5 * Math.cos(Math.PI * (frac - 0.85) / 0.15) : 0;
  let l = 0, r = 0;
  for (const [c, w] of [[idx, 1 - xf], [idx + 1, xf]]) {
    if (w <= 0) continue;
    CHORDS[c % 4].forEach((f, k) => {
      const amp = (k === 0 ? 0.5 : 0.26) * w;
      const trem = 0.8 + 0.2 * Math.sin(TAU * (0.11 + k * 0.07) * t + k);
      l += amp * trem * (Math.sin(TAU * f * 0.997 * t) + 0.22 * Math.sin(TAU * f * 2.004 * t));
      r += amp * trem * (Math.sin(TAU * f * 1.003 * t + 1) + 0.22 * Math.sin(TAU * f * 1.996 * t + 2));
    });
  }
  const g = 0.075 * energy(t);
  L[i] = l * g; Rt[i] = r * g;
}

function addKick(t0, gain) {
  const s0 = Math.floor(t0 * SR);
  for (let j = 0; j < SR * 0.45 && s0 + j < N; j++) {
    const tt = j / SR;
    const f = 48 + 90 * Math.exp(-tt * 28);
    const v = gain * Math.sin(TAU * f * tt) * Math.exp(-tt * 7);
    L[s0 + j] += v; Rt[s0 + j] += v;
  }
}
function addHat(t0, gain) {
  const s0 = Math.floor(t0 * SR); let prev = 0;
  for (let j = 0; j < SR * 0.08 && s0 + j < N; j++) {
    const n = noise(); const hp = n - prev; prev = n;
    const v = gain * hp * Math.exp(-j / SR * 60);
    L[s0 + j] += v * 0.8; Rt[s0 + j] += v;
  }
}
function addArp(t0, f, gain) {
  const s0 = Math.floor(t0 * SR);
  for (let j = 0; j < SR * 0.5 && s0 + j < N; j++) {
    const tt = j / SR;
    const v = gain * Math.exp(-tt * 6) * (Math.sin(TAU * f * tt) + 0.4 * Math.sin(TAU * f * 2 * tt) * Math.exp(-tt * 10));
    L[s0 + j] += v * 0.7; Rt[s0 + j] += v;
  }
}
function addImpact(t0, gain) {
  const s0 = Math.floor(t0 * SR); let lp = 0;
  for (let j = 0; j < SR * 2.2 && s0 + j < N; j++) {
    const tt = j / SR;
    lp += (noise() - lp) * 0.08;
    const boom = Math.sin(TAU * (38 + 40 * Math.exp(-tt * 6)) * tt) * Math.exp(-tt * 2.2);
    const v = gain * (boom * 0.9 + lp * 1.6 * Math.exp(-tt * 3));
    L[s0 + j] += v; Rt[s0 + j] += v;
  }
}
function addRiser(t1, len, gain) {
  const s0 = Math.floor((t1 - len) * SR), n = Math.floor(len * SR); let bp = 0, bp2 = 0;
  for (let j = 0; j < n; j++) {
    if (s0 + j < 0 || s0 + j >= N) continue;
    const u = j / n;
    const k = 0.01 + u * u * 0.25;
    bp += (noise() - bp) * k; bp2 += (bp - bp2) * k;
    const v = gain * (bp - bp2) * 4 * u * u;
    L[s0 + j] += v; Rt[s0 + j] += v * 0.9;
  }
}

const ARP = [587.33, 698.46, 880, 698.46, 466.16, 587.33, 698.46, 587.33, 523.25, 659.25, 783.99, 659.25, 523.25, 659.25, 783.99, 1046.5];
for (let b = 0, t = 21; t < 101; b++, t = 21 + b * BEAT) {
  const inCase = t >= 31.2;
  addKick(t, inCase ? 0.5 : 0.3);
  if (inCase) addHat(t + BEAT / 2, 0.06);
  if (inCase && b % 2 === 0) addArp(t, ARP[(b / 2) % 16], 0.05);
}
CUTS.forEach(c => { addRiser(c, 1.8, 0.35); addImpact(c, 0.55); });
[9.3, 108.4].forEach(t => addImpact(t, 0.4));

function reverb(x, s) {
  const combs = [1557, 1617, 1491, 1422].map(d => ({ d: d + s, buf: new Float32Array(d + s), i: 0 }));
  const aps = [225, 556].map(d => ({ d, buf: new Float32Array(d), i: 0 }));
  const y = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    let v = 0;
    for (const c of combs) { const o = c.buf[c.i]; c.buf[c.i] = x[n] + o * 0.82; c.i = (c.i + 1) % c.d; v += o; }
    v *= 0.25;
    for (const a of aps) { const o = a.buf[a.i]; const w = v + o * 0.5; a.buf[a.i] = w; a.i = (a.i + 1) % a.d; v = o - w * 0.5; }
    y[n] = v;
  }
  return y;
}
const rl = reverb(L, 0), rr = reverb(Rt, 23);
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 1.5, (DUR - t) / 2.5);
  L[i] = Math.tanh((L[i] * 0.8 + rl[i] * 0.4) * 1.2) * fade;
  Rt[i] = Math.tanh((Rt[i] * 0.8 + rr[i] * 0.4) * 1.2) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(Rt[i]));
}
const norm = 0.8 / peak;
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
