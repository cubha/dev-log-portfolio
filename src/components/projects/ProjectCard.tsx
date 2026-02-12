'use client'

import { Database } from '@/src/types/supabase'
import { FolderKanban, ExternalLink, Github, Calendar } from 'lucide-react'
import Image from 'next/image'
import { useAtomValue, useSetAtom } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import { selectedProjectAtom } from '@/src/store/projectAtom'
import { ProjectCardActions } from './ProjectCardActions'
import { motion } from 'framer-motion'

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
      className={`h-[400px] flex flex-col group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-lg transition-[color,border-color,box-shadow] duration-300 relative ${
        isActive || onCardClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* 관리자 전용 설정 버튼 */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-10">
          <ProjectCardActions project={project} />
        </div>
      )}

      {/* 썸네일 이미지 */}
      {project.thumbnail_url ? (
        <div className="relative h-40 bg-gray-100 overflow-hidden flex-shrink-0">
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {project.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold rounded-full shadow-md">
                ⭐ 주요 프로젝트
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <FolderKanban className="w-16 h-16 text-white opacity-50" />
        </div>
      )}

      {/* 카드 내용 */}
      <div className="p-5 flex flex-col flex-grow">
        {/* 제목 */}
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
            {project.title}
          </h2>
        </div>

        {/* 설명 */}
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed flex-grow">
          {project.description || '프로젝트 설명이 없습니다.'}
        </p>

        {/* 기술 스택 배지 */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tech_stack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 text-[10px] font-semibold rounded"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 날짜 정보 & 링크 버튼 - mt-auto로 하단 고정 */}
        <div className="mt-auto space-y-2">
          {/* 날짜 */}
          {(project.start_date || project.end_date) && (
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Calendar className="w-3 h-3" />
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
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            {project.link_url && (
              <a
                href={project.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>데모</span>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium hover:underline"
              >
                <Github className="w-3 h-3" />
                <span>코드</span>
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
