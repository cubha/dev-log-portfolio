'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/src/utils/supabase/client'
import { SilverButton } from '@/src/components/common/SilverButton'
import { createGuestbookEntry } from '@/src/actions/guestbook'
import {
  getOrCreateGuestNickname,
  refreshGuestNickname,
} from '@/src/utils/nickname/generateNickname'
import type { CreateGuestbookInput } from '@/src/types/contact'

const EMOJI_OPTIONS = ['👋', '🔥', '💻', '✨', '🚀', '🎉', '👍', '💡'] as const

interface GuestbookFormProps {
  user: User | null
  isAdmin?: boolean
  displayName: string | null
  avatarUrl: string | null
}

export function GuestbookForm({ user, isAdmin = false, displayName, avatarUrl }: GuestbookFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateGuestbookInput>({
    emoji: '👋',
    nickname: '',
    message: '',
    is_secret: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  // 비로그인 상태: 마운트 시 닉네임 자동 생성/복원
  useEffect(() => {
    if (user == null) {
      setFormData((prev) => ({ ...prev, nickname: getOrCreateGuestNickname() }))
    }
  }, [user])

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
      setFormData((prev) => ({ ...prev, emoji: '👋', message: '', is_secret: false }))
      toast.success('방명록이 등록되었습니다.')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const handleOAuthLogin = () => {
    const next = encodeURIComponent(window.location.pathname + window.location.search)
    createClient().auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    })
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

        {/* 익명: 닉네임 입력 + GitHub 로그인 유도 | 로그인: 프로필 표시 */}
        {user == null ? (
          <div className="space-y-2">
            <label
              htmlFor="guestbook-nickname"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              닉네임
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="guestbook-nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nickname: e.target.value }))
                  }
                  maxLength={20}
                  className="w-full h-11 pl-3 pr-9 bg-brand-primary/5 border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all text-sm text-foreground placeholder:text-foreground/30"
                  placeholder="닉네임 (최대 20자)"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, nickname: refreshGuestNickname() }))
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                  title="닉네임 재생성"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleOAuthLogin}
                className="h-11 px-3 flex items-center gap-1.5 bg-foreground/5 border border-foreground/15 rounded-xl text-xs text-foreground/60 hover:bg-foreground/10 hover:text-foreground transition-all whitespace-nowrap"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub 로그인
              </button>
            </div>
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
            rows={10}
            className="w-full flex-1 px-3 py-2 bg-brand-primary/5 border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all resize-none text-sm text-foreground placeholder:text-foreground/30"
            placeholder="방명록을 남겨주세요 (최대 200자)"
          />
        </div>

        {/* 로그인 유저: 비밀글 토글 */}
        {user != null && (
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
