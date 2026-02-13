import { createClient } from '@/src/utils/supabase/client'

interface CreateInquiryParams {
  title: string
  password: string
  content: string
  isPublic: boolean
}

/**
 * 문의 생성
 * 
 * 비밀번호를 해싱하여 저장합니다.
 */
export async function createInquiry(params: CreateInquiryParams) {
  const supabase = createClient()

  // 간단한 해싱 (실제 프로덕션에서는 서버 측에서 bcrypt 사용 권장)
  const passwordHash = await hashPassword(params.password)

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      title: params.title,
      content: params.content,
      password: passwordHash,
      is_public: params.isPublic,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create inquiry:', error)
    throw error
  }

  return data
}

/**
 * 간단한 비밀번호 해싱
 * 
 * 실제 프로덕션에서는 bcrypt 사용 권장
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
