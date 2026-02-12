'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { Database } from '@/src/types/supabase'
import { Plus } from 'lucide-react'
import { useAtom, useAtomValue } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import { projectFilterAtom, FILTER_OPTIONS, type ProjectFilter } from '@/src/store/filterAtom'
import { ProjectCard } from './ProjectCard'
import { ProjectDetailModal } from './ProjectDetailModal'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'

type Project = Database['public']['Tables']['projects']['Row']

// 슬라이더 설정 상수
const CARD_WIDTH = 350 // 각 카드의 너비 (px)
const CARD_HEIGHT = 400 // 각 카드의 높이 (px)
const CARD_GAP = 20 // 카드 간 간격 (px)
const CARDS_PER_VIEW = 3 // 한 화면에 보이는 중앙 카드 수
const PEEK_RATIO = 0.18 // 양옆 피크 카드 노출 비율
const PEEK_OPACITY = 0.3 // 피크 카드 투명도
const PEEK_SCALE = 0.9 // 피크 카드 크기

/**
 * 프로젝트 리스트 컴포넌트 (클라이언트 컴포넌트)
 *
 * 가로 슬라이더 방식으로 프로젝트를 표시합니다.
 * - 중앙에 3개의 메인 카드, 양옆에 피크 효과
 * - 드래그 & 화살표 네비게이션
 * - 하단 페이지네이션 도트
 */
export function ProjectList({ projects }: { projects: Project[] }) {
  const isAdmin = useAtomValue(isAdminAtom)
  const [activeFilter, setActiveFilter] = useAtom(projectFilterAtom)
  const [currentIndex, setCurrentIndex] = useState(0)
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // 필터링된 프로젝트 목록
  const filteredProjects = useMemo(() => {
    if (activeFilter === '전체') return projects
    return projects.filter((project) => project.category === activeFilter)
  }, [projects, activeFilter])

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / CARDS_PER_VIEW))
  const maxIndex = Math.max(0, filteredProjects.length - CARDS_PER_VIEW)
  // 마지막 페이지 처리: maxIndex에 도달하면 마지막 페이지로 간주
  const currentPage = currentIndex >= maxIndex 
    ? totalPages - 1 
    : Math.floor(currentIndex / CARDS_PER_VIEW)

  // 필터 변경 시 슬라이더 리셋
  useEffect(() => {
    setCurrentIndex(0)
    x.set(0)
  }, [activeFilter, x])

  // 슬라이드 이동 함수
  const goToSlide = (index: number) => {
    const maxIndex = Math.max(0, filteredProjects.length - CARDS_PER_VIEW)
    const newIndex = Math.max(0, Math.min(index, maxIndex))
    setCurrentIndex(newIndex)
    
    const targetX = -newIndex * (CARD_WIDTH + CARD_GAP)
    animate(x, targetX, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    })
  }

  // 페이지 단위 이동
  const goToPage = (page: number) => {
    goToSlide(page * CARDS_PER_VIEW)
  }

  const handlePrev = () => {
    goToSlide(Math.max(0, currentIndex - CARDS_PER_VIEW))
  }

  const handleNext = () => {
    const maxIndex = Math.max(0, filteredProjects.length - CARDS_PER_VIEW)
    goToSlide(Math.min(maxIndex, currentIndex + CARDS_PER_VIEW))
  }

  // 드래그 제약 조건 계산
  const maxDrag = Math.max(0, filteredProjects.length - CARDS_PER_VIEW) * (CARD_WIDTH + CARD_GAP)

  return (
    <>
      {/* 프로젝트 상세 모달 */}
      <ProjectDetailModal />

      {/* 페이지 헤더 */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-4xl font-bold text-gray-900">프로젝트</h1>
          {/* 관리자 전용: 새 프로젝트 추가 버튼 */}
          {isAdmin && (
            <Link
              href="/admin/projects"
              className="group flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
              title="새 프로젝트 추가"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-sm font-medium hidden sm:inline">새 프로젝트</span>
            </Link>
          )}
        </div>
        <p className="text-gray-600 text-lg">
          제가 작업한 프로젝트들을 소개합니다.
        </p>
      </div>

      {/* 필터 필(Filter Pills) 바 */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* 슬라이더 컨테이너 */}
      {filteredProjects.length === 0 ? (
        <EmptyFilterState activeFilter={activeFilter} />
      ) : (
        <div className="relative overflow-x-clip">
          {/* 슬라이더 뷰포트 - 중앙 정렬 및 양옆 피크 노출 */}
          <div
            ref={containerRef}
            className="relative mx-auto"
            style={{
              width: '100%',
              maxWidth: `${CARDS_PER_VIEW * CARD_WIDTH + (CARDS_PER_VIEW - 1) * CARD_GAP + CARD_WIDTH * PEEK_RATIO * 2}px`,
            }}
          >
            {/* 드래그 가능한 카드 컨테이너 */}
            <motion.div
              className="flex"
              style={{
                x,
                gap: `${CARD_GAP}px`,
                paddingLeft: `${CARD_WIDTH * PEEK_RATIO}px`,
                paddingRight: `${CARD_WIDTH * PEEK_RATIO}px`,
              }}
              drag="x"
              dragConstraints={{
                left: -maxDrag,
                right: 0,
              }}
              dragElastic={0.1}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
              onDragEnd={(_, info) => {
                const offset = info.offset.x
                const velocity = info.velocity.x

                // 빠른 스와이프
                if (Math.abs(velocity) > 500) {
                  if (velocity > 0) {
                    handlePrev()
                  } else {
                    handleNext()
                  }
                  return
                }

                // 일정 거리 이상 드래그
                const dragThreshold = CARD_WIDTH / 3
                if (Math.abs(offset) > dragThreshold) {
                  if (offset > 0) {
                    handlePrev()
                  } else {
                    handleNext()
                  }
                } else {
                  // 원위치
                  goToSlide(currentIndex)
                }
              }}
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => {
                  // 현재 위치 계산
                  const isInMainView =
                    index >= currentIndex && index < currentIndex + CARDS_PER_VIEW
                  const isLeftPeek = index === currentIndex - 1
                  const isRightPeek = index === currentIndex + CARDS_PER_VIEW
                  const isPeekCard = isLeftPeek || isRightPeek

                  // 피크 카드 클릭 핸들러
                  const handlePeekClick = () => {
                    if (isLeftPeek && currentIndex > 0) {
                      handlePrev()
                    } else if (isRightPeek && currentIndex < filteredProjects.length - CARDS_PER_VIEW) {
                      handleNext()
                    }
                  }

                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: isInMainView ? 1 : isPeekCard ? PEEK_OPACITY : 0.1,
                        scale: isInMainView ? 1 : isPeekCard ? PEEK_SCALE : 0.85,
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.3 },
                        layout: {
                          type: 'spring',
                          stiffness: 250,
                          damping: 25,
                        },
                      }}
                      style={{
                        width: `${CARD_WIDTH}px`,
                        height: `${CARD_HEIGHT}px`,
                        flexShrink: 0,
                        pointerEvents: isInMainView || isPeekCard ? 'auto' : 'none',
                      }}
                    >
                      <ProjectCard 
                        project={project} 
                        isActive={isInMainView}
                        onCardClick={isPeekCard ? handlePeekClick : undefined}
                      />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* 페이지네이션 도트 */}
          {filteredProjects.length > CARDS_PER_VIEW && (
            <div className="relative z-20 mt-16">
              <PaginationDots
                totalPages={totalPages}
                currentPage={currentPage}
                onPageClick={goToPage}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

/**
 * 필터 필(Filter Pills) 바 컴포넌트
 */
function FilterBar({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: ProjectFilter
  onFilterChange: (filter: ProjectFilter) => void
}) {
  return (
    <div className="flex items-center gap-3 mb-8 flex-wrap">
      {FILTER_OPTIONS.map((filter) => {
        const isActive = activeFilter === filter

        return (
          <motion.button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-5 py-2 rounded-full text-sm font-semibold
              transition-colors duration-200 cursor-pointer
              ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }
            `}
          >
            {filter}
            {/* 활성 인디케이터 dot */}
            {isActive && (
              <motion.span
                layoutId="filterIndicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

/**
 * 페이지네이션 도트 컴포넌트
 */
function PaginationDots({
  totalPages,
  currentPage,
  onPageClick,
}: {
  totalPages: number
  currentPage: number
  onPageClick: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 py-2">
      {Array.from({ length: totalPages }, (_, i) => {
        const isActive = i === currentPage

        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onPageClick(i)}
            whileTap={{ scale: 0.9 }}
            className={`
              rounded-full cursor-pointer transition-all duration-200
              ${
                isActive
                  ? 'w-10 h-3 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md shadow-blue-500/25'
                  : 'w-3 h-3 bg-gray-300 hover:bg-blue-400 hover:scale-110'
              }
            `}
            aria-label={`${i + 1}페이지로 이동`}
          >
            {/* 활성 도트 애니메이션 */}
            {isActive && (
              <motion.div
                layoutId="activeDot"
                className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

/**
 * 빈 필터 결과 상태 컴포넌트
 */
function EmptyFilterState({ activeFilter }: { activeFilter: ProjectFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="text-center py-20"
    >
      <p className="text-gray-400 text-lg">
        &apos;{activeFilter}&apos; 카테고리에 해당하는 프로젝트가 없습니다.
      </p>
    </motion.div>
  )
}
