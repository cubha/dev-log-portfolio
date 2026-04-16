'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, X, AlertCircle, ArrowLeft, Eye, PenLine } from 'lucide-react'
import { MarkdownPreview } from '@/src/components/blog/MarkdownPreview'
import { toast } from 'sonner'
import Link from 'next/link'
import { createBlogPost, updateBlogPost } from '@/src/actions/blog'
import { BlogEditor } from '@/src/components/admin/BlogEditor'
import { BLOG_STATUS, STATUS_LABEL } from '@/src/types/blog'
import type { BlogPost } from '@/src/types/blog'

const EMPTY_FORM = {
  title: '',
  slug: '',
  description: '',
  tags: '',
  status: 'draft',
  content: '',
}

type FormData = typeof EMPTY_FORM

interface BlogEditFormProps {
  mode: 'create' | 'edit'
  initialData?: BlogPost
}

export const BlogEditForm = ({ mode, initialData }: BlogEditFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(
    initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description ?? '',
          tags: initialData.tags.join(', '),
          status: initialData.status,
          content: initialData.content,
        }
      : { ...EMPTY_FORM },
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const errorRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)

  const showError = (message: string, focusRef?: React.RefObject<HTMLInputElement | null>) => {
    setFormError(message)
    setTimeout(() => {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      focusRef?.current?.focus()
    }, 50)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showError('제목을 입력해주세요.', titleRef)
      return
    }
    if (!formData.slug.trim()) {
      showError('슬러그를 입력해주세요.', slugRef)
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || null,
      content: formData.content,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: formData.status,
    }

    const result =
      mode === 'edit' && initialData
        ? await updateBlogPost(initialData.id, payload)
        : await createBlogPost(payload)

    if (!result.success) {
      showError(result.error ?? '저장 중 오류가 발생했습니다.')
    } else {
      toast(mode === 'edit' ? '포스트가 수정되었습니다.' : '새 포스트가 등록되었습니다.')
      router.push('/blog')
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="p-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="p-2.5 bg-silver-metal rounded-xl shadow-sm">
            <FileText className="w-5 h-5 text-white dark:text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === 'edit' ? '포스트 수정' : '새 포스트 작성'}
            </h1>
            <p className="text-sm text-foreground/50 mt-0.5">
              {mode === 'edit' && initialData
                ? `"${initialData.title}" 수정 중`
                : '새 블로그 포스트를 작성합니다'}
            </p>
          </div>
        </div>

        {/* 우측 상단: 취소 + 저장 버튼 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
            취소
          </button>
          <button
            type="button"
            onClick={(e) => {
              const form = document.getElementById('blog-edit-form') as HTMLFormElement | null
              form?.requestSubmit()
            }}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold bg-silver-metal animate-shine text-white dark:text-slate-950 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : mode === 'edit' ? '수정 완료' : '등록하기'}
          </button>
        </div>
      </div>

      {/* 폼 에러 */}
      {formError && (
        <div
          ref={errorRef}
          className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* 폼 */}
      <form id="blog-edit-form" onSubmit={handleSubmit} className="space-y-5">
        {/* 제목 */}
        <div>
          <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
            제목 <span className="text-red-400 normal-case tracking-normal font-normal">*</span>
          </label>
          <input
            ref={titleRef}
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="포스트 제목을 입력하세요"
            autoFocus
            className="w-full h-10 px-3 border border-foreground/10 rounded-lg text-sm text-foreground placeholder:text-foreground/30 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
          />
        </div>

        {/* 슬러그 */}
        <div>
          <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
            슬러그 <span className="text-red-400 normal-case tracking-normal font-normal">*</span>
          </label>
          <input
            ref={slugRef}
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
            placeholder="예: my-first-post"
            className="w-full h-10 px-3 border border-foreground/10 rounded-lg text-sm text-foreground placeholder:text-foreground/30 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
            설명
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            placeholder="포스트 요약 설명"
            rows={2}
            className="w-full px-3 py-2 border border-foreground/10 rounded-lg text-sm text-foreground placeholder:text-foreground/30 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all resize-none"
          />
        </div>

        {/* 태그 + 상태 (가로 배치) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
              태그
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
              placeholder="예: Next.js, TypeScript, React"
              className="w-full h-10 px-3 border border-foreground/10 rounded-lg text-sm text-foreground placeholder:text-foreground/30 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
            />
            <p className="text-xs text-foreground/40 mt-1">쉼표(,)로 구분</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
              상태
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
              className="w-full h-10 px-3 border border-foreground/10 rounded-lg text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all appearance-none cursor-pointer"
            >
              {BLOG_STATUS.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 내용: 편집 / 미리보기 탭 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wide">
              내용
            </label>
            <div className="flex items-center bg-foreground/5 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'edit'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                <PenLine className="w-3.5 h-3.5" />
                편집
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                미리보기
              </button>
            </div>
          </div>

          {activeTab === 'edit' ? (
            <BlogEditor
              content={formData.content}
              onChange={(markdown) => setFormData((p) => ({ ...p, content: markdown }))}
            />
          ) : (
            <div className="border border-foreground/10 rounded-lg bg-background p-6 min-h-[300px]">
              <MarkdownPreview content={formData.content} />
            </div>
          )}
        </div>

      </form>
    </div>
  )
}
