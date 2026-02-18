import Link from 'next/link'
import { LayoutDashboard, Home, FolderKanban, Wrench } from 'lucide-react'
import { LogoutButton } from '@/src/components/admin/LogoutButton'

/**
 * 관리자 페이지 레이아웃
 * 
 * 관리자 인증 후 접근하는 모든 페이지에 공통으로 적용되는 레이아웃입니다.
 * 사이드바 네비게이션과 상단 헤더를 포함합니다.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 타이틀 */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Portfolio Admin Panel</h1>
                <p className="text-xs text-gray-500">관리자 대시보드</p>
              </div>
            </div>

            {/* 우측 액션 버튼 */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">메인으로</span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 네비게이션 */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all group"
            >
              <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">대시보드</span>
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all group"
            >
              <FolderKanban className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">프로젝트 관리</span>
            </Link>
          </nav>
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
