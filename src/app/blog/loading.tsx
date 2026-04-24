const px = 'clamp(20px, 5.5vw, 80px)'

export default function BlogLoading() {
  return (
    <main>
      {/* PageHeader */}
      <section style={{ padding: `72px ${px} 40px`, borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: 240, height: 11, marginBottom: 40 }} />
        <div className="skeleton" style={{ width: '65%', height: 'clamp(32px, 4.4vw, 64px)', borderRadius: 6 }} />
      </section>

      {/* Blog list — row-link 스타일로 미러링 */}
      <section style={{ padding: `0 ${px} clamp(80px, 9vw, 140px)` }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              borderTop: '1px solid var(--border)',
              padding: '28px 0',
              display: 'grid',
              gridTemplateColumns: 'clamp(100px,9.7vw,140px) 1fr clamp(80px,8.3vw,120px)',
              gap: 24,
              alignItems: 'center',
            }}
          >
            {/* 날짜 */}
            <div className="skeleton" style={{ width: 64, height: 11 }} />
            {/* 제목 + 태그 */}
            <div>
              <div className="skeleton" style={{ width: `${[72, 60, 80, 65, 55][i - 1]}%`, height: 16, marginBottom: 12 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="skeleton" style={{ width: 52, height: 22, borderRadius: 999 }} />
                <div className="skeleton" style={{ width: 64, height: 22, borderRadius: 999 }} />
              </div>
            </div>
            {/* MIN READ */}
            <div className="skeleton" style={{ width: 56, height: 11, justifySelf: 'end' }} />
          </div>
        ))}
      </section>
    </main>
  )
}
