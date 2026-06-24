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

function withTimeout<T>(promise: PromiseLike<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ])
}

export const getCurrentUserRole = cache(async (): Promise<UserRoleInfo> => {
  try {
    const supabase = await createClient()

    // 폴백 객체가 Supabase 응답 타입(UserResponse 등)과 불일치하지 않도록
    // race 대상을 "값만 추출하는 Promise"로 정규화한다 (타입 안전).
    const user = await withTimeout<User | null>(
      supabase.auth.getUser().then(({ data }) => data.user),
      4000,
      null
    )

    if (!user) return GUEST

    const role = (await withTimeout<string | null>(
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => data?.role ?? null),
      3000,
      null
    )) ?? 'user'

    return { user, role, isAdmin: role === 'admin' }
  } catch {
    return GUEST
  }
})
