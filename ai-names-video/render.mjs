// Usage:
//   node render.mjs                                   -> out/ai-names.mp4 with the 126 BPM guide beat
//   MUSIC=we-never.mp3 MUSIC_START=12.38 node render.mjs
//     MUSIC_START = the time (s) in the song of the downbeat that should land on frame 0.
// Env: CHROME (browser path), FPS (default 30), FROM/TO (seconds, for partial renders).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const dir = path.dirname(fileURLToPath(import.meta.url));
const FPS = Number(process.env.FPS || 30);
const CHROME = process.env.CHROME || "/usr/local/bin/google-chrome";
fs.mkdirSync(path.join(dir, "out"), { recursive: true });

const types = { ".html": "text/html", ".js": "text/javascript", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(`http://localhost:${port}/index.html?render=1`);
await page.waitForFunction("window.READY === true");
const meta = await page.evaluate("window.VIDEO_META");
fs.writeFileSync(path.join(dir, "out", "cuts.json"), JSON.stringify(meta));
const from = Number(process.env.FROM || 0), to = Math.min(Number(process.env.TO || meta.DURATION), meta.DURATION);
const frames = Math.round((to - from) * FPS);
console.log(`duration ${meta.DURATION.toFixed(3)}s, rendering ${frames} frames @${FPS}fps`);

const silent = path.join(dir, "out", "video-silent.mp4");
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "18", "-r", String(FPS), silent], { stdio: ["pipe", "inherit", "inherit"] });

for (let f = 0; f < frames; f++) {
  const t = from + f / FPS;
  await page.evaluate(t => window.renderFrame(t), t);
  const buf = await page.screenshot({ type: "jpeg", quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
  if (f % 150 === 0) console.log(`frame ${f}/${frames}`);
}
ff.stdin.end();
await new Promise(r => ff.on("close", r));
await browser.close();
server.close();

const len = (to - from).toFixed(3);
let audioArgs;
if (process.env.MUSIC) {
  const start = Number(process.env.MUSIC_START || 0) + from;
  audioArgs = ["-ss", String(start), "-t", len, "-i", process.env.MUSIC];
} else {
  const guide = path.join(dir, "out", "guide-126bpm.wav");
  execFileSync("node", [path.join(dir, "make-guide.mjs"), guide, path.join(dir, "out", "cuts.json")], { stdio: "inherit" });
  audioArgs = ["-ss", String(from), "-t", len, "-i", guide];
}
const out = path.join(dir, "out", process.env.MUSIC ? "ai-names-music.mp4" : "ai-names.mp4");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", silent, ...audioArgs,
  "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
  "-af", `afade=t=out:st=${Math.max(0, len - 1.2)}:d=1.2`, "-shortest", out], { stdio: "inherit" });
console.log("wrote", out);
