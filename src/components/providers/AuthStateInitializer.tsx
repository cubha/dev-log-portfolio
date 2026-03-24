'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'

/**
 * 인증 상태 초기화 컴포넌트
 *
 * 서버에서 확인한 권한 정보를 Jotai atom에 동기화합니다.
 * 하이드레이션 오류를 방지하기 위해 useEffect에서만 상태를 업데이트합니다.
 */
interface AuthStateInitializerProps {
  isAdmin: boolean
}

export function AuthStateInitializer({ isAdmin }: AuthStateInitializerProps) {
  const setIsAdmin = useSetAtom(isAdminAtom)

  useEffect(() => {
    setIsAdmin(isAdmin)
  }, [isAdmin, setIsAdmin])

  return null
}
