'use client'

import { PageTransition } from '@/src/components/layout/PageTransition'

/**
 * 페이지 템플릿
 * 
 * 모든 페이지에 페이지 전환 애니메이션을 적용합니다.
 * template.tsx는 각 라우트 변경 시 새로운 인스턴스가 생성되므로
 * AnimatePresence가 정상 작동합니다.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
