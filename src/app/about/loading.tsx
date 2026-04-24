const px = 'clamp(20px, 5.5vw, 80px)'

function SkeletonPageHeader() {
  return (
    <section style={{ padding: `72px ${px} 40px`, borderBottom: '1px solid var(--border)' }}>
      <div className="skeleton" style={{ width: 220, height: 11, marginBottom: 40 }} />
      <div className="skeleton" style={{ width: '70%', height: 'clamp(32px, 4.4vw, 64px)', borderRadius: 6 }} />
    </section>
  )
}

export default function AboutLoading() {
  return (
    <main>
      <SkeletonPageHeader />

      {/* Essay — two-col-label-grid × 3 */}
      <section style={{ padding: `clamp(60px, 7vw, 100px) ${px}`, borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: 100, height: 10, marginBottom: 40 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {[['45%', '90%', '80%'], ['50%', '85%', '70%'], ['40%', '92%', '65%']].map(([tw, b1, b2], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'clamp(100px,12.5vw,180px) 1fr', gap: 32 }}>
              <div className="skeleton" style={{ width: tw, height: 15, marginTop: 2 }} />
              <div>
                <div className="skeleton" style={{ width: b1, height: 13, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: b2, height: 13, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '50%', height: 13 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills — chip grid */}
      <section style={{ padding: `clamp(48px, 6vw, 80px) ${px}`, borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: 80, height: 10, marginBottom: 32 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[72, 88, 60, 96, 80, 64, 104, 76, 68, 92].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: w, height: 32, borderRadius: 999 }} />
          ))}
        </div>
      </section>

      {/* Experience timeline rows */}
      <section style={{ padding: `clamp(48px, 6vw, 80px) ${px}` }}>
        <div className="skeleton" style={{ width: 80, height: 10, marginBottom: 32 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: 'clamp(100px,12.5vw,180px) 1fr',
              gap: 32,
              padding: '24px 0',
              borderTop: '1px solid var(--border)',
            }}>
              <div className="skeleton" style={{ width: '60%', height: 12 }} />
              <div>
                <div className="skeleton" style={{ width: '50%', height: 15, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '30%', height: 12 }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
