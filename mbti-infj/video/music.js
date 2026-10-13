// Synthesizes a 120 BPM soundtrack whose hits line up with the scene cuts in anim.html.
// Usage: node music.js out.wav
const fs = require('fs');

const SR = 44100;
const DUR = 38;
const N = SR * DUR;
const L = new Float32Array(N);
const Rt = new Float32Array(N);
const BEAT = 0.5;
const IMPACTS = [1.2, 4, 8, 12, 16, 22, 28, 32];
const DRUMS_ON = 4, DRUMS_OFF = 32;

let seed = 7;
const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2147483648 - 1; };
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const add = (i, l, r = l) => { if (i >= 0 && i < N) { L[i] += l; Rt[i] += r; } };

// Am - F - C - G, one chord per 2 bars
const CHORDS = [
  { bass: 45, notes: [57, 60, 64] },
  { bass: 41, notes: [53, 57, 60] },
  { bass: 48, notes: [55, 60, 64] },
  { bass: 43, notes: [55, 59, 62] },
];
const chordAt = (t) => CHORDS[Math.floor(t / 4) % 4];

// kick positions, used for sidechain ducking of the pad
const kicks = [];
for (let t = DRUMS_ON; t < DRUMS_OFF; t += BEAT) kicks.push(t);
for (let t = DRUMS_OFF; t < 36; t += BEAT * 2) kicks.push(t);

// pad: detuned saws through a sweeping one-pole lowpass
{
  const ph = new Float64Array(16);
  let lpL = 0, lpR = 0;
  let ki = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const ch = chordAt(t);
    const local = t % 4;
    const env = Math.min(1, local / 0.25) * (0.75 + 0.25 * Math.cos(local * Math.PI / 2));
    let sL = 0, sR = 0, v = 0;
    for (const m of [...ch.notes, ch.notes[0] + 12]) {
      for (const det of [-0.004, 0.004]) {
        const f = hz(m) * (1 + det);
        ph[v] = (ph[v] + f / SR) % 1;
        const s = 2 * ph[v] - 1;
        if (det < 0) sL += s; else sR += s;
        v++;
      }
    }
    const intro = Math.min(1, t / 3);
    const cutoff = 0.02 + 0.06 * intro + 0.04 * (t > 16 && t < 22 ? 1 : 0) + 0.02 * Math.sin(t * 0.7);
    lpL += cutoff * (sL - lpL); lpR += cutoff * (sR - lpR);
    while (ki < kicks.length - 1 && kicks[ki + 1] <= t) ki++;
    const dk = t - kicks[ki];
    const duck = dk >= 0 && dk < 0.4 ? 1 - 0.55 * Math.exp(-dk * 9) : 1;
    const g = 0.05 * env * duck;
    add(i, lpL * g, lpR * g);
    // sub bass
    const b = Math.sin(2 * Math.PI * hz(ch.bass) * t) * 0.11 * duck * (t > DRUMS_ON ? 1 : intro * 0.5);
    add(i, b);
  }
}

// arpeggio plucks (16ths) during the main body
for (let t = 8; t < 32; t += BEAT / 4) {
  const step = Math.round((t - 8) / (BEAT / 4));
  const ch = chordAt(t);
  const seq = [0, 1, 2, 1, 3, 2, 1, 2];
  const notes = [...ch.notes, ch.notes[0] + 12];
  const f = hz(notes[seq[step % 8]] + 12);
  const pan = 0.5 + 0.35 * Math.sin(step * 0.9);
  const s0 = Math.floor(t * SR);
  const len = Math.floor(0.22 * SR);
  for (let j = 0; j < len; j++) {
    const tt = j / SR;
    const x = (2 * Math.abs(2 * ((f * tt) % 1) - 1) - 1) * Math.exp(-tt * 18) * 0.05;
    add(s0 + j, x * (1 - pan) * 2, x * pan * 2);
  }
}

// kick
for (const t of kicks) {
  const s0 = Math.floor(t * SR);
  let ph = 0;
  for (let j = 0; j < 0.45 * SR; j++) {
    const tt = j / SR;
    ph += (45 + 140 * Math.exp(-tt * 32)) / SR;
    add(s0 + j, Math.sin(2 * Math.PI * ph) * Math.exp(-tt * 7) * 0.5);
  }
}

// clap on 2 and 4, hats on offbeats
for (let t = 8; t < DRUMS_OFF; t += BEAT) {
  const beatIdx = Math.round((t - 8) / BEAT);
  if (beatIdx % 2 === 1) {
    const s0 = Math.floor(t * SR);
    let prev = 0;
    for (let j = 0; j < 0.25 * SR; j++) {
      const tt = j / SR;
      const n = noise();
      const hp = n - prev; prev = n;
      const env = Math.exp(-tt * 18) + 0.5 * Math.exp(-Math.abs(tt - 0.012) * 400);
      add(s0 + j, hp * env * 0.12, hp * env * 0.12);
    }
  }
  const h0 = Math.floor((t + BEAT / 2) * SR);
  let prev = 0;
  for (let j = 0; j < 0.06 * SR; j++) {
    const n = noise();
    const hp = n - prev; prev = n;
    const x = hp * Math.exp(-(j / SR) * 70) * 0.06;
    add(h0 + j, x * 0.7, x * 1.3);
  }
}

// impacts: sub boom + filtered noise burst
for (const t of IMPACTS) {
  const s0 = Math.floor(t * SR);
  let lp = 0;
  for (let j = 0; j < 1.6 * SR; j++) {
    const tt = j / SR;
    lp += 0.08 * (noise() - lp);
    const boom = Math.sin(2 * Math.PI * (38 + 30 * Math.exp(-tt * 6)) * tt) * Math.exp(-tt * 2.6) * 0.35;
    const burst = lp * Math.exp(-tt * 5) * 0.9;
    add(s0 + j, boom + burst, boom + burst * 0.9);
  }
}

// risers into the big moments
for (const end of [4, 16, 32]) {
  const len = 1.6;
  const s0 = Math.floor((end - len) * SR);
  let lp = 0;
  for (let j = 0; j < len * SR; j++) {
    const k = j / (len * SR);
    lp += (0.01 + 0.4 * k * k) * (noise() - lp);
    const x = lp * k * k * 0.35;
    add(s0 + j, x, x);
  }
}

// master: fade + soft clip -> 16-bit WAV
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 0.05) * Math.min(1, Math.max(0, (DUR - t) / 2.2));
  const l = Math.tanh(L[i] * 1.2) * 0.85 * fade;
  const r = Math.tanh(Rt[i] * 1.2) * 0.85 * fade;
  buf.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
}
fs.writeFileSync(process.argv[2] || 'music.wav', buf);
