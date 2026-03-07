'use client'

import { Database } from '@/src/types/supabase'
import { FolderKanban, ExternalLink, Calendar } from 'lucide-react'
import Image from 'next/image'
import { useAtomValue, useSetAtom } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import { selectedProjectAtom } from '@/src/store/projectAtom'
import { ProjectCardActions } from './ProjectCardActions'
import { motion } from 'framer-motion'
import { THEME_CARD_CLASS } from '@/src/components/common/ThemeCard'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
  index: number
}

/**
 * 프로젝트 카드 컴포넌트
 *
 * 개별 프로젝트를 그리드 카드 형태로 표시합니다.
 * 스크롤 시 whileInView로 fade-up 애니메이션 적용.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const isAdmin = useAtomValue(isAdminAtom)
  const setSelectedProject = useSetAtom(selectedProjectAtom)

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) return
    setSelectedProject(project)
  }

  const priority = index === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -2, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
      onClick={handleCardClick}
      className={`group flex flex-col cursor-pointer overflow-hidden ${THEME_CARD_CLASS}`}
    >
      {/* 좌측 상단 태그 컨테이너 */}
      {(project.is_ongoing || project.is_featured) && (
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {project.is_ongoing && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold rounded-full shadow-md">
              🟢 진행중
            </span>
          )}
          {project.is_featured && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-[10px] font-bold rounded-full shadow-md">
              ⭐ 주요
            </span>
          )}
        </div>
      )}

      {/* 관리자 전용 설정 버튼 */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10">
          <ProjectCardActions project={project} />
        </div>
      )}

      {/* 썸네일 */}
      {project.thumbnail_url ? (
        <div className="relative w-full aspect-[5/3] bg-foreground/10 overflow-hidden flex-shrink-0">
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>
      ) : (
        <div className="relative w-full aspect-[5/3] bg-foreground/8 flex items-center justify-center flex-shrink-0">
          <FolderKanban className="w-8 h-8 text-white opacity-50" />
        </div>
      )}

      {/* 본문 */}
      <div className="flex flex-col gap-1.5 p-4 flex-1">
        {/* 제목 */}
        <h2 className="text-sm font-bold text-foreground line-clamp-2">
          {project.title}
        </h2>

        {/* 설명 */}
        <p className="text-xs text-foreground/60 line-clamp-2 flex-1">
          {project.description || '프로젝트 설명이 없습니다.'}
        </p>

        {/* 기술 스택 배지 — 최대 3개 후 +N */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 3).map((tech, i) => (
              <span
                key={i}
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

        {/* 날짜 */}
        {(project.start_date || project.end_date) && (
          <div className="flex items-center gap-1 text-xs text-foreground/50">
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

        {/* 링크 버튼 */}
        {project.link_url && (
          <div className="flex items-center gap-2 pt-1.5 border-t border-foreground/8">
            <a
              href={project.link_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-brand-secondary hover:opacity-80 font-medium hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              <span>데모</span>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}

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
