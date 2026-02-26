import { createClient } from '@/src/utils/supabase/server'
import { GuestbookListClient } from './GuestbookListClient'
import type { GuestbookEntry } from '@/src/types/contact'

interface GuestbookListProps {
  isAdmin: boolean
}

/**
 * 방명록 목록 (서버 컴포넌트)
 *
 * guestbook 테이블을 최신순으로 조회하고, 관리자에게 삭제 버튼을 노출합니다.
 */
export async function GuestbookList({ isAdmin }: GuestbookListProps) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[GuestbookList] fetch error:', error)
    return null
  }

  const entries: GuestbookEntry[] = (data ?? []).map((row) => ({
    id: row.id,
    nickname: row.nickname,
    message: row.message,
    emoji: row.emoji,
    created_at: row.created_at,
  }))

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 bg-foreground/30 rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">방명록 목록</h2>
      </div>
      {entries.length === 0 ? (
        <div className="bg-background border-[0.5px] border-foreground/10 rounded-2xl p-8 text-center">
          <p className="text-sm text-foreground/50">
            아직 방명록이 없어요. 첫 번째 메시지를 남겨주세요! 👋
          </p>
        </div>
      ) : (
        <div className="bg-background border-[0.5px] border-foreground/10 rounded-2xl overflow-hidden px-4">
          <GuestbookListClient entries={entries} isAdmin={isAdmin} />
        </div>
      )}
    </section>
  )
}
