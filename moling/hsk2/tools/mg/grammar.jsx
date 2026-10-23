function ease(f, a, b, from, to) {
  return interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1) });
}
function isHan(c) { const k = c.charCodeAt(0); return k >= 0x3400 && k <= 0x9fff; }
function ruby({ text, py, size, color, pyColor, weight, hl, hlColor, align }) {
  const INK = '#2b2f33'; const SEAL = '#b8432f'; const SUB = '#6f7c88'; const PYF = 'Noto Sans, Noto Serif, Arial, sans-serif';
  const s = String(text || '');
  const toks = String(py || '').trim().split(/\s+/).filter(Boolean);
  const chars = Array.from(s);
  const mark = {};
  String(hl || '').split(/\s+/).filter(Boolean).forEach((w) => {
    let i = s.indexOf(w);
    while (i >= 0) { for (let j = 0; j < w.length; j++) mark[i + j] = true; i = s.indexOf(w, i + w.length); }
  });
  const ps = Math.round(size * 0.36);
  let k = 0;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: align || 'flex-start', rowGap: Math.round(size * 0.12) }}>
      {chars.map((c, i) => {
        const col = mark[i] ? (hlColor || SEAL) : (color || INK);
        if (isHan(c)) {
          const t = toks[k++] || '';
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: size }}>
              <div style={{ fontSize: ps, lineHeight: 1.25, color: mark[i] ? col : (pyColor || SUB), fontFamily: PYF, whiteSpace: 'nowrap' }}>{t}</div>
              <div style={{ fontSize: size, lineHeight: 1.12, color: col, fontWeight: weight || 400 }}>{c}</div>
            </div>
          );
        }
        return <div key={i} style={{ fontSize: size, lineHeight: 1.12, color: col, fontWeight: weight || 400, whiteSpace: 'pre' }}>{c}</div>;
      })}
    </div>
  );
}
function GrammarCard({ item }) {
  const INK = '#2b2f33'; const SEAL = '#b8432f'; const SUB = '#6f7c88'; const QING = '#3f6f6a'; const ENF = 'Noto Serif, Georgia, serif';
  const BG = 'radial-gradient(ellipse at 40% 42%, #f6f2e9 0%, #ebe6dc 58%, #d3d9dd 100%)';
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = (item && item.props) || {};
  const F = (v) => { const n = Number(v); return (isNaN(n) || n < 0) ? -1 : n * fps; };
  const on = (t, d) => (t >= 0 ? ease(f, t, t + (d || 15), 0, 1) : 0);
  const head = ease(f, 0, 15, 0, 1);
  const tF = F(p.tFormula);
  const tP = F(p.tPractice);
  const tA = F(p.tAnswer);
  const exs = String(p.examples || '').split(';;').filter(Boolean).map((s) => {
    const a = s.split('|');
    return { t: F(a[0]), zh: a[1] || '', py: a[2] || '', en: a[3] || '', hl: a[4] || '' };
  });
  const fo = on(tF);
  const po = on(tP);
  const ao = on(tA, 12);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: BG, fontFamily: 'Noto Serif SC, Songti SC, serif' }}>
      <div style={{ position: 'absolute', top: 44, left: 120, right: 120, display: 'flex', alignItems: 'flex-end', gap: 22, opacity: head }}>
        <div style={{ width: 12, height: 66, background: SEAL, borderRadius: 3, alignSelf: 'flex-end', marginBottom: 4 }} />
        {ruby({ text: '语言点', py: 'yǔ yán diǎn', size: 46 })}
        <div style={{ fontSize: 30, color: SUB, fontFamily: ENF, paddingBottom: 8 }}>Grammar</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 30, color: '#f6f2e9', background: SEAL, borderRadius: 24, padding: '6px 22px', fontFamily: ENF, marginBottom: 8 }}>{p.num || ''}</div>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 150, display: 'flex', alignItems: 'flex-end', gap: 24, opacity: head, transform: 'translateY(' + (1 - head) * 16 + 'px)' }}>
        {ruby({ text: p.title, py: p.titlePy, size: 60, weight: 700 })}
        <div style={{ fontSize: 32, color: SUB, fontFamily: ENF, paddingBottom: 8 }}>{p.titleEn || ''}</div>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 285, width: 1420, padding: '14px 34px 16px', boxSizing: 'border-box', borderRadius: 22, background: 'rgba(255,255,255,0.65)', border: '4px solid ' + SEAL, opacity: fo, transform: 'translateX(' + (1 - fo) * -30 + 'px)' }}>
        {ruby({ text: p.formula, py: p.formulaPy, size: 52, weight: 700, color: SEAL, pyColor: SEAL })}
        <div style={{ fontSize: 27, color: SUB, fontFamily: ENF, marginTop: 4 }}>{p.formulaEn || ''}</div>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 470, width: 880, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {exs.map((e, i) => {
          const o = on(e.t);
          return (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', opacity: o, transform: 'translateY(' + (1 - o) * 18 + 'px)' }}>
              <div style={{ width: 14, height: 14, marginTop: 36, borderRadius: 7, background: QING, flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {ruby({ text: e.zh, py: e.py, size: 40, color: INK, hl: e.hl })}
                <div style={{ fontSize: 24, color: SUB, fontStyle: 'italic', fontFamily: ENF }}>{e.en}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 1060, top: 470, width: 500, padding: '18px 28px 20px', boxSizing: 'border-box', borderRadius: 22, background: QING, color: '#f6f2e9', opacity: po, transform: 'translateY(' + (1 - po) * 20 + 'px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 30, fontFamily: ENF }}>Your turn ·</div>
        {ruby({ text: p.prompt, py: p.promptPy, size: 38, color: '#f6f2e9', pyColor: '#dfe7e4' })}
        <div style={{ fontSize: 22, fontFamily: ENF, color: '#dfe7e4' }}>{p.promptEn || ''}</div>
        <div style={{ marginTop: 8, padding: '10px 18px 12px', borderRadius: 14, background: 'rgba(246,242,233,0.95)', opacity: ao, transform: 'scale(' + (0.92 + 0.08 * ao) + ')' }}>
          {ruby({ text: p.answer, py: p.answerPy, size: 40, color: SEAL, pyColor: SEAL, weight: 700, hl: p.answerHl })}
          <div style={{ fontSize: 22, fontFamily: ENF, color: SUB }}>{p.answerEn || ''}</div>
        </div>
      </div>
    </div>
  );
}
