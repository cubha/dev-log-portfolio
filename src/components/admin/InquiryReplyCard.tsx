'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ChevronDown, CheckCircle, Clock, MessageSquare, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { replyToInquiry, deleteInquiryReply, adminDeleteInquiry } from '@/src/actions/inquiries'
import type { Inquiry } from '@/src/types/contact'

interface InquiryReplyCardProps {
  inquiry: Inquiry
}

/**
 * 관리자 문의 답변 카드 컴포넌트 (아코디언 UI)
 *
 * - 문의 내용 표시
 * - 답변 작성 / 수정 / 삭제 (인라인 폼)
 * - 비밀 답변 토글 (공개 문의에도 비밀 답변 가능)
 * - 관리자 전용 — 비밀번호 검증 불필요
 */
export function InquiryReplyCard({ inquiry }: InquiryReplyCardProps) {
  const router = useRouter()
  const [isOpen, setIsOpen]                   = useState(false)
  const [isEditing, setIsEditing]             = useState(false)
  const [replyText, setReplyText]             = useState(inquiry.reply ?? '')
  const [replyIsPublic, setReplyIsPublic]     = useState(inquiry.reply_is_public ?? true)
  const [isSubmitting, setIsSubmitting]       = useState(false)
  const [isDeleting, setIsDeleting]           = useState(false)
  const [isDeletingInquiry, setIsDeletingInquiry] = useState(false)

  const hasReply = !!inquiry.reply

  // ── 답변 저장 (등록 · 수정 공용) ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!replyText.trim()) {
      toast.error('답변 내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await replyToInquiry({
        inquiryId: inquiry.id,
        reply: replyText,
        replyIsPublic,
      })
      if (result.success) {
        toast.success('답변이 저장되었습니다.')
        setIsEditing(false)
        router.refresh()
      } else {
        toast.error(result.error ?? '저장에 실패했습니다.')
      }
    } catch {
      toast.error('저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── 문의 전체 삭제 ───────────────────────────────────────────────────────
  const handleDeleteInquiry = async () => {
    setIsDeletingInquiry(true)
    try {
      const result = await adminDeleteInquiry(inquiry.id)
      if (result.success) {
        toast.success('문의가 삭제되었습니다.')
        router.refresh()
      } else {
        toast.error(result.error ?? '삭제에 실패했습니다.')
      }
    } catch {
      toast.error('삭제에 실패했습니다.')
    } finally {
      setIsDeletingInquiry(false)
    }
  }

  // ── 답변 삭제 ─────────────────────────────────────────────────────────────
  const handleDeleteReply = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteInquiryReply(inquiry.id)
      if (result.success) {
        toast.success('답변이 삭제되었습니다.')
        setReplyText('')
        setReplyIsPublic(true)
        setIsEditing(false)
        router.refresh()
      } else {
        toast.error(result.error ?? '삭제에 실패했습니다.')
      }
    } catch {
      toast.error('삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="transition-all duration-200"
    >
      {/* ── 헤더 (클릭 가능 영역) ──────────────────────────────────────────── */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-4 cursor-pointer flex items-center gap-3 hover:bg-foreground/5 transition-colors"
      >
        {/* 답변 상태 아이콘 */}
        <div className="flex-shrink-0">
          {hasReply ? (
            <div className="w-8 h-8 rounded-lg bg-silver-metal flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-foreground/40" />
            </div>
          )}
        </div>

        {/* 제목 · 배지 · 날짜 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-sm font-semibold text-foreground truncate">{inquiry.title}</h3>
            {hasReply && (
              <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-foreground text-background rounded-full">
                답변완료
              </span>
            )}
            {hasReply && !inquiry.reply_is_public && (
              <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full">
                비밀답변
              </span>
            )}
            {!inquiry.is_public && (
              <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-foreground/10 text-foreground/70 rounded-full">
                비공개
              </span>
            )}
          </div>
          <div className="text-xs text-foreground/50">
            {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* 문의 삭제 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteInquiry()
          }}
          disabled={isDeletingInquiry}
          className="p-1.5 text-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors disabled:opacity-50"
          title="문의 삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* 화살표 */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-foreground/40"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>

      {/* ── 아코디언 내용 ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3 border-t border-foreground/8">
              {/* 문의 내용 */}
              <div className="pt-3">
                <div className="text-xs font-medium text-foreground/50 mb-1.5">문의 내용</div>
                <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed">
                  {inquiry.content}
                </p>
              </div>

              {/* ── 답변 섹션 ──────────────────────────────────────────────── */}
              <div>
                {hasReply && !isEditing ? (
                  // 기존 답변 표시 + 수정/삭제 버튼
                  <div className="p-3 bg-foreground/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-md bg-silver-metal flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">A</span>
                      </div>
                      <div className="text-xs font-medium text-foreground">관리자 답변</div>
                      {!inquiry.reply_is_public && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full flex items-center gap-0.5">
                          <EyeOff className="w-2.5 h-2.5" />비밀
                        </span>
                      )}
                      {inquiry.replied_at && (
                        <div className="text-[11px] text-foreground/50">
                          {new Date(inquiry.replied_at).toLocaleDateString('ko-KR')}
                        </div>
                      )}
                      {/* 수정 · 삭제 버튼 */}
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setReplyText(inquiry.reply ?? '')
                            setReplyIsPublic(inquiry.reply_is_public ?? true)
                            setIsEditing(true)
                          }}
                          className="p-1 text-foreground/40 hover:text-foreground hover:bg-foreground/10 rounded-md transition-colors"
                          title="답변 수정"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteReply()
                          }}
                          disabled={isDeleting}
                          className="p-1 text-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors disabled:opacity-50"
                          title="답변 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed ml-7">
                      {inquiry.reply}
                    </p>
                  </div>
                ) : (
                  // 답변 입력 폼 (신규 작성 · 수정)
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-foreground/50" />
                        <div className="text-xs font-medium text-foreground/50">
                          {isEditing ? '답변 수정' : '답변 작성'}
                        </div>
                      </div>
                      {/* 비밀 답변 토글 */}
                      <button
                        type="button"
                        onClick={() => setReplyIsPublic((prev) => !prev)}
                        className={[
                          'flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all',
                          replyIsPublic
                            ? 'border-foreground/10 text-foreground/50 hover:border-foreground/20 hover:bg-foreground/5'
                            : 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        ].join(' ')}
                      >
                        {replyIsPublic ? (
                          <><Eye className="w-3 h-3" />공개 답변</>
                        ) : (
                          <><EyeOff className="w-3 h-3" />비밀 답변</>
                        )}
                      </button>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      placeholder="답변 내용을 입력하세요..."
                      className="w-full px-3 py-2.5 text-sm bg-background border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 resize-none text-foreground placeholder:text-foreground/30 transition-all"
                    />
                    <div className="flex justify-end gap-2">
                      {isEditing && (
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            setReplyText(inquiry.reply ?? '')
                            setReplyIsPublic(inquiry.reply_is_public ?? true)
                          }}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 text-xs border border-foreground/10 rounded-lg text-foreground/60 hover:bg-foreground/5 transition-colors disabled:opacity-50"
                        >
                          취소
                        </button>
                      )}
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-xs bg-foreground text-background rounded-lg hover:bg-foreground/80 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? '저장 중...' : '답변 저장'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
