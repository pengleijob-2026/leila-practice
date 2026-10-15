// Usage:
//   node render.mjs stills 5 40 120        -> out/still_<t>.jpg for each time (seconds)
//   node render.mjs video [workers]        -> out/github-explainer.mp4 (needs out/soundtrack.wav)
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const out = path.join(root, 'out');
mkdirSync(out, { recursive: true });
const FPS = 30;
const url = pathToFileURL(path.join(root, 'index.html')).href + '?render=1';

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/local/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1', '--autoplay-policy=no-user-gesture-required'],
});

async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  return page;
}
const grab = (page, t) => page.evaluate(t => { window.renderFrame(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, t)
  .then(d => Buffer.from(d.split(',')[1], 'base64'));

function run(cmd, args) {
  return new Promise((res, rej) => { const p = spawn(cmd, args, { stdio: 'inherit' }); p.on('exit', c => c ? rej(new Error(`${cmd} ${c}`)) : res()); });
}

const [mode, ...rest] = process.argv.slice(2);
if (mode === 'stills') {
  const page = await openPage();
  for (const s of rest) writeFileSync(path.join(out, `still_${s}.jpg`), await grab(page, parseFloat(s)));
} else {
  const workers = parseInt(rest[0] || '4', 10);
  const duration = await (await openPage()).evaluate('window.DURATION');
  const total = Math.round(duration * FPS);
  const per = Math.ceil(total / workers);
  const started = Date.now();
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const page = await openPage();
    const a = w * per, b = Math.min(total, a + per);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(out, `part${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise(r => ff.on('exit', r));
    for (let f = a; f < b; f++) {
      const buf = await grab(page, f / FPS);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (w === 0 && (f - a) % 150 === 0) console.log(`worker0 ${f - a}/${b - a}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await done;
  }));
  writeFileSync(path.join(out, 'parts.txt'), Array.from({ length: workers }, (_, w) => `file 'part${w}.mp4'`).join('\n'));
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(out, 'parts.txt'), '-i', path.join(out, 'soundtrack.wav'),
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(out, 'github-explainer.mp4')]);
  console.log('done', ((Date.now() - started) / 1000).toFixed(0), 's');
}
await browser.close();
