import { cache } from 'react'
import { createClient } from '@/src/utils/supabase/server'
import type { User } from '@supabase/supabase-js'

/** 서버 컴포넌트에서 조회한 유저 역할 정보 */
export interface UserRoleInfo {
  /** 현재 로그인 유저 (비로그인 시 null) */
  user: User | null
  /** 유저 역할: 'guest' | 'user' | 'admin' */
  role: string
  /** 관리자 여부 */
  isAdmin: boolean
}

/**
 * 서버 컴포넌트에서 현재 로그인 유저의 역할을 안전하게 조회합니다.
 * React.cache()로 래핑되어 동일 요청 범위 내 중복 호출을 방지합니다.
 *
 * - 비로그인 상태: { user: null, role: 'guest', isAdmin: false }
 * - 일반 로그인: { user, role: 'user', isAdmin: false }
 * - 관리자 로그인: { user, role: 'admin', isAdmin: true }
 *
 * @example
 * ```ts
 * const { user, role, isAdmin } = await getCurrentUserRole()
 * ```
 */
export const getCurrentUserRole = cache(async (): Promise<UserRoleInfo> => {
  const supabase = await createClient()

  // 현재 로그인 유저 확인 (서버 사이드에서 안전하게 검증)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 비로그인 상태
  if (!user) {
    return { user: null, role: 'guest', isAdmin: false }
  }

  // profiles 테이블에서 역할 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'user'

  return {
    user,
    role,
    isAdmin: role === 'admin',
  }
})
