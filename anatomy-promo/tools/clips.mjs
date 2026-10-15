// Live Anatomy figures used in the video, with scripted interactions at clip-local times.
// Collection figures come from the MIT `anatomy-figures` package served by fig.html;
// the Raptor engine is the skill's own built example page.
const FIG = 'http://127.0.0.1:8765/fig.html';
const LIT = '&lit=%23f2b56b';
const RAPTOR = 'file:///tmp/anatomy/examples/raptor-engine/raptor-engine.html';

export const CLIPS = {
  sampling: {
    url: `${FIG}?name=sampling&w=1500${LIT}`, dur: 17,
    actions: [
      { t: 0.5, type: 'focus' },
      ...Array.from({ length: 10 }, (_, i) => ({ t: 6 + i * 0.25, type: 'key', key: 'ArrowRight' })),
      { t: 9, type: 'key', key: 'Enter' },
      ...Array.from({ length: 16 }, (_, i) => ({ t: 11.5 + i * 0.2, type: 'key', key: 'ArrowLeft' })),
      { t: 15, type: 'key', key: 'Enter' },
    ],
  },
  watch: {
    url: `${FIG}?name=watch&w=1500${LIT}`, dur: 19,
    actions: [
      { t: 0.5, type: 'focus' },
      ...Array.from({ length: 8 }, (_, i) => ({ t: 1.5 + i * 0.3, type: 'key', key: 'ArrowUp' })),
      { t: 6, type: 'key', key: 's' },
      { t: 9.5, type: 'key', key: 's' },
      { t: 12.2, type: 'key', key: 's' },
      { t: 12.6, type: 'key', key: 'e' },
    ],
  },
  raptor: {
    url: RAPTOR, dur: 19,
    css: 'body{background:#0b0b0d!important} .fig-notes,figcaption,p{display:none!important}',
    clip: { x: 360, y: 40, width: 1200, height: 1000 },
    actions: [
      { t: 0.5, type: 'focus' },
      ...Array.from({ length: 11 }, (_, i) => ({ t: 1.5 + i * 0.35, type: 'key', key: 'ArrowRight' })),
      { t: 8.5, type: 'key', key: 'Escape' },
      { t: 11, type: 'key', key: 'i' },
    ],
  },

  'lru-cache': { url: `${FIG}?name=lru-cache&w=1300${LIT}`, dur: 3.5 },
  'bloom-filter': { url: `${FIG}?name=bloom-filter&w=1300${LIT}`, dur: 3.5 },
  seasons: { url: `${FIG}?name=seasons&w=1500${LIT}`, dur: 3.5 },
  'message-queue': { url: `${FIG}?name=message-queue&w=1500${LIT}`, dur: 3.5 },
};
