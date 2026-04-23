'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { animate, useMotionValue, useTransform, motion } from 'framer-motion'
import { CursorGlow } from '@/src/components/common/CursorGlow'

export function HeroSection() {
  const progress = useMotionValue(0)
  const [pct, setPct] = useState(0)
  const effWidth = useTransform(progress, [0, 100], ['0%', '92%'])
  const qualWidth = useTransform(progress, [0, 100], ['0%', '8%'])

  useEffect(() => {
    const unsub = progress.on('change', (v) => setPct(Math.round(v)))
    return unsub
  }, [progress])

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
        justifyContent: 'space-between',
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
          <p
            className="text-muted"
            style={{ fontSize: 20, fontWeight: 400, marginBottom: 36, letterSpacing: '-0.01em', lineHeight: 1.5, maxWidth: 620 }}
          >
            속도와 멈춘 사고력,<br />본질로의 투자라는 경험.
          </p>

          <h1
            className="h-hero metallic"
            style={{ margin: '0 0 28px' }}
          >
            은승호 입니다.
          </h1>

          <p
            className="text-muted sv-mono"
            style={{ fontSize: 13, letterSpacing: '0.02em', marginBottom: 56 }}
          >
            FULL-STACK DEVELOPER &nbsp;·&nbsp; NEXT.JS &nbsp;·&nbsp; TYPESCRIPT &nbsp;·&nbsp; SUPABASE
          </p>

          <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/projects" className="btn btn-primary">
              프로젝트 보기 <span className="arrow">→</span>
            </Link>
            <Link href="/about" className="btn btn-ghost">
              About 더 보기
            </Link>
          </div>
        </div>
      </div>

      {/* Buffer Progress widget */}
      <div
        style={{
          alignSelf: 'flex-end',
          width: 'min(440px, 100%)',
          border: '1px solid var(--border)',
          padding: '20px 22px',
          position: 'relative',
          zIndex: 1,
          marginTop: 60,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <div className="sv-label" style={{ marginBottom: 4 }}>BUFFER · PHILOSOPHY</div>
            <div className="h-4">Efficiency × Quality</div>
          </div>
          <div className="metallic sv-mono" style={{ fontSize: 28, fontWeight: 700 }}>
            {pct}%
          </div>
        </div>

        <div style={{ display: 'flex', gap: 2, marginBottom: 10, height: 4 }}>
          <motion.div style={{ width: effWidth, height: 4, background: 'var(--accent)', flexShrink: 0 }} />
          <motion.div style={{ width: qualWidth, height: 4, background: 'var(--border-strong)', flexShrink: 0 }} />
        </div>

        <div
          className="sv-mono text-subtle"
          style={{ fontSize: 10, letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}
        >
          <span>EFFICIENCY · 92%</span>
          <span>QUALITY BUFFER · 8%</span>
        </div>
      </div>
    </section>
  )
}
