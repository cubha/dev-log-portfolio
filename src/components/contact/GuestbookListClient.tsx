'use client'

import { useCallback, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Heart, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { deleteGuestbookEntry, toggleEntryLike } from '@/src/actions/guestbook'
import { GuestbookCommentSection } from './GuestbookCommentSection'
import type { GuestbookEntry } from '@/src/types/contact'

const containerVariants = {
  show: { transition: { staggerChildren: 0.05 } },
}

interface EntryLikeState {
  count: number
  likedByMe: boolean
}

interface GuestbookListClientProps {
  entries: GuestbookEntry[]
  isAdmin: boolean
  currentUserId: string | null
  currentUserName: string | null
  commentCounts: Record<number, number>
  currentPage: number
  totalPages: number
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function GuestbookItem({
  entry,
  isAdmin,
  currentUserId,
  currentUserName,
  commentCount,
  likeState,
  onLike,
}: {
  entry: GuestbookEntry
  isAdmin: boolean
  currentUserId: string | null
  currentUserName: string | null
  commentCount: number
  likeState: EntryLikeState
  onLike: () => void
}) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteGuestbookEntry(entry.id)
    if (result.success) {
      toast.success('방명록이 삭제되었습니다.')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* 4열 행 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '52px minmax(140px, 180px) 1fr minmax(100px, 160px)',
        gap: 20,
        padding: '24px 0',
        alignItems: 'start',
      }}>
        {/* 이모지 / 아바타 */}
        <div>
          {entry.avatar_url ? (
            <Image src={entry.avatar_url} alt="" width={32} height={32} unoptimized style={{ borderRadius: '50%' }} />
          ) : (
            <span style={{ fontSize: 22 }}>{entry.emoji}</span>
          )}
        </div>

        {/* 닉네임 + 날짜 */}
        <div>
          <div className="h-4" style={{ marginBottom: 4, color: 'var(--fg)' }}>
            {entry.nickname}
            {entry.is_secret && entry.user_id === currentUserId && (
              <span className="sv-mono text-subtle" style={{ fontSize: 10, marginLeft: 8 }}>🔒</span>
            )}
            {entry.is_secret && isAdmin && entry.user_id !== currentUserId && (
              <span className="sv-mono" style={{ fontSize: 10, color: '#F59E0B', marginLeft: 8 }}>🔒</span>
            )}
          </div>
          <div className="sv-mono text-subtle" style={{ fontSize: 11 }}>{formatDate(entry.created_at)}</div>
          {isAdmin && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)', marginTop: 8, padding: 0 }}
              title="삭제"
            >
              <Trash2 style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>

        {/* 메시지 */}
        <div style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
          {entry.message}
        </div>

        {/* 좋아요 + 댓글 */}
        <div className="sv-mono text-muted" style={{ fontSize: 12, textAlign: 'right' }}>
          <button
            type="button"
            onClick={onLike}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              color: likeState.likedByMe ? '#F43F5E' : 'var(--fg-muted)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
          >
            <Heart style={{ width: 13, height: 13 }} fill={likeState.likedByMe ? 'currentColor' : 'none'} />
            {likeState.count}
          </button>
          <span style={{ margin: '0 6px', color: 'var(--border-strong)' }}>·</span>
          <span>💬 {commentCount}</span>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <GuestbookCommentSection
        guestbookId={entry.id}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        commentCount={commentCount}
      />
    </motion.div>
  )
}

/** 페이지 번호 배열 생성 (ellipsis 포함) */
function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) {
    pages.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('ellipsis')
  }

  pages.push(total)
  return pages
}

export function GuestbookListClient({
  entries,
  isAdmin,
  currentUserId,
  currentUserName,
  commentCounts,
  currentPage,
  totalPages,
}: GuestbookListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // 원글 좋아요 상태 (낙관적 업데이트)
  const [entryLikes, setEntryLikes] = useState<Record<number, EntryLikeState>>(() =>
    Object.fromEntries(
      entries.map((e) => [e.id, { count: e.like_count, likedByMe: e.liked_by_me }])
    )
  )

  const handleEntryLike = async (entryId: number) => {
    if (!currentUserId) {
      toast.error('좋아요는 로그인 후 가능합니다.')
      return
    }

    // 낙관적 업데이트
    setEntryLikes((prev) => {
      const cur = prev[entryId] ?? { count: 0, likedByMe: false }
      return {
        ...prev,
        [entryId]: {
          count: cur.likedByMe ? cur.count - 1 : cur.count + 1,
          likedByMe: !cur.likedByMe,
        },
      }
    })

    const result = await toggleEntryLike(entryId)
    if (!result.success) {
      toast.error(result.error)
      // 롤백
      router.refresh()
    }
  }

  const navigateToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (page === 1) {
        params.delete('guestbookPage')
      } else {
        params.set('guestbookPage', String(page))
      }
      const query = params.toString()
      startTransition(() => {
        router.push(`/contact${query ? `?${query}` : ''}`, { scroll: false })
      })
    },
    [router, searchParams, startTransition]
  )

  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {entries.map((entry) => (
          <GuestbookItem
            key={entry.id}
            entry={entry}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            commentCount={commentCounts[entry.id] ?? 0}
            likeState={entryLikes[entry.id] ?? { count: entry.like_count, likedByMe: entry.liked_by_me }}
            onLike={() => handleEntryLike(entry.id)}
          />
        ))}
      </motion.div>
      <div style={{ borderTop: '1px solid var(--border)' }} />

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '32px 0 0' }}>
          <button
            type="button"
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 6, opacity: currentPage === 1 ? 0.3 : 1 }}
            aria-label="이전 페이지"
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>

          {pageNumbers.map((item, idx) =>
            item === 'ellipsis' ? (
              <span key={`e-${idx}`} className="sv-mono text-subtle" style={{ fontSize: 11, padding: '0 4px' }}>···</span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => navigateToPage(item)}
                className="sv-mono"
                style={{
                  width: 32, height: 32, background: 'none', cursor: 'pointer', fontSize: 12,
                  border: item === currentPage ? '1px solid var(--border-strong)' : '1px solid transparent',
                  color: item === currentPage ? 'var(--fg)' : 'var(--fg-muted)',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 6, opacity: currentPage === totalPages ? 0.3 : 1 }}
            aria-label="다음 페이지"
          >
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}
    </div>
  )
}
