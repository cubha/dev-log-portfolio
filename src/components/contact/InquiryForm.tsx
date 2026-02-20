'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createInquiry } from '@/src/utils/inquiries/create'

/**
 * Inquiry Form 컴포넌트
 * 
 * 문의 작성 폼. 제목, 비밀번호, 내용, 공개여부를 입력받습니다.
 */
export function InquiryForm() {
  const [formData, setFormData] = useState({
    title: '',
    password: '',
    content: '',
    isPublic: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.password.trim() || !formData.content.trim()) {
      toast.error('모든 필드를 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      await createInquiry({
        title: formData.title,
        password: formData.password,
        content: formData.content,
        isPublic: formData.isPublic,
      })

      // 성공 시 폼 초기화
      setFormData({
        title: '',
        password: '',
        content: '',
        isPublic: true,
      })
      
      toast.success('문의가 성공적으로 등록되었습니다.')
      
      // 페이지 새로고침하여 목록 갱신
      window.location.reload()
    } catch (error) {
      console.error('Failed to submit inquiry:', error)
      toast.error('문의 등록에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-foreground/30 rounded-full" />
          <h2 className="text-xl font-semibold text-foreground">문의 작성</h2>
        </div>
        {/* 공개 여부 토글 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground/50">
            {formData.isPublic ? '공개' : '비공개'}
          </span>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
            className={`
              relative w-12 h-6 rounded-full transition-all duration-300
              ${formData.isPublic ? 'bg-brand-primary' : 'bg-foreground/20'}
            `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300
                ${formData.isPublic ? 'translate-x-6' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-3.5 flex flex-col"
      >

        {/* 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1.5">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full h-11 px-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all text-sm text-foreground placeholder:text-foreground/30"
            placeholder="문의 제목을 입력하세요"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full h-11 px-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all text-sm text-foreground placeholder:text-foreground/30"
            placeholder="수정/삭제 시 사용할 비밀번호"
          />
        </div>

        {/* 내용 */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1.5">
            내용
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full flex-1 px-3 py-2 bg-brand-primary/5 border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all resize-none text-sm text-foreground placeholder:text-foreground/30"
            placeholder="문의 내용을 입력하세요"
          />
        </div>

        {/* 전송 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-silver-metal animate-shine text-white dark:text-slate-950 text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </motion.section>
  )
}
