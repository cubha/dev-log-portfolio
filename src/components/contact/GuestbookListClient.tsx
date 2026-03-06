'use client'

import { useCallback, useTransition } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { deleteGuestbookEntry } from '@/src/actions/guestbook'
import { GuestbookCommentSection } from './GuestbookCommentSection'
import type { GuestbookEntry } from '@/src/types/contact'

const containerVariants = {
  show: { transition: { staggerChildren: 0.05 } },
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
}: {
  entry: GuestbookEntry
  isAdmin: boolean
  currentUserId: string | null
  currentUserName: string | null
  commentCount: number
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

  const secretBadge =
    entry.is_secret && entry.user_id === currentUserId ? (
      <span className="text-xs text-foreground/50">🔒 내 비밀글</span>
    ) : entry.is_secret && isAdmin ? (
      <span className="text-xs text-amber-500/70">🔒 비밀글</span>
    ) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 py-3 border-b border-foreground/5 last:border-b-0"
    >
      {entry.avatar_url ? (
        <Image
          src={entry.avatar_url}
          alt=""
          width={28}
          height={28}
          unoptimized
          className="flex-shrink-0 rounded-full"
        />
      ) : (
        <span className="flex-shrink-0 text-xl">{entry.emoji}</span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-sm font-medium text-foreground">
              {entry.nickname}
            </span>
            {secretBadge}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-foreground/50">
              {formatDate(entry.created_at)}
            </span>
            {isAdmin && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-1 text-foreground/40 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed">
          {entry.message}
        </p>

        {/* 댓글 섹션 */}
        <GuestbookCommentSection
          guestbookId={entry.id}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          commentCount={commentCount}
        />
      </div>
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
    <div className={isPending ? 'opacity-60 transition-opacity' : ''}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-0"
      >
        {entries.map((entry) => (
          <GuestbookItem
            key={entry.id}
            entry={entry}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            commentCount={commentCounts[entry.id] ?? 0}
          />
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-4 border-t border-foreground/5">
          {/* 이전 */}
          <button
            type="button"
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 페이지 번호 */}
          {pageNumbers.map((item, idx) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 text-center text-xs text-foreground/30"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => navigateToPage(item)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  item === currentPage
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {item}
              </button>
            )
          )}

          {/* 다음 */}
          <button
            type="button"
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
