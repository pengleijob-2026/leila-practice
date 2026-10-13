const W = 1920, H = 1080, DURATION = 60;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const FONT = '"WenQuanYi Micro Hei","PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
const TAU = Math.PI * 2;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const back = k => { k = clamp(k); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const win = (t, s, e, d = .5) => clamp(Math.min((t - s) / d, (e - t) / d));
const rgba = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a, b, k) => a.map((v, i) => Math.round(lerp(v, b[i], k)));
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const C = {
  dots: [25, 195, 125],
  muse: [0, 130, 251],
  musePurple: [168, 85, 247],
  grok: [255, 59, 92],
  white: [255, 255, 255],
  bad: [255, 92, 92],
};

const SCENES = [
  { s: 0, e: 6, f: intro, acc: [120, 90, 255] },
  { s: 6, e: 18, f: sceneDots, acc: C.dots },
  { s: 18, e: 30, f: sceneMuse, acc: C.muse },
  { s: 30, e: 42, f: sceneGrok, acc: C.grok },
  { s: 42, e: 50, f: sceneCompare, acc: [120, 90, 255] },
  { s: 50, e: 60, f: sceneVerdict, acc: [90, 140, 255] },
];

const PARTICLES = Array.from({ length: 140 }, (_, i) => ({
  x: hash(i) * W, y: hash(i + 99) * H, v: 20 + hash(i + 7) * 90, r: .6 + hash(i + 3) * 2.2, a: .2 + hash(i + 11) * .6,
}));

/* ---------- drawing helpers ---------- */

function text(s, x, y, o = {}) {
  const { size = 48, color = '#fff', align = 'center', weight = 'bold', alpha = 1, glow = 0, glowColor, base = 'middle', spacing = 0 } = o;
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align; ctx.textBaseline = base;
  ctx.letterSpacing = spacing + 'px';
  if (glow) { ctx.shadowColor = glowColor || color; ctx.shadowBlur = glow; }
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
  ctx.restore();
}

function glitchText(s, x, y, o, g) {
  if (g > 0.01) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    text(s, x - 10 * g, y, { ...o, color: '#ff1f5a', glow: 0, alpha: (o.alpha ?? 1) * .8 });
    text(s, x + 10 * g, y + 2 * g, { ...o, color: '#00e5ff', glow: 0, alpha: (o.alpha ?? 1) * .8 });
    ctx.restore();
  }
  text(s, x, y, o);
}

function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

function poly(pts) {
  ctx.beginPath();
  pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py));
  ctx.closePath(); ctx.fill();
}

function ring(x, y, r, a0, a1, col, lw, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.strokeStyle = col; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore();
}

/* ---------- brand marks (simplified) ---------- */

function logoOpenAI(x, y, r, col = '#fff', rot = 0, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot);
  ctx.strokeStyle = col; ctx.lineWidth = r * .12; ctx.lineJoin = 'round';
  for (let k = 0; k < 6; k++) {
    ctx.save(); ctx.rotate(k * TAU / 6);
    rr(-r * .1, -r * .92, r * .46, r * .98, r * .23); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function logoMeta(x, y, r, alpha = 1, phase = 0) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y);
  const g = ctx.createLinearGradient(-r, 0, r, 0);
  g.addColorStop(0, '#0064e0'); g.addColorStop(.5, '#0082fb'); g.addColorStop(1, '#3fd0ff');
  ctx.strokeStyle = g; ctx.lineWidth = r * .2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = '#0082fb'; ctx.shadowBlur = r * .35;
  ctx.beginPath();
  for (let i = 0; i <= 240; i++) {
    const a = i / 240 * TAU, d = 1 + Math.sin(a) ** 2;
    const px = r * Math.cos(a) / d, py = r * 1.55 * Math.sin(a) * Math.cos(a) / d;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath(); ctx.stroke();
  if (phase > 0) {
    const a = phase * TAU, d = 1 + Math.sin(a) ** 2;
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.arc(r * Math.cos(a) / d, r * 1.55 * Math.sin(a) * Math.cos(a) / d, r * .07, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

function logoXAI(x, y, r, col = '#fff', alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.fillStyle = col;
  ctx.shadowColor = col; ctx.shadowBlur = r * .2;
  poly([[-r * .72, -r * .8], [-r * .42, -r * .8], [r * .72, r * .8], [r * .42, r * .8]]);
  poly([[-r * .72, r * .8], [-r * .44, r * .8], [-r * .1, r * .32], [-r * .24, r * .12]]);
  poly([[r * .08, -r * .14], [r * .62, -r * .9], [r * .72, -r * .9], [r * .14, -r * .02]]);
  ctx.restore();
}

function brandMark(name, x, y, r, t = 0, alpha = 1) {
  if (name === 'dots') logoOpenAI(x, y, r, '#fff', t * .3, alpha);
  if (name === 'muse') logoMeta(x, y, r * 1.15, alpha, (t * .35) % 1);
  if (name === 'grok') logoXAI(x, y, r * .85, '#fff', alpha);
}

const BRAND = {
  dots: { name: 'dots', org: 'OpenAI', col: C.dots },
  muse: { name: 'Muse', org: 'Meta', col: C.muse },
  grok: { name: 'Grok Bot', org: 'xAI', col: C.grok },
};

/* ---------- background & post ---------- */

function background(t, acc) {
  ctx.fillStyle = '#03040a'; ctx.fillRect(0, 0, W, H);
  let g = ctx.createRadialGradient(W / 2, H * .42, 0, W / 2, H * .42, W * .75);
  g.addColorStop(0, rgba(acc, .26)); g.addColorStop(.5, rgba(acc, .06)); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  const hy = H * .66;
  ctx.save(); ctx.strokeStyle = rgba(acc, .5); ctx.lineWidth = 1.4;
  for (let i = -24; i <= 24; i++) {
    ctx.globalAlpha = .35;
    ctx.beginPath(); ctx.moveTo(W / 2 + i * 34, hy); ctx.lineTo(W / 2 + i * 260, H); ctx.stroke();
  }
  const off = (t * .5) % 1;
  for (let j = 0; j < 16; j++) {
    const z = (j + off) / 16, y = hy + (H - hy) * z * z;
    ctx.globalAlpha = z * .7;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
  g = ctx.createLinearGradient(0, hy - 40, 0, hy + 120);
  g.addColorStop(0, '#03040a'); g.addColorStop(.4, 'rgba(3,4,10,.6)'); g.addColorStop(1, 'rgba(3,4,10,0)');
  ctx.fillStyle = g; ctx.fillRect(0, hy - 40, W, 160);
  ctx.fillStyle = rgba(acc, .6); ctx.fillRect(0, hy, W, 1.5);

  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const p of PARTICLES) {
    const y = ((p.y - t * p.v) % H + H) % H;
    const x = p.x + Math.sin(t * .6 + p.y) * 18;
    ctx.fillStyle = rgba(mix(acc, C.white, .4), p.a * (.6 + .4 * Math.sin(t * 3 + p.x)));
    ctx.beginPath(); ctx.arc(x, y, p.r, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

function post(t) {
  ctx.fillStyle = 'rgba(0,0,0,.08)';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.75)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  for (const sc of SCENES.slice(1)) {
    const d = t - sc.s;
    if (Math.abs(d) < .35) {
      const k = 1 - Math.abs(d) / .35;
      for (let i = 0; i < 9; i++) {
        const y = hash(i + Math.floor(t * 30) * 13) * H, h = 10 + hash(i * 3 + Math.floor(t * 30)) * 70;
        const dx = (hash(i * 7 + Math.floor(t * 30)) - .5) * 160 * k;
        ctx.drawImage(cv, 0, y, W, h, dx, y, W, h);
      }
      ctx.fillStyle = `rgba(255,255,255,${k * k * .55})`; ctx.fillRect(0, 0, W, H);
    }
  }
  if (t > DURATION - 1) { ctx.fillStyle = `rgba(0,0,0,${clamp(t - (DURATION - 1))})`; ctx.fillRect(0, 0, W, H); }
}

/* ---------- reusable UI pieces ---------- */

function card(x, y, w, title, desc, col, k, bad = false) {
  if (k <= 0) return;
  const h = 112, dx = (1 - eo(k)) * 140;
  ctx.save(); ctx.globalAlpha *= clamp(k * 1.4); ctx.translate(dx, 0);
  const c = bad ? C.bad : col;
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, rgba(c, .22)); g.addColorStop(1, 'rgba(255,255,255,.03)');
  rr(x, y, w, h, 16); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = rgba(c, .55); ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = rgba(c); ctx.shadowColor = rgba(c); ctx.shadowBlur = 20;
  rr(x, y + 16, 6, h - 32, 3); ctx.fill(); ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(x + 52, y + h / 2, 20, 0, TAU); ctx.strokeStyle = rgba(c); ctx.lineWidth = 3; ctx.stroke();
  text(bad ? '−' : '+', x + 52, y + h / 2 + 1, { size: 32, color: rgba(c) });
  text(title, x + 92, y + 38, { size: 34, align: 'left', color: '#fff' });
  const n = Math.floor(desc.length * clamp((k - .3) / .7));
  text(desc.slice(0, n), x + 92, y + 80, { size: 25, align: 'left', weight: 'normal', color: 'rgba(230,236,255,.85)' });
  ctx.restore();
}

function pill(x, y, label, col, k, size = 28) {
  if (k <= 0) return;
  ctx.save(); ctx.font = `bold ${size}px ${FONT}`;
  const w = ctx.measureText(label).width + size * 1.6, h = size * 1.8;
  ctx.globalAlpha *= clamp(k); ctx.translate(x, y); ctx.scale(lerp(.6, 1, back(k)), lerp(.6, 1, back(k)));
  rr(-w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = rgba(col, .18); ctx.fill();
  ctx.strokeStyle = rgba(col, .9); ctx.lineWidth = 2; ctx.shadowColor = rgba(col); ctx.shadowBlur = 18; ctx.stroke();
  ctx.restore();
  text(label, x, y + 1, { size, alpha: clamp(k), color: '#fff' });
}

function hud(x, y, r, t, col, k) {
  const s = back(k);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 1.5);
  const c = rgba(col), cs = rgba(col, .35);
  ring(0, 0, r * 1.62, t * .4, t * .4 + TAU * .7, cs, 2);
  ring(0, 0, r * 1.5, -t * .9, -t * .9 + TAU * .22, c, 6);
  ring(0, 0, r * 1.5, -t * .9 + Math.PI, -t * .9 + Math.PI + TAU * .12, c, 6);
  ring(0, 0, r * 1.32, t * .6, t * .6 + TAU * .45, cs, 14);
  ctx.strokeStyle = cs; ctx.lineWidth = 2;
  for (let i = 0; i < 72; i++) {
    const a = i / 72 * TAU + t * .15, l = i % 6 ? 8 : 20;
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 1.78, Math.sin(a) * r * 1.78);
    ctx.lineTo(Math.cos(a) * (r * 1.78 + l), Math.sin(a) * (r * 1.78 + l)); ctx.stroke();
  }
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.25);
  g.addColorStop(0, rgba(col, .35)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 1.25, 0, TAU); ctx.fill();
  ctx.restore();
}

function header(x, y, name, sub, org, col, k, align = 'left', g = 0) {
  glitchText(name, x, y, { size: 120, align, alpha: clamp(k * 2), glow: 30, glowColor: rgba(col), spacing: 2 }, g);
  text(sub, x, y + 92, { size: 40, align, alpha: clamp(k * 2 - .4), color: rgba(mix(col, C.white, .45)) });
  if (org) pill(align === 'left' ? x + 70 : align === 'right' ? x - 90 : x, y - 100, org, col, clamp(k * 2 - .2), 24);
}

/* ---------- scenes ---------- */

function intro(u, t) {
  const g = u < 1.2 ? (1 - u / 1.2) * (hash(Math.floor(t * 30)) > .4 ? 1 : .2) : (u > 5.3 ? (u - 5.3) * 2 : 0);
  const k = eo(u / .9);
  ctx.save(); ctx.translate(W / 2, 300); ctx.scale(lerp(1.4, 1, k), lerp(1.4, 1, k));
  glitchText('AI 智能助手', 0, 0, { size: 150, alpha: k, glow: 40, glowColor: 'rgba(140,110,255,.9)', spacing: 10 }, g);
  ctx.restore();
  const k2 = eo((u - 1) / .8);
  text('终 极 对 比', W / 2, 420, { size: 54, alpha: k2, color: '#cfc6ff', spacing: 18 });
  ctx.save(); ctx.globalAlpha = k2; ctx.fillStyle = 'rgba(160,140,255,.8)';
  ctx.fillRect(W / 2 - 360 * k2, 470, 720 * k2, 2); ctx.restore();

  const keys = ['dots', 'muse', 'grok'];
  keys.forEach((key, i) => {
    const b = BRAND[key], kk = clamp((u - 1.8 - i * .35) / .7);
    if (kk <= 0) return;
    const x = W / 2 + (i - 1) * 520, y = 690 - (1 - back(kk)) * 120;
    ctx.save(); ctx.globalAlpha = clamp(kk * 2);
    const gg = ctx.createRadialGradient(x, y, 0, x, y, 170);
    gg.addColorStop(0, rgba(b.col, .45)); gg.addColorStop(1, rgba(b.col, 0));
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, 170, 0, TAU); ctx.fill();
    ring(x, y, 128, t * (i % 2 ? -1 : 1), t * (i % 2 ? -1 : 1) + TAU * .75, rgba(b.col), 3);
    brandMark(key, x, y, 78, t);
    ctx.restore();
    text(b.name, x, y + 190, { size: 58, alpha: clamp(kk * 2), glow: 20, glowColor: rgba(b.col) });
    text(b.org, x, y + 248, { size: 28, alpha: clamp(kk * 2), weight: 'normal', color: rgba(mix(b.col, C.white, .5)), spacing: 6 });
  });
  [0, 1].forEach(i => {
    const kv = clamp((u - 3.1 - i * .15) / .4);
    const pulse = 1 + .08 * Math.sin(t * 10);
    ctx.save(); ctx.translate(W / 2 + (i - .5) * 520, 690); ctx.scale(back(kv) * pulse, back(kv) * pulse);
    glitchText('VS', 0, 0, { size: 64, alpha: kv, color: '#fff', glow: 30, glowColor: '#ff3bd0' }, kv < 1 ? 1 - kv : 0);
    ctx.restore();
  });
}

function orbitNodes(cx, cy, r, labels, t, col, k, speed = .25) {
  labels.forEach((lab, i) => {
    const kk = clamp((k - i * .12) * 2);
    if (kk <= 0) return;
    const a = t * speed + i / labels.length * TAU;
    const x = cx + Math.cos(a) * r * eo(kk), y = cy + Math.sin(a) * r * .55 * eo(kk);
    ctx.save(); ctx.globalAlpha *= kk;
    ctx.strokeStyle = rgba(col, .45); ctx.setLineDash([6, 8]); ctx.lineDashOffset = -t * 40; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
    const p = (t * .8 + i * .3) % 1;
    ctx.fillStyle = '#fff'; ctx.shadowColor = rgba(col); ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(lerp(cx, x, p), lerp(cy, y, p), 4, 0, TAU); ctx.fill();
    ctx.font = `bold 26px ${FONT}`;
    const w = ctx.measureText(lab).width + 36;
    rr(x - w / 2, y - 24, w, 48, 24); ctx.fillStyle = 'rgba(8,12,20,.85)'; ctx.fill();
    ctx.strokeStyle = rgba(col); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    text(lab, x, y + 1, { size: 26, alpha: kk, color: '#fff' });
  });
}

function sceneDots(u, t) {
  const col = C.dots, out = 1 - clamp((u - 11.4) / .6);
  ctx.save(); ctx.globalAlpha = out;
  const cx = 500, cy = 520;
  hud(cx, cy, 130, t, col, u / 1);
  orbitNodes(cx, cy, 330, ['上下文记忆', '任务调度', '写代码', '企业协同'], t, col, (u - 1.2) / 1.5, .3);
  const lk = back(clamp((u - .3) / .8));
  ctx.save(); ctx.translate(cx, cy); ctx.scale(lk, lk); ctx.shadowColor = rgba(col); ctx.shadowBlur = 40;
  logoOpenAI(0, 0, 105, '#fff', t * .35); ctx.restore();
  text('J.A.R.V.I.S. MODE', cx, cy + 270, { size: 26, alpha: clamp((u - 1) * 2) * (.6 + .4 * Math.sin(t * 6)), color: rgba(col), spacing: 8 });

  const x0 = 1000;
  header(x0, 190, 'dots', '像钢铁侠的 Jarvis · 超级总控', 'OpenAI', col, (u - .2) / .8, 'left', u < .8 ? 1 - u / .8 : 0);
  const items = [
    ['总控大脑', '记住上下文，拆解并调度复杂任务'],
    ['与 Codex 同门', '同属 OpenAI，环境更对口，写代码更顺'],
    ['企业协同', '团队工作流、企业协作衔接顺滑'],
    ['门槛 & 价格', '上手门槛高、价格硬，更偏重度用户'],
  ];
  items.forEach(([a, b], i) => card(x0, 380 + i * 132, 800, a, b, col, (u - 1.6 - i * 1.1) / .9, i === 3));
  const kt = clamp((u - 7.2) / .6);
  pill(x0 + 400, 950, '适合：重度用户 · 开发者 · 企业团队', col, kt, 28);
  ctx.restore();
}

function sceneMuse(u, t) {
  const col = C.muse, out = 1 - clamp((u - 11.4) / .6);
  ctx.save(); ctx.globalAlpha = out;
  const cx = 1420, cy = 500;
  const lk = back(clamp((u - .2) / .9));
  ctx.save(); ctx.globalAlpha *= clamp(u * 1.5);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 380);
  g.addColorStop(0, rgba(C.musePurple, .35)); g.addColorStop(.5, rgba(col, .15)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 380, 0, TAU); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const p = (t * .5 + i / 3) % 1;
    ring(cx, cy, 120 + p * 300, 0, TAU, rgba(mix(col, C.musePurple, i / 2)), 2, (1 - p) * .7);
  }
  ctx.restore();
  ctx.save(); ctx.translate(cx, cy); ctx.scale(lk, lk); logoMeta(0, 0, 170, 1, (t * .4) % 1); ctx.restore();
  orbitNodes(cx, cy, 330, ['购物', '订票', '收件箱', '做视频'], t, mix(col, C.musePurple, .4), (u - 1.4) / 1.5, -.22);

  const ks = clamp((u - 4.2) / .35);
  if (ks > 0) {
    ctx.save(); ctx.translate(cx + 180, cy - 230); ctx.rotate(-.2);
    const s = lerp(2.6, 1, eo(ks)); ctx.scale(s, s); ctx.globalAlpha *= ks;
    rr(-150, -62, 300, 124, 18); ctx.fillStyle = 'rgba(255,214,0,.12)'; ctx.fill();
    ctx.strokeStyle = '#ffd400'; ctx.lineWidth = 6; ctx.shadowColor = '#ffd400'; ctx.shadowBlur = 30; ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(cx + 180, cy - 230); ctx.rotate(-.2); ctx.scale(lerp(2.6, 1, eo(ks)), lerp(2.6, 1, eo(ks)));
    text('FREE ¥0', 0, -10, { size: 62, color: '#ffd400', alpha: ks, glow: 20 });
    text('免费档 · 零成本上手', 0, 38, { size: 22, color: '#fff3b0', alpha: ks });
    ctx.restore();
    const sw = clamp((u - 4.5) / .8);
    if (sw > 0 && sw < 1) ring(cx + 180, cy - 230, 60 + sw * 400, 0, TAU, '#ffd400', 6 * (1 - sw), 1 - sw);
  }

  const x0 = 120;
  header(x0, 190, 'Muse', 'Meta 出品的生活管家', 'Meta', col, (u - .2) / .8, 'left', u < .8 ? 1 - u / .8 : 0);
  const items = [
    ['生活杂事全包', '购物、订票、收件箱，都能帮你办'],
    ['最大杀招：免费档', '普通人零成本，直接上手'],
    ['简单视频也不错', '自己的云端电脑里直接合成，省积分'],
    ['短板', '写代码非强项 · 接 Agent 生态不如 Grok Bot'],
  ];
  items.forEach(([a, b], i) => card(x0, 380 + i * 132, 820, a, b, col, (u - 1.6 - i * 1.25) / .9, i === 3));

  const kp = clamp((u - 5.6) / .5);
  if (kp > 0) {
    const bx = 1150, by = 900, bw = 540, p = clamp((u - 5.9) / 3);
    ctx.save(); ctx.globalAlpha *= kp;
    rr(bx, by, bw, 18, 9); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fill();
    const gg = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    gg.addColorStop(0, rgba(col)); gg.addColorStop(1, rgba(C.musePurple));
    rr(bx, by, Math.max(18, bw * p), 18, 9); ctx.fillStyle = gg; ctx.shadowColor = rgba(col); ctx.shadowBlur = 20; ctx.fill();
    ctx.restore();
    const label = p < 1 ? `云端电脑合成视频中… ${Math.round(p * 100)}%` : '✓ 合成完成 · 积分省下来了';
    text(label, bx, by - 30, { size: 26, align: 'left', alpha: kp, color: p < 1 ? '#cfe4ff' : '#7dffb0' });
  }
  ctx.restore();
}

function bot(x, y, s, col, t, i, label, prog, k) {
  if (k <= 0) return;
  const bob = Math.sin(t * 3 + i) * 6;
  ctx.save(); ctx.globalAlpha *= clamp(k * 1.5); ctx.translate(x, y + bob); ctx.scale(back(k) * s, back(k) * s);
  ctx.strokeStyle = rgba(col); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -58); ctx.lineTo(0, -76); ctx.stroke();
  ctx.fillStyle = rgba(col); ctx.shadowColor = rgba(col); ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(0, -80, 7, 0, TAU); ctx.fill();
  rr(-62, -58, 124, 100, 28); ctx.fillStyle = 'rgba(10,10,16,.92)'; ctx.fill(); ctx.stroke();
  const blink = (Math.floor(t * 2 + i * 1.7) % 7 === 0) ? .15 : 1;
  ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff';
  rr(-34, -22, 20, 26 * blink, 8); ctx.fill();
  rr(14, -22, 20, 26 * blink, 8); ctx.fill();
  ctx.restore();
  text(label, x, y + 92 + bob, { size: 30, alpha: clamp(k * 1.5), color: '#fff' });
  ctx.save(); ctx.globalAlpha *= clamp(k * 1.5);
  rr(x - 80, y + 128, 160, 10, 5); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill();
  rr(x - 80, y + 128, 160 * prog, 10, 5); ctx.fillStyle = rgba(col); ctx.shadowColor = rgba(col); ctx.shadowBlur = 12; ctx.fill();
  ctx.restore();
}

function sceneGrok(u, t) {
  const col = C.grok, out = 1 - clamp((u - 11.4) / .6);
  ctx.save(); ctx.globalAlpha = out;
  const cx = 1340, cy = 290;
  hud(cx, cy, 82, t, col, u / 1);
  const lk = back(clamp((u - .3) / .8));
  ctx.save(); ctx.translate(cx, cy); ctx.scale(lk, lk); logoXAI(0, 0, 92, '#fff'); ctx.restore();

  header(120, 200, 'Grok Bot', 'xAI 桌面助手 · 马斯克旗下', 'xAI', col, (u - .2) / .8, 'left', u < .8 ? 1 - u / .8 : 0);

  const bots = ['写口播', '理日程', '连工具', '开网页', '组队协作'];
  const by = 640;
  bots.forEach((lab, i) => {
    const x = 300 + i * 330, k = clamp((u - 1.6 - i * .25) / .6);
    if (k > 0) {
      ctx.save(); ctx.globalAlpha *= k * .8;
      ctx.strokeStyle = rgba(col, .5); ctx.lineWidth = 2; ctx.setLineDash([8, 10]); ctx.lineDashOffset = -t * 60;
      ctx.beginPath(); ctx.moveTo(cx, cy + 150);
      ctx.bezierCurveTo(cx, by - 180, x, cy + 200, x, by - 90); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
    if (u > 4.6 && i < bots.length - 1) {
      const kk = clamp((u - 4.6) / .5);
      ctx.save(); ctx.globalAlpha *= kk; ctx.strokeStyle = rgba(col, .8); ctx.lineWidth = 3;
      ctx.shadowColor = rgba(col); ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(x + 75, by); ctx.lineTo(x + 255, by); ctx.stroke();
      const p = (t * 1.2 + i * .25) % 1;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + 75 + p * 180, by, 5, 0, TAU); ctx.fill();
      ctx.restore();
    }
    const prog = clamp((u - 2.8) / (3 + i * .9)) * (.85 + .15 * Math.sin(i));
    bot(x, by, 1, col, t, i, lab, prog, k);
  });
  text('多个 BOT 分工明确，同时开工，还能组队干活儿', W / 2, 430, { size: 34, alpha: clamp((u - 3.6) / .6), color: '#ffd6de' });

  const kb = clamp((u - 6.6) / .6);
  if (kb > 0) {
    const y = 940;
    ctx.save(); ctx.globalAlpha *= kb;
    rr(200, y - 62, W - 400, 124, 20);
    const g = ctx.createLinearGradient(200, 0, W - 200, 0);
    g.addColorStop(0, rgba(col, .25)); g.addColorStop(1, 'rgba(255,255,255,.04)');
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = rgba(col, .7); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    text('国内网络环境下上手更简单：装好就能开始干活', W / 2, y - 18, { size: 38, alpha: kb, glow: 16, glowColor: rgba(col) });
    text('不用像跑 Codex 那样折腾环境、卡连接', W / 2, y + 30, { size: 28, weight: 'normal', alpha: clamp((u - 7.2) / .6), color: 'rgba(255,230,235,.85)' });
  }
  ctx.restore();
}

function sceneCompare(u, t) {
  const out = 1 - clamp((u - 7.5) / .5);
  ctx.save(); ctx.globalAlpha = out;
  text('能力雷达', 120, 110, { size: 64, align: 'left', alpha: eo(u / .6), glow: 20, glowColor: '#8a6bff' });
  text('主观体验 · 仅供参考', 120, 175, { size: 26, align: 'left', weight: 'normal', alpha: eo((u - .3) / .6), color: '#b9b0e8' });

  const axes = ['总控调度', '写代码', '免费 / 低门槛', '生活杂事', '多 Agent 协作', '国内上手'];
  const data = {
    dots: [5, 5, 1.5, 3, 4, 2.5],
    muse: [2.5, 2, 5, 5, 2.5, 3.5],
    grok: [3.5, 3.5, 3.5, 3.5, 5, 5],
  };
  const cx = 720, cy = 590, R = 330, n = axes.length;
  const pt = (i, v) => { const a = -Math.PI / 2 + i / n * TAU; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
  const kg = eo(u / .8);
  ctx.save(); ctx.globalAlpha *= kg; ctx.strokeStyle = 'rgba(180,170,255,.25)'; ctx.lineWidth = 1.5;
  for (let l = 1; l <= 5; l++) {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const [x, y] = pt(i % n, l / 5 * kg); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  for (let i = 0; i < n; i++) { const [x, y] = pt(i, kg); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); }
  ctx.restore();
  axes.forEach((a, i) => { const [x, y] = pt(i, 1.2); text(a, x, y, { size: 28, alpha: kg, color: '#e6e2ff' }); });

  const keys = ['dots', 'muse', 'grok'];
  keys.forEach((key, j) => {
    const k = eo((u - 1 - j * 1.1) / 1), col = BRAND[key].col;
    if (k <= 0) return;
    const wob = 1 + .015 * Math.sin(t * 4 + j);
    ctx.save();
    ctx.beginPath();
    data[key].forEach((v, i) => { const [x, y] = pt(i, v / 5 * k * wob); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.closePath();
    ctx.fillStyle = rgba(col, .16); ctx.fill();
    ctx.strokeStyle = rgba(col); ctx.lineWidth = 4; ctx.shadowColor = rgba(col); ctx.shadowBlur = 20; ctx.stroke();
    data[key].forEach((v, i) => { const [x, y] = pt(i, v / 5 * k * wob); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); });
    ctx.restore();

    const ly = 330 + j * 200, lx = 1240, kl = clamp((u - 1 - j * 1.1) / .6);
    ctx.save(); ctx.globalAlpha *= kl; ctx.translate((1 - eo(kl)) * 100, 0);
    rr(lx, ly - 75, 560, 150, 20); ctx.fillStyle = rgba(col, .1); ctx.fill();
    ctx.strokeStyle = rgba(col, .7); ctx.lineWidth = 2; ctx.stroke();
    brandMark(key, lx + 80, ly, 44, t);
    text(BRAND[key].name, lx + 160, ly - 24, { size: 42, align: 'left', glow: 14, glowColor: rgba(col) });
    const tag = { dots: '超级总控 · 写代码强 · 偏贵', muse: '生活管家 · 免费档 · 轻视频', grok: '多 BOT 协作 · 上手快 · 性价比' }[key];
    text(tag, lx + 160, ly + 28, { size: 26, align: 'left', weight: 'normal', color: rgba(mix(col, C.white, .55)) });
    ctx.restore();
  });
  ctx.restore();
}

function sceneVerdict(u, t) {
  text('一句话怎么选？', W / 2, 120, { size: 72, alpha: eo(u / .6), glow: 30, glowColor: '#6a8cff', spacing: 6 });
  const cols = [
    ['dots', ['要超级总控', '又爱 OpenAI / Codex 那一套']],
    ['muse', ['要免费搞定生活杂事', '顺手做点简单视频']],
    ['grok', ['要少切窗口', '把工作与内容往前推', '追求性价比']],
  ];
  cols.forEach(([key, lines], i) => {
    const b = BRAND[key], k = clamp((u - .7 - i * 1.1) / .8), x = W / 2 + (i - 1) * 580, y = 560;
    if (k <= 0) return;
    const hi = u > 6 ? .5 + .5 * Math.sin(t * 3 + i * 2) : 1;
    ctx.save(); ctx.globalAlpha *= clamp(k * 1.5); ctx.translate(0, (1 - back(k)) * 160);
    rr(x - 260, y - 330, 520, 660, 28);
    const g = ctx.createLinearGradient(0, y - 330, 0, y + 330);
    g.addColorStop(0, rgba(b.col, .28)); g.addColorStop(1, 'rgba(10,12,22,.65)');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = rgba(b.col, .5 + .5 * hi); ctx.lineWidth = 3; ctx.shadowColor = rgba(b.col); ctx.shadowBlur = 30 * hi; ctx.stroke();
    ctx.shadowBlur = 0;
    brandMark(key, x, y - 200, 70, t);
    lines.forEach((l, j) => text(l, x, y - 40 + j * 54, { size: 34, color: '#fff', weight: j ? 'normal' : 'bold' }));
    const ka = clamp((k - .5) * 2);
    ctx.globalAlpha *= ka;
    const ax = x, ay = y + 160 + Math.sin(t * 5) * 6;
    ctx.fillStyle = rgba(b.col); ctx.shadowColor = rgba(b.col); ctx.shadowBlur = 20;
    poly([[ax - 18, ay - 16], [ax + 18, ay - 16], [ax, ay + 12]]);
    ctx.restore();
    text(`选 ${b.name}`, x, y + 245, { size: 58, alpha: clamp((k - .5) * 2), glow: 30, glowColor: rgba(b.col) });
  });
  const kf = clamp((u - 5.6) / .8);
  text('选对助手，事半功倍', W / 2, 990, { size: 50, alpha: kf, glow: 30, glowColor: '#8ab0ff', spacing: 12 });
}

/* ---------- main ---------- */

function accentAt(t) {
  for (let i = 0; i < SCENES.length; i++) {
    const sc = SCENES[i], nx = SCENES[i + 1];
    if (t < sc.e || !nx) {
      if (nx && t > sc.e - .8) return mix(sc.acc, nx.acc, eio((t - (sc.e - .8)) / .8));
      return sc.acc;
    }
  }
  return SCENES[0].acc;
}

function renderFrame(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const shake = SCENES.some(s => s.s > 0 && Math.abs(t - s.s) < .2) ? 6 : 0;
  background(t, accentAt(t));
  ctx.save();
  if (shake) ctx.translate((hash(t * 91) - .5) * shake * 2, (hash(t * 37) - .5) * shake * 2);
  for (const sc of SCENES) if (t >= sc.s && t < sc.e) sc.f(t - sc.s, t);
  ctx.restore();
  post(t);
}
