import type { Database } from './supabase'

/** Supabase contact_links 테이블의 Row 타입 */
export type ContactLink = Database['public']['Tables']['contact_links']['Row']

/** 인라인 수정 시 변경 가능한 필드 */
export type ContactLinkEditable = Pick<ContactLink, 'value' | 'href'>

/** 서버 액션 반환 타입 (판별 유니온) */
export type ActionResult =
  | { success: true }
  | { success: false; error: string }
