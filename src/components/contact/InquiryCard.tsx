'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineTrash, HiOutlineLockClosed, HiChevronDown, HiCheckCircle, HiClock } from 'react-icons/hi'
import { deleteInquiry } from '../../utils/inquiries/delete'
import { verifyInquiryPassword } from '../../utils/inquiries/verify'

interface InquiryCardProps {
  inquiry: {
    id: string
    title: string
    content: string
    reply: string | null
    replied_at: string | null
    created_at: string
    is_public: boolean
  }
  isAdmin: boolean
}

/**
 * Inquiry Card 컴포넌트 (아코디언 UI)
 * 
 * 개별 문의를 아코디언 형태로 표시하고, 답변 여부를 표시합니다.
 */
export function InquiryCard({ inquiry, isAdmin }: InquiryCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(isAdmin || inquiry.is_public)

  const hasReply = !!inquiry.reply
  const isPrivate = !inquiry.is_public

  const handleCardClick = () => {
    // 비공개 문의이고 잠겨있으면 비밀번호 모달 표시
    if (isPrivate && !isUnlocked) {
      setShowPasswordModal(true)
      return
    }
    // 그 외에는 토글
    setIsOpen(!isOpen)
  }

  const handlePasswordVerify = async () => {
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    setIsVerifying(true)

    try {
      const result = await verifyInquiryPassword(inquiry.id, password)
      
      if (result.success) {
        setIsUnlocked(true)
        setShowPasswordModal(false)
        setPassword('')
        setIsOpen(true)
      } else {
        alert(result.error || '비밀번호가 일치하지 않습니다.')
      }
    } catch (error) {
      console.error('Failed to verify password:', error)
      alert('비밀번호 검증에 실패했습니다.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDelete = async () => {
    if (!isAdmin && !password.trim()) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteInquiry(inquiry.id, isAdmin ? null : password)
      
      if (result.success) {
        alert('문의가 삭제되었습니다.')
        window.location.reload()
      } else {
        alert(result.error || '삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to delete inquiry:', error)
      alert('삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setPassword('')
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="transition-all duration-200"
      >
        {/* 헤더 (클릭 가능한 영역) */}
        <div
          onClick={handleCardClick}
          className="px-5 py-4 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          {/* 답변 상태 아이콘 */}
          <div className="flex-shrink-0">
            {hasReply ? (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <HiCheckCircle className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <HiClock className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          {/* 제목 및 날짜 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              {isPrivate && !isUnlocked && (
                <HiOutlineLockClosed className="flex-shrink-0 w-4 h-4 text-gray-400" />
              )}
              <h3 className="text-sm font-semibold text-gray-900 truncate">{inquiry.title}</h3>
              {hasReply && (
                <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-gray-900 text-white rounded-full">
                  답변완료
                </span>
              )}
              {isPrivate && (
                <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-gray-200 text-gray-700 rounded-full">
                  비공개
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {/* 우측 버튼 영역 */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteModal(true)
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="삭제"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400"
            >
              <HiChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        {/* 아코디언 내용 - 공개 문의거나 잠금 해제된 경우만 표시 */}
        <AnimatePresence>
          {isOpen && isUnlocked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 space-y-3 border-t border-gray-100">
                {/* 문의 내용 */}
                <div className="pt-3">
                  <div className="text-xs font-medium text-gray-500 mb-1.5">문의 내용</div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{inquiry.content}</p>
                </div>

                {/* 답변 내용 */}
                {hasReply && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">A</span>
                      </div>
                      <div className="text-xs font-medium text-gray-900">관리자 답변</div>
                      {inquiry.replied_at && (
                        <div className="text-[11px] text-gray-500 ml-auto">
                          {new Date(inquiry.replied_at).toLocaleDateString('ko-KR')}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed ml-7">{inquiry.reply}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 비밀번호 입력 모달 */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <HiOutlineLockClosed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">비공개 문의</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    비밀번호를 입력하세요
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePasswordVerify()
                      }
                    }}
                    placeholder="비밀번호 입력"
                    className="w-full pl-12 pr-4 py-2.5 border-[0.5px] border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPassword('')
                  }}
                  disabled={isVerifying}
                  className="flex-1 px-4 py-3 border-[0.5px] border-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handlePasswordVerify}
                  disabled={isVerifying}
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? '확인 중...' : '확인'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삭제 확인 모달 */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <HiOutlineTrash className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">문의 삭제</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {isAdmin ? '정말 삭제하시겠습니까?' : '비밀번호를 입력하세요'}
                  </p>
                </div>
              </div>

              {!isAdmin && (
                <div className="mb-6">
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호 입력"
                      className="w-full pl-12 pr-4 py-2.5 border-[0.5px] border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border-[0.5px] border-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
