'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Heart, Trash2, MessageCircle, Send, LogIn, RefreshCw, Check } from 'lucide-react'
import { createClient } from '@/src/utils/supabase/client'
import {
  getGuestbookComments,
  createGuestbookComment,
  deleteGuestbookComment,
  toggleCommentLike,
} from '@/src/actions/guestbook'
import {
  getOrCreateGuestNickname,
  refreshGuestNickname,
  STORAGE_KEY,
} from '@/src/utils/nickname/generateNickname'
import type { GuestbookComment } from '@/src/types/contact'

interface GuestbookCommentSectionProps {
  guestbookId: number
  isAdmin: boolean
  currentUserId: string | null
  currentUserName: string | null
  commentCount: number
}

function formatCommentDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function GuestbookCommentSection({
  guestbookId,
  isAdmin,
  currentUserId,
  currentUserName,
  commentCount: initialCount,
}: GuestbookCommentSectionProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [comments, setComments] = useState<GuestbookComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [commentCount, setCommentCount] = useState(initialCount)

  // 댓글 입력 폼
  const [nickname, setNickname] = useState('')
  const [nicknameMode, setNicknameMode] = useState<'auto' | 'edit'>('auto')
  const [editValue, setEditValue] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editInputRef = useRef<HTMLInputElement>(null)

  const isLoggedIn = currentUserId !== null

  // 비로그인 상태: 마운트 시 닉네임 자동 생성/복원
  useEffect(() => {
    if (!isLoggedIn) {
      setNickname(getOrCreateGuestNickname())
    }
  }, [isLoggedIn])

  const handleOAuthLogin = () => {
    const next = encodeURIComponent(window.location.pathname + window.location.search)
    createClient().auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    })
  }

  const fetchComments = async () => {
    setIsLoading(true)
    const data = await getGuestbookComments(guestbookId)
    setComments(data)
    setCommentCount(data.length)
    setIsLoading(false)
  }

  const handleToggle = () => {
    if (!isOpen) {
      fetchComments()
    }
    setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await createGuestbookComment({
      guestbook_id: guestbookId,
      nickname: isLoggedIn ? undefined : nickname,
      message,
    })

    setIsSubmitting(false)

    if (result.success) {
      setMessage('')
      toast.success('댓글이 등록되었습니다.')
      await fetchComments()
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (commentId: number) => {
    const result = await deleteGuestbookComment(commentId)
    if (result.success) {
      toast.success('댓글이 삭제되었습니다.')
      await fetchComments()
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const handleLike = async (commentId: number) => {
    if (!isLoggedIn) {
      toast.error('좋아요는 로그인 후 가능합니다.')
      return
    }

    // 낙관적 업데이트
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              liked_by_me: !c.liked_by_me,
              like_count: c.liked_by_me ? c.like_count - 1 : c.like_count + 1,
            }
          : c
      )
    )

    const result = await toggleCommentLike(commentId)
    if (!result.success) {
      toast.error(result.error)
      await fetchComments()
    }
  }

  return (
    <div className="mt-1">
      {/* 토글 버튼 */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/60 transition-colors py-1"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>댓글{commentCount > 0 ? ` ${commentCount}` : ''}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-3 border-l-2 border-foreground/8 ml-1 mt-2 space-y-2">
              {/* 로딩 */}
              {isLoading && (
                <p className="text-xs text-foreground/40 py-2">불러오는 중...</p>
              )}

              {/* 댓글 없음 */}
              {!isLoading && comments.length === 0 && (
                <p className="text-xs text-foreground/40 py-2">
                  아직 댓글이 없습니다.
                </p>
              )}

              {/* 댓글 목록 */}
              {!isLoading &&
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2 py-1.5 group">
                    {comment.avatar_url ? (
                      <Image
                        src={comment.avatar_url}
                        alt=""
                        width={20}
                        height={20}
                        unoptimized
                        className="flex-shrink-0 w-5 h-5 rounded-full object-cover mt-0.5"
                      />
                    ) : (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground/8 flex items-center justify-center mt-0.5">
                        <span className="text-[10px]">💬</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-foreground">
                          {comment.nickname}
                        </span>
                        <span className="text-[10px] text-foreground/35">
                          {formatCommentDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/60 mt-0.5 whitespace-pre-line">
                        {comment.message}
                      </p>

                      {/* 좋아요 + 삭제 */}
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          type="button"
                          onClick={() => handleLike(comment.id)}
                          className={`flex items-center gap-1 text-[10px] transition-colors ${
                            comment.liked_by_me
                              ? 'text-rose-500'
                              : 'text-foreground/30 hover:text-rose-400'
                          }`}
                        >
                          <Heart
                            className="w-3 h-3"
                            fill={comment.liked_by_me ? 'currentColor' : 'none'}
                          />
                          {comment.like_count > 0 && (
                            <span>{comment.like_count}</span>
                          )}
                        </button>

                        {(isAdmin ||
                          (comment.user_id !== null &&
                            comment.user_id === currentUserId)) && (
                          <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                            className="text-foreground/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              {/* 댓글 입력 폼 */}
              <div className="pt-1 pb-2 space-y-1.5">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  {isLoggedIn ? (
                    <input
                      type="text"
                      value={currentUserName ?? ''}
                      readOnly
                      className="w-20 shrink-0 px-2 py-1.5 text-xs bg-foreground/5 border border-foreground/10 rounded-lg text-foreground/60 cursor-default select-none"
                    />
                  ) : nicknameMode === 'auto' ? (
                    /* 자동생성 모드: 재생성 아이콘을 버튼 내부에 배치 */
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditValue(nickname)
                          setNicknameMode('edit')
                          setTimeout(() => editInputRef.current?.focus(), 0)
                        }}
                        className="pl-2 pr-6 py-1.5 text-xs bg-foreground/5 border border-foreground/10 rounded-lg text-foreground/70 hover:text-foreground hover:bg-foreground/8 transition-colors whitespace-nowrap"
                        title="클릭하여 직접 입력"
                      >
                        {nickname}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setNickname(refreshGuestNickname())
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/60 transition-colors"
                        title="닉네임 재생성"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    /* 직접입력 모드 */
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        maxLength={20}
                        placeholder="닉네임"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const trimmed = editValue.trim()
                            if (trimmed) {
                              setNickname(trimmed)
                              localStorage.setItem(STORAGE_KEY, trimmed)
                            }
                            setNicknameMode('auto')
                          } else if (e.key === 'Escape') {
                            setNicknameMode('auto')
                          }
                        }}
                        className="w-28 px-2 py-1.5 text-xs bg-foreground/5 border border-foreground/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/30 text-foreground placeholder:text-foreground/30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = editValue.trim()
                          if (trimmed) {
                            setNickname(trimmed)
                            localStorage.setItem(STORAGE_KEY, trimmed)
                          }
                          setNicknameMode('auto')
                        }}
                        className="p-1.5 text-foreground/30 hover:text-foreground/60 transition-colors"
                        title="확정"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={150}
                    placeholder="댓글을 입력하세요"
                    className="flex-1 min-w-0 px-2 py-1.5 text-xs bg-foreground/5 border border-foreground/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 text-foreground placeholder:text-foreground/30"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="p-1.5 text-foreground/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleOAuthLogin}
                    className="flex items-center gap-1 text-[10px] text-foreground/35 hover:text-foreground/60 transition-colors"
                  >
                    <LogIn className="w-3 h-3" />
                    GitHub 로그인하면 닉네임 자동 설정
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
