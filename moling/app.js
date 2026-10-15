'use strict';
const M = window.MOLING;
const byId = Object.fromEntries(M.characters.map((c) => [c.id, c]));
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

$('title').textContent = M.title;
$('subtitle').textContent = `${M.titlePy} · ${M.titleEn}`;
$('tagline').textContent = `${M.tagline} ${M.taglineEn}`;
$('w-summary').textContent = M.world.summary;
$('w-conflict').textContent = M.world.conflict;
$('w-goal').textContent = M.world.goal;
$('w-theme').textContent = M.world.theme;
$('places').innerHTML = M.world.places
  .map((p) => `<div class="place"><b>${esc(p.name)}</b><span>${esc(p.py)}</span><p>${esc(p.desc)}</p></div>`).join('');

$('shots').innerHTML = M.ep01.shots.map((s) => `
  <article class="shot">
    <img src="${s.img}" alt="${s.id}" loading="lazy" />
    <div>
      <h4>${s.id} <span>${s.sec} 秒</span></h4>
      <p class="visual">${esc(s.visual)}</p>
      <p class="lines">${s.lines.map(esc).join('<br>')}</p>
      <p class="en">${s.en.map(esc).join(' ')}</p>
      <details><summary>AI 视频提示词</summary><code>${esc(s.prompt)}</code></details>
    </div>
  </article>`).join('');

$('castGrid').innerHTML = M.characters.map((c) => `
  <button class="card" data-id="${c.id}">
    <img src="${c.img}" alt="${esc(c.name)}" loading="lazy" />
    <span class="nm">${esc(c.name)} <i>${esc(c.py)}</i></span>
    <span class="kd">${esc(c.kind)}</span>
    <span class="lv">${esc(c.teach.level)} · ${esc(c.teach.role)}</span>
  </button>`).join('');

function openChar(id) {
  const c = byId[id];
  $('charBody').innerHTML = `
    <img class="sheet" src="${c.img}" alt="${esc(c.name)}" />
    <h3>${esc(c.name)} <i>${esc(c.py)} · ${esc(c.en)}</i></h3>
    <p class="meta">${esc(c.kind)} · ${esc(c.age)} · 口头禅：${esc(c.catchphrase)}</p>
    <dl>
      <dt>外形</dt><dd>${esc(c.look)}</dd>
      <dt>性格</dt><dd>${esc(c.personality)}</dd>
      <dt>故事</dt><dd>${esc(c.story)}</dd>
      <dt>关系</dt><dd>${c.relations.map(esc).join('；')}</dd>
      <dt>配音</dt><dd>${esc(c.voice)}</dd>
      <dt>教学定位</dt><dd><b>${esc(c.teach.level)} · ${esc(c.teach.role)}</b><br>${esc(c.teach.style)}<br>话题：${c.teach.topics.map(esc).join('、')}</dd>
      <dt>AI 陪练提示词</dt><dd><code>${esc(c.persona)}</code><button class="copy" data-copy="${c.id}">复制提示词</button></dd>
    </dl>`;
  $('charDlg').showModal();
}
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-id]');
  if (card) return openChar(card.dataset.id);
  const copy = e.target.closest('[data-copy]');
  if (copy) {
    navigator.clipboard.writeText(byId[copy.dataset.copy].persona).then(() => {
      copy.textContent = '已复制';
      setTimeout(() => (copy.textContent = '复制提示词'), 1500);
    });
  }
});
$('charDlg').addEventListener('click', (e) => { if (e.target === $('charDlg')) $('charDlg').close(); });

(function drawRelations() {
  const svg = $('relSvg'), cx = 400, cy = 400, r = 310;
  const ring = ['xiaoyan', 'tuantuan', 'darong', 'heweng', 'mo', 'gua', 'adeng', 'luming'];
  const pos = { wuming: [cx, cy] };
  ring.forEach((id, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length;
    pos[id] = [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const IW = 200, IH = 150;
  let html = '<defs>' + M.characters.map((c) =>
    `<clipPath id="clip-${c.id}"><circle cx="${pos[c.id][0]}" cy="${pos[c.id][1]}" r="50"/></clipPath>`).join('') + '</defs>';
  html += M.relationships.map(([a, b, label]) => {
    const [x1, y1] = pos[a], [x2, y2] = pos[b];
    const bend = a === 'wuming' || b === 'wuming' ? 0 : 0.18;
    let mx = (x1 + x2) / 2 + ((x1 + x2) / 2 - cx) * bend;
    const my = (y1 + y2) / 2 + ((y1 + y2) / 2 - cy) * bend;
    if (bend && Math.hypot(mx - cx, my - cy) < 60) mx += 260;
    return `<path class="edge" d="M${x1},${y1} Q${mx},${my} ${x2},${y2}"/>` +
      `<text class="edge-label" x="${(x1 + 2 * mx + x2) / 4}" y="${(y1 + 2 * my + y2) / 4 + 5}">${esc(label)}</text>`;
  }).join('');
  html += M.characters.map((c) => {
    const [x, y] = pos[c.id];
    return `<g class="node" data-id="${c.id}"><circle cx="${x}" cy="${y}" r="53" class="ring"/>` +
      `<image href="${c.img}" x="${x - IW * 0.24}" y="${y - IH * 0.3}" width="${IW}" height="${IH}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${c.id})"/>` +
      `<text class="node-label" x="${x}" y="${y + 76}">${esc(c.name)}</text></g>`;
  }).join('');
  svg.innerHTML = html;
})();

$('seasonName').textContent = M.season.name;
$('episodes').innerHTML = M.season.episodes.map((e) => `
  <div class="ep${e.no === 1 ? ' current' : ''}">
    <span class="no">${String(e.no).padStart(2, '0')}</span>
    <span class="word">${esc(e.word)}</span>
    <h4>${esc(e.title)}</h4><small>${esc(e.place)}</small>
    <p>${esc(e.summary)}</p>
  </div>`).join('');

$('fmtBody').innerHTML = M.teachingSeries.format
  .map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('');
$('levels').innerHTML = M.teachingSeries.levels.map((l) => {
  const c = byId[l.host];
  return `<button class="level" data-id="${c.id}"><img src="${c.img}" alt="" loading="lazy"/>
    <b>${esc(l.level)}</b><span>${esc(c.name)} · ${esc(l.theme)}</span><small>${esc(l.sample)}</small></button>`;
}).join('');

$('tutors').innerHTML = M.characters.map((c) => `
  <div class="tutor">
    <img src="${c.img}" alt="" loading="lazy" />
    <div><b>${esc(c.name)}</b> <span class="pill">${esc(c.teach.level)}</span>
      <p>${esc(c.teach.style)}</p>
      <button class="copy" data-copy="${c.id}">复制提示词</button>
      <button class="ghost" data-id="${c.id}">查看设定</button>
    </div>
  </div>`).join('');
