'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/src/utils/supabase/client'
import { SilverButton } from '@/src/components/common/SilverButton'
import { createGuestbookEntry } from '@/src/actions/guestbook'
import type { CreateGuestbookInput } from '@/src/types/contact'

const EMOJI_OPTIONS = ['👋', '🔥', '💻', '✨', '🚀', '🎉', '👍', '💡'] as const

interface GuestbookFormProps {
  user: User | null
}

export function GuestbookForm({ user }: GuestbookFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateGuestbookInput>({
    emoji: '👋',
    nickname: '',
    message: '',
    is_secret: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CreateGuestbookInput = {
      ...formData,
      is_secret: user != null ? formData.is_secret : false,
    }

    setIsLoading(true)
    const result = await createGuestbookEntry(payload)
    setIsLoading(false)

    if (result.success) {
      setFormData({ emoji: '👋', nickname: '', message: '', is_secret: false })
      toast.success('방명록이 등록되었습니다.')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const handleOAuthLogin = () => {
    createClient().auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
  }

  const displayName =
    (user?.user_metadata?.user_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    'GitHub User'
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

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

        {/* 익명: 닉네임 입력 | 로그인: GitHub 프로필 */}
        {user == null ? (
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
        ) : (
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt=""
                width={24}
                height={24}
                unoptimized
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-foreground/10" />
            )}
            <span className="text-sm text-foreground/60">
              {formData.is_secret
                ? `🔒 ${displayName}으로 비밀글 남기는 중`
                : `${displayName}으로 남기는 중`}
            </span>
          </div>
        )}

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

        {/* 익명: GitHub 로그인 유도 | 로그인: 비밀글 토글 */}
        {user == null ? (
          <button
            type="button"
            onClick={handleOAuthLogin}
            className="w-full border border-foreground/15 rounded-xl text-sm text-foreground/50 py-2"
          >
            🔒 비밀글은 GitHub 로그인 후 작성 가능
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center justify-between"
            >
              <span
                className={`text-sm ${
                  formData.is_secret ? 'text-brand-primary' : 'text-foreground/70'
                }`}
              >
                🔒 비밀글로 남기기
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={formData.is_secret}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, is_secret: !prev.is_secret }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  formData.is_secret
                    ? 'bg-brand-primary'
                    : 'bg-foreground/15 ring-1 ring-inset ring-foreground/20'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    formData.is_secret ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* 등록 버튼 */}
        <SilverButton
          type="submit"
          size="form"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? '등록 중...' : '등록'}
        </SilverButton>
      </form>
    </motion.section>
  )
}
