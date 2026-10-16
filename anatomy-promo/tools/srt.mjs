// node srt.mjs -> ../anatomy-promo.srt (bilingual, zh line then en line, from SUBS in index.html)
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const SUBS = new Function(`return ${html.match(/const SUBS = (\[[\s\S]*?\n\]);/)[1]}`)();
const ts = s => {
  const ms = Math.round(s * 1000), p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const srt = SUBS.map(([a, b, zh, en], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${zh.replace(/[【】]/g, '')}\n${en}\n`).join('\n');
writeFileSync(path.join(root, 'anatomy-promo.srt'), srt);
console.log(`${SUBS.length} cues`);
