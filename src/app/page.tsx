import Link from 'next/link'
import { FolderKanban, ArrowRight } from 'lucide-react'
import { createClient } from '@/src/utils/supabase/server'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'

/**
 * 홈페이지
 * 
 * 프로젝트의 메인 랜딩 페이지입니다.
 * 프로젝트 리스트로 이동할 수 있는 버튼을 제공합니다.
 * 로그인 유저에게 우측 하단에 플로팅 메뉴가 표시됩니다.
 */
export default async function Home() {
  // 로그인 상태 및 권한 확인 (서버 컴포넌트에서 안전하게 체크)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let userRole = 'guest'

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role || 'user'
  }

  const isLoggedIn = !!user
  const isAdmin = userRole === 'admin'
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* 메인 타이틀 */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Dev Log Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            개발 블로그 포트폴리오 프로젝트
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Next.js 15와 Supabase로 구축한 포트폴리오 관리 시스템입니다.
          </p>
        </div>

        {/* 프로젝트 보기 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <FolderKanban className="w-6 h-6" />
            <span>프로젝트 보기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 기술 스택 표시 */}
        <div className="pt-16">
          <p className="text-sm text-gray-500 mb-4">사용 기술</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind CSS'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* 로그인 유저: 우측 하단 플로팅 메뉴 (로그아웃 + 관리자는 대시보드) */}
      {isLoggedIn && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  );
}
