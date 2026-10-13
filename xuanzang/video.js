const W = 1920, H = 1080, DURATION = 118;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const KAI = '"AR PL UKai CN","KaiTi","STKaiti","楷体",serif';
const SERIF = '"Noto Serif CJK SC","Source Han Serif SC","Songti SC","SimSun",serif';
const TAU = Math.PI * 2;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const win = (t, s, e, d = .6) => clamp(Math.min((t - s) / d, (e - t) / d));
const rgba = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const GOLD = [230, 192, 118], GOLD_HI = [255, 230, 170], RED = [176, 42, 32], PAPER = [228, 208, 166], INK = [52, 32, 18];

const SCENES = [
  { s: 0, e: 9, f: sIntro },
  { s: 9, e: 21, f: sYouth },
  { s: 21, e: 31, f: sDepart },
  { s: 31, e: 66, f: sMap },
  { s: 66, e: 94, f: sDeeds },
  { s: 94, e: 104, f: sEnd },
  { s: 104, e: 118, f: sFaith },
];

const DUST = Array.from({ length: 110 }, (_, i) => ({
  x: hash(i) * W, y: hash(i + 50) * H, v: 6 + hash(i + 9) * 22, r: .6 + hash(i + 3) * 2, a: .15 + hash(i + 17) * .5,
}));

const grain = (() => {
  const g = document.createElement('canvas'); g.width = 960; g.height = 540;
  const gx = g.getContext('2d'), img = gx.createImageData(960, 540);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = hash(i * .37) * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  gx.putImageData(img, 0, 0);
  return g;
})();

/* ---------- helpers ---------- */

function text(s, x, y, o = {}) {
  const { size = 48, color = rgba(GOLD), align = 'center', weight = 'normal', alpha = 1, glow = 0, glowColor, font = SERIF, base = 'middle', spacing = 0, blur = 0 } = o;
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= clamp(alpha);
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align; ctx.textBaseline = base;
  ctx.letterSpacing = spacing + 'px';
  if (blur > .3) ctx.filter = `blur(${blur}px)`;
  if (glow) { ctx.shadowColor = glowColor || color; ctx.shadowBlur = glow; }
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
  ctx.restore();
}

function inkText(s, x, y, k, o = {}) {
  const chars = [...s], size = o.size || 80, gap = size * (o.gapK || 1.05);
  const w = (chars.length - 1) * gap;
  chars.forEach((ch, i) => {
    const kk = clamp((k * (chars.length + 2) - i) / 3);
    if (kk <= 0) return;
    const px = o.align === 'left' ? x + i * gap + size / 2 : x - w / 2 + i * gap;
    text(ch, px, y, { ...o, align: 'center', spacing: 0, alpha: eo(kk) * (o.alpha ?? 1), blur: (1 - eo(kk)) * 18 });
  });
}

function vtext(s, x, y, k, o = {}) {
  const chars = [...s], size = o.size || 72, gap = size * 1.12;
  chars.forEach((ch, i) => {
    const kk = clamp((k * (chars.length + 2) - i) / 2.5);
    if (kk <= 0) return;
    text(ch, x, y + i * gap, { ...o, alpha: eo(kk) * (o.alpha ?? 1), blur: (1 - eo(kk)) * 14 });
  });
}

function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

function seal(x, y, s, chars, k, rot = -.06) {
  if (k <= 0) return;
  const sc = lerp(1.8, 1, eo(k));
  ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  rr(-s / 2, -s / 2, s, s, s * .1); ctx.fillStyle = rgba(RED, .92); ctx.fill();
  ctx.strokeStyle = 'rgba(255,220,200,.6)'; ctx.lineWidth = s * .03;
  rr(-s * .42, -s * .42, s * .84, s * .84, s * .06); ctx.stroke();
  ctx.fillStyle = '#f6e6d0'; ctx.font = `${s * .36}px ${KAI}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const c = [...chars];
  if (c.length === 4) {
    ctx.fillText(c[0], s * .19, -s * .19); ctx.fillText(c[1], s * .19, s * .19);
    ctx.fillText(c[2], -s * .19, -s * .19); ctx.fillText(c[3], -s * .19, s * .19);
  } else if (c.length === 2) {
    ctx.font = `${s * .4}px ${KAI}`;
    ctx.fillText(c[0], 0, -s * .2); ctx.fillText(c[1], 0, s * .2);
  } else {
    ctx.font = `${s * .62}px ${KAI}`; ctx.fillText(c[0], 0, s * .03);
  }
  ctx.restore();
}

function chapter(num, title, u) {
  const k = eo(u / .8);
  seal(150, 120, 74, num, clamp(u / .5));
  text(title, 210, 122, { font: KAI, size: 56, align: 'left', alpha: k, glow: 18, glowColor: rgba(GOLD, .6) });
  ctx.save(); ctx.globalAlpha *= k;
  const g = ctx.createLinearGradient(210, 0, 900, 0);
  g.addColorStop(0, rgba(GOLD, .8)); g.addColorStop(1, rgba(GOLD, 0));
  ctx.fillStyle = g; ctx.fillRect(210, 170, 690 * k, 2);
  ctx.restore();
}

/* ---------- atmosphere ---------- */

function sky(top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function sun(x, y, r, inten, t) {
  if (inten <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  let g = ctx.createRadialGradient(x, y, 0, x, y, r * 7);
  g.addColorStop(0, rgba(GOLD_HI, .55 * inten)); g.addColorStop(.15, rgba(GOLD, .3 * inten)); g.addColorStop(1, rgba(GOLD, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * TAU + t * .03, wdt = .05 + .04 * hash(i), len = W * (.6 + .5 * hash(i + 4));
    const fl = .5 + .5 * Math.sin(t * .8 + i * 1.7);
    ctx.fillStyle = rgba(GOLD_HI, .05 * inten * fl);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a - wdt) * len, y + Math.sin(a - wdt) * len);
    ctx.lineTo(x + Math.cos(a + wdt) * len, y + Math.sin(a + wdt) * len);
    ctx.closePath(); ctx.fill();
  }
  g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba([255, 248, 225], inten)); g.addColorStop(.7, rgba(GOLD_HI, .9 * inten)); g.addColorStop(1, rgba(GOLD, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.restore();
}

function ridge(seed, baseY, amp, off, col) {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 8) {
    const X = x + off;
    let y = 0;
    for (let k = 1; k <= 4; k++) y += Math.sin(X * .0016 * k * (1 + hash(seed + k) * .7) + hash(seed * 3 + k) * 10) / k;
    y += .25 * Math.sin(X * .02 + seed);
    ctx.lineTo(x, baseY - Math.abs(y) * amp);
  }
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
}

function mountains(t, tone = 1, speed = 1) {
  ridge(1, H * .7, 150, t * 6 * speed, `rgba(110,82,50,${.25 * tone})`);
  ridge(2, H * .78, 120, t * 14 * speed, `rgba(60,40,22,${.55 * tone})`);
  ridge(3, H * .9, 90, t * 30 * speed, `rgba(18,11,6,${.92 * tone})`);
}

function mist(y, t, a = .25) {
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 5; i++) {
    const x = ((i * 520 + t * (12 + i * 5)) % (W + 800)) - 400;
    const g = ctx.createRadialGradient(x, y + i * 18, 0, x, y + i * 18, 380);
    g.addColorStop(0, 'rgba(230,210,170,.35)'); g.addColorStop(1, 'rgba(230,210,170,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 400, y - 200, 800, 420);
  }
  ctx.restore();
}

function dust(t, a = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const p of DUST) {
    const y = ((p.y - t * p.v) % H + H) % H, x = p.x + Math.sin(t * .4 + p.y) * 30;
    ctx.fillStyle = rgba(GOLD_HI, p.a * a * (.5 + .5 * Math.sin(t * 1.5 + p.x)));
    ctx.beginPath(); ctx.arc(x, y, p.r, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

function monk(x, y, s, phase, col = '#0b0603', face = -1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s);
  ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round';
  const sw = Math.sin(phase), bob = Math.abs(Math.cos(phase)) * 2;
  ctx.translate(0, -bob);
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(-4, -10); ctx.lineTo(-4 + sw * 12, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(6, -10); ctx.lineTo(6 - sw * 12, 0); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-13, -78); ctx.quadraticCurveTo(-20, -40, -24, -8); ctx.lineTo(24, -8); ctx.quadraticCurveTo(20, -40, 14, -78);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(1, -90, 11, 0, TAU); ctx.fill();
  rr(-38, -104, 22, 64, 3); ctx.fill();
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(-27, -104, 24, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-27, -128); ctx.lineTo(-27, -104); ctx.stroke();
  ctx.lineWidth = 3.5;
  const sx = 30 + sw * 4;
  ctx.beginPath(); ctx.moveTo(sx - 4, -122); ctx.lineTo(sx + 6, 0); ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(10, -66); ctx.lineTo(sx - 1, -70); ctx.stroke();
  ctx.restore();
}

function post(t) {
  ctx.save();
  ctx.globalAlpha = .07; ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(grain, 0, 0, W, H);
  ctx.restore();
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .4, W / 2, H / 2, W * .7);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.7)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, 34); ctx.fillRect(0, H - 34, W, 34);
}

/* ---------- scenes ---------- */

function sIntro(u, t) {
  sky('#0a0604', '#24160b');
  sun(960, 790, 90, eo(u / 2.5) * .9, t);
  mountains(t, 1, .4);
  mist(H * .74, t, .5);
  dust(t, eo(u / 2));
  inkText('玄奘', 960, 400, clamp((u - .8) / 2), { font: KAI, size: 250, gapK: 1.15, color: rgba(GOLD_HI), glow: 40, glowColor: rgba(GOLD, .8) });
  seal(1255, 470, 92, '三藏', clamp((u - 3) / .4));
  text('602 — 664 · 大唐三藏法师', 960, 590, { size: 40, alpha: eo((u - 3.6) / .8), color: rgba(PAPER), spacing: 8 });
  inkText('一人 · 一心 · 万里路', 960, 690, clamp((u - 4.8) / 1.6), { font: KAI, size: 58, gapK: 1.25, color: rgba(GOLD) });
}

function sYouth(u, t) {
  sky('#0b0705', '#1c1209');
  sun(260, 860, 60, .45, t);
  mountains(t, .8, .3);
  dust(t, .7);
  chapter('壹', '少年立志', u);

  vtext('意欲远绍如来', 520, 300, clamp((u - 3.2) / 2), { font: KAI, size: 82, color: rgba(GOLD_HI), glow: 24, glowColor: rgba(GOLD, .7) });
  vtext('近光遗法', 400, 300, clamp((u - 4.6) / 1.6), { font: KAI, size: 82, color: rgba(GOLD_HI), glow: 24, glowColor: rgba(GOLD, .7) });
  text('—— 十三岁出家时的誓愿', 470, 1000, { size: 28, alpha: eo((u - 6) / .8), color: rgba(PAPER, .8) });

  const lines = [
    [.6, '洛州缑氏人，俗姓陈，名祎', 0],
    [1.6, '十一岁，熟读《法华经》《维摩诘经》', 0],
    [2.6, '十三岁，破格剃度出家', 0],
    [6.2, '遍访名师，二十余岁已誉满两京', 0],
    [7.6, '却发现：各家对佛理说法不一……', 0],
    [9.2, '他决心西行天竺，求取《瑜伽师地论》', 1],
  ];
  lines.forEach(([s, l, hi], i) => {
    const k = eo((u - s) / .8), y = 300 + i * 105 + (i > 2 ? 40 : 0);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k; ctx.translate((1 - k) * 60, 0);
    ctx.fillStyle = rgba(hi ? RED : GOLD, hi ? 1 : .7);
    ctx.beginPath(); ctx.arc(840, y, hi ? 9 : 6, 0, TAU); ctx.fill();
    if (i < lines.length - 1) { ctx.fillStyle = rgba(GOLD, .25); ctx.fillRect(839, y + 14, 2, 105 + (i === 2 ? 40 : 0) - 28); }
    ctx.restore();
    text(l, 880 + (1 - k) * 60, y, { size: hi ? 46 : 38, align: 'left', alpha: k, color: hi ? rgba(GOLD_HI) : rgba(PAPER, .92), glow: hi ? 20 : 0, glowColor: rgba(GOLD, .7), weight: hi ? 'bold' : 'normal' });
  });
}

function sDepart(u, t) {
  sky('#1a0d06', '#5a3014');
  sun(520, 640, 120, 1, t);
  ridge(7, H * .8, 60, t * 4, 'rgba(70,38,16,.7)');
  ridge(8, H * .9, 40, t * 8, 'rgba(14,8,4,1)');
  dust(t, 1);
  const mx = lerp(1500, 1180, clamp(u / 10)), my = H * .9 - 26;
  monk(mx, my, 1.6, u * 5.5);
  ctx.save(); ctx.globalAlpha *= .35; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(mx + 60, my + 4, 90, 8, 0, 0, TAU); ctx.fill(); ctx.restore();
  for (let i = 0; i < 14; i++) {
    const fx = mx + 40 + i * 46, a = clamp(1 - i / 14) * .5;
    ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.beginPath(); ctx.ellipse(fx, my + 6 + (i % 2) * 6, 8, 3, 0, 0, TAU); ctx.fill();
  }
  chapter('贰', '孤身西行', u);
  text('贞观三年 · 公元 629 年', 1440, 270, { size: 44, alpha: eo((u - .6) / .8), color: rgba(GOLD_HI), spacing: 4 });
  text('朝廷不发“过所”，他没有通关文牒，也没有随从', 1440, 350, { size: 34, alpha: eo((u - 1.8) / .8), color: rgba(PAPER) });
  inkText('只身出关，一路向西', 1440, 460, clamp((u - 3.4) / 1.6), { font: KAI, size: 76, color: rgba(GOLD_HI), glow: 30, glowColor: rgba(GOLD, .8) });
  text('心中只有一个念头：求得真经', 1440, 560, { size: 36, alpha: eo((u - 5.6) / .8), color: rgba(PAPER, .9) });
}

const OUT = [
  { n: '长安', x: 1700, y: 560, a: 2, d: 3.2, ly: 44 },
  { n: '瓜州', x: 1460, y: 440, a: 4, d: 4.5, ly: -38 },
  { n: '莫贺延碛', x: 1340, y: 412, a: 5.2, d: 9.4, ly: 44 },
  { n: '高昌', x: 1210, y: 372, a: 10.1, d: 12.8, ly: -38 },
  { n: '龟兹', x: 1030, y: 398, a: 13.3, d: 13.4, ly: 44 },
  { n: '凌山', x: 910, y: 320, a: 14, d: 16.2, ly: -38 },
  { n: '碎叶', x: 790, y: 236, a: 16.7, d: 16.8, ly: -38 },
  { n: '撒马尔罕', x: 560, y: 312, a: 17.4, d: 17.5, ly: -38 },
  { n: '巴米扬', x: 470, y: 500, a: 18.1, d: 18.2, lx: -84, ly: 0 },
  { n: '迦湿弥罗', x: 650, y: 560, a: 18.8, d: 18.9, ly: 44 },
  { n: '那烂陀', x: 1090, y: 820, a: 20, d: 24.6, ly: 44 },
];
const BACK = [
  { n: '那烂陀', x: 1090, y: 820, a: 24.6, d: 24.6, ly: 44, hide: 1 },
  { n: '曲女城', x: 850, y: 740, a: 25.4, d: 28.6, lx: -90, ly: 0 },
  { n: '葱岭', x: 730, y: 450, a: 29.6, d: 29.7, lx: -64, ly: 0 },
  { n: '于阗', x: 990, y: 500, a: 30.4, d: 30.5, ly: 44 },
  { n: '长安', x: 1700, y: 560, a: 32, d: 35, ly: 44, hide: 1 },
];

function drawRoute(pts, u, col, glow, dash) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 18; }
  if (dash) ctx.setLineDash(dash);
  let head = null;
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i], q = pts[i + 1], k = eio((u - p.d) / (q.a - p.d));
    if (u < p.d) break;
    const mx = (p.x + q.x) / 2 + (q.y - p.y) * .12, my = (p.y + q.y) / 2 - (q.x - p.x) * .12;
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
    const N = 30, n = Math.round(N * k);
    let x = p.x, y = p.y;
    for (let j = 1; j <= n; j++) {
      const s = j / N;
      x = (1 - s) * (1 - s) * p.x + 2 * (1 - s) * s * mx + s * s * q.x;
      y = (1 - s) * (1 - s) * p.y + 2 * (1 - s) * s * my + s * s * q.y;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    if (k < 1) head = [x, y];
  }
  ctx.restore();
  return head;
}

function station(p, u, col) {
  const k = clamp((u - p.a) / .4);
  if (k <= 0 || p.hide) return;
  const active = u >= p.a && u <= p.d + .3 && p.d - p.a > .5;
  ctx.save(); ctx.globalAlpha *= k;
  if (active) {
    const pu = ((u - p.a) % 1.2) / 1.2;
    ctx.strokeStyle = rgba(col, 1 - pu); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(p.x, p.y, 12 + pu * 40, 0, TAU); ctx.stroke();
  }
  ctx.fillStyle = rgba(col); ctx.beginPath(); ctx.arc(p.x, p.y, active ? 12 : 9, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(PAPER); ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, TAU); ctx.fill();
  ctx.restore();
  text(p.n, p.x + (p.lx || 0), p.y + (p.ly || 0), { font: KAI, size: active ? 38 : 32, alpha: k, color: rgba(INK), weight: 'bold' });
}

function mapGlyphMountain(x, y, s, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba(INK, .55); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .2, y - s * 1.1); ctx.lineTo(x + s * .2, y - s * .7); ctx.lineTo(x + s * .55, y - s * 1.3); ctx.lineTo(x + s * 1.2, y); ctx.stroke();
  ctx.restore();
}

function sMap(u, t) {
  sky('#120b06', '#1c1209');
  const open = eio(u / 1.6);
  const px = 70, py = 70, pw = W - 140, ph = H - 140;
  ctx.save();
  ctx.beginPath(); ctx.rect(W / 2 - pw / 2 * open, py, pw * open, ph); ctx.clip();
  const g = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, W * .62);
  g.addColorStop(0, rgba([236, 218, 178])); g.addColorStop(.7, rgba(PAPER)); g.addColorStop(1, rgba([150, 110, 64]));
  ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph);
  const ga = ctx.globalAlpha;
  ctx.globalAlpha = ga * .18; ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(grain, px, py, pw, ph);
  ctx.globalAlpha = ga; ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = rgba(INK, .5); ctx.lineWidth = 3; ctx.strokeRect(px + 18, py + 18, pw - 36, ph - 36);
  ctx.lineWidth = 1; ctx.strokeRect(px + 28, py + 28, pw - 56, ph - 56);

  const ma = clamp((u - 1) / 1);
  [[860, 300, 40], [930, 290, 52], [1010, 300, 44], [1090, 305, 38], [1150, 312, 30]].forEach(m => mapGlyphMountain(...m, ma));
  [[690, 470, 46], [750, 455, 56], [700, 420, 36]].forEach(m => mapGlyphMountain(...m, ma));
  [[820, 650, 44], [900, 640, 56], [980, 650, 50], [1060, 655, 42], [1140, 665, 36], [760, 640, 34]].forEach(m => mapGlyphMountain(...m, ma));
  ctx.save(); ctx.globalAlpha *= ma; ctx.fillStyle = rgba(INK, .35);
  for (let i = 0; i < 160; i++) ctx.fillRect(1000 + hash(i) * 420, 440 + hash(i + 7) * 60, 2.5, 2.5);
  ctx.strokeStyle = rgba([60, 90, 120], .55); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(700, 690); ctx.bezierCurveTo(850, 760, 1000, 900, 1350, 880); ctx.stroke();
  ctx.restore();
  [['天山', 1000, 250], ['葱岭', 650, 400], ['雪山', 1180, 620], ['流沙', 1220, 500], ['恒河', 1260, 920], ['大唐', 1660, 380], ['西域', 700, 190], ['天竺', 900, 900]]
    .forEach(([s, x, y]) => text(s, x, y, { font: KAI, size: 34, alpha: ma * .55, color: rgba(INK), spacing: 10 }));

  const h1 = drawRoute(OUT, u, rgba(RED, .9), null, null);
  const h2 = drawRoute(BACK, u, rgba([200, 140, 30]), rgba(GOLD), [14, 10]);
  OUT.forEach(p => station(p, u, RED));
  BACK.forEach(p => station(p, u, [190, 120, 20]));
  const head = h2 || h1;
  if (head) {
    ctx.save(); ctx.fillStyle = rgba(GOLD_HI); ctx.shadowColor = rgba(GOLD_HI); ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.arc(head[0], head[1], 9, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.restore();

  chapterOnMap(u);

  const caps = [
    [2.2, 4.6, '629 年', '自长安出发，一路西行'],
    [10.1, 12.9, '高昌', '国王苦苦强留，他绝食三日以明其志'],
    [14, 16.3, '凌山', '冰雪险峻，同行者冻饿而死十之三四'],
    [16.3, 19.6, '西域', '历经西域诸国，辗转南下天竺'],
    [20, 22.7, '那烂陀', '拜戒贤大师为师，苦学五年'],
    [22.7, 24.6, '五印', '遍游东、南、西印度，访师问学'],
    [25.4, 28.6, '643 年', '曲女城无遮大会，十八日无人能难'],
    [28.6, 32, '东归', '携经东归，翻越葱岭，取道于阗'],
    [32, 35, '645 年', '回到长安，带回佛经 657 部'],
  ];
  caps.forEach(([s, e, tag, line]) => {
    const k = win(u, s, e, .35);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k;
    const g2 = ctx.createLinearGradient(360, 0, 1560, 0);
    g2.addColorStop(0, 'rgba(20,12,6,0)'); g2.addColorStop(.15, 'rgba(20,12,6,.85)'); g2.addColorStop(.85, 'rgba(20,12,6,.85)'); g2.addColorStop(1, 'rgba(20,12,6,0)');
    ctx.fillStyle = g2; ctx.fillRect(360, 930, 1200, 84);
    ctx.restore();
    text(tag, 660, 972, { font: KAI, size: 40, alpha: k, color: rgba([235, 90, 70]), weight: 'bold', align: 'right' });
    text(line, 690, 972, { size: 38, alpha: k, color: rgba(PAPER), align: 'left' });
  });

  const kq = win(u, 5.4, 9.4, .6);
  if (kq > 0) {
    ctx.fillStyle = `rgba(10,6,3,${kq * .9})`; ctx.fillRect(0, 0, W, H);
    text('莫贺延碛 · 八百里流沙', 960, 300, { size: 36, alpha: kq, color: rgba(PAPER), spacing: 6 });
    text('失手打翻水囊，四夜五日滴水未进', 960, 360, { size: 34, alpha: kq, color: rgba(PAPER, .85) });
    inkText('宁可就西而死', 960, 520, clamp((u - 6) / 1.2) * kq, { font: KAI, size: 110, color: rgba(GOLD_HI), glow: 40, glowColor: rgba(GOLD) });
    inkText('岂归东而生', 960, 680, clamp((u - 7) / 1.2) * kq, { font: KAI, size: 110, color: rgba(GOLD_HI), glow: 40, glowColor: rgba(GOLD) });
  }

  const kt = clamp((u - 26) / .5) * win(u, 25.4, 28.6, .4);
  if (kt > 0) {
    [['大乘天', 700], ['解脱天', 1000]].forEach(([s, x], i) => {
      const kk = clamp((u - 26 - i * .4) / .5) * kt;
      ctx.save(); ctx.globalAlpha *= kk; ctx.translate(x, 630);
      rr(-110, -40, 220, 80, 40); ctx.fillStyle = rgba(RED, .92); ctx.fill();
      ctx.strokeStyle = rgba(GOLD_HI); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      text(s, x, 632, { font: KAI, size: 44, alpha: kk, color: '#fbe9cf' });
    });
    text('天竺僧众尊称', 850, 560, { size: 30, alpha: kt, color: rgba(INK), weight: 'bold' });
  }

  const ks = clamp((u - 32.6) / .8);
  if (ks > 0) {
    ctx.save(); ctx.globalAlpha *= ks;
    rr(1240, 640, 480, 230, 16); ctx.fillStyle = 'rgba(30,18,8,.88)'; ctx.fill();
    ctx.strokeStyle = rgba(GOLD, .8); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    text('十七年', 1360, 715, { font: KAI, size: 72, alpha: ks, color: rgba(GOLD_HI), glow: 20 });
    text('五万里', 1600, 715, { font: KAI, size: 72, alpha: ks, color: rgba(GOLD_HI), glow: 20 });
    text('历时', 1360, 800, { size: 30, alpha: ks, color: rgba(PAPER) });
    text('行程', 1600, 800, { size: 30, alpha: ks, color: rgba(PAPER) });
  }
}

function chapterOnMap(u) {
  const k = eo((u - .8) / .8);
  if (k <= 0) return;
  seal(170, 160, 70, '叁', k);
  text('万里求法路', 230, 162, { font: KAI, size: 52, align: 'left', alpha: k, color: rgba(INK), weight: 'bold' });
  ctx.save(); ctx.globalAlpha *= k;
  ctx.strokeStyle = rgba(RED, .9); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1450, 165); ctx.lineTo(1510, 165); ctx.stroke();
  ctx.strokeStyle = rgba([200, 140, 30]); ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(1450, 210); ctx.lineTo(1510, 210); ctx.stroke();
  ctx.restore();
  text('西行求法', 1530, 165, { size: 28, align: 'left', alpha: k, color: rgba(INK) });
  text('载经东归', 1530, 210, { size: 28, align: 'left', alpha: k, color: rgba(INK) });
}

function sDeeds(u, t) {
  sky('#0c0805', '#1e140a');
  sun(960, 1180, 260, .7, t);
  dust(t, .8);
  chapter('肆', '不朽功业', u);
  const cards = [
    { big: 657, unit: '部', title: '带回佛教经典', sub: '以二十匹马驮回长安' },
    { big: 1335, unit: '卷', title: '译经 75 部', sub: '十九年译笔不辍' },
    { bigText: '大唐西域记', title: '口述西行见闻', sub: '研究古印度史的瑰宝' },
    { bigText: '唯识宗', title: '开创法相唯识宗', sub: '深刻影响汉传佛教' },
    { bigText: '大雁塔', title: '652 年建塔藏经', sub: '今西安大雁塔前身' },
    { bigText: '东亚', title: '经论远传四方', sub: '朝鲜半岛 · 日本 · 越南' },
  ];
  cards.forEach((c, i) => {
    const s = 1.4 + i * 3.1, k = clamp((u - s) / .9);
    if (k <= 0) return;
    const col = i % 3, row = Math.floor(i / 3);
    const x = 360 + col * 600, y = 400 + row * 360;
    const latest = u - s < 3.1 && u < 20.5;
    ctx.save(); ctx.globalAlpha *= clamp(k * 1.5); ctx.translate(x, y + (1 - eo(k)) * 50);
    rr(-270, -150, 540, 300, 14);
    const g = ctx.createLinearGradient(0, -150, 0, 150);
    g.addColorStop(0, 'rgba(60,38,18,.85)'); g.addColorStop(1, 'rgba(20,12,6,.9)');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = rgba(GOLD, latest ? 1 : .45); ctx.lineWidth = latest ? 3 : 1.5;
    if (latest) { ctx.shadowColor = rgba(GOLD); ctx.shadowBlur = 30; }
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = rgba(GOLD, .25); ctx.lineWidth = 1; rr(-256, -136, 512, 272, 10); ctx.stroke();
    ctx.restore();
    const yy = y + (1 - eo(k)) * 50, a = clamp(k * 1.5);
    if (c.big) {
      const n = Math.round(c.big * eo((u - s) / 1.6));
      text(String(n), x - 20, yy - 50, { font: KAI, size: 110, alpha: a, color: rgba(GOLD_HI), glow: 24, glowColor: rgba(GOLD, .8), weight: 'bold' });
      ctx.save(); ctx.font = `bold 110px ${KAI}`; const w = ctx.measureText(String(c.big)).width; ctx.restore();
      text(c.unit, x - 20 + w / 2 + 34, yy - 30, { font: KAI, size: 50, alpha: a, color: rgba(GOLD) });
    } else {
      text(c.bigText, x, yy - 50, { font: KAI, size: c.bigText.length > 3 ? 78 : 96, alpha: a, color: rgba(GOLD_HI), glow: 24, glowColor: rgba(GOLD, .8), weight: 'bold' });
    }
    text(c.title, x, yy + 50, { size: 36, alpha: a, color: rgba(PAPER), weight: 'bold' });
    text(c.sub, x, yy + 102, { size: 28, alpha: a, color: rgba(PAPER, .7) });
  });
  const kb = eo((u - 21) / 1);
  inkText('中国四大翻译家之一 · 汉传佛教最伟大的译经师之一', 960, 990, clamp((u - 21) / 2.2), { size: 38, gapK: 1.02, color: rgba(GOLD_HI), glow: 18, glowColor: rgba(GOLD, .6), alpha: kb });
}

function flame(x, y, t, s = 1) {
  const f = 1 + .08 * Math.sin(t * 13) + .05 * Math.sin(t * 29);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  let g = ctx.createRadialGradient(x, y - 30 * s, 0, x, y - 30 * s, 420 * s * f);
  g.addColorStop(0, 'rgba(255,190,90,.45)'); g.addColorStop(1, 'rgba(255,150,50,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.translate(x, y); ctx.scale(s, s * f);
  g = ctx.createRadialGradient(0, -22, 2, 0, -22, 34);
  g.addColorStop(0, 'rgba(255,250,220,1)'); g.addColorStop(.5, 'rgba(255,190,80,.9)'); g.addColorStop(1, 'rgba(255,120,30,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, -70 + Math.sin(t * 9) * 4); ctx.quadraticCurveTo(22, -20, 0, 0); ctx.quadraticCurveTo(-22, -20, 0, -70 + Math.sin(t * 9) * 4); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#2a1a0c'; ctx.beginPath(); ctx.ellipse(x, y + 6 * s, 44 * s, 12 * s, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#3d2711'; ctx.fillRect(x - 10 * s, y + 6 * s, 20 * s, 60 * s);
}

function sEnd(u, t) {
  sky('#060403', '#100a05');
  flame(1500, 720, t, 1.2);
  dust(t, .4);
  chapter('伍', '译经至最后一刻', u);
  text('663 年，译完六百卷《大般若经》', 160, 770, { size: 40, align: 'left', alpha: eo((u - .6) / .8), color: rgba(PAPER) });
  const cols = ['吾来玉华', '本缘般若', '今经事既终', '吾生涯亦尽'];
  cols.forEach((c, i) => vtext(c, 1020 - i * 130, 250, clamp((u - 1.6 - i * .7) / 1.2), { font: KAI, size: 72, color: rgba(GOLD_HI), glow: 22, glowColor: rgba(GOLD, .7) }));
  text('664 年，玄奘圆寂于玉华寺', 160, 845, { size: 40, align: 'left', alpha: eo((u - 5.4) / .8), color: rgba(PAPER) });
  text('唐高宗闻讯悲叹：“朕失国宝矣！”', 160, 920, { size: 40, align: 'left', alpha: eo((u - 6.8) / .8), color: rgba(GOLD_HI), glow: 16, glowColor: rgba(GOLD, .6) });
}

function sFaith(u, t) {
  sky('#140a05', '#4a2a12');
  sun(960, lerp(900, 790, eo(u / 6)), 110, eo(u / 3), t);
  mountains(t, 1, .2);
  mist(H * .74, t, .4);
  dust(t, 1);
  monk(1460, H * .9 - 92, .9, 0, '#080403', -1);
  const o = 1 - clamp((u - 9.6) / .6);
  text('《西游记》里的唐僧，原型就是他', 960, 200, { size: 42, alpha: eo((u - .6) / .8) * o, color: rgba(PAPER) });
  text('但真实的玄奘，没有神通，也没有徒弟护送', 960, 270, { size: 42, alpha: eo((u - 2.4) / .8) * o, color: rgba(PAPER) });
  inkText('支撑他走完五万里的，是信仰', 960, 420, clamp((u - 4.2) / 1.8) * o, { font: KAI, size: 92, color: rgba(GOLD_HI), glow: 40, glowColor: rgba(GOLD) });
  text('“我们从古以来……有舍身求法的人……这就是中国的脊梁。”', 960, 560, { font: KAI, size: 44, alpha: eo((u - 6.6) / 1) * o, color: rgba(GOLD) });
  text('—— 鲁迅', 1500, 625, { size: 30, alpha: eo((u - 7.4) / 1) * o, color: rgba(PAPER, .8) });

  const k = clamp((u - 10) / 1.4);
  inkText('玄奘', 960, 380, k, { font: KAI, size: 200, gapK: 1.15, color: rgba(GOLD_HI), glow: 40, glowColor: rgba(GOLD, .9) });
  seal(1200, 450, 80, '三藏', clamp((u - 11.4) / .4));
  text('一人 · 一心 · 万里路', 960, 560, { font: KAI, size: 52, alpha: eo((u - 11.6) / .8), color: rgba(GOLD), spacing: 10 });
}

/* ---------- main ---------- */

function renderFrame(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  for (const sc of SCENES) {
    if (t >= sc.s && t < sc.e) {
      ctx.save();
      ctx.globalAlpha = clamp(Math.min((t - sc.s) / .7, (sc.e - t) / .7));
      sc.f(t - sc.s, t);
      ctx.restore();
    }
  }
  post(t);
}
