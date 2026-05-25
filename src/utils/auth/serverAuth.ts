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
const GUEST: UserRoleInfo = { user: null, role: 'guest', isAdmin: false }

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ])
}

export const getCurrentUserRole = cache(async (): Promise<UserRoleInfo> => {
  try {
    const supabase = await createClient()

    const { data: { user } } = await withTimeout(
      supabase.auth.getUser(),
      4000,
      { data: { user: null }, error: null }
    )

    if (!user) return GUEST

    const { data: profile } = await withTimeout(
      supabase.from('profiles').select('role').eq('id', user.id).single(),
      3000,
      { data: null, error: null }
    )

    const role = profile?.role || 'user'
    return { user, role, isAdmin: role === 'admin' }
  } catch {
    return GUEST
  }
})
