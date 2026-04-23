import Link from 'next/link'

const CARDS = [
  {
    key: 'ABOUT',
    href: '/about',
    title: '기술의 변화를 실무의 효율로 전환',
    body: '8년차 풀스택 개발자, AI 협업과 본질적 사고에 투자',
    meta: 'React · TypeScript · Next.js · Java',
  },
  {
    key: 'PROJECTS',
    href: '/projects',
    title: 'Dev Log Portfolio',
    body: 'Next.js 15 App Router 기반 개인 포트폴리오 + 개발 블로그',
    meta: '2026.02 → 진행 중',
  },
  {
    key: 'WRITING',
    href: '/blog',
    title: 'Claude Code Hook으로 만드는 자기학습 시스템',
    body: 'Knowledge & Gotchas 자동 수집 피드백 루프 구축',
    meta: '2026.04.15 · 17분',
  },
  {
    key: 'CONTACT',
    href: '/contact',
    title: '일하러 갈까요?',
    body: 'cubha@naver.com — 새 프로젝트 상담 가능',
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
              <div className="card-arrow" style={{ fontSize: 18 }}>↗</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
