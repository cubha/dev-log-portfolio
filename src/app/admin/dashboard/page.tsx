import { createClient } from '@/src/utils/supabase/server'
import { FolderKanban, Code2, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

/**
 * 관리자 대시보드 메인 페이지
 * 
 * 프로젝트, 기술 스택 등의 통계를 한눈에 보여주는 대시보드입니다.
 */
export default async function AdminDashboardPage() {
  try {
    const supabase = await createClient()

    // 프로젝트 통계 가져오기
    const { count: projectsCount, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    if (projectsError) {
      console.error('프로젝트 통계 로딩 오류:', projectsError)
    }

    // 기술 스택 통계 가져오기
    const { count: skillsCount, error: skillsError } = await supabase
      .from('skills')
      .select('*', { count: 'exact', head: true })

    if (skillsError) {
      console.error('기술 스택 통계 로딩 오류:', skillsError)
    }

    // 주요 프로젝트 통계
    const { count: featuredCount, error: featuredError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)

    if (featuredError) {
      console.error('주요 프로젝트 통계 로딩 오류:', featuredError)
    }

    return (
      <div>
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">포트폴리오 관리 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 프로젝트 통계 */}
          <StatCard
            title="전체 프로젝트"
            value={projectsCount || 0}
            icon={<FolderKanban className="w-8 h-8" />}
            color="blue"
            description="등록된 프로젝트"
          />

          {/* 기술 스택 통계 */}
          <StatCard
            title="기술 스택"
            value={skillsCount || 0}
            icon={<Code2 className="w-8 h-8" />}
            color="purple"
            description="보유 기술"
          />

          {/* 주요 프로젝트 통계 */}
          <StatCard
            title="주요 프로젝트"
            value={featuredCount || 0}
            icon={<TrendingUp className="w-8 h-8" />}
            color="green"
            description="Featured 프로젝트"
          />
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 액션</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/projects"
              className="group flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-lg transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary rounded-lg">
                  <FolderKanban className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">프로젝트 관리</p>
                  <p className="text-sm text-gray-600">프로젝트 추가 및 수정</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/skills"
              className="group flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-lg transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-secondary rounded-lg">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">기술 스택 관리</p>
                  <p className="text-sm text-gray-600">기술 스택 추가 및 수정</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-secondary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 최근 활동 (추후 구현 예정) */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">최근 활동</h2>
          <p className="text-gray-500 text-center py-8">최근 활동 내역이 여기에 표시됩니다.</p>
        </div>
      </div>
    )
  } catch (error) {
    console.error('대시보드 데이터 로딩 오류:', error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">데이터 로딩 오류</p>
          <p className="text-gray-600 text-sm">대시보드 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }
}

/**
 * 통계 카드 컴포넌트
 * 
 * 대시보드에 표시되는 통계 정보 카드입니다.
 */
function StatCard({
  title,
  value,
  icon,
  color,
  description,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'purple' | 'green'
  description: string
}) {
  const colorClasses = {
    blue: 'from-brand-primary/70 to-brand-primary text-brand-primary',
    purple: 'from-brand-secondary/70 to-brand-secondary text-brand-secondary',
    green: 'from-green-500 to-green-600 text-green-600',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} bg-opacity-10 rounded-lg`}>
          <div className={colorClasses[color]}>{icon}</div>
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-gray-500 text-xs">{description}</p>
      </div>
    </div>
  )
}
