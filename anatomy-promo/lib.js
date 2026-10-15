// Shared drawing helpers (particles, glow, subtitles, labels), same look as github-explainer.
const W = 1920, H = 1080;
const SERIF = '"Noto Serif CJK SC", "Noto Serif", serif';
const SERIF_EN = '"Noto Serif", "Noto Serif CJK SC", serif';
const MONO = '"DejaVu Sans Mono", "Noto Sans CJK SC", monospace';

const cv = document.getElementById("c");
const ctx = cv.getContext('2d');

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(20080410);
const RN = []; for (let i = 0; i < 20000; i++) RN.push(rnd());
const R = i => RN[((Math.floor(i) % 20000) + 20000) % 20000];
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, u) => a + (b - a) * u;
const eio = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const eo = u => 1 - Math.pow(1 - u, 3);
const win = (t, a, b, f = 0.6) => Math.min(seg(t, a, a + f), 1 - seg(t, b - f, b));

const COL = {
  blue: [110, 135, 255], gold: [255, 190, 110], white: [255, 250, 240], cyan: [150, 215, 255],
  purple: [165, 120, 255], red: [255, 95, 80], green: [130, 240, 170],
};
const rgba = (c, a) => `rgba(${COL[c].join(',')},${a})`;
const SPR = {};
for (const k in COL) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const [r, gg, b] = COL[k];
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.12, `rgba(${r},${gg},${b},0.9)`);
  gr.addColorStop(0.4, `rgba(${r},${gg},${b},0.22)`);
  gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); SPR[k] = c;
}

function dot(x, y, r, col, a) {
  if (a <= 0.003) return;
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = Math.min(1, a);
  ctx.drawImage(SPR[col], x - r, y - r, 2 * r, 2 * r);
}
function orb(x, y, r, col, a) { dot(x, y, r * 7, col, a * 0.45); dot(x, y, r * 2.6, col, a); dot(x, y, r * 1.1, 'white', a); }
function ring(x, y, r, col, a, lw = 1.5) {
  if (a <= 0) return;
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(a);
  ctx.strokeStyle = rgba(col, 1); ctx.lineWidth = lw;
  ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, 6.2832); ctx.stroke();
}
function cnode(x, y, col, at, lt, A, r = 7) {
  const ap = seg(lt, at, at + 0.35); if (ap <= 0) return;
  const fl = 1 - seg(lt, at, at + 1.2);
  dot(x, y, 30 + fl * 90, col, A * fl * 0.5);
  if (fl > 0) ring(x, y, 12 + (1 - fl) * 55, col, A * fl * 0.6);
  orb(x, y, r, col, A * ap);
}

const bez = (p0, p1, p2, p3) => u => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };
const line = (a, b) => u => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// A "dust" stroke: a faint core line plus scattered glowing grains, like the particle threads in the reference.
function dust(fn, from, to, col, t, o = {}) {
  const n = o.n || 260, w = o.w ?? 5, seed = o.seed || 0, a = o.a ?? 1, size = o.size || 1;
  if (to <= from || a <= 0) return;
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1;
  ctx.strokeStyle = rgba(col, 0.32 * a); ctx.lineWidth = o.lw || 1.3;
  ctx.beginPath();
  const steps = 48;
  for (let k = 0; k <= steps; k++) { const p = fn(lerp(from, to, k / steps)); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
  ctx.stroke();
  for (let i = 0; i < n; i++) {
    const u = i / n; if (u < from || u > to) continue;
    const p = fn(u), q = fn(Math.min(1, u + 0.003));
    const dx = q[0] - p[0], dy = q[1] - p[1]; const L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    const j = (R(seed + i * 3) - 0.5) * 2;
    const off = j * Math.abs(j) * w + Math.sin(t * 1.5 + i) * 0.8;
    const tw = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.7);
    dot(p[0] + nx * off, p[1] + ny * off, (2 + R(seed + i * 3 + 1) * 4) * size, col, a * tw * (0.35 + 0.65 * R(seed + i * 3 + 2)));
  }
  if (o.head && to < 1) { const p = fn(to); dot(p[0], p[1], 22, col, a * 0.9); }
}
function flow(fn, col, t, a, n = 12, speed = 0.35, seed = 0, r = 10) {
  if (a <= 0) return;
  for (let k = 0; k < n; k++) { const u = (t * speed + k / n + R(seed + k) * 0.05) % 1; const p = fn(u); dot(p[0], p[1], r, col, a * Math.sin(u * Math.PI)); }
}

function txt(s, x, y, o = {}) {
  const { size = 24, col = '#e9e4d8', a = 1, align = 'center', font = SERIF, weight = '', italic = false, base = 'middle', shadow = 0 } = o;
  if (a <= 0.003) return;
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = clamp(a);
  ctx.fillStyle = col; ctx.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${font}`;
  ctx.textAlign = align; ctx.textBaseline = base;
  if (shadow) { ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = shadow; }
  ctx.fillText(s, x, y);
  ctx.shadowBlur = 0;
}
function panel(x, y, w, h, a, o = {}) {
  if (a <= 0) return;
  const { border = 'rgba(170,185,255,0.45)', fill = 'rgba(10,12,28,0.82)', r = 10, lw = 1.3 } = o;
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = clamp(a);
  ctx.fillStyle = fill; ctx.strokeStyle = border; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.stroke();
}
function strokeLine(x1, y1, x2, y2, a, col = 'rgba(216,208,189,1)', lw = 1) {
  if (a <= 0) return;
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = clamp(a);
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

/* ---------------- background ---------------- */
const STARS = [];
for (let i = 0; i < 1100; i++) {
  const c = R(i * 7 + 3);
  STARS.push({ x: R(i * 7) * W, y: R(i * 7 + 1) * H, z: 0.2 + R(i * 7 + 2) * 0.8, c: c < 0.55 ? 'blue' : (c < 0.8 ? 'purple' : 'gold'), p: R(i * 7 + 4) * 6.28, s: 0.5 + R(i * 7 + 5) * 2 });
}
function background(t) {
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H / 2, W * 0.7);
  g.addColorStop(0, '#0b0d1c'); g.addColorStop(1, '#020207');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (const s of STARS) {
    const x = ((s.x - t * 6 * s.z) % W + W) % W;
    const y = s.y + Math.sin(t * 0.1 + s.p) * 6 * s.z;
    const tw = 0.5 + 0.5 * Math.sin(t * s.s + s.p);
    dot(x, y, 1.5 + s.z * 3.5, s.c, (0.1 + 0.38 * tw) * s.z);
  }
}
function vignette() {
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.62);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

/* ---------------- subtitles & labels ---------------- */
function subtitle(zh, en, lt, dur) {
  const out = 1 - seg(lt, dur - 0.5, dur);
  if (out <= 0 || lt < 0) return;
  const chars = []; let hl = false;
  for (const ch of zh) { if (ch === '【') { hl = true; continue; } if (ch === '】') { hl = false; continue; } chars.push({ ch, hl }); }
  ctx.font = `40px ${SERIF}`;
  const sp = 3; let total = 0;
  const ws = chars.map(c => { const w = ctx.measureText(c.ch).width; total += w + sp; return w; });
  total -= sp;
  let x = W / 2 - total / 2; const y = 885;
  chars.forEach((c, i) => {
    const a = eo(seg(lt, 0.1 + i * 0.035, 0.1 + i * 0.035 + 0.5)) * out;
    txt(c.ch, x + ws[i] / 2, y + (1 - a) * 6, { size: 40, col: c.hl ? '#f2b56b' : '#ece6da', a, weight: c.hl ? '600' : '', shadow: 10 });
    x += ws[i] + sp;
  });
  const da = seg(lt, 0.3, 1) * out;
  strokeLine(W / 2 - 46, y + 40, W / 2 + 46, y + 40, da * 0.45);
  dot(W / 2, y + 40, 8, 'gold', da * 0.7);
  txt(en, W / 2, y + 72, { size: 22, col: '#bab6c6', a: seg(lt, 0.6, 1.4) * out * 0.85, italic: true, font: SERIF_EN, shadow: 8 });
}
function label(year, cap, a) {
  if (!year || a <= 0) return;
  strokeLine(36, 80, 78, 80, a * 0.7);
  txt(year, 94, 80, { size: 28, weight: '700', align: 'left', a, col: '#ece4d0' });
  txt(cap, 94, 116, { size: 17, align: 'left', a: a * 0.72, col: '#b8b2a4' });
}

/* ---------------- particle text ---------------- */
function makeTextPts(str, size, cx, cy, step) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.font = `600 ${size}px ${SERIF_EN}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(str, cx, cy);
  const d = g.getImageData(0, 0, W, H).data; const pts = [];
  for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
    if (d[(y * W + x) * 4 + 3] > 128) pts.push([x + (R(x * 7 + y) - 0.5) * step, y + (R(x + y * 13) - 0.5) * step]);
  }
  return pts;
}
const TP = {};
function particleTitle(pts, lt, A, t, t0, t1, seedBase) {
  for (let i = 0; i < pts.length; i++) {
    const d = R(seedBase + i * 5);
    const arr = eio(seg(lt, t0 + d * (t1 - t0) * 0.6, t0 + (t1 - t0) * 0.5 + d * (t1 - t0) * 0.5));
    const sx = R(seedBase + i * 5 + 1) * W, sy = R(seedBase + i * 5 + 2) * H;
    const ang = t * 0.25 + R(seedBase + i * 5 + 3) * 6.28, sw = (1 - arr) * 50;
    const x = lerp(sx, pts[i][0], arr) + Math.cos(ang) * sw, y = lerp(sy, pts[i][1], arr) + Math.sin(ang) * sw;
    const tw = 0.6 + 0.4 * Math.sin(t * 2.5 + i);
    const col = arr > 0.9 ? (R(i * 3) < 0.7 ? 'gold' : 'white') : (R(i * 3) < 0.6 ? 'blue' : 'purple');
    dot(x, y, arr > 0.98 ? 3.4 : 2.5 + R(i) * 2, col, A * tw * (0.3 + 0.55 * arr));
  }
}
