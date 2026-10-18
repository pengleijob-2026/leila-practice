// Synthesizes an original 126 BPM four-on-the-floor guide track that matches the
// video's beat grid: kick every beat, offbeat hats, a crash + sub drop on every
// scene change (every 16 beats) and a noise riser into each one.
import fs from "node:fs";

const SR = 44100, BPM = 126, BEAT = 60 / BPM;
const TOTAL_BEATS = 16 + 8 * 16 + 16;
const N = Math.ceil((TOTAL_BEATS * BEAT + 1.5) * SR);
const L = new Float32Array(N);
let seed = 1;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function add(start, len, fn) {
  const s0 = Math.floor(start * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n && s0 + i < N; i++) L[s0 + i] += fn(i / SR);
}
const kick = (t0, g = 1) => add(t0, 0.45, t => {
  const f = 45 + 120 * Math.exp(-t * 35);
  return g * 0.9 * Math.sin(2 * Math.PI * f * t - 0.0) * Math.exp(-t * 7);
});
const hat = (t0, g = 0.18) => add(t0, 0.08, t => g * rnd() * Math.exp(-t * 60));
const clap = t0 => add(t0, 0.2, t => 0.35 * rnd() * Math.exp(-t * 22));
const crash = t0 => add(t0, 1.8, t => 0.32 * rnd() * Math.exp(-t * 2.2));
const sub = (t0, f) => add(t0, BEAT * 4, t => 0.35 * Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 0.9));
const riser = (t0, len) => add(t0, len, t => { const p = t / len; return 0.22 * p * p * rnd() * (0.6 + 0.4 * Math.sin(2 * Math.PI * (4 + 28 * p) * t)); });
const chord = [98, 116.54, 146.83, 87.31]; // G2 Bb2 D3 F2 roots

for (let b = 0; b < TOTAL_BEATS; b++) {
  const t = b * BEAT;
  const inIntroBuild = b < 4;
  if (!inIntroBuild || b % 2 === 0) kick(t, b % 16 === 0 ? 1.2 : 1);
  hat(t + BEAT / 2);
  if (b >= 4) { hat(t + BEAT / 4, 0.07); hat(t + 3 * BEAT / 4, 0.07); }
  if (b % 2 === 1 && b >= 4) clap(t);
  if (b % 16 === 0) { crash(t); sub(t, 49); }
  if (b % 4 === 0) sub(t, chord[(b / 4) % 4] / 2);
  if (b % 16 === 12) riser(t, BEAT * 4);
  if (b >= 4 && b < 8) kick(t + BEAT / 2, 0.6); // logo rapid-fire on 8th notes
}

let peak = 0; for (const v of L) peak = Math.max(peak, Math.abs(v));
const buf = Buffer.alloc(44 + N * 2);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 2, 4); buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) buf.writeInt16LE(Math.round((L[i] / peak) * 0.89 * 32767), 44 + i * 2);
fs.writeFileSync(process.argv[2] || "guide-126bpm.wav", buf);
