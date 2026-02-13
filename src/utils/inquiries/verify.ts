import { createClient } from '@/src/utils/supabase/client'

/**
 * 문의 비밀번호 검증
 * 
 * @param inquiryId - 문의 ID
 * @param password - 입력된 비밀번호
 * @returns 검증 성공 여부
 */
export async function verifyInquiryPassword(
  inquiryId: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  try {
    // 문의 조회
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .select('password')
      .eq('id', inquiryId)
      .single()

    if (error || !inquiry) {
      return { success: false, error: '문의를 찾을 수 없습니다.' }
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password)

    // 비밀번호 비교
    if (passwordHash !== inquiry.password) {
      return { success: false, error: '비밀번호가 일치하지 않습니다.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to verify password:', error)
    return { success: false, error: '비밀번호 검증에 실패했습니다.' }
  }
}

/**
 * 비밀번호 해싱 (create.ts와 동일)
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
