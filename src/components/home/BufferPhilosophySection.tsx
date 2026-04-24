const BARS = [
  { k: 'Coding × Git', v: 45 },
  { k: 'Refactoring', v: 22 },
  { k: 'Performance Opt.', v: 18 },
  { k: 'Docs & UX Polish', v: 15 },
]

export function BufferPhilosophySection() {
  return (
    <section
      style={{
        paddingTop: 'clamp(60px, 5.5vw, 80px)',
        paddingRight: 'clamp(20px, 5.5vw, 80px)',
        paddingBottom: 'clamp(80px, 9vw, 140px)',
        paddingLeft: 'clamp(20px, 5.5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: 'clamp(240px, 23.6vw, 340px) 1fr',
        gap: 'clamp(40px, 5.5vw, 80px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div>
        <div className="sv-eyebrow" style={{ marginBottom: 28 }}>02 ─── BUFFER PHILOSOPHY</div>
        <h3 className="h-2" style={{ margin: '0 0 28px' }}>
          가속으로 확보한<br />품질 버퍼
        </h3>
        <p className="text-muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
          평상시 80% 운영은 공식입니다. 남은 20%는 테스트·리팩터링·성능 최적화·편집기 개선에 재투자합니다.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 6 }}>
        {BARS.map((b) => (
          <div key={b.k}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div className="sv-mono" style={{ fontSize: 12, letterSpacing: '0.05em' }}>{b.k}</div>
              <div className="sv-mono text-muted" style={{ fontSize: 12 }}>{b.v}%</div>
            </div>
            <div style={{ height: 2, background: 'var(--border)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${b.v}%`, background: 'var(--accent)' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
