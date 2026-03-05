'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/utils/supabase/server'
import type { ActionResult, ReplyInquiryInput } from '@/src/types/contact'

/**
 * 관리자 권한을 확인하고 문의 답변을 저장하는 서버 액션
 *
 * @param input - { inquiryId: string, reply: string }
 * @returns     - 성공/실패 결과 객체
 */
export async function replyToInquiry(
  input: ReplyInquiryInput
): Promise<ActionResult> {
  const supabase = await createClient()

  // ── 1. 인증 확인 ──────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // ── 2. 관리자 권한 확인 ───────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { success: false, error: '관리자 권한이 필요합니다.' }
  }

  // ── 3. 입력값 검증 ────────────────────────────────────────
  const trimmedReply = input.reply.trim()
  if (!trimmedReply) {
    return { success: false, error: '답변 내용을 입력해주세요.' }
  }

  // ── 4. 답변 저장 ──────────────────────────────────────────
  const { error } = await supabase
    .from('inquiries')
    .update({
      reply: trimmedReply,
      replied_at: new Date().toISOString(),
      reply_is_public: input.replyIsPublic,
    })
    .eq('id', input.inquiryId)

  if (error) {
    console.error('[replyToInquiry] Supabase error:', error)
    return { success: false, error: error.message }
  }

  // ── 5. 캐시 무효화 ────────────────────────────────────────
  revalidatePath('/contact')

  return { success: true }
}

/**
 * 관리자 권한을 확인하고 문의 답변을 삭제하는 서버 액션
 *
 * @param inquiryId - 답변을 삭제할 문의 ID
 * @returns         - 성공/실패 결과 객체
 */
export async function deleteInquiryReply(
  inquiryId: string
): Promise<ActionResult> {
  const supabase = await createClient()

  // ── 1. 인증 확인 ──────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // ── 2. 관리자 권한 확인 ───────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { success: false, error: '관리자 권한이 필요합니다.' }
  }

  // ── 3. 답변 삭제 (null로 초기화) ──────────────────────────
  const { error } = await supabase
    .from('inquiries')
    .update({
      reply: null,
      replied_at: null,
    })
    .eq('id', inquiryId)

  if (error) {
    console.error('[deleteInquiryReply] Supabase error:', error)
    return { success: false, error: error.message }
  }

  // ── 4. 캐시 무효화 ────────────────────────────────────────
  revalidatePath('/contact')

  return { success: true }
}

/**
 * 관리자 권한을 확인하고 문의 자체를 삭제하는 서버 액션
 *
 * @param inquiryId - 삭제할 문의 ID
 * @returns         - 성공/실패 결과 객체
 */
export async function adminDeleteInquiry(
  inquiryId: string
): Promise<ActionResult> {
  const supabase = await createClient()

  // ── 1. 인증 확인 ──────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // ── 2. 관리자 권한 확인 ───────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { success: false, error: '관리자 권한이 필요합니다.' }
  }

  // ── 3. 문의 삭제 ──────────────────────────────────────────
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', inquiryId)

  if (error) {
    console.error('[adminDeleteInquiry] Supabase error:', error)
    return { success: false, error: error.message }
  }

  // ── 4. 캐시 무효화 ────────────────────────────────────────
  revalidatePath('/contact')

  return { success: true }
}
