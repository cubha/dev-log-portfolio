'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { HiOutlineTrash } from 'react-icons/hi'
import { deleteGuestbookEntry } from '@/src/actions/guestbook'
import type { GuestbookEntry } from '@/src/types/contact'

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

interface GuestbookListClientProps {
  entries: GuestbookEntry[]
  isAdmin: boolean
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
}: {
  entry: GuestbookEntry
  isAdmin: boolean
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
      variants={itemVariants}
      className="flex gap-3 py-3 border-b border-foreground/5 last:border-b-0"
    >
      <span className="flex-shrink-0 text-xl">{entry.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">
            {entry.nickname}
          </span>
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
}: GuestbookListClientProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-0"
    >
      {entries.map((entry) => (
        <GuestbookItem key={entry.id} entry={entry} isAdmin={isAdmin} />
      ))}
    </motion.div>
  )
}
