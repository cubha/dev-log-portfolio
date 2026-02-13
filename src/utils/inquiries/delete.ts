import { createClient } from '@/src/utils/supabase/client'

/**
 * 문의 삭제
 * 
 * 관리자가 아닌 경우 비밀번호를 확인합니다.
 */
export async function deleteInquiry(
  inquiryId: string,
  password: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  // 비밀번호가 제공된 경우 (일반 사용자)
  if (password !== null) {
    // 기존 문의 조회
    const { data: inquiry, error: fetchError } = await supabase
      .from('inquiries')
      .select('password')
      .eq('id', inquiryId)
      .single()

    if (fetchError || !inquiry) {
      return { success: false, error: '문의를 찾을 수 없습니다.' }
    }

    // 비밀번호 확인
    const passwordHash = await hashPassword(password)
    if (passwordHash !== inquiry.password) {
      return { success: false, error: '비밀번호가 일치하지 않습니다.' }
    }
  }

  // 삭제 실행
  const { error: deleteError } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', inquiryId)

  if (deleteError) {
    console.error('Failed to delete inquiry:', deleteError)
    return { success: false, error: '삭제에 실패했습니다.' }
  }

  return { success: true }
}

/**
 * 간단한 비밀번호 해싱
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
