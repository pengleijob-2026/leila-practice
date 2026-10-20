// Deterministic frame capture of live Anatomy figures.
// A virtual clock replaces requestAnimationFrame / performance.now / Date.now, so every
// frame advances exactly 1/FPS seconds regardless of how slow the screenshot is.
//   node capture.mjs <clip> [--stills t1,t2,...]
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLIPS } from './clips.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30;
const name = process.argv[2];
const stillsArg = process.argv.indexOf('--stills');
const stills = stillsArg > 0 ? process.argv[stillsArg + 1].split(',').map(Number) : null;
const clip = CLIPS[name];
if (!clip) throw new Error(`unknown clip ${name}; have ${Object.keys(CLIPS).join(', ')}`);

const outDir = path.resolve(here, '../out/clips', name);
if (!stills) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const CLOCK = `(() => {
  let vt = 0; const cbs = new Map(); let id = 0;
  window.requestAnimationFrame = cb => { cbs.set(++id, cb); return id; };
  window.cancelAnimationFrame = i => cbs.delete(i);
  performance.now = () => vt;
  const d0 = Date.now(); Date.now = () => d0 + vt;
  window.__step = ms => { vt += ms; const list = [...cbs.values()]; cbs.clear(); for (const cb of list) { try { cb(vt); } catch (e) { console.error(e); } } };
})();`;

const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/google-chrome',
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--force-device-scale-factor=1'],
});
const page = await browser.newPage();
await page.setViewport({ width: clip.vw || 1920, height: clip.vh || 1080 });
page.on('pageerror', e => console.log('pageerror', e.message));
await page.evaluateOnNewDocument(CLOCK);
await page.goto(clip.url, { waitUntil: 'networkidle0', timeout: 120000 });
if (clip.css) await page.addStyleTag({ content: clip.css });
await new Promise(r => setTimeout(r, 1500));
for (let i = 0; i < 30; i++) await page.evaluate(() => window.__step(1000 / 30));

const total = Math.round(clip.dur * FPS);
const actions = (clip.actions || []).slice().sort((a, b) => a.t - b.t);
let ai = 0;
const wanted = stills ? new Set(stills.map(s => Math.round(s * FPS))) : null;
const started = Date.now();
for (let f = 0; f < total; f++) {
  const t = f / FPS;
  while (ai < actions.length && actions[ai].t <= t) {
    const a = actions[ai++];
    if (a.type === 'key') await page.keyboard.press(a.key);
    else if (a.type === 'keydown') await page.keyboard.down(a.key);
    else if (a.type === 'keyup') await page.keyboard.up(a.key);
    else if (a.type === 'move') await page.mouse.move(a.x, a.y, { steps: a.steps || 1 });
    else if (a.type === 'down') await page.mouse.down();
    else if (a.type === 'up') await page.mouse.up();
    else if (a.type === 'click') await page.mouse.click(a.x, a.y);
    else if (a.type === 'focus') await page.evaluate(sel => { const el = document.querySelector(sel); el && el.focus(); }, a.sel || '[tabindex]');
  }
  await page.evaluate(() => window.__step(1000 / 30));
  if (wanted && !wanted.has(f)) continue;
  const buf = await page.screenshot({ type: 'jpeg', quality: 90, clip: clip.clip });
  writeFileSync(path.join(outDir, stills ? `still_${t.toFixed(1)}.jpg` : `${String(f).padStart(4, '0')}.jpg`), buf);
  if (!stills && f % 90 === 0) console.log(`${name} ${f}/${total} ${((Date.now() - started) / 1000).toFixed(0)}s`);
}
await browser.close();
console.log(`${name} done ${((Date.now() - started) / 1000).toFixed(0)}s`);
