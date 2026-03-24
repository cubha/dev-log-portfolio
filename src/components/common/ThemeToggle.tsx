'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

/**
 * 다크/라이트 모드 토글 버튼
 *
 * - 초기 마운트 시 hydration 불일치 방지를 위해 mounted 플래그 사용
 * - Sun(라이트) / Moon(다크) 아이콘으로 현재 테마 표시
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 클라이언트에서만 렌더링되도록 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // 서버/hydration 중에는 동일한 크기의 빈 자리 유지
    return <div className="w-9 h-9" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px]" strokeWidth={2} />
      ) : (
        <Moon className="w-[18px] h-[18px]" strokeWidth={2} />
      )}
    </button>
  )
}
