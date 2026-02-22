'use client'

import dynamic from 'next/dynamic'

/**
 * Toaster를 dynamic import로 분리하여 초기 번들 크기 감소
 * ssr: false — 토스트는 클라이언트 상호작용 후에만 필요
 */
const Toaster = dynamic(
  () => import('sonner').then((mod) => mod.Toaster),
  { ssr: false }
)

export function DynamicToaster() {
  return <Toaster richColors position="top-right" />
}
