'use server'

import { createClient } from '@/src/utils/supabase/server'
import type { AboutProfile } from '@/src/types/profile'

/**
 * About 프로필 가져오기
 * 
 * 현재 사용자의 프로필을 가져옵니다.
 */
export async function getProfile(): Promise<AboutProfile | null> {
  const supabase = await createClient()

  // 현재 사용자 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 프로필 조회
  const { data, error } = await supabase
    .from('about_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('프로필 조회 오류:', error)
    return null
  }

  return data as AboutProfile
}
