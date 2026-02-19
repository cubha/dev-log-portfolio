'use client'

import { useAtom } from 'jotai'
import { selectedProjectAtom } from '@/src/store/projectAtom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Github, ExternalLink, Calendar, FolderKanban, Code } from 'lucide-react'
import { Database } from '@/src/types/supabase'
import { useEffect } from 'react'
import { getTechIcon } from '@/src/utils/techIcons'

type Project = Database['public']['Tables']['projects']['Row']

/**
 * 프로젝트 상세 모달 컴포넌트
 * 
 * 프로젝트 카드 클릭 시 상세 정보를 모달 형태로 표시합니다.
 * - Framer Motion을 활용한 부드러운 애니메이션
 * - 배경 클릭 또는 X 버튼으로 닫기
 * - 스크롤 가능한 콘텐츠
 */
export function ProjectDetailModal() {
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom)

  // 모달이 열릴 때 body 스크롤 비활성화
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [selectedProject, setSelectedProject])

  const handleClose = () => {
    setSelectedProject(null)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <AnimatePresence mode="wait">
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* 닫기 버튼 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-foreground/10 transition-colors group"
              aria-label="모달 닫기"
            >
              <X className="w-6 h-6 text-foreground/60 group-hover:text-foreground" />
            </button>

            {/* 스크롤 가능한 콘텐츠 */}
            <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
              {/* 썸네일 이미지 - 더 크게 */}
              {selectedProject.thumbnail_url ? (
                <div className="relative w-full h-80 bg-foreground/10">
                  <Image
                    src={selectedProject.thumbnail_url}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {selectedProject.is_featured && (
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-sm font-bold rounded-full shadow-lg">
                        ⭐ 주요 프로젝트
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-80 bg-foreground/8 flex items-center justify-center">
                  <FolderKanban className="w-24 h-24 text-white opacity-50" />
                </div>
              )}

              {/* 본문 콘텐츠 */}
              <div className="p-8 md:p-10">
                {/* 헤더: 기간 & 회사 정보 */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b-2 border-foreground/10">
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                  {selectedProject.title}
                </h2>

                {/* 카테고리 배지 */}
                {selectedProject.category && (
                  <div className="mb-6">
                    <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-secondary text-sm font-semibold rounded-full">
                      {selectedProject.category} 프로젝트
                    </span>
                  </div>
                )}

                {/* 프로젝트 정보 리스트 */}
                <div className="mb-8 space-y-4 bg-foreground/5 p-6 rounded-xl border border-foreground/10">
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
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
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
                {(selectedProject.github_url || selectedProject.link_url) && (
                  <div className="flex flex-wrap gap-4 pt-6 border-t border-foreground/10">
                    {selectedProject.link_url && (
                      <a
                        href={selectedProject.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-silver-metal animate-shine text-white dark:text-slate-950 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>라이브 데모 보기</span>
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                      >
                        <Github className="w-5 h-5" />
                        <span>GitHub 저장소</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * 날짜 포맷팅 함수 (짧은 형식)
 * ISO 날짜 문자열을 "YYYY.MM" 형식으로 변환합니다.
 */
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

/**
 * 날짜 포맷팅 함수 (긴 형식)
 * ISO 날짜 문자열을 "YYYY년 M월" 형식으로 변환합니다.
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    })
  } catch {
    return dateString
  }
}

/**
 * 프로젝트 진행 기간 계산 (개월 수)
 */
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
    const totalMonths = yearDiff * 12 + monthDiff + 1 // +1은 시작 월 포함

    return Math.max(1, totalMonths)
  } catch {
    return 0
  }
}

/**
 * 팀 규모 포맷팅 함수
 * 특수 값들을 범위로 표시합니다.
 */
function formatTeamSize(teamSize: number | null): string {
  if (teamSize === null || teamSize === undefined) return '-'
  
  switch (teamSize) {
    case 0:
      return 'O (0~9명)'
    case 10:
      return 'OO (10~99명)'
    case 100:
      return 'OOO (100명 이상)'
    default:
      return `총 ${teamSize}명`
  }
}
