'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/src/utils/supabase/client'
import { createGuestbookEntry } from '@/src/actions/guestbook'
import {
  getOrCreateGuestNickname,
  refreshGuestNickname,
} from '@/src/utils/nickname/generateNickname'
import type { CreateGuestbookInput } from '@/src/types/contact'

const EMOJI_OPTIONS = ['👋', '🔥', '🖥', '✨', '🚀', '🎨', '👍', '💡'] as const

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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* 이모지 선택 */}
      <div>
        <div className="sv-label" style={{ marginBottom: 12 }}>이모지</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, emoji }))}
              style={{
                width: 44, height: 44,
                border: formData.emoji === emoji
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border)',
                background: 'transparent',
                fontSize: 18, cursor: 'pointer',
                borderRadius: 2,
                transition: 'border-color 0.15s',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 닉네임 / 로그인 */}
      {user == null ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 16 }}>
          <div>
            <div className="sv-label" style={{ marginBottom: 8 }}>닉네임</div>
            <div style={{ position: 'relative' }}>
              <input
                id="guestbook-nickname"
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                maxLength={20}
                className="sv-input"
                placeholder="닉네임 (최대 20자)"
                style={{ paddingRight: 32 }}
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, nickname: refreshGuestNickname() }))}
                title="닉네임 재생성"
                style={{
                  position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)', padding: 4,
                }}
              >
                <RefreshCw style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
          <div>
            <div className="sv-label" style={{ marginBottom: 8 }}>로그인</div>
            <button
              type="button"
              onClick={handleOAuthLogin}
              className="btn"
              style={{ width: '100%', padding: '10px 14px', fontSize: 12, justifyContent: 'center' }}
            >
              GITHUB →
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" width={28} height={28} unoptimized style={{ borderRadius: '50%' }} />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-2)' }} />
          )}
          <span className="text-muted" style={{ fontSize: 13 }}>
            {formData.is_secret ? `🔒 ${displayName}으로 비밀글 남기는 중` : `${displayName}으로 남기는 중`}
          </span>
        </div>
      )}

      {/* 메시지 */}
      <div>
        <div className="sv-label" style={{ marginBottom: 8 }}>메시지</div>
        <textarea
          id="guestbook-message"
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          maxLength={200}
          rows={5}
          placeholder="방명록을 남겨주세요 (최대 200자)"
          className="sv-input"
          style={{ resize: 'none', borderBottom: '1px solid var(--border-strong)', padding: '14px 0', fontFamily: 'inherit', width: '100%' }}
        />
      </div>

      {/* 비밀글 토글 (로그인 유저) */}
      {user != null && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="text-muted" style={{ fontSize: 13 }}>🔒 비밀글로 남기기</span>
          <button
            type="button"
            role="switch"
            aria-checked={formData.is_secret}
            onClick={() => setFormData((prev) => ({ ...prev, is_secret: !prev.is_secret }))}
            className={`relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer ${formData.is_secret ? 'bg-silver-metal' : 'bg-[var(--surface)]'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.is_secret ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
      )}

      {/* 등록 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
        style={{ alignSelf: 'flex-start' }}
      >
        {isLoading ? '등록 중...' : '방명록 등록'} <span className="arrow">→</span>
      </button>
    </form>
  )
}
