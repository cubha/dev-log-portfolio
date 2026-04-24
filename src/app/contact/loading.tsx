const px = 'clamp(20px, 5.5vw, 80px)'

export default function ContactLoading() {
  return (
    <main>
      {/* PageHeader */}
      <section style={{ padding: `72px ${px} 40px`, borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: 200, height: 11, marginBottom: 40 }} />
        <div className="skeleton" style={{ width: '60%', height: 'clamp(32px, 4.4vw, 64px)', borderRadius: 6 }} />
      </section>

      {/* ContactInfo + LiveStatus row */}
      <section style={{ padding: `clamp(48px, 6vw, 80px) ${px}`, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr clamp(200px,25vw,360px)', gap: 'clamp(40px,5.5vw,80px)', alignItems: 'start' }}>
          {/* contact links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skeleton" style={{ width: 80, height: 10, marginBottom: 8 }} />
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '40%', height: 13, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: '60%', height: 11 }} />
                </div>
              </div>
            ))}
          </div>
          {/* Live status widget */}
          <div className="skeleton" style={{ height: 160, borderRadius: 8 }} />
        </div>
      </section>

      {/* Guestbook form */}
      <section style={{ padding: `clamp(48px, 6vw, 80px) ${px}` }}>
        <div className="skeleton" style={{ width: 80, height: 10, marginBottom: 32 }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 6, marginBottom: 24 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="skeleton" style={{ width: 96, height: 36, borderRadius: 2 }} />
        </div>
        {/* Guestbook list stubs */}
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ padding: '20px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 999, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: 100, height: 12, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '75%', height: 13 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
