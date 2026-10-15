// Builds derived files from data.js: ai-personas.json, ep01 subtitles and the ep01 animatic.
// Usage: node moling/tools/build.mjs [--no-video]
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const M = createRequire(import.meta.url)(join(root, 'data.js'));
const FPS = 30, W = 1280, H = 720, FADE = 0.5;
const FONT = 'WenQuanYi Micro Hei';

const personas = M.characters.map((c) => ({
  id: c.id, name: c.name, pinyin: c.py, english: c.en,
  image: `moling/${c.img}`, level: c.teach.level, role: c.teach.role,
  teachingStyle: c.teach.style, topics: c.teach.topics,
  catchphrase: c.catchphrase, voice: c.voice, systemPrompt: c.persona
}));
writeFileSync(join(root, 'ai-personas.json'), JSON.stringify(personas, null, 2) + '\n');

const ts = (s, sep) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return sep === ','
    ? `${p(h)}:${p(m)}:${p(sec)},${p(ms % 1000, 3)}`
    : `${h}:${p(m)}:${p(sec)}.${p(Math.floor((ms % 1000) / 10))}`;
};

const cues = [];
let t = 0;
for (const shot of M.ep01.shots) {
  const usable = shot.sec - 2 * FADE;
  const step = usable / shot.lines.length;
  shot.lines.forEach((zh, i) => {
    const start = t + FADE + i * step;
    cues.push({ start, end: start + step - 0.1, zh, en: shot.en[i] });
  });
  t += shot.sec;
}
const total = t;

writeFileSync(join(root, 'ep01.srt'),
  cues.map((c, i) => `${i + 1}\n${ts(c.start, ',')} --> ${ts(c.end, ',')}\n${c.zh}\n${c.en}\n`).join('\n'));

const ass = [
  '[Script Info]', 'ScriptType: v4.00+', `PlayResX: ${W}`, `PlayResY: ${H}`, '',
  '[V4+ Styles]',
  'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
  `Style: ZH,${FONT},38,&H00FFFFFF,&H00FFFFFF,&H00303030,&H64000000,0,0,0,0,100,100,2,0,1,2.2,1,2,60,60,62,1`,
  `Style: EN,${FONT},22,&H00E8E8E8,&H00E8E8E8,&H00303030,&H64000000,0,0,0,0,100,100,0,0,1,1.6,0,2,60,60,30,1`,
  `Style: TITLE,${FONT},96,&H00FFFFFF,&H00FFFFFF,&H00404040,&H64000000,1,0,0,0,100,100,12,0,1,3,2,5,60,60,0,1`,
  '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
  ...cues.flatMap((c) => [
    `Dialogue: 0,${ts(c.start)},${ts(c.end)},ZH,,0,0,0,,${c.zh}`,
    `Dialogue: 0,${ts(c.start)},${ts(c.end)},EN,,0,0,0,,${c.en}`
  ]),
  `Dialogue: 1,${ts(0.4)},${ts(4.2)},TITLE,,0,0,0,,{\\fad(600,600)}${M.title}\\N{\\fs34\\fsp2}${M.titleEn} · ${M.ep01.title}`,
  `Dialogue: 1,${ts(total - 4.5)},${ts(total - 0.3)},TITLE,,0,0,0,,{\\fad(600,400)\\pos(${W / 2},${H * 0.14})}${M.title}\\N{\\fs30\\fsp2}${M.tagline}`
].join('\n') + '\n';
writeFileSync(join(root, 'ep01.ass'), ass);

if (process.argv.includes('--no-video')) process.exit(0);

const tmp = join(root, '.build');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp);
const moves = [
  "z='min(zoom+0.0006,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
  "z='1.12':x='(iw-iw/zoom)*on/{N}':y='ih/2-(ih/zoom/2)'",
  "z='max(1.15-0.0006*on,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
  "z='1.12':x='(iw-iw/zoom)*(1-on/{N})':y='ih/2-(ih/zoom/2)'"
];
const parts = M.ep01.shots.map((shot, i) => {
  const n = shot.sec * FPS;
  const out = join(tmp, `${shot.id}.mp4`);
  const vf = `scale=${W * 2}:${H * 2},zoompan=${moves[i % moves.length].replaceAll('{N}', n)}:d=${n}:s=${W}x${H}:fps=${FPS},` +
    `fade=t=in:st=0:d=${FADE},fade=t=out:st=${shot.sec - FADE}:d=${FADE},format=yuv420p`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-i', join(root, shot.img),
    '-vf', vf, '-frames:v', String(n), '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', out]);
  return out;
});
writeFileSync(join(tmp, 'list.txt'), parts.map((p) => `file '${p}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'),
  '-vf', `ass=${join(root, 'ep01.ass')}`, '-c:v', 'libx264', '-crf', '23', '-preset', 'medium',
  '-movflags', '+faststart', '-pix_fmt', 'yuv420p', join(root, 'assets/ep01/ep01-animatic.mp4')]);
rmSync(tmp, { recursive: true, force: true });
console.log(`ep01 animatic: ${total}s, ${cues.length} subtitle cues`);
