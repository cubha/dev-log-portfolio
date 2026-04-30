'use client'

import { useEffect } from 'react'
import { animate, useMotionValue, useTransform, motion } from 'framer-motion'
import { CursorGlow } from '@/src/components/common/CursorGlow'

export function HeroSection() {
  const progress = useMotionValue(0)
  const effWidth = useTransform(progress, [0, 100], ['0%', '60%'])
  const qualWidth = useTransform(progress, [0, 100], ['0%', '40%'])

  useEffect(() => {
    const t = setTimeout(() => {
      animate(progress, 100, { duration: 1.8, ease: [0.4, 0, 0.2, 1] })
    }, 500)
    return () => clearTimeout(t)
  }, [progress])

  return (
    <section
      style={{
        padding: 'clamp(80px, 8vw, 120px) clamp(20px, 5.5vw, 80px)',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CursorGlow />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-context" style={{ marginBottom: 72 }}>
          PORTFOLIO · 2026 EDITION ─────────────
        </div>

        <div style={{ maxWidth: 1180 }}>
          {/* Heading — 위젯 없이 순수 2-line */}
          <h1 style={{ margin: '0 0 32px', fontFamily: "'Pretendard Variable', 'Pretendard', system-ui, sans-serif" }}>
            <span className="metallic" style={{ display: 'block', lineHeight: 1.1, fontWeight: 700, fontSize: 'clamp(48px, 4.8vw, 68px)', letterSpacing: '-0.04em' }}>
              속도로 얻은 여유를, 완성도에 투자하는
            </span>
            <span style={{ display: 'block', lineHeight: 1.0, marginTop: 28 }}>
              <span className="text-muted" style={{ fontWeight: 400, fontSize: 'clamp(40px, 4.2vw, 60px)', letterSpacing: '-0.03em', marginRight: 14 }}>개발자</span>
              <span className="metallic" style={{ fontWeight: 700, fontSize: 'clamp(88px, 10vw, 144px)', letterSpacing: '-0.05em' }}>은승호</span>
              <span className="text-muted" style={{ fontWeight: 400, fontSize: 'clamp(40px, 4.2vw, 60px)', letterSpacing: '-0.03em', marginLeft: 14 }}>입니다.</span>
            </span>
          </h1>

          {/* Full-Width Split Bar */}
          <div style={{ marginTop: 48, marginBottom: 40 }}>
            <div style={{ display: 'flex', gap: 3, height: 10, marginBottom: 12 }}>
              <motion.div style={{ width: effWidth, height: 10, background: 'var(--accent)', flexShrink: 0 }} />
              <motion.div style={{ width: qualWidth, height: 10, background: 'var(--border-strong)', flexShrink: 0 }} />
            </div>
            <div
              className="sv-mono text-subtle"
              style={{ fontSize: 10, letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}
            >
              <span>EFFICIENCY · 60%</span>
              <span>BUFFER · PHILOSOPHY · 40%</span>
            </div>
          </div>

          <p className="text-muted sv-mono" style={{ fontSize: 13, letterSpacing: '0.02em', marginBottom: 36 }}>
            FULL-STACK DEVELOPER &nbsp;·&nbsp; NEXT.JS &nbsp;·&nbsp; TYPESCRIPT &nbsp;·&nbsp; SUPABASE
          </p>

        </div>
      </div>
    </section>
  )
}
