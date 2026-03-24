import { createClient } from '@/src/utils/supabase/server'
import Link from 'next/link'
import { Home, LayoutDashboard } from 'lucide-react'
import { LogoutButton } from '@/src/components/admin/LogoutButton'

/**
 * 전역 인증 상단 패널 (서버 컴포넌트)
 *
 * 로그인한 사용자에게만 렌더링되는 슬림한 전역 상단 바입니다.
 * /login 페이지에서는 미들웨어 역방향 가드에 의해 로그인 유저가
 * 접근할 수 없으므로, 비로그인 유저에 대한 null 반환만으로 충분합니다.
 *
 * 포함 요소:
 *   - 메인으로(/) 링크
 *   - 관리자인 경우 대시보드 링크
 *   - 사용자 정보 + 로그아웃 버튼 (compact 변형)
 */
export async function AuthPanel() {
  const supabase = await createClient()

  // JWT 서버 검증으로 실제 로그인 상태 확인
  const { data: { user } } = await supabase.auth.getUser()

  // 비로그인이면 패널을 렌더링하지 않음
  if (!user) return null

  // profiles 테이블에서 role 및 표시 이름 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, user_id')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role || 'user'
  const displayName = profile?.user_id || '사용자'

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* 좌측: 네비게이션 링크 */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>메인으로</span>
          </Link>
          {/* 관리자에게만 대시보드 바로가기 표시 */}
          {userRole === 'admin' && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>대시보드</span>
            </Link>
          )}
        </div>

        {/* 우측: 사용자 정보 + 로그아웃 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {displayName}
            {userRole === 'admin' && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-brand-primary text-xs font-semibold rounded">
                관리자
              </span>
            )}
          </span>
          {/* compact 변형: 상단 바에 맞는 슬림한 로그아웃 버튼 */}
          <LogoutButton variant="compact" />
        </div>
      </div>
    </div>
  )
}
