'use strict';
const $ = s => document.querySelector(s);
const app = $('#app');
let level = -1, round = 0, view = 'map', state = {}, ready = false, awarded = false, sound = true;
let earned = new Set(), cores = new Set();
let rewardTimer = null, toastTimer = null, audioCtx = null, audioNodes = [], audioRun = 0;

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    earned = new Set(data.earned || []);
    cores = new Set(data.cores || []);
  } catch {}
}
function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      earned: [...earned],
      cores: [...cores]
    }));
  } catch {}
}

const tri = (zh, py, en) => `${zh}<span class="py">${py || ''}</span><span class="en">${en || ''}</span>`;
const t = () => PLANETS[level].tasks[round];

function toast(msg) {
  $('#toast').textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#toast').textContent = ''; }, 2800);
}
function feedback(msg) { const el = $('#feedback'); if (el) el.textContent = msg; }
function stopAudio() {
  audioRun++;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  audioNodes.forEach(n => { try { n.stop(); n.disconnect(); } catch {} });
  audioNodes = [];
}
function speak(text) {
  if (!sound) return;
  stopAudio();
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => /^zh/i.test(v.lang));
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN'; u.rate = .85;
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}
async function chime(big = false) {
  if (!sound) return;
  const run = audioRun;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    if (!sound || run !== audioRun) return;
    (big ? [523, 659, 784, 1047] : [659, 784, 1047]).forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      const at = audioCtx.currentTime + i * .12;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(.07, at + .02);
      g.gain.exponentialRampToValueAtTime(.001, at + .28);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(at); o.stop(at + .3);
      audioNodes.push(o);
    });
  } catch {}
}
function clearReward() {
  clearTimeout(rewardTimer); rewardTimer = null;
  $('#celebration').hidden = true;
  $('#celebration').innerHTML = '';
}
function celebrate(isNew, milestone = false) {
  clearReward();
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let sparks = '';
  if (!reduce) {
    for (let g = 0; g < (milestone ? 4 : 2); g++) {
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        const colors = ['#3de7ff', '#ff8a3d', '#ffd56a', '#fff'];
        sparks += `<i class="spark" style="--x:${25 + g * 18}%;--y:${28 + (g % 2) * 20}%;--dx:${Math.cos(a) * 140}px;--dy:${Math.sin(a) * 140}px;--c:${colors[i % 4]};--delay:${g * .12}s"></i>`;
      }
    }
  }
  $('#celebration').innerHTML = `${sparks}<div class="reward-badge"><strong>${isNew ? '★ +1' : '✓'}</strong>${milestone ? '包裹送达！' : '太棒了！'}</div>`;
  $('#celebration').hidden = false;
  chime(milestone);
  rewardTimer = setTimeout(clearReward, reduce ? 1400 : milestone ? 2800 : 2000);
}
function updateHUD() { $('#starCount').textContent = `★ ${earned.size}/6`; }
function unlocked(i) { return i === 0 || cores.has(i - 1); }
function planetDone(i) { return PLANETS[i].tasks.every((_, r) => earned.has(`${i}:${r}`)); }

function showMap() {
  clearReward(); stopAudio();
  level = -1; view = 'map'; updateHUD();
  const next = PLANETS.findIndex((_, i) => !cores.has(i));
  app.innerHTML = `
    <div class="map-hero">
      <div class="chars">
        <img class="hero" src="assets/art/courier-hero.jpg" alt="">
        <img class="bot" src="assets/art/robot.webp" alt="">
      </div>
      <h1>星际快递员</h1>
      <p>送两个包裹：天气预报 → 电话任务</p>
    </div>
    <div class="planet-list">
      ${PLANETS.map((l, i) => {
        const done = cores.has(i);
        const open = unlocked(i);
        return `<button class="planet-card ${done ? 'done' : next === i ? 'current' : ''}" data-level="${i}" ${open ? '' : 'disabled'}>
          <span class="planet-thumb" style="background-image:url(${l.bg})"><span class="num">${done ? '✓' : i + 1}</span></span>
          <span>
            <strong>${l.name}</strong>
            <span class="py">${l.py}</span>
            <span class="en">${l.en}</span>
            <div class="pkg">📦 ${l.package}</div>
            <div class="st">${done ? '已送达 · 可重玩' : open ? '开始任务 →' : '先完成天气星球'}</div>
          </span>
        </button>`;
      }).join('')}
    </div>
    ${cores.size === 2 ? `<button class="primary" id="seeMedal" style="width:100%;margin-top:14px">🏅 查看奖章</button>` : ''}
    <button type="button" id="resetProgress" style="width:100%;margin-top:10px;opacity:.7;font-size:13px">重置星星</button>`;
  document.querySelectorAll('[data-level]').forEach(b => b.onclick = () => startLevel(+b.dataset.level));
  if ($('#seeMedal')) $('#seeMedal').onclick = showFinish;
  $('#resetProgress').onclick = () => {
    if (!confirm('清空星星进度？')) return;
    earned.clear(); cores.clear(); saveProgress(); showMap();
  };
}

function startLevel(i) {
  if (!unlocked(i)) return;
  clearReward(); stopAudio();
  level = i; round = 0; view = 'play';
  render();
}

function resetTask() {
  state = { parts: [], revealed: new Set(), dial: [], dialReady: false };
  ready = false; awarded = false;
}

function render() {
  clearReward(); stopAudio(); resetTask();
  const l = PLANETS[level];
  app.innerHTML = `
    <div class="play-wrap">
      <section id="world" class="world" data-effect="${l.effect}" style="background-image:url('${l.bg}')">
        <div class="world-top">
          <div class="world-tag">${l.package}</div>
          <span class="world-progress">${round + 1}/3</span>
        </div>
        <div id="mechanic"></div>
        <img class="scene-avatar" src="assets/art/courier-hero.jpg" alt="">
        <div class="world-caption" id="worldCaption">${tri('准备好！', 'Zhǔnbèi hǎo!', 'Ready!')}</div>
      </section>
      <aside class="console">
        <div class="stepdots">${l.tasks.map((_, i) => `<i class="${earned.has(`${level}:${i}`) ? 'done' : i === round ? 'on' : ''}"></i>`).join('')}</div>
        <h2 class="prompt">${tri(t().prompt, t().py, t().en)}</h2>
        <div class="row-btns">
          <button id="listenPrompt">♫ 听</button>
          <button id="backMap">← 地图</button>
        </div>
        <p id="feedback" class="feedback" role="status"></p>
        <div class="say-box">
          <p class="say">${tri(t().say, t().sayPy, t().sayEn)}</p>
          <div class="row-btns">
            <button id="listenSay">♫ 听口令</button>
            <button id="nextBtn" class="primary" hidden>下一个 →</button>
          </div>
        </div>
        <div class="row-btns" id="controls" style="margin-top:8px"></div>
      </aside>
    </div>`;
  $('#listenPrompt').onclick = () => speak(t().prompt);
  $('#listenSay').onclick = () => speak(t().say);
  $('#backMap').onclick = showMap;
  $('#nextBtn').onclick = nextTask;
  buildMechanic();
}

function caption(zh, py, en) { $('#worldCaption').innerHTML = tri(zh, py, en); }

/** Mobile: operate success → auto star (no teacher gate) */
function solve() {
  if (ready) return;
  ready = true;
  $('#world').classList.add('solved');
  feedback('✓ 正确！跟读口令，点「下一个」。');
  caption('说中文！', 'Shuō Zhōngwén!', 'Say it!');
  speak(t().say);
  award();
}

function award() {
  if (!ready || awarded) return;
  awarded = true;
  const key = `${level}:${round}`, isNew = !earned.has(key);
  earned.add(key);
  if (planetDone(level)) cores.add(level);
  saveProgress(); updateHUD();
  $('#nextBtn').hidden = false;
  $('#nextBtn').textContent = round < 2 ? '下一个 →' : '打开包裹！';
  celebrate(isNew, round === 2);
}

function nextTask() {
  if (!awarded) return;
  if (round < 2) { round++; render(); }
  else showComplete();
}

function buildMechanic() {
  const m = t().mechanic;
  if (m === 'hotspot') buildHotspots();
  if (m === 'words') buildWords();
  if (m === 'levers') buildLevers();
  if (m === 'rings') buildRings();
  if (m === 'scan') buildScan();
  if (m === 'dial') buildDial();
}

function buildHotspots() {
  const task = t();
  $('#mechanic').innerHTML = task.spots.map(s =>
    `<button class="hotspot" data-spot="${s.id}" style="left:${s.x}%;top:${s.y}%">${tri(s.zh, s.py, s.en)}</button>`
  ).join('');
  caption('点气象灯', 'Diǎn qìxiàng dēng', 'Tap beacon');
  document.querySelectorAll('[data-spot]').forEach(b => b.onclick = () => {
    if (ready) return;
    if (b.dataset.spot === task.target) { b.classList.add('lit'); solve(); }
    else { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); feedback('再试试！'); }
  });
}

function buildWords() {
  const task = t();
  const order = task.words.map((_, i) => (i + 1) % task.words.length);
  $('#mechanic').innerHTML = `
    <div class="module-bay">${task.words.map((_, i) => `<div class="module-slot" id="slot${i}">${i + 1}</div>`).join('')}</div>
    <div class="word-pool">${order.map(i => `<button class="word-tile" data-word="${i}">${tri(task.words[i], task.pys[i], task.engs[i])}</button>`).join('')}</div>`;
  $('#controls').innerHTML = '<button id="undoWord">撤回</button><button id="checkWords" class="orange">检查</button>';
  caption('装进包裹', 'Zhuāng jìn bāoguǒ', 'Install tiles');
  document.querySelectorAll('[data-word]').forEach(b => b.onclick = () => {
    if (ready || state.parts.includes(+b.dataset.word)) return;
    state.parts.push(+b.dataset.word); b.disabled = true; paintSlots();
  });
  $('#undoWord').onclick = () => {
    if (ready || !state.parts.length) return;
    const idx = state.parts.pop();
    document.querySelector(`[data-word="${idx}"]`).disabled = false;
    paintSlots();
  };
  $('#checkWords').onclick = () => {
    if (ready) return;
    if (state.parts.length !== task.words.length) { feedback('还没装完'); return; }
    if (state.parts.every((n, i) => n === i)) solve();
    else feedback('顺序不对，撤回再试');
  };
}
function paintSlots() {
  t().words.forEach((_, i) => {
    const slot = $(`#slot${i}`), idx = state.parts[i];
    if (!slot) return;
    slot.textContent = idx === undefined ? String(i + 1) : t().words[idx];
    slot.classList.toggle('filled', idx !== undefined);
  });
}

function buildLevers() {
  const task = t();
  $('#mechanic').innerHTML = `<div class="lever-panel">
    <button class="lever yes" data-lever="yes">${tri('会', 'huì', 'will')}</button>
    <button class="lever no" data-lever="no">${tri('不会', 'bú huì', "won't")}</button>
  </div>`;
  caption('扳开关', 'Bān kāiguān', 'Pull lever');
  document.querySelectorAll('[data-lever]').forEach(b => b.onclick = () => {
    if (ready) return;
    if (b.dataset.lever === task.target) { b.classList.add('charged'); solve(); }
    else { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); feedback('另一个！'); }
  });
}

function buildRings() {
  const task = t();
  $('#mechanic').innerHTML = task.options.map(o =>
    `<button class="call-ring" data-ring="${o.id}">${tri(o.zh, o.py, o.en)}</button>`
  ).join('');
  caption('接听', 'Jiētīng', 'Answer');
  document.querySelectorAll('[data-ring]').forEach(b => b.onclick = () => {
    if (ready) return;
    if (b.dataset.ring === task.target) { b.classList.add('open'); solve(); }
    else { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); feedback('找「喂」'); }
  });
}

function buildScan() {
  const task = t();
  $('#mechanic').innerHTML = `<div class="radar-ring" id="radar"></div>${task.cards.map((c, i) =>
    `<button class="crystal-card" data-card="${c.id}"><span class="crew-icon">◇</span><strong>扫描 ${i + 1}</strong></button>`
  ).join('')}`;
  caption('扫描', 'Sǎomiáo', 'Scan');
  document.querySelectorAll('[data-card]').forEach(b => b.onclick = () => {
    if (ready) return;
    const c = task.cards.find(x => x.id === b.dataset.card);
    if (!state.revealed.has(c.id)) {
      state.revealed.add(c.id);
      b.innerHTML = `<span class="crew-icon">${c.icon}</span><strong>${c.zh}</strong><span class="py">${c.py}</span>`;
      const radar = $('#radar');
      radar.classList.remove('scanning'); void radar.offsetWidth; radar.classList.add('scanning');
      feedback('再点一次选择');
      return;
    }
    if (c.id === task.target) { b.classList.add('selected'); solve(); }
    else feedback('不是这个');
  });
}

function buildDial() {
  const task = t();
  const keys = [['1', 'yāo'], ['2', 'èr'], ['3', 'sān'], ['4', 'sì'], ['5', 'wǔ'], ['6', 'liù'], ['7', 'qī'], ['8', 'bā'], ['9', 'jiǔ']];
  const order = task.words.map((_, i) => (i + 2) % task.words.length);
  $('#mechanic').innerHTML = `
    <div class="dial-display" id="dialDisplay">— — —</div>
    <div class="dial-pad">${keys.map(([n, py]) => `<button class="dial-key" data-key="${n}">${n}<small>${py}</small></button>`).join('')}</div>
    <div class="dial-words">
      <div class="dial-slots" id="dialSlots">${task.words.map((_, i) => `<div class="module-slot" id="dslot${i}">${i + 1}</div>`).join('')}</div>
      <div class="dial-pool" id="dialPool" hidden>${order.map(i => `<button class="word-tile" data-dword="${i}">${tri(task.words[i], task.pys[i], task.engs[i])}</button>`).join('')}</div>
    </div>`;
  $('#controls').innerHTML = '<button id="clearDial">清除</button><button id="checkDial" class="orange" hidden>检查</button>';
  caption('拨 138', 'Bō 138', 'Dial 138');
  document.querySelectorAll('[data-key]').forEach(b => b.onclick = () => {
    if (ready || state.dialReady) return;
    if (state.dial.length >= 3) return;
    state.dial.push(b.dataset.key);
    paintDial();
    if (state.dial.length === 3) {
      if (state.dial.join('') === task.code.join('')) {
        state.dialReady = true;
        feedback('接通！组装句子');
        $('#dialPool').hidden = false;
        $('#checkDial').hidden = false;
      } else {
        feedback('号码错了');
        state.dial = [];
        paintDial();
      }
    }
  });
  $('#clearDial').onclick = () => { if (!ready && !state.dialReady) { state.dial = []; paintDial(); } };
  document.querySelectorAll('[data-dword]').forEach(b => b.onclick = () => {
    if (ready || !state.dialReady || state.parts.includes(+b.dataset.dword)) return;
    state.parts.push(+b.dataset.dword); b.disabled = true; paintDialSlots();
  });
  $('#checkDial').onclick = () => {
    if (ready || !state.dialReady) return;
    if (state.parts.length !== task.words.length) { feedback('装完词语'); return; }
    if (state.parts.every((n, i) => n === i)) solve();
    else feedback('顺序不对');
  };
}
function paintDial() {
  const el = $('#dialDisplay');
  if (!el) return;
  el.textContent = state.dial.length ? state.dial.map(d => d === '1' ? 'yāo' : d).join(' · ') : '— — —';
}
function paintDialSlots() {
  t().words.forEach((_, i) => {
    const slot = $(`#dslot${i}`), idx = state.parts[i];
    if (!slot) return;
    slot.textContent = idx === undefined ? String(i + 1) : t().words[idx];
    slot.classList.toggle('filled', idx !== undefined);
  });
}

function showComplete() {
  clearReward(); stopAudio();
  const l = PLANETS[level];
  app.innerHTML = `<div class="complete-card" style="--scene:url('${l.bg}')">
    <div class="pkg-emoji">📦✨</div>
    <img src="assets/art/courier-hero.jpg" alt="">
    <h1>${l.package}<br>打开了！</h1>
    <p>${level === 0 ? '下一站：电话星球' : '两个包裹都送到了！'}</p>
    <button class="primary" id="goNext" style="width:100%">${level < 1 ? '飞往电话星球 →' : '领取奖章 🏅'}</button>
    <button id="goMap" style="width:100%">地图</button>
  </div>`;
  $('#goNext').onclick = () => level < 1 ? startLevel(1) : showFinish();
  $('#goMap').onclick = showMap;
}

function showFinish() {
  clearReward(); stopAudio();
  if (cores.size !== 2) { showMap(); return; }
  app.innerHTML = `<div class="finish-card" style="--scene:url('assets/art/launch.webp')">
    <img src="assets/art/courier-hero.jpg" alt="">
    <h1>快递员，配送完成！</h1>
    <p>🏅 中文星际快递员</p>
    <p>★ ${earned.size} / 6</p>
    <button class="primary" id="again" style="width:100%">再庆祝 ★</button>
    <button id="goMap" style="width:100%">回到地图</button>
  </div>`;
  $('#again').onclick = () => celebrate(false, true);
  $('#goMap').onclick = showMap;
  celebrate(false, true);
}

$('#mapBtn').onclick = showMap;
$('#pinyinBtn').onclick = () => {
  const h = document.body.classList.toggle('hide-py');
  $('#pinyinBtn').setAttribute('aria-pressed', String(!h));
};
$('#englishBtn').onclick = () => {
  const h = document.body.classList.toggle('hide-en');
  $('#englishBtn').setAttribute('aria-pressed', String(!h));
};
$('#soundBtn').onclick = () => {
  sound = !sound;
  $('#soundBtn').setAttribute('aria-pressed', String(sound));
  $('#soundBtn').textContent = sound ? '♫' : '♩';
  if (!sound) stopAudio();
};
document.addEventListener('visibilitychange', () => { if (document.hidden) { clearReward(); stopAudio(); } });

loadProgress();
showMap();
