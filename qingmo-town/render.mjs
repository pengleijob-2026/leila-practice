// Offline export of the 15 s camera shot: headless Chrome renders each frame at a fixed time step
// (window.renderFrame(t)), frames are piped to ffmpeg, so no frame is ever dropped.
// Usage:
//   npm install && node render.mjs                -> out/qingmo-town-1920x1080.mp4 + out/qingmo-town-1080x1920.mp4
//   SIZES=1920x1080 node render.mjs               -> one orientation only
// Env: CHROME (browser path), FPS (default 30), FROM/TO (seconds), STILLS (default "0,8,14"),
//      QUERY (extra URL params, e.g. "nochar" or "char=hero.png"), GPU=1 to use the real GPU instead of SwiftShader.
// Stills are written as out/still-<size>-t<sec>.png.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const dir = path.dirname(fileURLToPath(import.meta.url));
const FPS = Number(process.env.FPS || 30);
const CHROME = process.env.CHROME || "/usr/local/bin/google-chrome";
const SIZES = (process.env.SIZES || "1920x1080,1080x1920").split(",").map(s => s.split("x").map(Number));
const STILLS = (process.env.STILLS ?? "0,8,14").split(",").filter(Boolean).map(Number);
const QUERY = process.env.QUERY ? "&" + process.env.QUERY : "";
const out = path.join(dir, "out");
fs.mkdirSync(out, { recursive: true });

const types = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const gpuArgs = process.env.GPU ? ["--enable-gpu", "--ignore-gpu-blocklist"] : ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 0, args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb", ...gpuArgs] });

async function renderSize([W, H]) {
  const tag = `${W}x${H}`;
  const page = await browser.newPage();
  page.on("pageerror", e => console.error(`[${tag}] page error:`, e.message));
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${port}/index.html?render=1${QUERY}`, { timeout: 0 });
  await page.waitForFunction("window.__ready === true", { timeout: 0 });
  const meta = await page.evaluate("window.VIDEO_META");
  const from = Number(process.env.FROM || 0), to = Math.min(Number(process.env.TO || meta.DURATION), meta.DURATION);
  const frames = Math.round((to - from) * FPS);
  const file = path.join(out, `qingmo-town-${tag}.mp4`);
  console.log(`[${tag}] rendering ${frames} frames @${FPS}fps -> ${path.relative(dir, file)}`);

  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "17", "-profile:v", "high", "-r", String(FPS),
    "-movflags", "+faststart", file], { stdio: ["pipe", "inherit", "inherit"] });
  const stillFrames = new Map(STILLS.map(s => [Math.round((s - from) * FPS), s]));
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    const t = from + f / FPS;
    await page.evaluate(t => window.renderFrame(t), t);
    const buf = await page.screenshot({ type: "png" });
    if (stillFrames.has(f)) fs.writeFileSync(path.join(out, `still-${tag}-t${stillFrames.get(f)}.png`), buf);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (f % 30 === 0) console.log(`[${tag}] frame ${f}/${frames}  ${((Date.now() - t0) / 1000 / (f + 1)).toFixed(2)} s/frame`);
  }
  // stills past the last frame (e.g. t = duration) are rendered separately
  for (const [f, s] of stillFrames) if (f >= frames) {
    await page.evaluate(t => window.renderFrame(t), s);
    fs.writeFileSync(path.join(out, `still-${tag}-t${s}.png`), await page.screenshot({ type: "png" }));
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await page.close();
  console.log(`[${tag}] wrote ${file}`);
}

await Promise.all(SIZES.map(renderSize));
await browser.close();
server.close();
