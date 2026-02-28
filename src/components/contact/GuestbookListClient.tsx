'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { HiOutlineTrash, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { deleteGuestbookEntry } from '@/src/actions/guestbook'
import type { GuestbookEntry } from '@/src/types/contact'

const PAGE_SIZE = 10

const containerVariants = {
  show: { transition: { staggerChildren: 0.05 } },
}

interface GuestbookListClientProps {
  entries: GuestbookEntry[]
  isAdmin: boolean
  currentUserId: string | null
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
}: {
  entry: GuestbookEntry
  isAdmin: boolean
  currentUserId: string | null
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
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed">
          {entry.message}
        </p>
      </div>
    </motion.div>
  )
}

export function GuestbookListClient({
  entries,
  isAdmin,
  currentUserId,
}: GuestbookListClientProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(entries.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const pageEntries = entries.slice(start, start + PAGE_SIZE)

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-0"
      >
        {pageEntries.map((entry) => (
          <GuestbookItem
            key={entry.id}
            entry={entry}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
          />
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-4 border-t border-foreground/5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="이전 페이지"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs text-foreground/50 tabular-nums">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="다음 페이지"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
