import { AdminHeader, AdminSidebar } from '@/src/components/admin/AdminHeader'

/**
 * 관리자 페이지 레이아웃
 *
 * 어드민 인증 후 접근하는 모든 페이지에 공통으로 적용됩니다.
 * 헤더·사이드바는 클라이언트 컴포넌트(AdminHeader/AdminSidebar)로 분리되어
 * ThemeToggle 및 active 경로 감지가 가능합니다.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8 min-w-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
