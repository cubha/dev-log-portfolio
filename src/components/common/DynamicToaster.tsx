'use client'

import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'

/**
 * Toaster 클라이언트 전용 렌더러
 *
 * Next.js 15.5.x에서 `dynamic({ ssr: false })`를 root layout에서 사용하면
 * BailoutToCSR 에러가 root layout까지 전파되어 화면 전체가 렌더링되지 않는
 * 문제가 발생합니다. useState + useEffect 패턴으로 동일한 효과를 구현합니다.
 * (서버에서는 null 반환 → 클라이언트 마운트 후 Toaster 렌더)
 */
export function DynamicToaster() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <Toaster richColors position="top-right" />
}
