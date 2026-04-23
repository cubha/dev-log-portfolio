'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { List, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import type { AdjacentPost, PostSummary } from '@/src/utils/blog/getBlogPosts'

const ITEMS_PER_PAGE = 10

interface PostNavigationProps {
  prev: AdjacentPost | null
  next: AdjacentPost | null
  allPosts: PostSummary[]
  currentSlug: string
}

export const PostNavigation = ({ prev, next, allPosts, currentSlug }: PostNavigationProps) => {
  const router = useRouter()
  const currentIndex = allPosts.findIndex((p) => p.slug === currentSlug)
  const initialPage = currentIndex >= 0 ? Math.floor(currentIndex / ITEMS_PER_PAGE) : 0

  const [isOpen, setIsOpen] = useState(true)
  const [page, setPage] = useState(initialPage)
  const currentItemRef = useRef<HTMLAnchorElement>(null)
  const userToggledRef = useRef(false)

  const totalPages = Math.ceil(allPosts.length / ITEMS_PER_PAGE)
  const visiblePosts = allPosts.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  useEffect(() => {
    if (!userToggledRef.current) return
    if (isOpen && currentItemRef.current) {
      const timer = setTimeout(() => {
        currentItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      const isEditable = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement).isContentEditable
      if (isEditable) return
      if (e.key === 'ArrowLeft' && prev) { e.preventDefault(); router.push(`/blog/${prev.slug}`) }
      else if (e.key === 'ArrowRight' && next) { e.preventDefault(); router.push(`/blog/${next.slug}`) }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [prev, next, router])

  return (
    <nav aria-label="포스트 탐색" style={{ marginTop: 72, borderTop: '1px solid var(--border)', paddingTop: 32 }}>
      {/* 전체 글 목록 아코디언 */}
      {allPosts.length > 0 && (
        <div style={{ border: '1px solid var(--border)', marginBottom: 32 }}>
          <button
            type="button"
            onClick={() => { userToggledRef.current = true; setIsOpen((o) => !o) }}
            aria-expanded={isOpen}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--fg-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <List style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span className="sv-mono" style={{ fontSize: 11, letterSpacing: '0.1em' }}>전체 글 목록</span>
              <span className="sv-mono" style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>
                ({currentIndex >= 0 ? currentIndex + 1 : '-'}/{allPosts.length})
              </span>
            </div>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown style={{ width: 14, height: 14 }} />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {visiblePosts.map((post, idx) => {
                    const realIndex = page * ITEMS_PER_PAGE + idx
                    const isCurrent = post.slug === currentSlug
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        ref={isCurrent ? currentItemRef : undefined}
                        aria-current={isCurrent ? 'page' : undefined}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 16px',
                          fontSize: 13,
                          textDecoration: 'none',
                          color: isCurrent ? 'var(--fg)' : 'var(--fg-muted)',
                          borderLeft: `2px solid ${isCurrent ? 'var(--accent)' : 'transparent'}`,
                          background: isCurrent ? 'var(--accent-dim)' : 'none',
                          transition: 'background 0.15s',
                        }}
                      >
                        <span className="sv-mono" style={{ fontSize: 10, width: 20, flexShrink: 0, color: 'var(--fg-subtle)' }}>
                          {realIndex + 1}
                        </span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isCurrent ? 500 : 400 }}>
                          {post.title}
                        </span>
                        {post.published_at && (
                          <span className="sv-mono" style={{ fontSize: 10, color: 'var(--fg-subtle)', flexShrink: 0 }}>
                            {format(new Date(post.published_at), 'yyyy.MM')}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', opacity: page === 0 ? 0.3 : 1 }}
                      aria-label="이전 페이지"
                    >
                      <ChevronLeft style={{ width: 14, height: 14 }} />
                    </button>
                    <span className="sv-mono" style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', opacity: page === totalPages - 1 ? 0.3 : 1 }}
                      aria-label="다음 페이지"
                    >
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 이전/다음글 */}
      {(prev || next) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {prev ? (
            <Link href={`/blog/${prev.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="sv-label" style={{ marginBottom: 10 }}>← PREVIOUS</div>
              <div className="h-4" style={{ lineHeight: 1.4 }}>{prev.title}</div>
            </Link>
          ) : <div />}
          {next && (
            <Link href={`/blog/${next.slug}`} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'right' }}>
              <div className="sv-label" style={{ marginBottom: 10 }}>NEXT →</div>
              <div className="h-4" style={{ lineHeight: 1.4 }}>{next.title}</div>
            </Link>
          )}
        </div>
      )}

      {(prev || next) && (
        <p className="sv-mono" style={{ textAlign: 'center', fontSize: 10, color: 'var(--fg-subtle)', marginTop: 20, letterSpacing: '0.1em' }} aria-hidden="true">
          {prev && '←'} ARROW KEYS TO NAVIGATE {next && '→'}
        </p>
      )}
    </nav>
  )
}
