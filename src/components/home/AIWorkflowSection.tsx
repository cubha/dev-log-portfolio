const STEPS = [
  {
    n: '01',
    en: 'Context Injection',
    ko: '맥락의 주입과 정렬',
    body: '프로젝트의 아키텍처, 제약사항, 코딩 스타일, 도메인 지식을 AI에 사전 학습시켜 개발 방향성을 명확히 합니다.',
  },
  {
    n: '02',
    en: 'Phased Development',
    ko: '단계별 점진적 개발',
    body: '문제를 작은 단위로 분해하여 각 단계마다 AI와 함께 설계·구현·검증을 반복. 매 단계 산출물이 독립적으로 안정.',
  },
  {
    n: '03',
    en: 'Spec-driven Verification',
    ko: '명세 기반 검증',
    body: '작성한 코드를 기계적으로 검증하는 절차. AI가 속도를 내더라도 품질이 흔들리지 않도록 스펙이 가드레일을 만듭니다.',
  },
]

export function AIWorkflowSection() {
  return (
    <section
      style={{
        padding: 'clamp(60px, 7vw, 100px) clamp(20px, 5.5vw, 80px) clamp(80px, 9vw, 140px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="sv-eyebrow" style={{ marginBottom: 40 }}>
        01 ──── AI COLLABORATION PROTOCOL
      </div>

      <h2
        className="h-section metallic"
        style={{ margin: '0 0 22px', maxWidth: 900 }}
      >
        The Assembly Line
      </h2>

      <p
        className="text-muted"
        style={{ fontSize: 18, letterSpacing: '-0.01em', maxWidth: 700, marginBottom: 80, lineHeight: 1.6 }}
      >
        AI와 함께하는 3단계 정밀 공정.{' '}
        <span style={{ color: 'var(--fg)' }}>각 단계는 독립적으로 검증 가능</span>하며,
        코드 품질을 점진적으로 누적시킵니다.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="card"
            style={{
              padding: '36px 32px 40px',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="sv-mono"
              style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: 28, position: 'relative', zIndex: 1 }}
            >
              STEP {s.n}
            </div>
            <div className="h-3" style={{ marginBottom: 6, position: 'relative', zIndex: 1 }}>
              {s.en}
            </div>
            <div
              className="text-muted sv-mono"
              style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 18, textTransform: 'uppercase', position: 'relative', zIndex: 1 }}
            >
              {s.ko}
            </div>
            <div
              className="text-muted"
              style={{ fontSize: 14, lineHeight: 1.65, position: 'relative', zIndex: 1 }}
            >
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
