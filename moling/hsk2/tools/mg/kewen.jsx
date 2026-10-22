function KewenCard({ item }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = (item && item.props) || {};
  const mode = String(p.mode || 'line');
  const story = mode === 'story';
  const accent = story ? QING : SEAL;
  const inA = ease(f, 0, 10, 0, 1);
  if (mode === 'title') {
    const sub = ease(f, 12, 26, 0, 1);
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: BG, fontFamily: 'Noto Serif SC, Songti SC, serif' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: inA, transform: 'scale(' + (0.94 + 0.06 * inA) + ')' }}>
          <div style={{ padding: '10px 34px', borderRadius: 8, background: SEAL, color: '#f6f2e9', fontSize: 40, letterSpacing: 6 }}>{p.badge || '课文'}</div>
          <div style={{ marginTop: 40 }}>
            <Ruby text={p.title} py={p.titlePy} size={150} weight={700} align="center" pyColor={SEAL} />
          </div>
          <div style={{ fontSize: 54, color: SUB, fontStyle: 'italic', fontFamily: ENF, marginTop: 20 }}>{p.titleEn || ''}</div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center', opacity: sub }}>
          <div style={{ fontSize: 36, color: INK, fontFamily: ENF }}>{p.note || ''}</div>
        </div>
      </div>
    );
  }
  const idx = Number(p.idx) || 1;
  const total = Number(p.total) || 4;
  const echoF = (Number(p.echoAt) || 0) * fps;
  const echo = echoF > 0 ? ease(f, echoF, echoF + 8, 0, 1) : 0;
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin((f - echoF) / 7));
  const len = Math.max.apply(null, String(p.zh || '').split('|').map((s) => Array.from(s).length));
  const size = len <= 9 ? 92 : len <= 10 ? 84 : len <= 11 ? 76 : 70;
  const dots = [];
  for (let i = 1; i <= total; i++) dots.push(<div key={i} style={{ width: i === idx ? 30 : 12, height: 12, borderRadius: 6, background: i <= idx ? accent : 'rgba(43,47,51,0.18)' }} />);
  const badge = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 24px', marginBottom: 10, borderRadius: 30, background: accent, color: '#f6f2e9' }}>
      <div style={{ fontSize: 30 }}>{story ? '故事里' : '课文'}</div>
      <div style={{ fontSize: 24, fontFamily: ENF }}>{story ? 'In the story' : 'Text'}</div>
    </div>
  );
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: BG, fontFamily: 'Noto Serif SC, Songti SC, serif' }}>
      <Header zh={p.title} py={p.titlePy} en={p.titleEn} o={1} right={badge} />
      <div style={{ position: 'absolute', left: 104, top: 224, width: 772, height: 440, borderRadius: 14, border: '6px solid ' + accent, boxShadow: '0 18px 40px rgba(43,47,51,0.22)', background: '#d9dcd8' }} />
      <div style={{ position: 'absolute', left: 110, top: 690, width: 760, display: 'flex', alignItems: 'center', gap: 12 }}>{dots}</div>
      <div style={{ position: 'absolute', left: 960, right: 100, top: 250, display: 'flex', flexDirection: 'column', opacity: inA, transform: 'translateX(' + (1 - inA) * 30 + 'px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: accent, color: '#f6f2e9', fontSize: 36, fontFamily: ENF, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.role || Array.from(String(p.speaker || '·'))[0]}</div>
          <div style={{ fontSize: 40, color: INK }}>{p.speaker || ''}</div>
        </div>
        <Ruby text={p.zh} py={p.py} size={size} weight={600} hl={p.hl} hlColor={accent} />
        <div style={{ fontSize: 40, color: SUB, fontStyle: 'italic', fontFamily: ENF, marginTop: 24, lineHeight: 1.3 }}>{p.en || ''}</div>
      </div>
      <div style={{ position: 'absolute', left: 960, top: 850, display: 'flex', opacity: echo, transform: 'translateY(' + (1 - echo) * 20 + 'px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 36px', borderRadius: 50, background: QING, color: '#f6f2e9' }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: '#f6f2e9', opacity: pulse }} />
          <Ruby text="跟我读" py="gēn wǒ dú" size={38} color="#f6f2e9" pyColor="#dfe7e4" />
          <div style={{ fontSize: 32, fontFamily: ENF, marginLeft: 6 }}>· Your turn</div>
        </div>
      </div>
    </div>
  );
}
