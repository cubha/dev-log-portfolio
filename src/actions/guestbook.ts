'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/utils/supabase/server'
import type {
  ActionResult,
  CreateGuestbookInput,
} from '@/src/types/contact'

const NICKNAME_MAX_LENGTH = 20
const MESSAGE_MAX_LENGTH = 200

/** 입력값 검증 (skipNickname: true 시 로그인 유저로 서버에서 nickname 자동 주입) */
function validateInput(
  input: CreateGuestbookInput,
  skipNickname?: boolean
): string | null {
  const { nickname, message, emoji } = input
  if (!skipNickname) {
    if (!nickname?.trim()) return '닉네임을 입력해 주세요.'
    if (nickname.trim().length > NICKNAME_MAX_LENGTH)
      return `닉네임은 최대 ${NICKNAME_MAX_LENGTH}자까지 입력할 수 있습니다.`
  }
  if (!message?.trim()) return '메시지를 입력해 주세요.'
  if (message.trim().length > MESSAGE_MAX_LENGTH)
    return `메시지는 최대 ${MESSAGE_MAX_LENGTH}자까지 입력할 수 있습니다.`
  if (!emoji?.trim()) return '이모지를 선택해 주세요.'
  return null
}

/**
 * 방명록 항목 생성 (익명 허용, 비밀글은 로그인 필요)
 */
export async function createGuestbookEntry(
  input: CreateGuestbookInput
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 익명 유저 + 비밀글 요청 시 차단
  if (!user && input.is_secret) {
    return {
      success: false,
      error: '비밀글은 로그인 후 작성 가능합니다.',
    }
  }

  const validationError = validateInput(input, !!user)
  if (validationError) return { success: false, error: validationError }

  // 로그인 유저 닉네임 결정: GitHub OAuth vs 이메일/패스워드 로그인 분기
  let loggedInNickname = 'User'
  if (user != null) {
    const isGitHub = user.app_metadata?.provider === 'github'
    if (isGitHub) {
      loggedInNickname =
        (user.user_metadata?.user_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        'GitHub User'
    } else {
      // 이메일/패스워드 로그인 (관리자) → profiles.user_id 사용
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', user.id)
        .single()
      loggedInNickname = profile?.user_id ?? user.email?.split('@')[0] ?? 'User'
    }
  }

  const insertData =
    user != null
      ? {
          user_id: user.id,
          nickname: loggedInNickname,
          avatar_url:
            (user.user_metadata?.avatar_url as string | undefined) ?? null,
          is_secret: input.is_secret,
          message: input.message.trim(),
          emoji: input.emoji.trim(),
        }
      : {
          user_id: null,
          avatar_url: null,
          is_secret: false,
          nickname: input.nickname!.trim(),
          message: input.message.trim(),
          emoji: input.emoji.trim(),
        }

  const { error } = await supabase.from('guestbook').insert(insertData)

  if (error) {
    console.error('[createGuestbookEntry] Supabase error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/contact')
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

  revalidatePath('/contact')
  return { success: true }
}
