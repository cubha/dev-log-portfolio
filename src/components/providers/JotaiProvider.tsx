'use client'

import { Provider } from 'jotai'
import { ReactNode } from 'react'

/**
 * Jotai Provider 컴포넌트
 *
 * 전역 상태 관리를 위한 Provider입니다.
 * 하이드레이션 오류를 방지하기 위해 클라이언트 컴포넌트로 분리했습니다.
 */
export function JotaiProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>
}
