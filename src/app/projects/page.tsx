import { createClient } from '@/src/utils/supabase/server'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { Database } from '@/src/types/supabase'
import { FolderKanban } from 'lucide-react'
import { ProjectList } from '@/src/components/projects/ProjectList'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import Link from 'next/link'

/**
 * 프로젝트 리스트 페이지 (공개 페이지)
 *
 * Supabase의 projects 테이블에서 모든 프로젝트를 가져와
 * 모던한 카드 레이아웃으로 표시합니다.
 *
 * - 비로그인 방문자도 모든 프로젝트를 볼 수 있습니다.
 * - 관리자(admin)로 로그인한 경우에만 "프로젝트 추가하기" 버튼이 표시됩니다.
 *
 * Supabase CLI로 생성된 타입을 활용하여 완벽한 타입 안정성을 제공합니다.
 */
export default async function ProjectsPage() {
  try {
    // 현재 로그인 유저의 role 확인 (공통 유틸리티 사용)
    const { role: userRole, isAdmin } = await getCurrentUserRole()

    const supabase = await createClient()

    // 프로젝트 데이터 가져오기 (최신순 정렬)
    // Database 타입이 주입되어 자동 완성과 타입 체크 제공
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('is_ongoing', { ascending: false })
      .order('end_date', { ascending: false, nullsFirst: false })

    // 에러 메시지 추출 (Supabase 에러 또는 일반 에러)
    const errorMessage = error?.message || null

    // 타입 안전성 확보: Database 타입 명시적 사용
    const typedProjects: Database['public']['Tables']['projects']['Row'][] = projects || []

    // 단일 return 문으로 통합된 레이아웃
    return (
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <AuthStateInitializer isAdmin={isAdmin} />
        {errorMessage ? (
          <ErrorState message={errorMessage} />
        ) : typedProjects.length === 0 ? (
          <EmptyState isAdmin={isAdmin} />
        ) : (
          <ProjectList projects={typedProjects} />
        )}
        {userRole !== 'guest' && <FloatingUserButton isAdmin={isAdmin} />}
      </div>
    )
  } catch (error) {
    // 최상위 try-catch: 예상치 못한 모든 에러를 안전하게 처리
    console.error('페이지 렌더링 오류:', error)
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pt-8">
        <ErrorState message={errorMessage} />
      </div>
    )
  }
}

/**
 * 에러 상태 컴포넌트
 * 
 * 데이터 로딩 오류나 예상치 못한 에러 발생 시 표시됩니다.
 */
function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          데이터 로딩 오류
        </h2>
        <p className="text-red-600 text-sm">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-red-500 text-xs mt-2">{message}</p>
      </div>
    </div>
  )
}

/**
 * 빈 상태 컴포넌트
 * 
 * 프로젝트 데이터가 없을 때 표시되는 Empty State UI입니다.
 * 관리자에게는 프로젝트 추가 버튼을, 일반 유저에게는 안내 메시지만 보여줍니다.
 */
function EmptyState({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <FolderKanban className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          아직 등록된 프로젝트가 없습니다
        </h1>
        {isAdmin ? (
          <>
            <p className="text-gray-600 text-lg mb-8">
              첫 번째 프로젝트를 등록해 보세요!
            </p>
            <Link
              href="/admin/projects?mode=new"
              scroll={false}
              className="inline-flex items-center gap-2 px-6 py-3 bg-silver-metal animate-shine text-white dark:text-slate-950 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <FolderKanban className="w-5 h-5" />
              <span className="font-medium">프로젝트 추가하기</span>
            </Link>
          </>
        ) : (
          <p className="text-gray-600 text-lg">
            프로젝트가 곧 업데이트될 예정입니다.
          </p>
        )}
      </div>
    </div>
  )
}


