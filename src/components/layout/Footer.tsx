'use client'

import { usePathname } from 'next/navigation'

/**
 * 전역 슬림 푸터 컴포넌트
 *
 * 단일 라인 저작권 표기만 포함한 미니멀 구조.
 * /admin 경로에서는 렌더링하지 않음.
 */
export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="w-full border-t border-slate-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-xs text-slate-400 dark:text-slate-600">
          © 2026 Silver. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
