'use client'

import { useAtom } from 'jotai'
import { selectedProjectAtom } from '@/src/store/projectAtom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ExternalLink, Calendar, FolderKanban, Code, FileText, ArrowLeft, Loader2 } from 'lucide-react'
import { Database } from '@/src/types/supabase'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getTechIcon } from '@/src/utils/techIcons'
import { StatusBadge } from '@/src/components/common/StatusBadge'
type Project = Database['public']['Tables']['projects']['Row']

/** 프로젝트 제목 → slug 변환 */
function toSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-가-힣]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'project'
}

/**
 * 프로젝트 상세 모달 컴포넌트
 *
 * - 개요 뷰: 프로젝트 메타 정보 (기간, 기술스택 등)
 * - MDX 뷰: "상세 보기" 클릭 시 MDX 콘텐츠 인라인 렌더링 (페이지 이동 없음)
 * - ESC: MDX 뷰에서는 개요로 복귀, 개요에서는 모달 닫기
 */
export function ProjectDetailModal() {
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom)
  const [showMdxView, setShowMdxView] = useState(false)
  const [mdxHtml, setMdxHtml] = useState<string | null>(null)
  const [mdxLoading, setMdxLoading] = useState(false)

  // 프로젝트 변경 시 MDX 뷰 초기화
  useEffect(() => {
    setShowMdxView(false)
    setMdxHtml(null)
    setMdxLoading(false)
  }, [selectedProject?.id])

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedProject])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !selectedProject) return
      if (showMdxView) {
        setShowMdxView(false)
      } else {
        setSelectedProject(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [selectedProject, setSelectedProject, showMdxView])

  const handleClose = () => setSelectedProject(null)

  const handleViewDetail = async () => {
    if (!selectedProject) return
    const slug = toSlug(selectedProject.title)
    setShowMdxView(true)
    setMdxLoading(true)
    try {
      const res = await fetch(`/api/mdx/${slug}`)
      const data = (await res.json()) as { html: string | null }
      setMdxHtml(data.html)
    } catch {
      setMdxHtml(null)
    } finally {
      setMdxLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose()
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
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] bg-background rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* 닫기 버튼 */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 p-2 bg-background/95 rounded-full shadow-md hover:bg-foreground/10 transition-colors group"
              aria-label="모달 닫기"
            >
              <X className="w-5 h-5 text-foreground/60 group-hover:text-foreground" />
            </button>

            <AnimatePresence mode="wait">
              {showMdxView ? (
                /* ── MDX 상세 뷰 ── */
                <motion.div
                  key="mdx-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* MDX 뷰 헤더 */}
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-foreground/10 flex-shrink-0">
                    <button
                      onClick={() => setShowMdxView(false)}
                      className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors flex-shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>돌아가기</span>
                    </button>
                    <span className="text-foreground/20">|</span>
                    <h2
                      id="modal-title"
                      className="text-sm font-semibold text-foreground truncate pr-10"
                    >
                      {selectedProject.title}
                    </h2>
                  </div>

                  {/* MDX 콘텐츠 */}
                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-5 py-6 md:px-6">
                    {mdxLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin text-brand-secondary" />
                      </div>
                    ) : mdxHtml ? (
                      <article
                        className="mdx-modal-content"
                        dangerouslySetInnerHTML={{ __html: mdxHtml }}
                      />
                    ) : (
                      <div className="text-center py-20 text-foreground/40 text-sm">
                        상세 내용을 불러올 수 없습니다.
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* ── 프로젝트 개요 뷰 ── */
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-h-0 overflow-y-auto custom-scrollbar"
                >
                  {/* 썸네일 */}
                  {selectedProject.thumbnail_url ? (
                    <div className="relative w-full h-48 bg-foreground/10 flex-shrink-0">
                      <Image
                        src={selectedProject.thumbnail_url}
                        alt={selectedProject.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      {selectedProject.is_featured && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold rounded-full shadow-md">
                            ⭐ 주요
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-foreground/8 flex items-center justify-center">
                      <FolderKanban className="w-16 h-16 text-foreground/30" />
                    </div>
                  )}

                  {/* 본문 */}
                  <div className="p-5 md:p-6">
                    {/* 헤더: 기간 & 회사 정보 */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-foreground/10">
                      {/* 좌측: 진행 기간 & 총 개월 수 */}
                      <div className="flex items-center gap-3">
                        {(selectedProject.start_date || selectedProject.end_date) && (
                          <>
                            <Calendar className="w-5 h-5 text-brand-secondary" />
                            <div>
                              <div className="text-lg font-bold text-foreground">
                                {selectedProject.start_date && formatDateShort(selectedProject.start_date)}
                                {' - '}
                                {selectedProject.is_ongoing
                                  ? '진행중'
                                  : selectedProject.end_date && formatDateShort(selectedProject.end_date)}
                              </div>
                              <div className="text-sm text-foreground/60">
                                총 {calculateMonthDuration(selectedProject.start_date, selectedProject.end_date, selectedProject.is_ongoing)}개월
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* 우측: 회사명 & 역할 */}
                      {(selectedProject.company_name || selectedProject.project_role) && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">
                            {selectedProject.company_name || '-'}
                          </div>
                          {selectedProject.project_role && (
                            <div className="text-sm text-brand-secondary font-semibold">
                              {selectedProject.project_role}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 프로젝트 제목 */}
                    <h2 id="modal-title" className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
                      {selectedProject.title}
                    </h2>

                    {/* 카테고리 배지 */}
                    {selectedProject.category && (
                      <div className="mb-4">
                        <StatusBadge size="md">
                          {selectedProject.category} 프로젝트
                        </StatusBadge>
                      </div>
                    )}

                    {/* 프로젝트 정보 리스트 */}
                    <div className="mb-6 space-y-3 bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                      {/* 주요 업무 */}
                      {selectedProject.description && (
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-28 font-bold text-foreground/70 text-sm">
                            주요 업무
                          </div>
                          <div className="flex-1 text-foreground text-sm leading-relaxed whitespace-pre-line">
                            {selectedProject.description}
                          </div>
                        </div>
                      )}

                      {/* 담당 역할 */}
                      {selectedProject.project_role && (
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-28 font-bold text-foreground/70 text-sm">
                            담당 역할
                          </div>
                          <div className="flex-1 text-foreground text-sm">
                            {selectedProject.project_role}
                          </div>
                        </div>
                      )}

                      {/* 개발 환경 (기술 스택) */}
                      {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-28 font-bold text-foreground/70 text-sm">
                            개발 환경
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.tech_stack.map((tech, index) => {
                                const iconResult = getTechIcon(tech)
                                return (
                                  <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-background border border-foreground/10 text-foreground/80 text-xs font-semibold rounded-lg shadow-sm hover:shadow-md hover:border-brand-primary/40 transition-all"
                                  >
                                    {iconResult ? (
                                      <iconResult.icon
                                        className="w-4 h-4 flex-shrink-0"
                                        style={{ color: iconResult.color }}
                                      />
                                    ) : (
                                      <Code className="w-4 h-4 flex-shrink-0 text-foreground/40" />
                                    )}
                                    <span>{tech}</span>
                                  </motion.span>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 진행 인원 */}
                      {selectedProject.team_size !== null && selectedProject.team_size !== undefined && (
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-28 font-bold text-foreground/70 text-sm">
                            진행 인원
                          </div>
                          <div className="flex-1 text-foreground text-sm">
                            {formatTeamSize(selectedProject.team_size)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 상세 내용 섹션 */}
                    {selectedProject.detailed_tasks && selectedProject.detailed_tasks.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                          <span className="w-1 h-6 bg-foreground/30 rounded-full"></span>
                          상세 내용
                        </h3>
                        <div className="space-y-2.5 pl-2">
                          {selectedProject.detailed_tasks.map((task, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex gap-3 items-start group"
                            >
                              <span className="text-brand-secondary font-bold text-base mt-0.5 group-hover:text-foreground transition-colors">
                                &gt;&gt;
                              </span>
                              <span className="text-foreground/90 text-base leading-relaxed flex-1">
                                {task}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 링크 버튼들 */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-foreground/10">
                      {selectedProject.project_type !== 'work' && (
                        <button
                          onClick={handleViewDetail}
                          className="flex items-center gap-2 px-4 py-2.5 bg-brand-secondary text-white dark:text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                        >
                          <FileText className="w-4 h-4" />
                          <span>상세 보기</span>
                        </button>
                      )}
                      {selectedProject.project_type !== 'work' && selectedProject.live_demo_url && (
                        <a
                          href={selectedProject.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-silver-metal animate-shine text-white dark:text-slate-950 text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>LIVE DEMO</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

function formatDateShort(dateString: string | null): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}.${month}`
  } catch {
    return dateString
  }
}

function calculateMonthDuration(
  startDate: string | null,
  endDate: string | null,
  isOngoing: boolean | null
): number {
  if (!startDate) return 0
  try {
    const start = new Date(startDate)
    const end = isOngoing || !endDate ? new Date() : new Date(endDate)
    const yearDiff = end.getFullYear() - start.getFullYear()
    const monthDiff = end.getMonth() - start.getMonth()
    return Math.max(1, yearDiff * 12 + monthDiff + 1)
  } catch {
    return 0
  }
}

function formatTeamSize(teamSize: number | null): string {
  if (teamSize === null || teamSize === undefined) return '-'
  switch (teamSize) {
    case 0: return 'O (0~9명)'
    case 10: return 'OO (10~99명)'
    case 100: return 'OOO (100명 이상)'
    default: return `총 ${teamSize}명`
  }
}
