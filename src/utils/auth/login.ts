'use server'

import { createClient } from '@/src/utils/supabase/server'

/**
 * 로그인 결과 타입
 */
export interface LoginResult {
  success: boolean
  error?: string
  role?: string
}

/**
 * Supabase Auth 기반 로그인 처리
 *
 * profiles 테이블의 user_id를 Supabase Auth의 이메일로 변환하여
 * signInWithPassword()로 JWT 세션을 생성합니다.
 *
 * 흐름:
 *   1. user_id로 profiles 테이블에서 Supabase Auth 이메일 조회
 *   2. signInWithPassword()로 실제 JWT 세션 생성
 *   3. role 반환
 *
 * @param userId - 사용자 ID (profiles.user_id 값)
 * @param password - 비밀번호
 */
export async function loginUser(
  userId: string,
  password: string
): Promise<LoginResult> {
  try {
    const supabase = await createClient()

    // --------------------------------------------------
    // 1. profiles 테이블에서 user_id로 사용자 조회
    //    Supabase Auth에 등록된 이메일 정보를 가져옵니다.
    // --------------------------------------------------
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id, role')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      console.error('사용자 조회 오류:', profileError)
      return {
        success: false,
        error: '사용자 ID 또는 비밀번호가 올바르지 않습니다.',
      }
    }

    // --------------------------------------------------
    // 2. Supabase Auth로 로그인 — JWT 세션 자동 생성
    //    user_id를 이메일 형식으로 변환하여 Auth에 전달합니다.
    //    (Supabase Auth는 이메일 기반이므로 변환 필요)
    // --------------------------------------------------
    const authEmail = userId.includes('@') ? userId : `${userId}@portfolio.local`

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    })

    if (authError || !authData.user) {
      console.error('Supabase Auth 로그인 실패:', authError)
      return {
        success: false,
        error: '사용자 ID 또는 비밀번호가 올바르지 않습니다.',
      }
    }

    // --------------------------------------------------
    // 3. role 반환
    // --------------------------------------------------
    const userRole = profile.role || 'user'
    console.log(`[로그인 성공] userId: ${userId}, role: ${userRole}`)

    return {
      success: true,
      role: userRole,
    }
  } catch (error) {
    console.error('로그인 처리 중 예외 발생:', error)
    return {
      success: false,
      error: '로그인 중 오류가 발생했습니다.',
    }
  }
}
