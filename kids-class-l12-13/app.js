'use strict';
const $ = s => document.querySelector(s);
const app = $('#app');

let sectionIdx = -1, round = 0, view = 'map', state = {};
let ready = false, awarded = false, sound = true, freeJump = true;
let earned = new Set(), doneSections = new Set();
let rewardTimer = null, toastTimer = null, audioCtx = null, audioNodes = [], audioTimers = [], audioRun = 0;
let elapsed = 0, timerRunning = false, timerStarted = 0, timerInterval = null;
const SOFT_CAP = 7200; // 120 minutes soft timer

const tri = (zh, py, en) => `${zh}<span class="py">${py || ''}</span><span class="en">${en || ''}</span>`;
const sec = () => SECTIONS[sectionIdx];
const planet = () => PLANETS[sec().planetIndex];
const starKey = (si, r) => `${SECTIONS[si].id}:${r}`;
const sectionStarCount = si => {
  const s = SECTIONS[si];
  let n = 0;
  for (let i = 0; i < countStarsForSection(s); i++) if (earned.has(starKey(si, i))) n++;
  return n;
};
const sectionComplete = si => sectionStarCount(si) >= countStarsForSection(SECTIONS[si]);

function toast(msg) {
  $('#toast').textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#toast').textContent = ''; }, 3500);
}
function feedback(msg) { const el = $('#feedback'); if (el) el.textContent = msg; }
function stopAudio() {
  audioRun++;
  audioTimers.forEach(clearTimeout);
  audioTimers = [];
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  audioNodes.forEach(n => { try { n.stop(); n.disconnect(); } catch {} });
  audioNodes = [];
}
function speak(text) {
  if (!sound) return;
  stopAudio();
  if (!('speechSynthesis' in window)) { toast('请老师领读 · Please read with your teacher.'); return; }
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => /^zh/i.test(v.lang));
  if (voices.length && !voice) { toast('此设备没有中文声音，请老师领读。'); return; }
  const u = new SpeechSynthesisUtterance(String(text).replaceAll('Courier', '盖布'));
  u.lang = 'zh-CN'; u.rate = .8;
  if (voice) u.voice = voice;
  u.onerror = () => toast('请老师领读 · Please read with your teacher.');
  window.speechSynthesis.speak(u);
}
async function chime(big = false) {
  if (!sound) return;
  const run = audioRun;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    if (!sound || run !== audioRun) return;
    (big ? [523, 659, 784, 1047, 1318] : [659, 784, 1047]).forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      const at = audioCtx.currentTime + i * .13;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(.075, at + .02);
      g.gain.exponentialRampToValueAtTime(.001, at + .32);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(at); o.stop(at + .34);
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
  clearReward(); stopAudio();
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let sparks = '';
  if (!reduce) {
    for (let g = 0; g < (milestone ? 5 : 3); g++)
      for (let i = 0; i < 14; i++) {
        const a = i / 14 * Math.PI * 2;
        const colors = ['#3de7ff', '#ff8a3d', '#ffd56a', '#fff'];
        sparks += `<i class="spark" style="--x:${18 + g * 16}%;--y:${28 + (g % 2) * 22}%;--dx:${Math.cos(a) * 160}px;--dy:${Math.sin(a) * 160}px;--c:${colors[i % 4]};--delay:${g * .12}s"></i>`;
      }
  }
  $('#celebration').innerHTML = `${sparks}<div class="reward-badge"><strong>${isNew ? '★ +1' : '✓'}</strong>${tri(milestone ? '本站完成！' : '口令收到！', milestone ? 'Běn zhàn wánchéng!' : 'Kǒulìng shōudào!', milestone ? 'Section clear!' : 'Got it!')}</div><img class="reward-hero" src="${ART.hero}" alt="">`;
  $('#celebration').hidden = false;
  chime(milestone);
  rewardTimer = setTimeout(clearReward, reduce ? 1600 : milestone ? 3200 : 2400);
}

function updateHUD() {
  const partsDone = ['A', 'B'].filter(p =>
    SECTIONS.filter(s => s.part === p).every((_, i, arr) => {
      const si = SECTIONS.indexOf(arr[i]);
      return sectionComplete(si);
    })
  ).length;
  // packages = planet sections complete
  const pkgs = ['a-planet', 'b-planet'].filter(id => sectionComplete(SECTION_INDEX[id])).length;
  $('#coreCount').textContent = `📦 ${pkgs} / 2`;
  $('#starCount').textContent = `★ ${earned.size} / ${TOTAL_STARS}`;
  const cur = sectionIdx >= 0 ? SECTIONS[sectionIdx] : null;
  $('#sectionLabel').textContent = cur ? `${cur.partLabel} · ${cur.name}` : '星图 · Mission Map';
}

function unlocked(si) {
  if (freeJump) return true;
  if (si === 0) return true;
  return sectionComplete(si - 1) || doneSections.has(SECTIONS[si - 1].id);
}

function currentNext() {
  return SECTIONS.findIndex((_, i) => !sectionComplete(i));
}

/* ========== MAP ========== */
function showMap() {
  clearReward(); stopAudio();
  sectionIdx = -1; view = 'map'; setStageBg(''); updateHUD();
  const next = currentNext();
  const parts = [
    { key: 'HQ', label: 'HQ · 出发', ids: ['hq'] },
    { key: 'A', label: 'PART A · 天气预报包裹 · L12', ids: ['a-vocab', 'a-phrase', 'a-text', 'a-grammar', 'a-dialog', 'a-planet'] },
    { key: 'B', label: 'PART B · 电话任务包裹 · L13', ids: ['b-vocab', 'b-phrase', 'b-text', 'b-grammar', 'b-dialog', 'b-planet'] },
    { key: 'END', label: 'Finale', ids: ['finale'] }
  ];
  const rows = [['hq', 'a-vocab', 'a-phrase', 'a-text', 'a-grammar', 'a-dialog', 'a-planet'],
    ['finale', 'b-planet', 'b-dialog', 'b-grammar', 'b-text', 'b-phrase', 'b-vocab']];
  const node = id => {
    const si = SECTION_INDEX[id];
    const s = SECTIONS[si];
    const L = mapLabel(s);
    const done = sectionComplete(si);
    const cur = next === si;
    return `<button class="toy-node ${s.type} ${s.part === 'B' ? 'partB' : ''} ${done ? 'done' : ''} ${cur ? 'current' : ''}" data-si="${si}" ${unlocked(si) ? '' : 'disabled'}>
      <span class="toy-icon"><span class="toy-emoji">${typeIcon(s.type, s.part)}</span>${done ? '<span class="toy-check">✓</span>' : ''}</span>
      <span class="toy-zh">${L.zh}</span>
      <span class="toy-py">${L.py}</span>
      <span class="toy-en">${L.en} · ★${sectionStarCount(si)}/${countStarsForSection(s)}</span>
    </button>`;
  };
  app.innerHTML = `<section class="toy-map" style="background-image:linear-gradient(#071528aa,#071528cc),url('${ART.launch}')">
    <div class="toy-head">
      <img class="toy-head-hero" src="${ART.hero}" alt="">
      <div class="toy-title"><h1>${tri(BRIEFING.title, BRIEFING.titlePy, BRIEFING.titleEn)}</h1>
        <div class="toy-sub">HSK 1 · L12 天气预报包裹 → L13 电话任务包裹 · ~120′</div></div>
      <button class="primary" id="continueBtn">${next < 0
        ? tri('查看奖章', 'Chákàn jiǎngzhāng', 'See medal')
        : tri(earned.size ? '继续课程' : '开始出发！', earned.size ? 'Jìxù kèchéng' : 'Kāishǐ chūfā!', 'Let’s go!')}</button>
      <label class="jump-toggle"><input type="checkbox" id="freeJump" ${freeJump ? 'checked' : ''}> 老师自由跳转</label>
    </div>
    <div class="toy-rows">
      <div class="toy-row-label a">PART A · L12 ☀️ →</div>
      <div class="toy-row">${rows[0].map(node).join('')}</div>
      <div class="toy-turn">↓</div>
      <div class="toy-row">${rows[1].map(node).join('')}</div>
      <div class="toy-row-label b">← PART B · L13 📞</div>
    </div>
  </section>`;
  const tm = $('.toy-map');
  if (tm) tm.style.height = Math.max(520, innerHeight - tm.getBoundingClientRect().top - window.scrollY - 10) + 'px';
  $('#continueBtn').onclick = () => {
    if (next < 0) startSection(SECTION_INDEX.finale);
    else startSection(next);
  };
  $('#freeJump').onchange = e => { freeJump = e.target.checked; showMap(); };
  document.querySelectorAll('[data-si]').forEach(b => b.onclick = () => startSection(+b.dataset.si));
}

function typeIcon(t, part) {
  if (t === 'planet') return part === 'B' ? '📞' : '⛈️';
  return ({ briefing: '🚀', vocab: '📦', phrase: '🧩', text: '📡', grammar: '🔧', dialog: '📻', finale: '🏅' })[t] || '★';
}
function mapLabel(s) {
  if (s.type === 'briefing') return { zh: '总部出发', py: 'zǒngbù chūfā', en: 'HQ Launch' };
  if (s.type === 'finale') return { zh: '领取奖章', py: 'lǐngqǔ jiǎngzhāng', en: 'Medal' };
  const en = { vocab: 'New Words', phrase: 'Phrase Dock', text: 'Text Signal', grammar: 'Grammar Lab', dialog: 'Radio Talk' }[s.type]
    || (s.part === 'B' ? 'Phone Planet' : 'Weather Planet');
  const py = s.py.charAt(0).toLowerCase() + s.py.slice(1);
  return { zh: s.name, py, en };
}
/* —— Free step navigation (no task / teacher gate) —— */
function setStageBg(url) {
  document.body.style.backgroundImage = url ? `linear-gradient(#071528cc,#071528ee),url('${url}')` : '';
}
function goStep(d) {
  const t = (sectionIdx < 0 ? 0 : sectionIdx) + d;
  if (t < 0) return showMap();
  if (t >= SECTIONS.length) return showMap();
  startSection(t, true);
}
function navHTML() {
  return `<button class="nav-prev" data-step="-1" ${sectionIdx <= 0 ? 'disabled' : ''}>◀ 上一站<span class="en">Prev</span></button>
    <button class="nav-next primary" data-step="1">${sectionIdx >= SECTIONS.length - 1 ? '星图 Map ▶' : '下一站 Next ▶'}</button>`;
}
function bindNav() {
  document.querySelectorAll('[data-step]').forEach(b => b.onclick = () => goStep(+b.dataset.step));
}

function startSection(si, force = false) {
  if (!Number.isInteger(si) || si < 0 || si >= SECTIONS.length || (!force && !unlocked(si))) return false;
  clearReward(); stopAudio();
  sectionIdx = si; round = 0; view = 'play';
  setStageBg(SECTIONS[si].bg);
  if (!timerRunning && elapsed === 0) toggleTimer();
  const s = SECTIONS[si];
  if (s.type === 'briefing') return renderBriefing();
  if (s.type === 'finale') return renderFinale();
  if (s.type === 'planet') return renderPlanet();
  return renderSectionShell();
}

function resetTask() {
  state = { parts: [], revealed: new Set(), dial: [], dialReady: false, flipped: false, matched: false, line: 0, role: 'A' };
  ready = false; awarded = false;
}

function shellHTML(worldExtra, consoleExtra) {
  const s = sec();
  const total = countStarsForSection(s);
  return `
    <div class="level-heading">
      <h1>${typeIcon(s.type)} ${tri(s.name, s.py, s.en)}</h1>
      <div class="heading-meta">${s.partLabel}<br>${s.lesson || ''} · 建议 ${s.minutes} 分钟</div>
    </div>
    <p class="story-strip">${s.story || ''}</p>
    <div class="play-layout">
      <section id="world" class="world" data-effect="${s.type}" style="background-image:url('${s.bg}')">
        <div class="world-top">
          <div class="world-tag">${s.partLabel}<span class="en">${s.en}</span></div>
          <span class="world-progress">${Math.min(round + 1, total)} / ${total}</span>
        </div>
        <div id="mechanic">${worldExtra || ''}</div>
        <img class="scene-avatar" src="${ART.hero}" alt="">
        <img class="scene-robot-mini" src="${ART.robot}" alt="">
        <div class="world-caption" id="worldCaption"></div>
      </section>
      <aside class="console">
        <div class="stepdots">${Array.from({ length: total }, (_, i) =>
          `<i class="${earned.has(starKey(sectionIdx, i)) ? 'done' : i === round ? 'on' : ''}"></i>`).join('')}</div>
        <h2 class="prompt" id="prompt"></h2>
        <button id="listenPrompt">♫ ${tri('听', 'Tīng', 'Listen')}</button>
        <p class="instructions" id="instructions"></p>
        <div class="controls" id="controls"></div>
        <p id="feedback" class="feedback" role="status"></p>
        <div id="speakBox" class="speak-box">
          <h3>中文通讯 · SAY / TEACHER</h3>
          <div id="model"></div>
          <button id="confirmBtn" disabled>老师：口令通过 ✓<span class="en">Teacher confirm</span></button>
          <button id="nextBtn" class="primary" hidden></button>
        </div>
        ${consoleExtra || ''}
      </aside>
    </div>
    <div class="level-bottom">
      <button id="backMap">← 星图</button>
      <p>操作 → 说中文 → 得星</p>
      <button id="retryBtn">↻ 重玩</button>
      ${navHTML()}
    </div>`;
}

function bindShell(listenText) {
  $('#listenPrompt').onclick = () => speak(listenText || '');
  $('#backMap').onclick = showMap;
  $('#retryBtn').onclick = () => startSection(sectionIdx);
  $('#confirmBtn').onclick = () => award(false);
  $('#nextBtn').onclick = nextRound;
  bindNav();
  updateHUD();
}

function instruction(zh, en) { $('#instructions').innerHTML = zh + `<span class="en">${en || ''}</span>`; }
function caption(zh, py, en) { $('#worldCaption').innerHTML = tri(zh, py, en); }
function setPrompt(zh, py, en) { $('#prompt').innerHTML = tri(zh, py, en); }

function paintSay(say, sayPy, sayEn, autoGate) {
  const model = $('#model');
  if (!say) {
    model.innerHTML = `<p class="say">${tri('继续互动', 'Jìxù', 'Keep going')}</p>`;
    return;
  }
  model.innerHTML = `<p class="say">${tri(say, sayPy, sayEn)}</p><button id="listenSay">♫ 听口令</button>`;
  $('#listenSay').onclick = () => speak(say);
  if (autoGate) {
    $('#confirmBtn').hidden = true;
  } else {
    $('#confirmBtn').hidden = false;
  }
}

function solve(autoAward = false) {
  if (ready) return;
  ready = true;
  $('#world')?.classList.add('solved');
  if (autoAward) {
    feedback('✓ 完成！');
    award(true);
    return;
  }
  $('#confirmBtn').disabled = false;
  $('#confirmBtn').classList.add('primary');
  feedback('操作成功！请把中文说给老师听。');
  caption('发送中文口令！', 'Fāsòng kǒulìng!', 'Say it to your teacher!');
  chime();
}

function award(isAuto) {
  if (!ready || awarded) return;
  awarded = true;
  const key = starKey(sectionIdx, round);
  const isNew = !earned.has(key);
  earned.add(key);
  if (sectionComplete(sectionIdx)) doneSections.add(sec().id);
  updateHUD();
  const total = countStarsForSection(sec());
  const last = round >= total - 1;
  if (!isAuto) {
    $('#confirmBtn').disabled = true;
    $('#confirmBtn').classList.remove('primary');
    $('#confirmBtn').textContent = '✓ 已确认';
  }
  $('#nextBtn').hidden = false;
  $('#nextBtn').innerHTML = last
    ? tri('完成本站 →', 'Wánchéng běn zhàn', 'Section clear →')
    : tri('下一个', 'Xià yí ge', 'Next');
  feedback(isNew ? '★ 获得一颗星星！' : '复习也很棒！');
  celebrate(isNew, last);
}

function nextRound() {
  if (!awarded) return;
  const total = countStarsForSection(sec());
  if (round < total - 1) {
    round++;
    const s = sec();
    if (s.type === 'planet') renderPlanet();
    else renderSectionShell();
  } else {
    showSectionComplete();
  }
}

/* ========== BRIEFING ========== */
function renderBriefing() {
  resetTask();
  view = 'briefing';
  app.innerHTML = `<section class="planet-complete" style="--scene:url('${SECTIONS[SECTION_INDEX.hq].bg}')">
    <div class="completion-inner">
      <div class="eyebrow">HQ BRIEFING · 5′</div>
      <div class="completion-chars">
        <img class="hero" src="${ART.hero}" alt="">
        <img class="bot" src="${ART.robot}" alt="">
      </div>
      <h1>${tri('双包任务启动！', 'Shuāng bāo rènwu!', 'Dual package mission!')}</h1>
      <p>${tri('包裹1：天气预报 → 天气星球（第12课）', 'Bāoguǒ 1', 'Package 1: Weather · L12')}</p>
      <p>${tri('包裹2：电话任务 → 电话星球（第13课）', 'Bāoguǒ 2', 'Package 2: Phone · L13')}</p>
      <p>路径：生词 → 词组 → 课文 → 语言点 → 对话 → 闯关</p>
      <div class="speak-box" style="max-width:420px;margin:16px auto;text-align:left">
        <h3>说给老师听</h3>
        <p class="say">${tri('我是星际快递员！', 'Wǒ shì xīngjì kuàidìyuán!', 'I am a space courier!')}</p>
        <button id="listenSay">♫ 听</button>
        <button id="confirmBtn" class="primary" style="width:100%;margin-top:8px">老师：口令通过 ✓</button>
        <button id="nextBtn" class="primary" hidden style="width:100%;margin-top:8px">进入 PART A →</button>
      </div>
      <div class="completion-actions"><button id="backMap">星图</button>${navHTML()}</div>
    </div>
  </section>`;
  bindNav();
  ready = true;
  paintModelBrief();
  $('#listenSay').onclick = () => speak('我是星际快递员！');
  $('#confirmBtn').onclick = () => {
    if (awarded) return;
    awardBrief();
  };
  $('#nextBtn').onclick = () => startSection(SECTION_INDEX['a-vocab']);
  $('#backMap').onclick = showMap;
  updateHUD();
}
function paintModelBrief() {}
function awardBrief() {
  awarded = true; ready = true;
  const key = starKey(sectionIdx, 0);
  const isNew = !earned.has(key);
  earned.add(key); doneSections.add('hq');
  updateHUD();
  $('#confirmBtn').disabled = true;
  $('#nextBtn').hidden = false;
  celebrate(isNew, true);
}

/* ========== GENERIC SECTION DISPATCH ========== */
function renderSectionShell() {
  resetTask();
  const s = sec();
  app.innerHTML = shellHTML();
  const type = s.type;
  if (type === 'vocab') buildVocab();
  else if (type === 'phrase') buildPhrase();
  else if (type === 'text') buildText();
  else if (type === 'grammar') buildGrammar();
  else if (type === 'dialog') buildDialog();
}

/* —— Vocab: one word card, flip + pick meaning —— */
function buildVocab() {
  const s = sec();
  const w = s.words[round];
  const distractors = s.words.filter(x => x.zh !== w.zh).sort(() => Math.random() - .5).slice(0, 2);
  const choices = [w, ...distractors].sort(() => Math.random() - .5);
  setPrompt(`生词 ${round + 1}/${s.words.length}`, 'Shēngcí', 'New word');
  instruction('先点卡片翻转听读，再点正确的英文意思。', 'Flip the card, listen, then tap the correct meaning.');
  caption(s.story, '', '');
  bindShell(w.zh);
  paintSay(w.zh, w.py, w.en, true);
  $('#confirmBtn').hidden = true;
  $('#mechanic').innerHTML = `
    <div class="vocab-stage">
      <button class="word-card" id="wordCard" type="button" aria-label="翻转生词">
        <span class="card-face front"><span class="card-icon">${w.icon || '✦'}</span><span class="card-zh">？</span><span class="card-hint">点击翻转</span></span>
        <span class="card-face back"><span class="card-icon">${w.icon || '✦'}</span><strong class="card-zh">${w.zh}</strong><span class="py">${w.py}</span><span class="en">${w.en}</span></span>
      </button>
      <div class="meaning-row" id="meaningRow" hidden>
        ${choices.map(c => `<button class="meaning-btn" data-zh="${c.zh}">${c.en}<span class="py">${c.py}</span></button>`).join('')}
      </div>
    </div>`;
  $('#wordCard').onclick = () => {
    if (ready) return;
    $('#wordCard').classList.add('flipped');
    state.flipped = true;
    speak(w.zh);
    $('#meaningRow').hidden = false;
    feedback('选正确的意思 · Pick the meaning');
  };
  document.querySelectorAll('.meaning-btn').forEach(b => b.onclick = () => {
    if (ready || !state.flipped) return;
    if (b.dataset.zh === w.zh) {
      b.classList.add('lit');
      solve(true);
    } else {
      b.classList.add('wrong');
      feedback('再试试！ · Try again');
    }
  });
}

/* —— Phrase: assemble tiles —— */
function buildPhrase() {
  const s = sec();
  const p = s.phrases[round];
  const order = p.words.map((_, i) => (i + 1) % p.words.length);
  setPrompt(p.say, p.sayPy, p.sayEn);
  instruction('按顺序点词块，装进对接站。', 'Tap chunks in order.');
  caption('词组对接站', 'Cízǔ duìjiē', 'Phrase dock');
  bindShell(p.say);
  paintSay(p.say, p.sayPy, p.sayEn, false);
  $('#mechanic').innerHTML = `
    <div class="package-bay-ring"></div>
    <div class="module-bay">${p.words.map((_, i) => `<div class="module-slot" id="slot${i}">${i + 1}</div>`).join('')}</div>
    <div class="word-pool">${order.map(i => `<button class="word-tile" data-word="${i}">${tri(p.words[i], p.pys[i], p.engs[i])}</button>`).join('')}</div>`;
  $('#controls').innerHTML = '<button id="undoWord">↶ 撤回</button><button id="checkWords">检查</button>';
  document.querySelectorAll('[data-word]').forEach(b => b.onclick = () => {
    if (ready || state.parts.includes(+b.dataset.word)) return;
    state.parts.push(+b.dataset.word); b.disabled = true; paintSlots(p.words);
  });
  $('#undoWord').onclick = () => {
    if (ready || !state.parts.length) return;
    const idx = state.parts.pop();
    document.querySelector(`[data-word="${idx}"]`).disabled = false;
    paintSlots(p.words); feedback('');
  };
  $('#checkWords').onclick = () => {
    if (ready) return;
    if (state.parts.length !== p.words.length) { feedback('还没装完'); return; }
    if (state.parts.every((n, i) => n === i)) solve(false);
    else feedback('顺序不对，撤回再试');
  };
}
function paintSlots(words) {
  words.forEach((_, i) => {
    const slot = $(`#slot${i}`), idx = state.parts[i];
    if (!slot) return;
    slot.textContent = idx === undefined ? String(i + 1) : words[idx];
    slot.classList.toggle('filled', idx !== undefined);
  });
}

/* —— Text: comic bubbles line by line + role —— */
function buildText() {
  const s = sec();
  const scene = s.scenes[round];
  state.line = 0;
  setPrompt(scene.title, scene.titlePy, scene.titleEn);
  instruction('点「下一句」展开对话，可听读；全部展开后选角色跟说。', 'Reveal lines, listen, then role-play.');
  caption(scene.title, scene.titlePy, scene.titleEn);
  bindShell(scene.lines[0].zh);
  paintSay(scene.lines[0].zh, scene.lines[0].py, scene.lines[0].en, false);
  $('#confirmBtn').disabled = true;
  renderTextBubbles(scene);
  $('#controls').innerHTML = `
    <button id="nextLine" class="primary">下一句 →</button>
    <button id="roleA">我当 A</button>
    <button id="roleB">我当 B</button>`;
  $('#nextLine').onclick = () => {
    if (state.line < scene.lines.length - 1) {
      state.line++;
      renderTextBubbles(scene);
      const L = scene.lines[state.line];
      speak(L.zh);
      paintSay(L.zh, L.py, L.en, false);
      if (state.line === scene.lines.length - 1) {
        $('#nextLine').textContent = '对话完整 ✓';
        feedback('选 A 或 B，把你的句子说给老师听，再点口令通过。');
        ready = true;
        $('#confirmBtn').disabled = false;
        $('#confirmBtn').classList.add('primary');
      }
    }
  };
  $('#roleA').onclick = () => { state.role = 'A'; highlightRole(scene); };
  $('#roleB').onclick = () => { state.role = 'B'; highlightRole(scene); };
}
function renderTextBubbles(scene) {
  $('#mechanic').innerHTML = `<div class="comic-board">${scene.lines.map((L, i) => {
    const show = i <= state.line;
    return `<div class="bubble ${L.who} ${show ? 'show' : 'hide'} ${state.role === L.who ? 'mine' : ''}" data-i="${i}">
      <span class="who">${L.who}</span>
      <strong>${show ? L.zh : '…'}</strong>
      ${show ? `<span class="py">${L.py}</span><span class="en">${L.en}</span>` : ''}
    </div>`;
  }).join('')}</div>`;
  document.querySelectorAll('.bubble.show').forEach(b => b.onclick = () => {
    const L = scene.lines[+b.dataset.i];
    speak(L.zh);
  });
}
function highlightRole(scene) {
  renderTextBubbles(scene);
  const mine = scene.lines.filter(L => L.who === state.role);
  if (mine.length) {
    paintSay(mine.map(m => m.zh).join(' '), mine[0].py, 'Your lines', false);
    feedback(`你是 ${state.role}：说自己的句子给老师听。`);
  }
}

/* —— Grammar stations —— */
function buildGrammar() {
  const s = sec();
  const st = s.stations[round];
  setPrompt(st.title, st.titlePy, st.titleEn);
  instruction(st.tip, st.tipEn);
  caption(st.prompt, st.py, st.en);
  bindShell(st.say);
  paintSay(st.say, st.sayPy, st.sayEn, false);
  if (st.mechanic === 'pick') buildPick(st);
  else if (st.mechanic === 'words') buildGrammarWords(st);
  else if (st.mechanic === 'levers') buildGrammarLevers(st);
  else if (st.mechanic === 'dial') buildGrammarDial(st);
}
function buildPick(st) {
  $('#mechanic').innerHTML = `<div class="pick-grid">${st.options.map(o =>
    `<button class="pick-card" data-id="${o.id}">${tri(o.zh, o.py, o.en)}</button>`).join('')}</div>`;
  document.querySelectorAll('.pick-card').forEach(b => b.onclick = () => {
    if (ready) return;
    if (b.dataset.id === st.target) { b.classList.add('lit'); solve(false); }
    else { b.classList.add('wrong'); feedback('再选一次'); }
  });
}
function buildGrammarWords(st) {
  const order = st.words.map((_, i) => (i + round + 1) % st.words.length);
  $('#mechanic').innerHTML = `
    <div class="module-bay">${st.words.map((_, i) => `<div class="module-slot" id="slot${i}">${i + 1}</div>`).join('')}</div>
    <div class="word-pool">${order.map(i => `<button class="word-tile" data-word="${i}">${tri(st.words[i], st.pys[i], st.engs[i])}</button>`).join('')}</div>`;
  $('#controls').innerHTML = '<button id="undoWord">↶ 撤回</button><button id="checkWords">检查</button>';
  document.querySelectorAll('[data-word]').forEach(b => b.onclick = () => {
    if (ready || state.parts.includes(+b.dataset.word)) return;
    state.parts.push(+b.dataset.word); b.disabled = true; paintSlots(st.words);
  });
  $('#undoWord').onclick = () => {
    if (ready || !state.parts.length) return;
    const idx = state.parts.pop();
    document.querySelector(`[data-word="${idx}"]`).disabled = false;
    paintSlots(st.words);
  };
  $('#checkWords').onclick = () => {
    if (ready) return;
    if (state.parts.length !== st.words.length) { feedback('装完再检查'); return; }
    if (state.parts.every((n, i) => n === i)) solve(false);
    else feedback('顺序不对');
  };
}
function buildGrammarLevers(st) {
  $('#mechanic').innerHTML = `<div class="lever-panel">
    <button class="lever yes" data-lever="yes">${tri('会', 'huì', 'will')}</button>
    <button class="lever no" data-lever="no">${tri('不会', 'bú huì', "won't")}</button>
  </div>`;
  document.querySelectorAll('[data-lever]').forEach(b => b.onclick = () => {
    if (ready) return;
    if (b.dataset.lever === st.target) { b.classList.add('charged'); solve(false); }
    else { b.classList.add('wrong'); feedback('另一个开关'); }
  });
}
function buildGrammarDial(st) {
  const keys = [['1', 'yāo'], ['2', 'èr'], ['3', 'sān'], ['4', 'sì'], ['5', 'wǔ'], ['6', 'liù'], ['7', 'qī'], ['8', 'bā'], ['9', 'jiǔ']];
  $('#mechanic').innerHTML = `
    <div class="dial-display" id="dialDisplay">— — —</div>
    <div class="dial-pad" style="bottom:32%">${keys.map(([n, py]) =>
      `<button class="dial-key" data-key="${n}">${n}<small>${py}</small></button>`).join('')}</div>`;
  $('#controls').innerHTML = '<button id="clearDial">清除</button>';
  document.querySelectorAll('[data-key]').forEach(b => b.onclick = () => {
    if (ready) return;
    if (state.dial.length >= 3) return;
    state.dial.push(b.dataset.key);
    $('#dialDisplay').textContent = state.dial.map(d => d === '1' ? 'yāo' : d).join(' · ');
    if (state.dial.length === 3) {
      if (state.dial.join('') === st.code.join('')) solve(false);
      else { feedback('号码不对'); state.dial = []; $('#dialDisplay').textContent = '— — —'; }
    }
  });
  $('#clearDial').onclick = () => { if (!ready) { state.dial = []; $('#dialDisplay').textContent = '— — —'; } };
}

/* —— Dialog drills —— */
function buildDialog() {
  const s = sec();
  const d = s.drills[round];
  setPrompt(d.cue, d.cuePy, d.cueEn);
  instruction('总部来电！点正确的回复，再说给老师听。', 'Pick the right reply, then say it.');
  caption('对讲机频道', 'Duìjiǎngjī', 'Radio channel');
  bindShell(d.cue);
  paintSay(d.say, d.sayPy, d.sayEn, false);
  $('#mechanic').innerHTML = `
    <div class="radio-panel">
      <div class="radio-cue">${tri('📡 ' + d.cue, d.cuePy, d.cueEn)}</div>
      <div class="pick-grid">${d.options.map(o =>
        `<button class="pick-card" data-id="${o.id}">${tri(o.zh, o.py, o.en)}</button>`).join('')}</div>
    </div>`;
  document.querySelectorAll('.pick-card').forEach(b => b.onclick = () => {
    if (ready) return;
    if (b.dataset.id === d.target) { b.classList.add('lit'); solve(false); }
    else { b.classList.add('wrong'); feedback('换一个回复'); }
  });
}

/* ========== PLANET (existing 3 missions) ========== */
function renderPlanet() {
  resetTask();
  const s = sec();
  const l = planet();
  const task = l.tasks[round];
  app.innerHTML = shellHTML();
  $('#world').dataset.effect = l.effect;
  setPrompt(task.prompt, task.py, task.en);
  caption(l.sub, '', l.subEn);
  bindShell(task.prompt);
  let extra = '';
  if (task.bonusSay) extra = `<p class="say" style="font-size:15px;opacity:.85">${tri('加分：' + task.bonusSay, task.bonusSayPy, task.bonusSayEn)}</p>`;
  $('#model').innerHTML = `<p class="say">${tri(task.say, task.sayPy, task.sayEn)}</p>${extra}<button id="listenSay">♫ 听口令</button>`;
  $('#listenSay').onclick = () => speak(task.say);
  $('#confirmBtn').hidden = false;
  buildPlanetMechanic(task);
}
function buildPlanetMechanic(task) {
  const m = task.mechanic;
  if (m === 'hotspot') {
    instruction('点击发光气象灯。', 'Tap the glowing beacon.');
    $('#mechanic').innerHTML = `<div class="station-glow"></div>${task.spots.map(s =>
      `<button class="hotspot" data-spot="${s.id}" style="left:${s.x}%;top:${s.y}%">${tri(s.zh, s.py, s.en)}</button>`).join('')}`;
    document.querySelectorAll('[data-spot]').forEach(b => b.onclick = () => {
      if (ready) return;
      if (b.dataset.spot === task.target) { b.classList.add('lit'); solve(false); }
      else { b.classList.add('wrong'); feedback('再找找'); }
    });
  } else if (m === 'words') {
    instruction('按顺序装进包裹舱。', 'Install tiles in order.');
    const order = task.words.map((_, i) => (i + 1) % task.words.length);
    $('#mechanic').innerHTML = `
      <div class="package-bay-ring"></div>
      <div class="module-bay">${task.words.map((_, i) => `<div class="module-slot" id="slot${i}">${i + 1}</div>`).join('')}</div>
      <div class="word-pool">${order.map(i => `<button class="word-tile" data-word="${i}">${tri(task.words[i], task.pys[i], task.engs[i])}</button>`).join('')}</div>`;
    $('#controls').innerHTML = '<button id="undoWord">↶ 撤回</button><button id="checkWords">检查</button>';
    document.querySelectorAll('[data-word]').forEach(b => b.onclick = () => {
      if (ready || state.parts.includes(+b.dataset.word)) return;
      state.parts.push(+b.dataset.word); b.disabled = true; paintSlots(task.words);
    });
    $('#undoWord').onclick = () => {
      if (ready || !state.parts.length) return;
      const idx = state.parts.pop();
      document.querySelector(`[data-word="${idx}"]`).disabled = false;
      paintSlots(task.words);
    };
    $('#checkWords').onclick = () => {
      if (ready) return;
      if (state.parts.length !== task.words.length) { feedback('还没装完'); return; }
      if (state.parts.every((n, i) => n === i)) solve(false);
      else feedback('顺序不对');
    };
  } else if (m === 'levers') {
    instruction('扳对风暴开关。', 'Pull the correct lever.');
    $('#mechanic').innerHTML = `<div class="energy-beam"></div><div class="lever-panel">
      <button class="lever yes" data-lever="yes">${tri('会', 'huì', 'will')}</button>
      <button class="lever no" data-lever="no">${tri('不会', 'bú huì', "won't")}</button></div>`;
    document.querySelectorAll('[data-lever]').forEach(b => b.onclick = () => {
      if (ready) return;
      if (b.dataset.lever === task.target) { b.classList.add('charged'); solve(false); }
      else { b.classList.add('wrong'); feedback('另一个'); }
    });
  } else if (m === 'rings') {
    instruction('接电话要点「喂」。', 'Tap 喂 to answer.');
    $('#mechanic').innerHTML = `<div class="radar-halo"></div>${task.options.map(o =>
      `<button class="call-ring" data-ring="${o.id}">${tri(o.zh, o.py, o.en)}</button>`).join('')}`;
    document.querySelectorAll('[data-ring]').forEach(b => b.onclick = () => {
      if (ready) return;
      if (b.dataset.ring === task.target) { b.classList.add('open'); solve(false); }
      else { b.classList.add('wrong'); feedback('找「喂」'); }
    });
  } else if (m === 'scan') {
    instruction('先扫描，再选正确动作。', 'Scan, then choose.');
    $('#mechanic').innerHTML = `<div class="radar-ring" id="radar"></div>${task.cards.map((c, i) =>
      `<button class="crystal-card" data-card="${c.id}"><span class="crew-icon">◇</span><strong>扫描 ${i + 1}</strong></button>`).join('')}`;
    document.querySelectorAll('[data-card]').forEach(b => b.onclick = () => {
      if (ready) return;
      const c = task.cards.find(x => x.id === b.dataset.card);
      if (!state.revealed.has(c.id)) {
        state.revealed.add(c.id);
        b.innerHTML = `<span class="crew-icon">${c.icon}</span><strong>${c.zh}</strong><span class="py">${c.py}</span><span class="en">${c.en}</span>`;
        const radar = $('#radar');
        radar.classList.remove('scanning'); void radar.offsetWidth; radar.classList.add('scanning');
        feedback('再点一次选择');
        return;
      }
      if (c.id === task.target) { b.classList.add('selected'); solve(false); }
      else feedback('不是这个');
    });
  } else if (m === 'dial') {
    instruction('先拨 138（1=yāo），再组装口令。', 'Dial 138, then build sentence.');
    const keys = [['1', 'yāo'], ['2', 'èr'], ['3', 'sān'], ['4', 'sì'], ['5', 'wǔ'], ['6', 'liù'], ['7', 'qī'], ['8', 'bā'], ['9', 'jiǔ']];
    const order = task.words.map((_, i) => (i + 2) % task.words.length);
    $('#mechanic').innerHTML = `
      <div class="dial-display" id="dialDisplay">— — —</div>
      <div class="dial-pad">${keys.map(([n, py]) => `<button class="dial-key" data-key="${n}">${n}<small>${py}</small></button>`).join('')}</div>
      <div class="dial-words">
        <div class="dial-slots">${task.words.map((_, i) => `<div class="module-slot" id="dslot${i}">${i + 1}</div>`).join('')}</div>
        <div class="dial-pool" id="dialPool" hidden>${order.map(i => `<button class="word-tile" data-dword="${i}">${tri(task.words[i], task.pys[i], task.engs[i])}</button>`).join('')}</div>
      </div>`;
    $('#controls').innerHTML = '<button id="clearDial">清除</button><button id="undoDword" hidden>撤回</button><button id="checkDial" hidden>检查</button>';
    document.querySelectorAll('[data-key]').forEach(b => b.onclick = () => {
      if (ready || state.dialReady) return;
      if (state.dial.length >= 3) return;
      state.dial.push(b.dataset.key);
      $('#dialDisplay').textContent = state.dial.map(d => d === '1' ? 'yāo' : d).join(' · ');
      if (state.dial.length === 3) {
        if (state.dial.join('') === task.code.join('')) {
          state.dialReady = true;
          feedback('接通！组装句子');
          $('#dialPool').hidden = false;
          $('#undoDword').hidden = false;
          $('#checkDial').hidden = false;
        } else {
          feedback('号码错了'); state.dial = [];
          $('#dialDisplay').textContent = '— — —';
        }
      }
    });
    $('#clearDial').onclick = () => { if (!ready && !state.dialReady) { state.dial = []; $('#dialDisplay').textContent = '— — —'; } };
    document.querySelectorAll('[data-dword]').forEach(b => b.onclick = () => {
      if (ready || !state.dialReady || state.parts.includes(+b.dataset.dword)) return;
      state.parts.push(+b.dataset.dword); b.disabled = true;
      task.words.forEach((_, i) => {
        const slot = $(`#dslot${i}`), idx = state.parts[i];
        slot.textContent = idx === undefined ? String(i + 1) : task.words[idx];
        slot.classList.toggle('filled', idx !== undefined);
      });
    });
    $('#undoDword').onclick = () => {
      if (ready || !state.parts.length) return;
      const idx = state.parts.pop();
      document.querySelector(`[data-dword="${idx}"]`).disabled = false;
      task.words.forEach((_, i) => {
        const slot = $(`#dslot${i}`), ix = state.parts[i];
        slot.textContent = ix === undefined ? String(i + 1) : task.words[ix];
        slot.classList.toggle('filled', ix !== undefined);
      });
    };
    $('#checkDial').onclick = () => {
      if (ready || !state.dialReady) return;
      if (state.parts.length !== task.words.length) { feedback('装完词语'); return; }
      if (state.parts.every((n, i) => n === i)) solve(false);
      else feedback('顺序不对');
    };
  }
}

/* ========== SECTION COMPLETE / FINALE ========== */
function showSectionComplete() {
  clearReward(); stopAudio();
  const s = sec();
  const next = sectionIdx + 1;
  const isPlanet = s.type === 'planet';
  app.innerHTML = `<section class="planet-complete" style="--scene:url('${s.bg}')">
    <div class="completion-inner">
      <div class="eyebrow">${s.partLabel}</div>
      <div class="completion-chars">
        <img class="hero" src="${ART.hero}" alt="">
        <img class="bot" src="${ART.robot}" alt="">
      </div>
      ${isPlanet ? '<div class="package-open">📦✨</div>' : `<div class="core-big">${typeIcon(s.type)}</div>`}
      <h1>${tri(isPlanet ? s.name.replace('闯关', '') + ' · 包裹打开！' : s.name + ' · 完成！', '', 'Section complete!')}</h1>
      <p>${s.story || ''}</p>
      <div class="completion-actions">
        <button id="goNext" class="primary">${next < SECTIONS.length
          ? tri('下一站 →', 'Xià yí zhàn', 'Next stop →')
          : tri('领取奖章', 'Lǐngqǔ jiǎngzhāng', 'Medal')}</button>
        <button id="goMap">星图</button>
        ${navHTML().replace('nav-next primary', 'nav-next').replace(/下一站 Next ▶/, '下一站 ▶')}
      </div>
    </div>
  </section>`;
  $('#goNext').onclick = () => {
    if (next < SECTIONS.length) startSection(next);
    else renderFinale();
  };
  $('#goMap').onclick = showMap;
  bindNav();
}

function renderFinale() {
  sectionIdx = SECTION_INDEX.finale;
  setStageBg(SECTIONS[sectionIdx].bg);
  resetTask();
  ready = true;
  view = 'finale';
  if (timerRunning) toggleTimer();
  const key = starKey(sectionIdx, 0);
  app.innerHTML = `<section class="finish" style="--scene:url('${SECTIONS[SECTION_INDEX.finale].bg}')">
    <div class="completion-inner">
      <div class="eyebrow">MISSION ACCOMPLISHED · ~120′</div>
      <div class="completion-chars">
        <img class="hero" src="${ART.hero}" alt="">
        <img class="bot" src="${ART.robot}" alt="">
      </div>
      <h1>${tri('Courier，配送完成！', 'Pèisòng wánchéng!', 'Delivery complete!')}</h1>
      <p>🏅 中文星际快递员<span class="py">Zhōngwén Xīngjì Kuàidìyuán</span><span class="en">Chinese Space Courier</span></p>
      <div class="core-tray">📦 📦</div>
      <p>★ ${earned.size} / ${TOTAL_STARS}</p>
      <p>${tri('天气预报 + 电话任务，两个包裹都送到了！', '', 'Both weather and phone packages delivered!')}</p>
      <div class="completion-actions">
        <button id="claimMedal" class="primary">领取奖章 ★</button>
        <button id="finishMap">回到星图</button>
        ${navHTML()}
      </div>
      <p style="margin-top:18px;opacity:.8"><img src="assets/leila-logo.png" alt="LEILA" style="height:36px;vertical-align:middle"> LEILA 蕾姐教中文</p>
    </div>
  </section>`;
  $('#claimMedal').onclick = () => {
    if (!earned.has(key)) {
      earned.add(key);
      doneSections.add('finale');
      updateHUD();
    }
    celebrate(true, true);
  };
  $('#finishMap').onclick = showMap;
  bindNav();
  updateHUD();
  if (!earned.has(key)) {
    earned.add(key);
    doneSections.add('finale');
    updateHUD();
    celebrate(true, true);
  }
}

/* ========== TIMER / TOPBAR ========== */
function timerText() {
  const now = elapsed + (timerRunning ? (Date.now() - timerStarted) / 1000 : 0);
  const secs = Math.min(SOFT_CAP + 600, Math.floor(now));
  $('#timerBtn').textContent = `${timerRunning ? 'Ⅱ' : '▶'} ${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  if (now >= SOFT_CAP && timerRunning && !state._softToast) {
    state._softToast = true;
    toast('建议 120 分钟节点：可进入收尾或颁奖（老师掌控，不强制）。');
  }
}
function toggleTimer() {
  if (timerRunning) {
    elapsed += (Date.now() - timerStarted) / 1000;
    timerRunning = false; clearInterval(timerInterval);
  } else {
    timerRunning = true; timerStarted = Date.now();
    timerInterval = setInterval(timerText, 1000);
  }
  timerText();
}

function showDialog(id) {
  clearReward(); stopAudio();
  const d = $('#' + id);
  if (d && !d.open) d.showModal();
}

$('#mapBtn').onclick = showMap;
$('#pinyinBtn').onclick = () => {
  const hidden = document.body.classList.toggle('hide-py');
  $('#pinyinBtn').setAttribute('aria-pressed', String(!hidden));
};
$('#englishBtn').onclick = () => {
  const hidden = document.body.classList.toggle('hide-en');
  $('#englishBtn').setAttribute('aria-pressed', String(!hidden));
};
$('#soundBtn').onclick = () => {
  sound = !sound;
  $('#soundBtn').setAttribute('aria-pressed', String(sound));
  $('#soundBtn').textContent = sound ? '♫ 声音' : '♩ 静音';
  if (!sound) stopAudio();
};
$('#timerBtn').onclick = toggleTimer;
$('#guideBtn').onclick = () => showDialog('guide');
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => {
  stopAudio();
  $('#' + b.dataset.close).close();
});
$('#resetAsk').onclick = () => { $('#resetConfirm').hidden = false; };
$('#resetNo').onclick = () => { $('#resetConfirm').hidden = true; };
$('#resetYes').onclick = () => {
  earned.clear(); doneSections.clear();
  elapsed = 0; timerRunning = false; clearInterval(timerInterval); timerText();
  $('#resetConfirm').hidden = true;
  $('#guide').close();
  showMap();
};
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { clearReward(); stopAudio(); if (timerRunning) toggleTimer(); }
});

showMap();
