// Procedural ancient-style score (pentatonic plucks, drone, temple bells, frame drum) -> /tmp/xz_music.wav
import fs from 'node:fs';

const SR = 44100, DUR = 118;
const N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
const CUTS = [9, 21, 31, 66, 94, 104];
const midi = m => 440 * Math.pow(2, (m - 69) / 12);

let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { L[i] += v * (1 - pan); R[i] += v * (1 + pan); } };

function pluck(t0, f, amp, pan = 0, decay = .996) {
  const p = Math.max(2, Math.round(SR / f)), buf = new Float32Array(p);
  for (let i = 0; i < p; i++) buf[i] = rnd() * 2 - 1;
  const len = SR * 3.5, start = Math.floor(t0 * SR);
  let idx = 0, prev = 0;
  for (let j = 0; j < len; j++) {
    const cur = buf[idx];
    const next = decay * .5 * (cur + prev);
    prev = cur; buf[idx] = next; idx = (idx + 1) % p;
    add(start + j, cur * amp * Math.min(1, j / 40), pan);
  }
}

function bell(t0, f, amp) {
  const parts = [[1, 1, 4], [2.76, .5, 2.2], [5.4, .3, 1.5], [8.93, .18, 1], [.5, .45, 6]];
  const start = Math.floor(t0 * SR);
  for (let j = 0; j < SR * 7; j++) {
    const t = j / SR;
    let v = 0;
    for (const [m, a, d] of parts) v += Math.sin(2 * Math.PI * f * m * t + m) * a * Math.exp(-t / d);
    add(start + j, v * amp * Math.min(1, j / 60), Math.sin(t * .5) * .2);
  }
}

function drum(t0, amp) {
  const start = Math.floor(t0 * SR);
  let lp = 0;
  for (let j = 0; j < SR * .8; j++) {
    const t = j / SR, f = 60 + 50 * Math.exp(-t * 20);
    lp += ((rnd() * 2 - 1) - lp) * .05;
    add(start + j, (Math.sin(2 * Math.PI * f * t) * .9 + lp * .5) * Math.exp(-t * 5) * amp);
  }
}

// D minor pentatonic: D F G A C
const SCALE = [50, 53, 55, 57, 60, 62, 65, 67, 69, 72, 74];
const BEAT = 60 / 66;

let deg = 5;
for (let t = 1.2; t < DUR - 4; ) {
  const sect = t < 31 ? 0 : t < 66 ? 1 : t < 94 ? 2 : t < 104 ? 3 : 4;
  deg = Math.max(0, Math.min(SCALE.length - 1, deg + [-2, -1, -1, 0, 1, 1, 2][Math.floor(rnd() * 7)]));
  const amp = [.22, .26, .24, .16, .25][sect];
  pluck(t, midi(SCALE[deg]), amp, (rnd() - .5) * .6);
  if (rnd() < .3) pluck(t + .04, midi(SCALE[deg] - 12), amp * .5, -.2);
  const steps = sect === 1 ? [.5, .5, 1, .5] : sect === 3 ? [2, 1.5, 2] : [1, 1, 2, .5, .5, 1.5];
  t += steps[Math.floor(rnd() * steps.length)] * BEAT;
  if (rnd() < .12) t += BEAT * 2;
}

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const sw = .55 + .45 * Math.sin(t * .21);
  const fade = Math.min(1, t / 4);
  let v = Math.sin(2 * Math.PI * midi(38) * t) * .5 + Math.sin(2 * Math.PI * midi(45) * t) * .3 + Math.sin(2 * Math.PI * midi(50) * t + Math.sin(t * 3) * .4) * .15;
  const quiet = t > 94 && t < 104 ? .5 : 1;
  add(i, v * .1 * sw * fade * quiet);
}

CUTS.forEach(c => bell(c - .1, midi(62), .22));
bell(.3, midi(62), .25);
bell(DUR - 7, midi(50), .3);

for (let t = 33; t < 64; t += BEAT) {
  const b = Math.round((t - 33) / BEAT);
  drum(t, b % 4 === 0 ? .55 : .25);
  if (b % 8 === 7) drum(t + BEAT / 2, .3);
}
for (let t = 104; t < 112; t += BEAT * 2) drum(t, .35);

let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = .9 / peak;
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVE', 8);
out.write('fmt ', 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
out.write('data', 36); out.writeUInt32LE(N * 4, 40);
const D = Math.floor(SR * .09);
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, i / (SR * .3), (N - i) / (SR * 3));
  const wl = L[i] + (i > D ? R[i - D] * .25 : 0), wr = R[i] + (i > D ? L[i - D] * .25 : 0);
  out.writeInt16LE(Math.round(Math.tanh(wl * g) * fade * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(Math.tanh(wr * g) * fade * 32767), 46 + i * 4);
}
fs.writeFileSync('/tmp/xz_music.wav', out);
