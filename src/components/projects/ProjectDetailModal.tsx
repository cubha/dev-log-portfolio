'use client'

import { useAtom } from 'jotai'
import { selectedProjectAtom } from '@/src/store/projectAtom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, Loader2, Code } from 'lucide-react'
import { Database } from '@/src/types/supabase'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getTechIcon } from '@/src/utils/techIcons'

type Project = Database['public']['Tables']['projects']['Row']

function toSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-가-힣]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'project'
}

function formatPeriod(p: Project): string {
  const fmt = (d: string | null) => {
    if (!d) return ''
    const [y, m] = d.split('-')
    return `${y}.${m}`
  }
  const start = fmt(p.start_date)
  const end = p.is_ongoing ? '진행중' : fmt(p.end_date)
  return start && end ? `${start} – ${end}` : start || end || '—'
}

export function ProjectDetailModal() {
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom)
  const [showMdxView, setShowMdxView] = useState(false)
  const [mdxHtml, setMdxHtml] = useState<string | null>(null)
  const [mdxLoading, setMdxLoading] = useState(false)

  useEffect(() => {
    setShowMdxView(false)
    setMdxHtml(null)
    setMdxLoading(false)
  }, [selectedProject?.id])

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !selectedProject) return
      if (showMdxView) setShowMdxView(false)
      else setSelectedProject(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedProject, setSelectedProject, showMdxView])

  const handleClose = () => setSelectedProject(null)

  const handleViewDetail = async () => {
    if (!selectedProject) return
    setShowMdxView(true)
    setMdxLoading(true)
    try {
      const res = await fetch(`/api/mdx/${toSlug(selectedProject.title)}`)
      const data = (await res.json()) as { html: string | null }
      setMdxHtml(data.html)
    } catch {
      setMdxHtml(null)
    } finally {
      setMdxLoading(false)
    }
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence mode="wait">
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '64px 16px 32px',
            overflowY: 'auto',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 960,
              background: 'var(--bg)',
              border: '1px solid var(--border-strong)',
              display: 'flex', flexDirection: 'column',
              maxHeight: 'calc(100vh - 96px)',
            }}
          >
            {/* ── 헤더 바 ──────────────────────────────────────────── */}
            <div style={{
              padding: '18px 32px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0,
            }}>
              {showMdxView ? (
                <button
                  onClick={() => setShowMdxView(false)}
                  className="sv-mono text-muted"
                  style={{ fontSize: 11, letterSpacing: '0.14em', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <ArrowLeft style={{ width: 13, height: 13 }} /> BACK TO OVERVIEW
                </button>
              ) : (
                <div className="sv-mono text-subtle" style={{ fontSize: 11, letterSpacing: '0.14em' }}>
                  PROJECT &nbsp;·&nbsp; {(selectedProject.category ?? 'PROJECT').toUpperCase()}
                  &nbsp;·&nbsp; {selectedProject.title.toUpperCase().slice(0, 40)}
                </div>
              )}
              <button
                onClick={handleClose}
                aria-label="닫기"
                style={{ background: 'none', border: 'none', color: 'var(--fg-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 0 0 16px' }}
              >
                ✕
              </button>
            </div>

            {/* ── 콘텐츠 ────────────────────────────────────────────── */}
            <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
              <AnimatePresence mode="wait">
                {showMdxView ? (
                  /* MDX 뷰 */
                  <motion.div
                    key="mdx"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.18 }}
                    style={{ padding: 'clamp(24px, 4vw, 48px) clamp(24px, 5vw, 64px)' }}
                  >
                    {mdxLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
                        <Loader2 style={{ width: 24, height: 24, animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
                      </div>
                    ) : mdxHtml ? (
                      <article className="mdx-modal-content" dangerouslySetInnerHTML={{ __html: mdxHtml }} />
                    ) : (
                      <p className="text-subtle sv-mono" style={{ fontSize: 12, letterSpacing: '0.08em', textAlign: 'center', padding: '80px 0' }}>
                        상세 내용을 불러올 수 없습니다.
                      </p>
                    )}
                  </motion.div>
                ) : (
                  /* 개요 뷰 */
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                    style={{ padding: 'clamp(24px, 4vw, 40px) clamp(24px, 5vw, 64px) clamp(32px, 4vw, 48px)' }}
                  >
                    {/* 배지 */}
                    <div className="sv-mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: 16 }}>
                      {selectedProject.is_featured && '★ FEATURED · '}
                      {selectedProject.category ? `${selectedProject.category.toUpperCase()} 프로젝트` : 'PROJECT'}
                      {selectedProject.is_ongoing && ' · 진행중'}
                    </div>

                    {/* 제목 */}
                    <h2
                      id="modal-title"
                      style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 16px', color: 'var(--fg)' }}
                    >
                      {selectedProject.title}
                    </h2>

                    {/* 히어로 이미지 */}
                    <div style={{
                      height: 240, border: '1px solid var(--border)',
                      background: 'repeating-linear-gradient(135deg, var(--bg-1) 0 12px, var(--bg-2) 12px 24px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 32, position: 'relative', overflow: 'hidden',
                    }}>
                      {selectedProject.thumbnail_url ? (
                        <Image src={selectedProject.thumbnail_url} alt={selectedProject.title} fill style={{ objectFit: 'cover' }} priority />
                      ) : (
                        <span className="sv-mono text-subtle" style={{ fontSize: 11, letterSpacing: '0.12em' }}>[ NO THUMBNAIL ]</span>
                      )}
                    </div>

                    {/* 메타 그리드: PERIOD / ROLE / STATUS */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
                      marginBottom: 32,
                    }}>
                      {[
                        ['PERIOD', formatPeriod(selectedProject)],
                        ['ROLE', selectedProject.project_role || '—'],
                        ['STATUS', selectedProject.is_ongoing ? '진행중' : '완료'],
                      ].map(([k, v], i) => (
                        <div key={i} style={{ padding: '16px 0', paddingLeft: i ? 24 : 0, borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                          <div className="sv-label" style={{ marginBottom: 6 }}>{k}</div>
                          <div className="sv-mono" style={{ fontSize: 13, color: 'var(--fg)' }}>{v}</div>
                        </div>
                      ))}
                    </div>

                    {/* 상세 정보 섹션 */}
                    <div style={{ background: 'var(--bg-1)', padding: '4px 0', marginBottom: 32 }}>

                      {/* 주요 업무 */}
                      {selectedProject.description && (
                        <div style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ flexShrink: 0, width: 80, fontWeight: 700, fontSize: 13, color: 'var(--fg-muted)' }}>주요 업무</div>
                          <p style={{ flex: 1, fontSize: 13, color: 'var(--fg)', lineHeight: 1.75, whiteSpace: 'pre-line', margin: 0 }}>
                            {selectedProject.description}
                          </p>
                        </div>
                      )}

                      {/* 담당 역할 */}
                      {selectedProject.project_role && (
                        <div style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ flexShrink: 0, width: 80, fontWeight: 700, fontSize: 13, color: 'var(--fg-muted)' }}>담당 역할</div>
                          <p style={{ flex: 1, fontSize: 13, color: 'var(--fg)', margin: 0 }}>{selectedProject.project_role}</p>
                        </div>
                      )}

                      {/* 개발 환경 */}
                      {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                        <div style={{ display: 'flex', gap: 16, padding: '16px 20px' }}>
                          <div style={{ flexShrink: 0, width: 80, fontWeight: 700, fontSize: 13, color: 'var(--fg-muted)' }}>개발 환경</div>
                          <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {selectedProject.tech_stack.map((tech, i) => {
                              const iconResult = getTechIcon(tech)
                              return (
                                <span
                                  key={i}
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '4px 10px',
                                    border: '1px solid var(--border)',
                                    fontSize: 12, color: 'var(--fg)',
                                    background: 'var(--bg)',
                                  }}
                                >
                                  {iconResult ? (
                                    <iconResult.icon style={{ width: 14, height: 14, flexShrink: 0, color: iconResult.color }} />
                                  ) : (
                                    <Code style={{ width: 14, height: 14, flexShrink: 0, color: 'var(--fg-subtle)' }} />
                                  )}
                                  {tech}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 상세 내용 (detailed_tasks) */}
                    {selectedProject.detailed_tasks && selectedProject.detailed_tasks.length > 0 && (
                      <div style={{ marginBottom: 32 }}>
                        <div className="sv-label" style={{ marginBottom: 12 }}>상세 내용</div>
                        {selectedProject.detailed_tasks.map((task, i) => (
                          <div key={i} style={{ padding: '12px 0', borderTop: '1px solid var(--border)', display: 'flex', gap: 16 }}>
                            <span className="sv-mono text-subtle" style={{ fontSize: 11, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                            <span style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.65 }}>{task}</span>
                          </div>
                        ))}
                        <div style={{ borderTop: '1px solid var(--border)' }} />
                      </div>
                    )}

                    {/* CTA 버튼 */}
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      {selectedProject.project_type !== 'work' && (
                        <button onClick={handleViewDetail} className="btn btn-primary">
                          상세 보기 <span className="arrow">→</span>
                        </button>
                      )}
                      {selectedProject.live_demo_url && selectedProject.project_type !== 'work' && (
                        <a href={selectedProject.live_demo_url} target="_blank" rel="noopener noreferrer" className="btn">
                          라이브 사이트 <span className="arrow">↗</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
