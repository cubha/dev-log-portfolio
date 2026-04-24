'use client'

import { useState } from 'react'
import { LogOut, X, LayoutDashboard, User, Edit, FileText } from 'lucide-react'
import { logoutUser } from '@/src/utils/auth/logout'
import { usePathname } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { isAdminAtom, isLoggedInAtom } from '@/src/store/authAtom'
import Link from 'next/link'

export function FloatingUserButton() {
  const isAdmin = useAtomValue(isAdminAtom)
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()

  if (!isLoggedIn) return null

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
    } catch {
      window.location.href = '/'
    }
  }

  // 특수 페이지 확인
  const isAboutPage = pathname === '/about'
  const isBlogPage = pathname?.startsWith('/blog')

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* 펼쳐지는 메뉴 */}
      {isOpen && (
        <div className="bg-background rounded-xl shadow-lg border border-foreground/10 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* 관리자 전용 메뉴 */}
          {isAdmin && (
            <>
              {isAboutPage ? (
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
                >
                  <Edit className="w-4 h-4 text-brand-secondary" />
                  <span className="font-medium">프로필 편집</span>
                </Link>
              ) : isBlogPage ? (
                <Link
                  href="/admin/blog"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-brand-secondary" />
                  <span className="font-medium">블로그 관리</span>
                </Link>
              ) : (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-secondary" />
                  <span className="font-medium">대시보드</span>
                </Link>
              )}
              <hr className="border-foreground/8" />
            </>
          )}

          {/* 로그아웃 — 모든 로그인 유저에게 표시 */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </span>
          </button>
        </div>
      )}

      {/* 플로팅 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full shadow-lg
          transition-all duration-200 hover:scale-105 active:scale-95
          ${isOpen
            ? 'bg-gray-800 text-white hover:bg-gray-900'
            : isAdmin
              ? 'bg-silver-metal animate-shine text-white dark:text-slate-950'
              : 'bg-gray-700 text-white hover:bg-gray-800'
          }
        `}
        title={isAdmin ? '관리자 메뉴' : '사용자 메뉴'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </button>
    </div>
  )
}
