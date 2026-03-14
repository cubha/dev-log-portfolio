'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/utils/supabase/server'
import type {
  ActionResult,
  CreateGuestbookInput,
  CreateCommentInput,
  GuestbookComment,
} from '@/src/types/contact'

const NICKNAME_MAX_LENGTH = 20
const MESSAGE_MAX_LENGTH = 200
const COMMENT_MAX_LENGTH = 150

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

  // 로그인 유저 닉네임 결정: 관리자 > GitHub OAuth > 이메일 순
  let loggedInNickname = 'User'
  if (user != null) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id, role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      loggedInNickname = 'Admin'
    } else {
      const isGitHub = user.app_metadata?.provider === 'github'
      if (isGitHub) {
        loggedInNickname =
          (user.user_metadata?.user_name as string | undefined) ??
          (user.user_metadata?.name as string | undefined) ??
          'GitHub User'
      } else {
        loggedInNickname = profile?.user_id ?? user.email?.split('@')[0] ?? 'User'
      }
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

// ── 댓글 관련 ────────────────────────────────────────

/** 로그인 유저 닉네임 결정 (공통 헬퍼) */
async function resolveLoggedInNickname(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: { id: string; app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown>; email?: string }
): Promise<{ nickname: string; avatarUrl: string | null }> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id, role')
    .eq('id', user.id)
    .single()

  let nickname = 'User'
  if (profile?.role === 'admin') {
    nickname = 'Admin'
  } else {
    const isGitHub = user.app_metadata?.provider === 'github'
    if (isGitHub) {
      nickname =
        (user.user_metadata?.user_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        'GitHub User'
    } else {
      nickname = profile?.user_id ?? user.email?.split('@')[0] ?? 'User'
    }
  }

  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null
  return { nickname, avatarUrl }
}

/**
 * 방명록 댓글 목록 조회
 */
export async function getGuestbookComments(
  guestbookId: number
): Promise<GuestbookComment[]> {
  const supabase = await createClient()

  // auth.getUser()와 댓글 목록 조회를 병렬 실행
  const [
    { data: { user } },
    { data: comments, error },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('guestbook_comments')
      .select('*')
      .eq('guestbook_id', guestbookId)
      .order('created_at', { ascending: true }),
  ])

  if (error) {
    console.error('[getGuestbookComments] fetch error:', error)
    return []
  }

  const commentIds = (comments ?? []).map((c) => c.id)

  const { data: likes } = await supabase
    .from('guestbook_comment_likes')
    .select('comment_id, user_id')
    .in('comment_id', commentIds.length > 0 ? commentIds : [-1])

  const likeMap = new Map<number, { count: number; likedByMe: boolean }>()
  for (const like of likes ?? []) {
    const entry = likeMap.get(like.comment_id) ?? { count: 0, likedByMe: false }
    entry.count++
    if (user && like.user_id === user.id) entry.likedByMe = true
    likeMap.set(like.comment_id, entry)
  }

  return (comments ?? []).map((c) => ({
    id: c.id,
    guestbook_id: c.guestbook_id,
    user_id: c.user_id ?? null,
    nickname: c.nickname,
    message: c.message,
    avatar_url: c.avatar_url ?? null,
    created_at: c.created_at,
    like_count: likeMap.get(c.id)?.count ?? 0,
    liked_by_me: likeMap.get(c.id)?.likedByMe ?? false,
  }))
}

/**
 * 방명록 댓글 생성 (익명 허용)
 */
export async function createGuestbookComment(
  input: CreateCommentInput
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !input.nickname?.trim()) {
    return { success: false, error: '닉네임을 입력해 주세요.' }
  }
  if (!input.message?.trim()) {
    return { success: false, error: '댓글을 입력해 주세요.' }
  }
  if (input.message.trim().length > COMMENT_MAX_LENGTH) {
    return { success: false, error: `댓글은 최대 ${COMMENT_MAX_LENGTH}자까지 입력할 수 있습니다.` }
  }
  if (input.nickname && input.nickname.trim().length > NICKNAME_MAX_LENGTH) {
    return { success: false, error: `닉네임은 최대 ${NICKNAME_MAX_LENGTH}자까지 입력할 수 있습니다.` }
  }

  let insertData: {
    guestbook_id: number
    user_id: string | null
    nickname: string
    message: string
    avatar_url: string | null
  }

  if (user) {
    const { nickname, avatarUrl } = await resolveLoggedInNickname(supabase, user)
    insertData = {
      guestbook_id: input.guestbook_id,
      user_id: user.id,
      nickname,
      message: input.message.trim(),
      avatar_url: avatarUrl,
    }
  } else {
    insertData = {
      guestbook_id: input.guestbook_id,
      user_id: null,
      nickname: input.nickname!.trim(),
      message: input.message.trim(),
      avatar_url: null,
    }
  }

  const { error } = await supabase.from('guestbook_comments').insert(insertData)

  if (error) {
    console.error('[createGuestbookComment] Supabase error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/contact')
  return { success: true }
}

/**
 * 방명록 댓글 삭제 (작성자 본인 또는 관리자)
 */
export async function deleteGuestbookComment(
  commentId: number
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  const { data: comment } = await supabase
    .from('guestbook_comments')
    .select('user_id')
    .eq('id', commentId)
    .single()

  if (!comment) return { success: false, error: '댓글을 찾을 수 없습니다.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isOwner = comment.user_id === user.id
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) {
    return { success: false, error: '삭제 권한이 없습니다.' }
  }

  const { error } = await supabase
    .from('guestbook_comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    console.error('[deleteGuestbookComment] Supabase error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/contact')
  return { success: true }
}

/**
 * 방명록 원글 좋아요 토글 (로그인 유저 전용)
 */
export async function toggleEntryLike(
  entryId: number
): Promise<ActionResult & { liked?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  const { data: existing } = await supabase
    .from('guestbook_likes')
    .select('id')
    .eq('guestbook_id', entryId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('guestbook_likes')
      .delete()
      .eq('id', existing.id)

    if (error) {
      console.error('[toggleEntryLike] delete error:', error)
      return { success: false, error: error.message }
    }
    return { success: true, liked: false }
  } else {
    const { error } = await supabase
      .from('guestbook_likes')
      .insert({ guestbook_id: entryId, user_id: user.id })

    if (error) {
      console.error('[toggleEntryLike] insert error:', error)
      return { success: false, error: error.message }
    }
    return { success: true, liked: true }
  }
}

/**
 * 댓글 좋아요 토글 (로그인 유저 전용)
 */
export async function toggleCommentLike(
  commentId: number
): Promise<ActionResult & { liked?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  const { data: existing } = await supabase
    .from('guestbook_comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('guestbook_comment_likes')
      .delete()
      .eq('id', existing.id)

    if (error) {
      console.error('[toggleCommentLike] delete error:', error)
      return { success: false, error: error.message }
    }
    return { success: true, liked: false }
  } else {
    const { error } = await supabase
      .from('guestbook_comment_likes')
      .insert({ comment_id: commentId, user_id: user.id })

    if (error) {
      console.error('[toggleCommentLike] insert error:', error)
      return { success: false, error: error.message }
    }
    return { success: true, liked: true }
  }
}
