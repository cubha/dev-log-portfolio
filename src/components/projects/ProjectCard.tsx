import { Database } from '@/src/types/supabase'
import { FolderKanban, ExternalLink, Github, Calendar } from 'lucide-react'
import Image from 'next/image'

// Supabase에서 생성된 타입을 사용하여 프로젝트 타입 추출
type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
}

/**
 * 프로젝트 카드 컴포넌트
 * 
 * 개별 프로젝트를 카드 형태로 표시합니다.
 * 썸네일, 제목, 설명, 기술 스택, 링크 등을 포함합니다.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* 썸네일 이미지 */}
      {project.thumbnail_url ? (
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {project.is_featured && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold rounded-full shadow-md">
                ⭐ 주요 프로젝트
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
          <FolderKanban className="w-20 h-20 text-white opacity-50" />
        </div>
      )}

      {/* 카드 내용 */}
      <div className="p-6">
        {/* 제목 */}
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {project.title}
          </h2>
        </div>

        {/* 설명 */}
        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* 기술 스택 배지 */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech_stack.slice(0, 5).map((tech, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-md hover:from-blue-100 hover:to-purple-100 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 5 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
                +{project.tech_stack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* 날짜 정보 */}
        {(project.start_date || project.end_date) && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <Calendar className="w-3.5 h-3.5" />
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
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {project.link_url && (
            <a
              href={project.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              <span>데모 보기</span>
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium hover:underline"
            >
              <Github className="w-4 h-4" />
              <span>코드 보기</span>
            </a>
          )}
        </div>
      </div>
    </article>
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
