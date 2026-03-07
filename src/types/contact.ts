import type { Database } from './supabase'

/** Supabase contact_links 테이블의 Row 타입 */
export type ContactLink = Database['public']['Tables']['contact_links']['Row']

/** 인라인 수정 시 변경 가능한 필드 */
export type ContactLinkEditable = Pick<ContactLink, 'value' | 'href'>

/** 서버 액션 반환 타입 (판별 유니온) */
export type ActionResult =
  | { success: true }
  | { success: false; error: string }

/** 방명록(Guestbook) 항목 타입 */
export type GuestbookEntry = {
  id: number
  nickname: string
  message: string
  emoji: string
  created_at: string
  is_secret: boolean
  user_id: string | null
  avatar_url: string | null
  like_count: number
  liked_by_me: boolean
}

/** 방명록 생성 시 필요한 필드 */
export type CreateGuestbookInput = Pick<
  GuestbookEntry,
  'nickname' | 'message' | 'emoji'
> & { is_secret: boolean }

/** 방명록 댓글 타입 */
export type GuestbookComment = {
  id: number
  guestbook_id: number
  user_id: string | null
  nickname: string
  message: string
  avatar_url: string | null
  created_at: string
  like_count: number
  liked_by_me: boolean
}

/** 댓글 생성 시 필요한 필드 */
export type CreateCommentInput = {
  guestbook_id: number
  nickname?: string
  message: string
}
