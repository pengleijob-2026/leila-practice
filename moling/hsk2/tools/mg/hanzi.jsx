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
function header({ zh, py, en, o, right }) {
  const SEAL = '#b8432f'; const SUB = '#6f7c88'; const ENF = 'Noto Serif, Georgia, serif';
  return (
    <div style={{ position: 'absolute', top: 44, left: 120, right: 120, display: 'flex', alignItems: 'flex-end', gap: 22, opacity: o }}>
      <div style={{ width: 12, height: 66, background: SEAL, borderRadius: 3, alignSelf: 'flex-end', marginBottom: 4 }} />
      {ruby({ text: zh, py: py, size: 46 })}
      <div style={{ fontSize: 30, color: SUB, fontFamily: ENF, paddingBottom: 8 }}>{en}</div>
      <div style={{ flex: 1 }} />
      {right || null}
    </div>
  );
}
function glyphPaths(kind) {
  if (kind === 'eye') return ['M40 200 Q200 70 360 200 Q200 330 40 200 Z', 'M200 150 A50 50 0 1 1 199.9 150 Z'];
  if (kind === 'snake') return ['M200 70 C150 70 128 118 158 150 C188 182 252 172 252 128 C252 92 228 70 200 70 Z', 'M196 168 C140 228 262 250 210 312 C180 346 138 332 150 298'];
  if (kind === 'foot') return ['M150 60 H250 V150 H150 Z', 'M200 150 V330', 'M110 330 H300', 'M200 245 L282 205', 'M140 268 V330'];
  if (kind === 'silk') return ['M200 50 C262 78 262 128 200 150 C138 128 138 78 200 50 Z', 'M200 150 C268 180 268 238 200 262 C132 238 132 180 200 150 Z', 'M200 262 V345', 'M168 282 L132 345', 'M232 282 L268 345'];
  if (kind === 'ox') return ['M80 70 C92 150 140 178 200 178 C260 178 308 150 320 70', 'M200 120 V345', 'M120 250 H280'];
  if (kind === 'door') return ['M130 60 V345', 'M130 100 H290 V320 H130', 'M180 100 V320', 'M248 200 A10 10 0 1 1 247.9 200 Z'];
  return [];
}
function HanziStage({ item }) {
  const INK = '#2b2f33'; const SEAL = '#b8432f'; const SUB = '#6f7c88'; const QING = '#3f6f6a'; const PYF = 'Noto Sans, Noto Serif, Arial, sans-serif'; const ENF = 'Noto Serif, Georgia, serif'; const BG = 'radial-gradient(ellipse at 40% 42%, #f6f2e9 0%, #ebe6dc 58%, #d3d9dd 100%)';
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = (item && item.props) || {};
  const INF = 1e9;
  const F = (v) => { const n = Number(v); return (isNaN(n) || n < 0) ? -1 : n * fps; };
  const tA = F(p.tAncient);
  const tR = F(p.tRotate);
  const tM = F(p.tModern);
  const tC = F(p.tCompose);
  const hasAncient = !!(p.ancient && p.ancient !== 'none' && tA >= 0);
  const hasCompose = !!(p.partA && p.partB && tC >= 0);
  const aStart = hasCompose ? (tM >= 0 ? tM : tC) : INF;
  const firstT = hasAncient ? tA : aStart;
  const backT = hasCompose ? tC + 45 : (hasAncient && tM >= 0 ? tM : INF);
  const fullO = f < backT ? 1 - ease(f, firstT, firstT + 12, 0, 1) : ease(f, backT, backT + 15, 0, 1);
  const ancEnd = tM >= 0 ? tM : INF;
  const ancO = hasAncient ? ease(f, tA, tA + 10, 0, 1) * (1 - ease(f, ancEnd, ancEnd + 12, 0, 1)) : 0;
  const draw = hasAncient ? ease(f, tA, tA + 45, 0, 1) : 0;
  const rot = tR >= 0 ? ease(f, tR, tR + 30, 0, 90) : 0;
  const partO = hasCompose ? ease(f, aStart, aStart + 12, 0, 1) * (1 - ease(f, tC + 45, tC + 57, 0, 1)) : 0;
  const slide = hasCompose ? ease(f, tC, tC + 24, 1, 0) : 1;
  const bO = hasCompose ? ease(f, tC, tC + 12, 0, 1) : 0;
  const slotO = hasCompose ? 1 - ease(f, tC, tC + 8, 0, 1) : 0;
  const formulaO = hasCompose ? ease(f, tC + 45, tC + 65, 0, 1) : 0;
  const tb = p.layout === 'tb';
  const aPos = tb ? { left: 250, top: 190, size: 240 } : { left: 70, top: 300, size: 300 };
  const bPos = tb ? { left: 250, top: 460, size: 240 } : { left: 400, top: 300, size: 300 };
  const aPy = tb ? { left: 60, top: 280, width: 170, textAlign: 'right' } : { left: 70, top: 232, width: 300, textAlign: 'center' };
  const bPy = tb ? { left: 60, top: 550, width: 170, textAlign: 'right' } : { left: 400, top: 232, width: 300, textAlign: 'center' };
  const bShift = tb ? 'translateY(' + slide * 360 + 'px)' : 'translateX(' + slide * 520 + 'px)';
  const paths = glyphPaths(p.ancient);
  const notes = String(p.notes || '').split(';;').filter(Boolean).map((s) => { const a = s.split('|'); return { t: Number(a[0]) * fps, zh: a[1] || '', py: a[2] || '', en: a[3] || '' }; });
  const related = String(p.related || '').split(';;').filter(Boolean).map((s) => s.split('|'));
  const tRel = F(p.tRelated);
  const tEx = F(p.tExtra);
  const relO = tRel >= 0 && related.length ? ease(f, tRel, tRel + 15, 0, 1) : 0;
  const exO = tEx >= 0 && p.extra ? ease(f, tEx, tEx + 15, 0, 1) : 0;
  const head = ease(f, 0, 15, 0, 1);
  const box = { position: 'absolute', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontWeight: 700 };
  const pyStyle = { position: 'absolute', fontSize: 46, fontFamily: PYF };
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: BG, fontFamily: 'Noto Serif SC, Songti SC, serif' }}>
      {header({ zh: p.label, py: p.labelPy, en: p.labelEn, o: head })}
      <div style={{ position: 'absolute', left: 100, top: 150, width: 800, height: 730 }}>
        <div style={{ position: 'absolute', left: 150, top: 110, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,47,51,0.10) 0%, rgba(43,47,51,0) 70%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 20, textAlign: 'center', fontSize: 76, color: SEAL, fontFamily: PYF, opacity: Math.max(fullO, 0) }}>{p.pinyin || ''}</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontSize: 360, lineHeight: 1.1, color: INK, fontWeight: 700, opacity: fullO }}>{p.hanzi || ''}</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', fontSize: 40, color: SUB, fontStyle: 'italic', fontFamily: ENF, opacity: fullO * (1 - formulaO) }}>{p.meaning || ''}</div>
        <div style={{ position: 'absolute', left: 200, top: 120, width: 400, height: 400, opacity: ancO, transform: 'rotate(' + rot + 'deg)' }}>
          <svg width="400" height="400" viewBox="0 0 400 400">
            {paths.map((d, i) => <path key={i} d={d} fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />)}
            {p.ancient === 'snake' ? <circle cx="186" cy="110" r="9" fill={INK} opacity={draw} /> : null}
          </svg>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 545, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 14, opacity: ancO }}>
          {ruby({ text: '古文字', py: 'gǔ wén zì', size: 34, color: SUB })}
          <div style={{ fontSize: 28, color: SUB, fontFamily: ENF, paddingBottom: 4 }}>ancient form</div>
        </div>
        <div style={Object.assign({}, pyStyle, aPy, { color: QING, opacity: partO })}>{p.partAPy || ''}</div>
        <div style={Object.assign({}, box, { left: aPos.left, top: aPos.top, width: aPos.size, height: aPos.size, fontSize: aPos.size, color: QING, opacity: partO })}>{p.partA || ''}</div>
        <div style={Object.assign({}, box, { left: bPos.left, top: bPos.top, width: bPos.size, height: bPos.size, border: '5px dashed rgba(43,47,51,0.25)', borderRadius: 24, opacity: partO * slotO })} />
        <div style={Object.assign({}, pyStyle, bPy, { color: SEAL, opacity: partO * bO })}>{p.partBPy || ''}</div>
        <div style={Object.assign({}, box, { left: bPos.left, top: bPos.top, width: bPos.size, height: bPos.size, fontSize: bPos.size, color: SEAL, opacity: partO * bO, transform: bShift })}>{p.partB || ''}</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 18, opacity: formulaO }}>
          {ruby({ text: p.partA, py: p.partAPy, size: 64, color: QING, pyColor: QING })}
          <div style={{ fontSize: 56, color: SUB }}>+</div>
          {ruby({ text: p.partB, py: p.partBPy, size: 64, color: SEAL, pyColor: SEAL })}
          <div style={{ fontSize: 56, color: SUB }}>→</div>
          {ruby({ text: p.hanzi, py: p.pinyin, size: 64, weight: 700 })}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 960, top: 160, width: 620, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {notes.map((n, i) => {
          const o = ease(f, n.t, n.t + 14, 0, 1);
          return (
            <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', opacity: o, transform: 'translateY(' + (1 - o) * 20 + 'px)' }}>
              <div style={{ width: 14, height: 14, marginTop: 34, borderRadius: 7, background: SEAL, flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ruby({ text: n.zh, py: n.py, size: 34 })}
                <div style={{ fontSize: 25, lineHeight: 1.3, color: SUB, fontFamily: ENF }}>{n.en}</div>
              </div>
            </div>
          );
        })}
        <div style={{ opacity: relO, transform: 'translateY(' + (1 - relO) * 20 + 'px)', display: related.length ? 'flex' : 'none', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            {ruby({ text: p.relatedLabel, py: p.relatedLabelPy, size: 30, color: SUB })}
            <div style={{ fontSize: 23, color: SUB, fontFamily: ENF, paddingBottom: 3 }}>{p.relatedLabelEn || ''}</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {related.map((r, i) => {
              const o = tRel >= 0 ? ease(f, tRel + i * 12, tRel + i * 12 + 12, 0, 1) : 0;
              return (
                <div key={i} style={{ width: 118, height: 128, borderRadius: 16, background: 'rgba(255,255,255,0.6)', border: '3px solid ' + QING, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: o, transform: 'scale(' + (0.8 + 0.2 * o) + ')' }}>
                  <div style={{ fontSize: 24, color: QING, fontFamily: PYF }}>{r[1] || ''}</div>
                  <div style={{ fontSize: 60, lineHeight: 1.1, color: INK }}>{r[0]}</div>
                  <div style={{ fontSize: 19, color: SUB, fontFamily: ENF, fontStyle: 'italic' }}>{r[2] || ''}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ opacity: exO, transform: 'translateY(' + (1 - exO) * 20 + 'px)', display: p.extra ? 'flex' : 'none', alignSelf: 'flex-start', flexDirection: 'column', gap: 4, maxWidth: 560, padding: '8px 26px 10px', border: '4px solid ' + SEAL, borderRadius: 14, background: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
          {ruby({ text: p.extra, py: p.extraPy, size: 46, color: SEAL, pyColor: SEAL, weight: 700 })}
          <div style={{ fontSize: 23, color: SUB, fontFamily: ENF }}>{p.extraEn || ''}</div>
        </div>
      </div>
    </div>
  );
}
