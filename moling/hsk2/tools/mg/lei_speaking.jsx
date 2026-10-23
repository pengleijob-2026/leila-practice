// 小课堂模板v2 · 蕾姐讲解头像（墨灵版） ChatCut asset 87e59d4419, 300×270
// photo = 墨灵版头像 476e1866c4，整张显示（含水墨圆框和「蕾」印章），与左下角静态头像同心。
function speakLevel(f) {
  const a = Math.sin(f * 0.71) * 0.5 + 0.5;
  const b = Math.sin(f * 0.37 + 1.3) * 0.5 + 0.5;
  const c = Math.sin(f * 1.13 + 2.1) * 0.5 + 0.5;
  return 0.25 + 0.75 * (0.45 * a + 0.35 * b + 0.2 * c);
}
function LeiSpeaking({ item }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = (item && item.props) || {};
  const INK = '#2b2f33'; const SEAL = '#b8432f';
  const inO = interpolate(f, [0, 7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outO = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vis = Math.min(inO, outO);
  const pop = interpolate(f, [0, 9], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1.4, 0.36, 1) });
  const lvl = speakLevel(f);
  const bob = Math.sin(f * 0.21) * 2;
  const tilt = Math.sin(f * 0.13 + 0.7) * 1.5;
  const breathe = 1 + Math.sin(f * 0.09) * 0.012 + lvl * 0.015;
  const ripples = [0, 1, 2].map(i => ((f + i * 18) % 54) / 54);
  const bars = [0, 1, 2, 3, 4].map(i => {
    const v = Math.sin(f * (0.55 + i * 0.17) + i * 1.7) * 0.5 + 0.5;
    return 5 + 15 * v * lvl;
  });
  return (
    <div style={{ width: 300, height: 270, position: 'relative', opacity: vis }}>
      <svg width="300" height="270" viewBox="0 0 300 270" style={{ position: 'absolute', left: 0, top: 0 }}>
        {ripples.map((t, i) => (
          <circle key={i} cx="150" cy="140" r={100 + t * 30} fill="none" stroke={INK} strokeWidth={3 - 2 * t} strokeOpacity={0.3 * (1 - t)} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 50, top: 40, width: 200, height: 200, transform: 'scale(' + pop + ')' }}>
        <div style={{ width: 200, height: 200, transform: 'translateY(' + bob + 'px) rotate(' + tilt + 'deg) scale(' + breathe + ')' }}>
          {p.photo ? <Img src={p.photo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 97, top: 236, width: 106, height: 28, borderRadius: 14, background: SEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: '0 2px 6px rgba(0,0,0,0.22)' }}>
        {bars.map((h, i) => (
          <div key={i} style={{ width: 5, height: h, borderRadius: 3, background: '#f6f2e9' }} />
        ))}
      </div>
    </div>
  );
}
