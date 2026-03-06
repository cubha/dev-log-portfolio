import { createClient } from '@/src/utils/supabase/server'
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

  const entries: GuestbookEntry[] = (data ?? []).map((row) => ({
    id: row.id,
    nickname: row.nickname,
    message: row.message,
    emoji: row.emoji,
    created_at: row.created_at,
    is_secret: row.is_secret ?? false,
    user_id: row.user_id ?? null,
    avatar_url: row.avatar_url ?? null,
  }))

  // 현재 페이지 항목들의 댓글 수 조회
  const entryIds = entries.map((e) => e.id)
  const { data: commentRows } = await supabase
    .from('guestbook_comments')
    .select('guestbook_id')
    .in('guestbook_id', entryIds.length > 0 ? entryIds : [-1])

  const commentCounts: Record<number, number> = {}
  for (const row of commentRows ?? []) {
    commentCounts[row.guestbook_id] = (commentCounts[row.guestbook_id] ?? 0) + 1
  }

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
        <div className="bg-background border-[0.5px] border-foreground/10 rounded-2xl p-8 text-center">
          <p className="text-sm text-foreground/50">
            아직 방명록이 없어요. 첫 번째 메시지를 남겨주세요! 👋
          </p>
        </div>
      ) : (
        <div className="bg-background border-[0.5px] border-foreground/10 rounded-2xl overflow-hidden px-4">
          <GuestbookListClient
            entries={entries}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            commentCounts={commentCounts}
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      )}
    </section>
  )
}
