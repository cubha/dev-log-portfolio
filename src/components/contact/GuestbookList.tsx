import { createClient } from '@/src/utils/supabase/server'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { GuestbookListClient } from './GuestbookListClient'
import type { GuestbookEntry } from '@/src/types/contact'

const PAGE_SIZE = 10

interface GuestbookListProps {
  isAdmin: boolean
  currentUserId: string | null
  currentUserName: string | null
  page: number
}

/**
 * 방명록 목록 (서버 컴포넌트)
 *
 * 서버사이드 페이지네이션: Supabase range + count 사용
 * - getCurrentUserRole()은 cache()로 래핑되어 중복 호출 없음
 * - 댓글 수/좋아요 쿼리는 Promise.all()로 병렬 실행
 */
export async function GuestbookList({
  isAdmin,
  currentUserId,
  currentUserName,
  page,
}: GuestbookListProps) {
  const supabase = await createClient()

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from('guestbook')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('[GuestbookList] fetch error:', error)
    return null
  }

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const entryIds = (data ?? []).map((e) => e.id)
  const safeIds = entryIds.length > 0 ? entryIds : [-1]

  // 댓글 수 + 좋아요 병렬 조회 (+ 캐시된 유저 정보 재사용)
  const [{ data: commentRows }, { data: likeRows }, { user }] = await Promise.all([
    supabase.from('guestbook_comments').select('guestbook_id').in('guestbook_id', safeIds),
    supabase.from('guestbook_likes').select('guestbook_id, user_id').in('guestbook_id', safeIds),
    getCurrentUserRole(),
  ])

  const commentCounts: Record<number, number> = {}
  for (const row of commentRows ?? []) {
    commentCounts[row.guestbook_id] = (commentCounts[row.guestbook_id] ?? 0) + 1
  }

  const likeMap = new Map<number, { count: number; likedByMe: boolean }>()
  for (const like of likeRows ?? []) {
    const entry = likeMap.get(like.guestbook_id) ?? { count: 0, likedByMe: false }
    entry.count++
    if (user && like.user_id === user.id) entry.likedByMe = true
    likeMap.set(like.guestbook_id, entry)
  }

  const entries: GuestbookEntry[] = (data ?? []).map((row) => ({
    id: row.id,
    nickname: row.nickname,
    message: row.message,
    emoji: row.emoji,
    created_at: row.created_at,
    is_secret: row.is_secret ?? false,
    user_id: row.user_id ?? null,
    avatar_url: row.avatar_url ?? null,
    like_count: likeMap.get(row.id)?.count ?? 0,
    liked_by_me: likeMap.get(row.id)?.likedByMe ?? false,
  }))

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 bg-foreground/30 rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">방명록 목록</h2>
        {totalCount > 0 && (
          <span className="text-xs text-foreground/40">({totalCount})</span>
        )}
      </div>
      {entries.length === 0 && page === 1 ? (
        <div className="bg-surface border border-foreground/[0.08] rounded-2xl p-8 text-center">
          <p className="text-sm text-foreground/50">
            아직 방명록이 없어요. 첫 번째 메시지를 남겨주세요! 👋
          </p>
        </div>
      ) : (
        <GuestbookListClient
          entries={entries}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          commentCounts={commentCounts}
          currentPage={page}
          totalPages={totalPages}
        />
      )}
    </section>
  )
}
