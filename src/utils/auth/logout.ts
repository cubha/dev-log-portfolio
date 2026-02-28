'use server'

import { createClient } from '@/src/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Supabase Auth 기반 로그아웃 처리
 *
 * JWT 세션을 서버 측에서 파기하고 로그인 페이지로 리다이렉트합니다.
 * 쿠키에 저장된 access_token, refresh_token이 자동으로 삭제됩니다.
 */
export async function logoutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
