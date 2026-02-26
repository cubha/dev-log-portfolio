'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createGuestbookEntry } from '@/src/actions/guestbook'
import type { CreateGuestbookInput } from '@/src/types/contact'

const EMOJI_OPTIONS = ['👋', '🔥', '💻', '✨', '🚀', '🎉', '👍', '💡'] as const

export function GuestbookForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateGuestbookInput>({
    emoji: '👋',
    nickname: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    const result = await createGuestbookEntry(formData)
    setIsLoading(false)

    if (result.success) {
      setFormData({ emoji: '👋', nickname: '', message: '' })
      toast.success('방명록이 등록되었습니다.')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 bg-foreground/30 rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">방명록</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3.5 flex flex-col">
        {/* 이모지 선택기 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            이모지
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, emoji }))}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl transition-all
                  ${
                    formData.emoji === emoji
                      ? 'ring-2 ring-brand-primary bg-brand-primary/10'
                      : 'bg-brand-primary/5 hover:bg-brand-primary/10'
                  }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 닉네임 */}
        <div>
          <label
            htmlFor="guestbook-nickname"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            닉네임
          </label>
          <input
            id="guestbook-nickname"
            type="text"
            value={formData.nickname}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nickname: e.target.value }))
            }
            maxLength={20}
            className="w-full h-11 px-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all text-sm text-foreground placeholder:text-foreground/30"
            placeholder="닉네임 (최대 20자)"
          />
        </div>

        {/* 메시지 */}
        <div>
          <label
            htmlFor="guestbook-message"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            메시지
          </label>
          <textarea
            id="guestbook-message"
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            maxLength={200}
            rows={3}
            className="w-full flex-1 px-3 py-2 bg-brand-primary/5 border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all resize-none text-sm text-foreground placeholder:text-foreground/30"
            placeholder="방명록을 남겨주세요 (최대 200자)"
          />
        </div>

        {/* 등록 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-silver-metal animate-shine text-white dark:text-slate-950 text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '등록 중...' : '등록'}
        </button>
      </form>
    </motion.section>
  )
}
