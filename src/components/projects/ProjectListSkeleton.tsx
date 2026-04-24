const px = 'clamp(20px, 5.5vw, 80px)'

export function ProjectListSkeleton() {
  return (
    <>
      {/* PageHeader 스켈레톤 */}
      <section style={{ padding: `72px ${px} 40px`, borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: 250, height: 11, marginBottom: 40 }} />
        <div className="skeleton" style={{ width: '68%', height: 'clamp(32px, 4.4vw, 64px)', borderRadius: 6, marginBottom: 16 }} />
        <div className="skeleton" style={{ width: '30%', height: 13, borderRadius: 4 }} />
      </section>

      {/* 필터바 + 카드 그리드 */}
      <section style={{
        padding: `clamp(60px, 6vw, 96px) ${px} clamp(80px, 9vw, 140px)`,
        borderTop: '1px solid var(--border)',
      }}>
        {/* 필터 태그 + 검색 스켈레톤 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '18px 0',
          marginBottom: 32,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[48, 60, 72, 52].map((w, i) => (
              <div key={i} className="skeleton" style={{ width: w, height: 30, borderRadius: 999 }} />
            ))}
          </div>
          <div className="skeleton" style={{ width: 'clamp(140px, 16vw, 220px)', height: 30, borderRadius: 4 }} />
        </div>

        {/* 카드 그리드 — auto-fit minmax(280px, 1fr) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {/* 썸네일 */}
              <div className="skeleton" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 0 }} />
              {/* 카드 내용 */}
              <div style={{ padding: 20 }}>
                <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: '95%', height: 13, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: '60%', height: 13, marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 999 }} />
                  <div className="skeleton" style={{ width: 72, height: 24, borderRadius: 999 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
