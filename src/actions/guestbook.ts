'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/utils/supabase/server'
import type {
  ActionResult,
  CreateGuestbookInput,
} from '@/src/types/contact'

const NICKNAME_MAX_LENGTH = 20
const MESSAGE_MAX_LENGTH = 200

/** 입력값 검증 */
function validateInput(input: CreateGuestbookInput): string | null {
  const { nickname, message, emoji } = input
  if (!nickname?.trim()) return '닉네임을 입력해 주세요.'
  if (nickname.trim().length > NICKNAME_MAX_LENGTH)
    return `닉네임은 최대 ${NICKNAME_MAX_LENGTH}자까지 입력할 수 있습니다.`
  if (!message?.trim()) return '메시지를 입력해 주세요.'
  if (message.trim().length > MESSAGE_MAX_LENGTH)
    return `메시지는 최대 ${MESSAGE_MAX_LENGTH}자까지 입력할 수 있습니다.`
  if (!emoji?.trim()) return '이모지를 선택해 주세요.'
  return null
}

/**
 * 방명록 항목 생성 (익명 허용)
 */
export async function createGuestbookEntry(
  input: CreateGuestbookInput
): Promise<ActionResult> {
  const validationError = validateInput(input)
  if (validationError) return { success: false, error: validationError }

  const supabase = await createClient()

  const { error } = await supabase.from('guestbook').insert({
    nickname: input.nickname.trim(),
    message: input.message.trim(),
    emoji: input.emoji.trim(),
  })

  if (error) {
    console.error('[createGuestbookEntry] Supabase error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

/**
 * 방명록 항목 삭제 (관리자 전용)
 */
export async function deleteGuestbookEntry(id: number): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin')
    return { success: false, error: '관리자 권한이 필요합니다.' }

  const { error } = await supabase.from('guestbook').delete().eq('id', id)

  if (error) {
    console.error('[deleteGuestbookEntry] Supabase error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
