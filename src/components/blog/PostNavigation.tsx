'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, List, ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { AdjacentPost, PostSummary } from '@/src/utils/blog/getBlogPosts'
import { ThemeCard } from '@/src/components/common/ThemeCard'

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

  const totalPages = Math.ceil(allPosts.length / ITEMS_PER_PAGE)
  const visiblePosts = allPosts.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  useEffect(() => {
    if (isOpen && currentItemRef.current) {
      const timer = setTimeout(() => {
        currentItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // 키보드 방향키(← →) 네비게이션 — input/textarea/contenteditable 포커스 중 무시
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      const isEditable = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement).isContentEditable
      if (isEditable) return

      if (e.key === 'ArrowLeft' && prev) {
        e.preventDefault()
        router.push(`/blog/${prev.slug}`)
      } else if (e.key === 'ArrowRight' && next) {
        e.preventDefault()
        router.push(`/blog/${next.slug}`)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [prev, next, router])

  return (
    <nav aria-label="포스트 탐색" className="mt-12 pt-8 border-t border-foreground/10 space-y-3">
      {/* 접이식 글 목록 패널 */}
      {allPosts.length > 0 && (
        <ThemeCard noHoverLift className="overflow-hidden">
          {/* 헤더 토글 버튼 */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-foreground/[0.04] transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2 text-foreground/70">
              <List className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">전체 글 목록</span>
              <span className="text-xs text-foreground/40">
                ({currentIndex >= 0 ? currentIndex + 1 : '-'}/{allPosts.length})
              </span>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ChevronDown className="w-4 h-4 text-foreground/40" />
            </motion.div>
          </button>

          {/* 펼친 목록 */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-foreground/10">
                  {visiblePosts.map((post, idx) => {
                    const realIndex = page * ITEMS_PER_PAGE + idx
                    const isCurrent = post.slug === currentSlug
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        ref={isCurrent ? currentItemRef : undefined}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={`group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 border-l-2 ${
                          isCurrent
                            ? 'bg-foreground/5 border-foreground/40'
                            : 'border-transparent hover:bg-foreground/[0.03] hover:border-foreground/15'
                        }`}
                      >
                        <span
                          className={`text-xs w-5 shrink-0 tabular-nums ${
                            isCurrent ? 'text-foreground/60' : 'text-foreground/30'
                          }`}
                        >
                          {realIndex + 1}
                        </span>
                        <span
                          className={`flex-1 line-clamp-1 ${
                            isCurrent
                              ? 'font-semibold text-foreground'
                              : 'text-foreground/70 group-hover:text-foreground/90'
                          }`}
                        >
                          {post.title}
                        </span>
                        {post.published_at && (
                          <span className="text-xs text-foreground/30 shrink-0">
                            {format(new Date(post.published_at), 'yyyy.MM')}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>

                {/* 페이지네이션 (10개 초과 시만) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 px-4 py-2.5 border-t border-foreground/10">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="p-1 rounded text-foreground/40 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="이전 페이지"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-foreground/40 tabular-nums">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      className="p-1 rounded text-foreground/40 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="다음 페이지"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </ThemeCard>
      )}

      {/* 이전/다음 카드 */}
      {(prev || next) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="이전/다음 글 이동 (← → 방향키 사용 가능)">
          {prev && (
            <Link
              href={`/blog/${prev.slug}`}
              aria-label={`이전 글: ${prev.title}`}
              className={`group flex items-start gap-3 p-4 relative bg-surface rounded-2xl border border-foreground/[0.08] border-rim-light bg-card-surface shadow-sharp transition-all duration-300 hover:border-rim-intense hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30${!next ? ' sm:col-span-2' : ''}`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-silver-metal flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform duration-200" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-foreground/40 block mb-1">이전 글</span>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors line-clamp-2">
                  {prev.title}
                </span>
                {prev.published_at && (
                  <span className="flex items-center gap-1 mt-1.5 text-xs text-foreground/40">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(prev.published_at), 'yyyy년 M월 d일', { locale: ko })}
                  </span>
                )}
              </div>
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              aria-label={`다음 글: ${next.title}`}
              className={`group flex items-start gap-3 p-4 relative bg-surface rounded-2xl border border-foreground/[0.08] border-rim-light bg-card-surface shadow-sharp transition-all duration-300 hover:border-rim-intense hover:-translate-y-0.5 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30${!prev ? ' sm:col-span-2' : ' sm:col-start-2'}`}
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs text-foreground/40 block mb-1">다음 글</span>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors line-clamp-2">
                  {next.title}
                </span>
                {next.published_at && (
                  <span className="flex items-center justify-end gap-1 mt-1.5 text-xs text-foreground/40">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(next.published_at), 'yyyy년 M월 d일', { locale: ko })}
                  </span>
                )}
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-silver-metal flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </Link>
          )}
        </div>
      )}

      {/* 키보드 힌트 */}
      {(prev || next) && (
        <p className="text-center text-xs text-foreground/20 select-none" aria-hidden="true">
          {prev && '←'} 방향키로 글 이동 {next && '→'}
        </p>
      )}
    </nav>
  )
}
