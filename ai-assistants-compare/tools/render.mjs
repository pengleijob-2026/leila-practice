// Usage:
//   node tools/render.mjs stills 3 10 22      -> PNG stills at the given seconds
//   node tools/render.mjs video out.mp4       -> full silent video (mux music separately)
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const page_url = 'file://' + path.resolve(here, '..', 'index.html');
const FPS = 30;
const [mode, ...args] = process.argv.slice(2);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/local/bin/google-chrome',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.evaluateOnNewDocument(() => { window.__RENDER__ = true; });
await page.goto(page_url);
await page.evaluate(() => document.fonts.ready);

const grab = async (t, type) => {
  await page.evaluate(t => renderFrame(t), t);
  const el = await page.$('canvas');
  return el.screenshot({ type, ...(type === 'jpeg' ? { quality: 95 } : {}) });
};

if (mode === 'stills') {
  const fs = await import('node:fs');
  for (const s of args) fs.writeFileSync(`/tmp/still_${s}.png`, await grab(Number(s), 'png'));
} else {
  const out = args[0] || 'out.mp4';
  const duration = await page.evaluate(() => DURATION);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    const buf = await grab(i / FPS, 'jpeg');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.error(`frame ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}
await browser.close();
