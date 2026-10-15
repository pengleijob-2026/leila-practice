// Usage:
//   node render.js video out.mp4 [fps]      -> silent H.264 video
//   node render.js stills outdir t1 t2 ...  -> PNG previews at given seconds
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME || '/usr/local/bin/google-chrome';
const [mode, out, ...rest] = process.argv.slice(2);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu-sandbox', '--force-color-profile=srgb'],
  });
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, 'anim.html') + '?capture', { waitUntil: 'load' });
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.DURATION);

  const grab = (t, type) =>
    page.evaluate((t, type) => {
      window.render(t);
      return document.getElementById('c').toDataURL(type, 0.93).split(',')[1];
    }, t, type);

  if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const s of rest) {
      fs.writeFileSync(path.join(out, `t${s}.png`), Buffer.from(await grab(+s, 'image/png'), 'base64'));
    }
  } else {
    const fps = +(rest[0] || 30);
    const total = Math.round(duration * fps);
    const ff = spawn('ffmpeg', [
      '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out,
    ], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < total; i++) {
      const buf = Buffer.from(await grab(i / fps, 'image/jpeg'), 'base64');
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if (i % 150 === 0) process.stdout.write(`frame ${i}/${total}\n`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
  }
  await browser.close();
})();
