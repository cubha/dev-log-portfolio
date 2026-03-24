'use server'

import { createClient } from '@/src/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AboutProfile } from '@/src/types/profile'

/**
 * About 프로필 Upsert 서버 액션
 * 
 * 기존 프로필이 있으면 업데이트하고, 없으면 새로 생성합니다.
 */
export async function upsertProfile(formData: FormData) {
  const supabase = await createClient()

  // 현재 사용자 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('인증이 필요합니다.')
  }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('관리자 권한이 필요합니다.')
  }

  // 폼 데이터 추출
  const mainCopy = formData.get('main_copy') as string
  const introText = formData.get('intro_text') as string
  const profileImageUrl = formData.get('profile_image_url') as string | null
  const storyJsonStr = formData.get('story_json') as string
  const isIntroVisible = formData.get('is_intro_visible') !== 'false'
  const showExperience = formData.get('show_experience') !== 'false'
  const showEducation  = formData.get('show_education')  !== 'false'
  const showTraining   = formData.get('show_training')   !== 'false'

  // 필수 필드 검증
  if (!mainCopy || mainCopy.trim().length === 0) {
    throw new Error('메인 카피는 필수 입력 항목입니다.')
  }

  if (!introText || introText.trim().length === 0) {
    throw new Error('서두 소개글은 필수 입력 항목입니다.')
  }

  // story_json 파싱
  let storyJson = []
  try {
    storyJson = JSON.parse(storyJsonStr)
  } catch {
    throw new Error('스토리 데이터 형식이 올바르지 않습니다.')
  }

  // 프로필 데이터 준비
  const profileData = {
    user_id: user.id,
    main_copy: mainCopy.trim(),
    intro_text: introText.trim(),
    profile_image_url: profileImageUrl?.trim() || null,
    story_json: storyJson,
    is_intro_visible: isIntroVisible,
    show_experience: showExperience,
    show_education:  showEducation,
    show_training:   showTraining,
    updated_at: new Date().toISOString(),
  }

  // Upsert: user_id로 기존 프로필 찾아서 업데이트, 없으면 생성
  const { error: upsertError } = await supabase
    .from('about_profiles')
    .upsert(profileData, {
      onConflict: 'user_id',
    })

  if (upsertError) {
    console.error('프로필 저장 오류:', upsertError)
    throw new Error(`프로필 저장에 실패했습니다: ${upsertError.message}`)
  }

  // 캐시 무효화
  revalidatePath('/about')
  revalidatePath('/admin/profile')

  return { success: true }
}
