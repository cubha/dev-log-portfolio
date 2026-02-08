import { createClient } from '@/src/utils/supabase/server'
import { Database } from '@/src/types/supabase'
import { FolderKanban, ExternalLink, Github, Calendar } from 'lucide-react'

// Supabase에서 생성된 타입을 사용하여 프로젝트 타입 추출
type Project = Database['public']['Tables']['projects']['Row']

/**
 * 프로젝트 리스트 페이지
 * 
 * Supabase의 projects 테이블에서 모든 프로젝트를 가져와
 * 모던한 카드 레이아웃으로 표시합니다.
 * 
 * Supabase CLI로 생성된 타입을 활용하여 완벽한 타입 안정성을 제공합니다.
 */
export default async function ProjectsPage() {
  try {
    const supabase = await createClient()

    // 프로젝트 데이터 가져오기 (최신순 정렬)
    // Database 타입이 주입되어 자동 완성과 타입 체크 제공
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    // 에러 처리
    if (error) {
      console.error('프로젝트 데이터 로딩 오류:', error)
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                데이터 로딩 오류
              </h2>
              <p className="text-red-600 text-sm">
                데이터를 불러오는 중 오류가 발생했습니다.
              </p>
              <p className="text-red-500 text-xs mt-2">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      )
    }

    // Empty State: 프로젝트가 없는 경우
    if (!projects || projects.length === 0) {
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <FolderKanban className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                아직 등록된 프로젝트가 없습니다
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                첫 번째 프로젝트를 등록해 보세요!
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                <FolderKanban className="w-5 h-5" />
                <span className="font-medium">프로젝트 추가하기</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 타입 안전성 확보: Database 타입 명시적 사용
    const typedProjects: Database['public']['Tables']['projects']['Row'][] = projects

    return (
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">프로젝트</h1>
          <p className="text-gray-600 text-lg">
            제가 작업한 프로젝트들을 소개합니다. ({typedProjects.length}개)
          </p>
        </div>

        {/* 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {typedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    // 최상위 try-catch: 예상치 못한 모든 에러를 안전하게 처리
    console.error('페이지 렌더링 오류:', error)
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              오류 발생
            </h2>
            <p className="text-red-600 text-sm">
              데이터를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-red-500 text-xs mt-2">
              {error instanceof Error ? error.message : '알 수 없는 오류'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * 프로젝트 카드 컴포넌트
 * 
 * 개별 프로젝트를 카드 형태로 표시합니다.
 * 썸네일, 제목, 설명, 기술 스택, 링크 등을 포함합니다.
 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* 썸네일 이미지 */}
      {project.thumbnail_url ? (
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
