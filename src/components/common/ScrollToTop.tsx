'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * 경로 변경 시 스크롤을 상단으로 복원
 * (Link scroll={false}와 함께 사용)
 */
export function ScrollToTop() {
  const pathname = usePathname()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
