'use client'

import { Database } from '@/src/types/supabase'
import { FolderKanban, ExternalLink, Github, Calendar } from 'lucide-react'
import Image from 'next/image'
import { useAtomValue, useSetAtom } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import { selectedProjectAtom } from '@/src/store/projectAtom'
import { ProjectCardActions } from './ProjectCardActions'
import { motion } from 'framer-motion'
import { THEME_CARD_CLASS } from '@/src/components/common/ThemeCard'

// Supabase에서 생성된 타입을 사용하여 프로젝트 타입 추출
type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
  isActive?: boolean // 중앙에 위치한 활성 카드인지 여부
  onCardClick?: () => void // 피크 카드 클릭 시 슬라이더 이동 핸들러
}

/**
 * 프로젝트 카드 컴포넌트
 * 
 * 개별 프로젝트를 카드 형태로 표시합니다.
 * 썸네일, 제목, 설명, 기술 스택, 링크 등을 포함합니다.
 * 관리자 권한은 Jotai atom을 통해 전역으로 관리됩니다.
 * 
 * - isActive가 true인 경우: 탭 시 상세 모달 표시 (드래그는 제외)
 * - isActive가 false이고 onCardClick이 있는 경우: 탭 시 슬라이더 이동
 * 
 * Framer Motion의 onTap 이벤트를 사용하여 드래그와 클릭을 명확히 구분합니다.
 */
export function ProjectCard({ project, isActive = true, onCardClick }: ProjectCardProps) {
  const isAdmin = useAtomValue(isAdminAtom)
  const setSelectedProject = useSetAtom(selectedProjectAtom)

  const handleCardTap = (event: MouseEvent | TouchEvent | PointerEvent) => {
    // 링크나 버튼 클릭은 이벤트 전파 중단 (별도 처리)
    const target = event.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }

    // 중앙 활성 카드인 경우: 모달 열기
    if (isActive) {
      setSelectedProject(project)
    }
    // 피크 카드인 경우: 슬라이더 이동
    else if (onCardClick) {
      onCardClick()
    }
  }

  return (
    <motion.article
      onTap={handleCardTap}
      whileHover={isActive || onCardClick ? { scale: 1.02 } : {}}
      whileTap={isActive || onCardClick ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`h-full flex flex-col group overflow-hidden ${THEME_CARD_CLASS} ${
        isActive || onCardClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* 관리자 전용 설정 버튼 */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10">
          <ProjectCardActions project={project} />
        </div>
      )}

      {/* 썸네일 이미지 */}
      {project.thumbnail_url ? (
        <div className="relative h-28 bg-foreground/10 overflow-hidden flex-shrink-0">
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {project.is_featured && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-[10px] font-bold rounded-full shadow-md">
                ⭐ 주요
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-28 bg-foreground/8 flex items-center justify-center flex-shrink-0">
          <FolderKanban className="w-10 h-10 text-white opacity-50" />
        </div>
      )}

      {/* 카드 내용 */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* 제목 */}
        <div className="mb-1.5">
          <h2 className="text-sm font-bold text-foreground line-clamp-1">
            {project.title}
          </h2>
        </div>

        {/* 설명 */}
        <p className="text-foreground/60 text-[11px] mb-2 line-clamp-2 leading-relaxed flex-grow">
          {project.description || '프로젝트 설명이 없습니다.'}
        </p>

        {/* 기술 스택 배지 */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {project.tech_stack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-brand-secondary/5 border border-brand-secondary/20 text-brand-secondary text-[9px] font-semibold rounded"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="px-1.5 py-0.5 bg-foreground/10 text-foreground/60 text-[9px] font-semibold rounded">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 날짜 정보 & 링크 버튼 - mt-auto로 하단 고정 */}
        <div className="mt-auto space-y-1.5">
          {/* 날짜 */}
          {(project.start_date || project.end_date) && (
            <div className="flex items-center gap-1 text-[9px] text-foreground/50">
              <Calendar className="w-2.5 h-2.5" />
              <span>
                {project.start_date && project.end_date
                  ? `${formatDate(project.start_date)} - ${formatDate(project.end_date)}`
                  : project.start_date
                  ? `${formatDate(project.start_date)} ~`
                  : project.end_date
                  ? `~ ${formatDate(project.end_date)}`
                  : ''}
              </span>
            </div>
          )}

          {/* 링크 버튼들 */}
          <div className="flex items-center gap-2 pt-1.5 border-t border-foreground/8">
            {project.link_url && (
              <a
                href={project.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-brand-secondary hover:opacity-80 font-medium hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>데모</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

/**
 * 날짜 포맷팅 함수
 * 
 * ISO 날짜 문자열을 "YYYY년 MM월" 형식으로 변환합니다.
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
