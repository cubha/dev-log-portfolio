import { ProjectListSkeleton } from '@/src/components/projects/ProjectListSkeleton'

/**
 * 프로젝트 페이지 로딩 UI
 * Supabase 데이터 페칭 중 즉시 표시
 */
export default function ProjectsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
      <ProjectListSkeleton />
    </div>
  )
}
