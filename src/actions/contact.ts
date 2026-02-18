'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/utils/supabase/server'
import type { ActionResult, ContactLinkEditable } from '@/src/types/contact'

/**
 * 관리자 권한을 확인하고 contact_link 항목을 업데이트하는 서버 액션
 *
 * @param id      - 수정할 contact_links 행의 UUID
 * @param data    - 변경할 필드 (value, href)
 * @returns       - 성공/실패 결과 객체
 */
export async function updateContactLink(
  id: string,
  data: ContactLinkEditable
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

  // ── 3. 데이터 업데이트 ────────────────────────────────────
  const { error } = await supabase
    .from('contact_links')
    .update({
      value: data.value.trim(),
      // 빈 문자열은 NULL로 처리 (링크 없음)
      href: data.href?.trim() || null,
    })
    .eq('id', id)

  if (error) {
    console.error('[updateContactLink] Supabase error:', error)
    return { success: false, error: error.message }
  }

  // ── 4. 페이지 캐시 무효화 → 서버 컴포넌트 재렌더링 트리거 ──
  revalidatePath('/contact')

  return { success: true }
}
