'use server'

import { createClient } from '@/src/utils/supabase/server'
import type { AboutProfile, StorySection } from '@/src/types/profile'

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

  // story_json: DB는 Json 타입, 런타임은 StorySection[]. null 날짜 필드는 undefined로 정규화
  return {
    ...data,
    story_json: (data.story_json ?? []) as unknown as StorySection[],
    created_at: data.created_at ?? undefined,
    updated_at: data.updated_at ?? undefined,
  } satisfies AboutProfile
}
