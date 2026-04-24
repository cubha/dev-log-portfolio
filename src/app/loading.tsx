const px = 'clamp(20px, 5.5vw, 80px)'

export default function RootLoading() {
  return (
    <main>
      {/* Hero — 뷰포트 전체 높이, 하단 고정 레이블 */}
      <section style={{
        minHeight: '100vh',
        padding: `clamp(80px, 12vh, 140px) ${px} 0`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 'clamp(32px, 6vw, 72px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* eyebrow */}
        <div className="skeleton" style={{ width: 180, height: 12, marginBottom: 48 }} />
        {/* hero heading lines */}
        <div className="skeleton" style={{ width: '62%', height: 'clamp(44px, 7vw, 96px)', borderRadius: 8, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '45%', height: 'clamp(44px, 7vw, 96px)', borderRadius: 8, marginBottom: 48 }} />
        {/* CTA row */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="skeleton" style={{ width: 140, height: 46, borderRadius: 2 }} />
          <div className="skeleton" style={{ width: 110, height: 46, borderRadius: 2 }} />
        </div>
      </section>

      {/* Menu preview — 3 card stubs */}
      <section style={{ padding: `clamp(60px, 8vw, 120px) ${px}`, borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: 140, height: 11, marginBottom: 40 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 2 }} />
          ))}
        </div>
      </section>

      {/* Footer spacer */}
      <section style={{ padding: `clamp(48px, 6vw, 80px) ${px}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton" style={{ width: '55%', height: 40, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: '35%', height: 20 }} />
        </div>
      </section>
    </main>
  )
}
