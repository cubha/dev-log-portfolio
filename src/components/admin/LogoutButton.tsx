'use client'

import { LogOut } from 'lucide-react'
import { logoutUser } from '@/src/utils/auth/logout'
import { useState } from 'react'

/**
 * 로그아웃 버튼 컴포넌트
 *
 * Supabase Auth의 signOut을 호출하여 JWT 세션을 파기합니다.
 *
 * @param variant
 *   - 'default': 관리자 패널용 (빨간 배경, 넓은 패딩)
 *   - 'compact': 전역 상단 바용 (투명 배경, 슬림 디자인)
 */
export function LogoutButton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logoutUser()
    } catch (error) {
      console.error('로그아웃 오류:', error)
      // redirect()가 내부적으로 에러를 throw하므로 여기로 올 수 있음
      // 실제 에러 시 fallback
      window.location.href = '/'
    }
  }

  // 스타일 변형: 관리자 패널용 vs 전역 상단 바용
  const styles = {
    default:
      'flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
    compact:
      'flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed',
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={styles[variant]}
    >
      <LogOut className="w-4 h-4" />
      <span className={variant === 'compact' ? 'text-xs font-medium' : 'text-sm font-medium'}>
        {isLoading ? '로그아웃 중...' : '로그아웃'}
      </span>
    </button>
  )
}
