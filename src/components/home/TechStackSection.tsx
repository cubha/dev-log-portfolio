const STACK = [
  'Next.js 15', 'TypeScript', 'Supabase', 'Tailwind CSS',
  'Framer Motion', 'React 19', 'PostgreSQL', 'Vercel',
  'Java / Spring', 'JetBrains Mono',
]

export function TechStackSection() {
  return (
    <section
      style={{
        padding: 'clamp(60px, 5.5vw, 80px) clamp(20px, 5.5vw, 80px) clamp(80px, 8vw, 120px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="sv-eyebrow" style={{ marginBottom: 48 }}>03 ──── TECH STACK</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxWidth: 1100 }}>
        {STACK.map((t) => (
          <span key={t} className="tag" style={{ padding: '10px 18px', fontSize: 13 }}>
            {t}
          </span>
        ))}
      </div>
    </section>
  )
}
