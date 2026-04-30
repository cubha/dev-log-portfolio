import Link from 'next/link'

const CARDS = [
  {
    key: 'ABOUT',
    href: '/about',
    label: 'About 페이지로 이동',
    title: '나를 소개합니다',
    body: '이력 · 기술 스택 · 개발 철학',
    meta: 'React · TypeScript · Next.js · Java',
  },
  {
    key: 'PROJECTS',
    href: '/projects',
    label: 'Projects 페이지로 이동',
    title: '그동안 쌓아온 프로젝트들',
    body: '업무 · 개인 · 팀 프로젝트 이력 모음',
    meta: '8 PROJECTS',
  },
  {
    key: 'WRITING',
    href: '/blog',
    label: 'Writing 페이지로 이동',
    title: '개발 노트 · 기술 기록',
    body: '개발 경험과 기술적 고민',
    meta: 'Dev Notes',
  },
  {
    key: 'CONTACT',
    href: '/contact',
    label: 'Contact 페이지로 이동',
    title: '소통은 언제든 환영입니다',
    body: '인사건네기 · 협업 및 커피챗 문의',
    meta: 'Seoul, KR',
  },
]

export function MenuPreviewSection() {
  return (
    <section
      style={{
        padding: '0 clamp(20px, 5.5vw, 80px) clamp(80px, 9vw, 140px)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {CARDS.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            aria-label={c.label}
            className="card"
            style={{
              padding: '28px 28px 24px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 220,
            }}
          >
            <div className="sv-label" style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
              {c.key}
            </div>
            <div className="h-4" style={{ marginBottom: 12, letterSpacing: '-0.01em', lineHeight: 1.3, position: 'relative', zIndex: 1 }}>
              {c.title}
            </div>
            <div className="text-muted" style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 16, position: 'relative', zIndex: 1 }}>
              {c.body}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div className="sv-mono text-subtle" style={{ fontSize: 10, letterSpacing: '0.08em' }}>{c.meta}</div>
              <div className="card-arrow" aria-hidden="true" style={{ fontSize: 18 }}>↗</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
