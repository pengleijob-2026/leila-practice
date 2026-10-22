function ease(f, a, b, from, to) {
  return interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1) });
}
function isHan(c) { const k = c.charCodeAt(0); return k >= 0x3400 && k <= 0x9fff; }
function Ruby({ text, py, size, color, pyColor, weight, hl, hlColor, align }) {
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
        if (c === '|') return <div key={i} style={{ flexBasis: '100%', height: 0 }} />;
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
function Header({ zh, py, en, o, right }) {
  return (
    <div style={{ position: 'absolute', top: 44, left: 120, right: 120, display: 'flex', alignItems: 'flex-end', gap: 22, opacity: o }}>
      <div style={{ width: 12, height: 66, background: SEAL, borderRadius: 3, alignSelf: 'flex-end', marginBottom: 4 }} />
      <Ruby text={zh} py={py} size={46} />
      <div style={{ fontSize: 30, color: SUB, fontFamily: ENF, paddingBottom: 8 }}>{en}</div>
      <div style={{ flex: 1 }} />
      {right || null}
    </div>
  );
}
