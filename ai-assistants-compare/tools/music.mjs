// Procedural synthwave-style backing track, written to /tmp/music.wav (60 s, 44.1 kHz stereo).
import fs from 'node:fs';

const SR = 44100, DUR = 60, BPM = 120, BEAT = 60 / BPM;
const N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
const CUTS = [6, 18, 30, 42, 50];
const midi = m => 440 * Math.pow(2, (m - 69) / 12);
// Am - F - C - G, two bars each
const CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
const chordAt = t => CHORDS[Math.floor(t / (BEAT * 8)) % 4];

let seed = 1;
const noise = () => { seed = (seed * 16807) % 2147483647; return seed / 1073741823.5 - 1; };
const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { L[i] += v * (1 - pan); R[i] += v * (1 + pan); } };
const saw = ph => 2 * (ph - Math.floor(ph + .5));

function kick(t0, amp = .9) {
  let ph = 0;
  for (let j = 0; j < SR * .4; j++) {
    const t = j / SR, f = 45 + 110 * Math.exp(-t * 28);
    ph += f / SR;
    add(Math.floor(t0 * SR) + j, Math.sin(ph * 2 * Math.PI) * Math.exp(-t * 7) * amp);
  }
}
function hat(t0, amp = .12, len = .05) {
  let prev = 0;
  for (let j = 0; j < SR * len; j++) {
    const n = noise(), hp = n - prev; prev = n;
    add(Math.floor(t0 * SR) + j, hp * Math.exp(-j / SR / (len / 4)) * amp, .3);
  }
}
function snare(t0, amp = .3) {
  for (let j = 0; j < SR * .2; j++) {
    const t = j / SR;
    add(Math.floor(t0 * SR) + j, (noise() * .7 + Math.sin(2 * Math.PI * 190 * t) * .5) * Math.exp(-t * 22) * amp, -.1);
  }
}
function whoosh(tc, amp = .35) {
  let lp = 0;
  const start = tc - 1, len = 1.3;
  for (let j = 0; j < SR * len; j++) {
    const t = j / SR, k = t / len;
    const env = k < .77 ? Math.pow(k / .77, 2.5) : Math.exp(-(k - .77) * 25);
    const cut = .02 + .5 * env;
    lp += (noise() - lp) * cut;
    add(Math.floor(start * SR) + j, lp * env * amp, Math.sin(k * 6) * .6);
  }
  kick(tc, 1.1);
  for (let j = 0; j < SR * 1.2; j++) {
    const t = j / SR;
    add(Math.floor(tc * SR) + j, Math.sin(2 * Math.PI * (38 + 20 * Math.exp(-t * 4)) * t) * Math.exp(-t * 2.5) * .5);
  }
}

const beats = Math.floor(DUR / BEAT);
for (let b = 0; b < beats; b++) {
  const t = b * BEAT;
  if (t > DUR - 2.5) break;
  const intro = t < 2;
  if (!intro) kick(t);
  if (!intro && b % 4 === 1 || b % 4 === 3 && !intro) snare(t);
  hat(t + BEAT / 2, intro ? .05 : .12);
  if (!intro && b % 2) hat(t + BEAT * .75, .06, .03);
}

let bassLp = 0;
let padLp = [0, 0];
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const ch = chordAt(t);
  const step = Math.floor(t / (BEAT / 2));
  const stepT = t - step * BEAT / 2;
  const root = midi(ch[0] - 24 + (step % 4 === 3 ? 12 : 0));
  const bassRaw = saw(root * t) * Math.exp(-stepT * 6);
  bassLp += (bassRaw - bassLp) * .08;
  const bassAmp = t < 2 ? 0 : .32;

  let pad = 0;
  for (const n of ch) for (const d of [-.08, .08]) pad += saw(midi(n + d) * t);
  const arpNote = ch[step % 3] + 12;
  const arp = Math.sin(2 * Math.PI * midi(arpNote) * t) * Math.exp(-stepT * 9) * .08;
  padLp[0] += (pad - padLp[0]) * .03;
  padLp[1] += (padLp[0] - padLp[1]) * .03;
  const swell = .5 + .5 * Math.sin(t * Math.PI / (BEAT * 4));
  const v = bassLp * bassAmp + padLp[1] * .035 * (.6 + .4 * swell) + arp;
  add(i, v, Math.sin(t * .7) * .15);
}

CUTS.forEach(c => whoosh(c));

let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = .89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, i / (SR * .5), (N - i) / (SR * 2.5));
  const s = x => Math.max(-1, Math.min(1, Math.tanh(x * g * 1.1) * fade));
  buf.writeInt16LE(Math.round(s(L[i]) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(s(R[i]) * 32767), 46 + i * 4);
}
fs.writeFileSync('/tmp/music.wav', buf);
