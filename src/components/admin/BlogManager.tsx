'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import {
  Plus, Pencil, Trash2, X, FileText, AlertCircle, Check, Eye, EyeOff,
} from 'lucide-react'
import { toast } from 'sonner'
import { editingBlogAtom } from '@/src/store/blogAtom'
import { fetchBlogPosts } from '@/src/utils/blog/blogActions'
import { createBlogPost, updateBlogPost, deleteBlogPost, togglePublish } from '@/src/actions/blog'
import { BlogEditor } from '@/src/components/admin/BlogEditor'
import { BLOG_STATUS } from '@/src/types/blog'
import type { BlogPost } from '@/src/types/blog'

// ─── 상태 뱃지 스타일 ─────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  draft:     'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  published: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  archived:  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

const STATUS_LABEL: Record<string, string> = {
  draft:     '임시저장',
  published: '발행됨',
  archived:  '보관됨',
}

// ─── 초기 폼 값 ──────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title:       '',
  slug:        '',
  description: '',
  tags:        '',
  status:      'draft',
  content:     '',
}

type FormData = typeof EMPTY_FORM

/**
 * 관리자 블로그 관리 컴포넌트
 *
 * - 블로그 포스트 목록 테이블 (상태 뱃지, 발행 토글, 수정/삭제)
 * - 등록/수정 폼 (Tiptap 기반 BlogEditor 포함)
 * - editingBlogAtom: null → 등록 모드, 값 → 수정 모드
 * - 삭제 2단계 확인
 */
export const BlogManager = () => {
  const [posts, setPosts]       = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [editingBlog, setEditingBlog] = useAtom(editingBlogAtom)
  const [showForm, setShowForm]       = useState(false)
  const [formData, setFormData]       = useState<FormData>({ ...EMPTY_FORM })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError]     = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ─── 데이터 로드 ───────────────────────────────────────────────────────────
  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    setListError(null)
    const { data, error } = await fetchBlogPosts()
    if (error) setListError(error)
    else setPosts(data ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => { loadPosts() }, [loadPosts])

  // ─── 폼 열기/닫기 ──────────────────────────────────────────────────────────
  const openAddForm = () => {
    setEditingBlog(null)
    setFormData({ ...EMPTY_FORM })
    setFormError(null)
    setShowForm(true)
  }

  const openEditForm = (post: BlogPost) => {
    setEditingBlog(post)
    setFormData({
      title:       post.title,
      slug:        post.slug,
      description: post.description ?? '',
      tags:        post.tags.join(', '),
      status:      post.status,
      content:     post.content,
    })
    setFormError(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingBlog(null)
    setFormError(null)
  }

  // ─── 폼 제출 ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setFormError('제목을 입력해주세요.')
      return
    }
    if (!formData.slug.trim()) {
      setFormError('슬러그를 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    const payload = {
      title:       formData.title.trim(),
      slug:        formData.slug.trim(),
      description: formData.description.trim() || null,
      content:     formData.content,
      tags:        formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status:      formData.status,
    }

    const result = editingBlog
      ? await updateBlogPost(editingBlog.id, payload)
      : await createBlogPost(payload)

    if (!result.success) {
      setFormError(result.error)
    } else {
      toast(editingBlog ? '포스트가 수정되었습니다.' : '새 포스트가 등록되었습니다.')
      closeForm()
      await loadPosts()
    }
    setIsSubmitting(false)
  }

  // ─── 삭제 (2단계) ──────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (deletingId !== id) {
      setDeletingId(id)
      return
    }
    setDeletingId(null)
    const result = await deleteBlogPost(id)
    if (!result.success) {
      setListError(result.error)
    } else {
      toast('포스트가 삭제되었습니다.')
      setPosts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // ─── 발행 토글 ─────────────────────────────────────────────────────────────
  const handleTogglePublish = async (post: BlogPost) => {
    const willPublish = post.status !== 'published'
    const result = await togglePublish(post.id, willPublish)
    if (!result.success) {
      toast.error(result.error)
    } else {
      toast(willPublish ? '포스트가 발행되었습니다.' : '임시저장으로 변경되었습니다.')
      await loadPosts()
    }
  }

  // ─── 폼 뷰 ────────────────────────────────────────────────────────────────
  if (showForm) {
    return (
      <div>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-silver-metal rounded-xl shadow-sm">
              <FileText className="w-5 h-5 text-white dark:text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {editingBlog ? '포스트 수정' : '새 포스트 작성'}
              </h1>
              <p className="text-sm text-foreground/50 mt-0.5">
                {editingBlog ? `"${editingBlog.title}" 수정 중` : '새 블로그 포스트를 작성합니다'}
              </p>
            </div>
          </div>
          <button
            onClick={closeForm}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
            취소
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 제목 */}
          <div>
            <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
              제목 <span className="text-red-400 normal-case tracking-normal font-normal">*</span>
            </label>
            <input
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

          {/* 에디터 */}
          <div>
            <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
              내용
            </label>
            <BlogEditor
              content={formData.content}
              onChange={(markdown) => setFormData((p) => ({ ...p, content: markdown }))}
            />
          </div>

          {/* 폼 에러 */}
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2.5 text-sm font-medium text-foreground/60 bg-foreground/8 rounded-lg hover:bg-foreground/12 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-semibold bg-silver-metal animate-shine text-white dark:text-slate-950 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? '저장 중...'
                : editingBlog ? '수정 완료' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // ─── 목록 뷰 ──────────────────────────────────────────────────────────────
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-silver-metal rounded-xl shadow-sm">
            <FileText className="w-5 h-5 text-white dark:text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">블로그 관리</h1>
            <p className="text-sm text-foreground/50 mt-0.5">블로그 포스트를 작성하고 관리합니다</p>
          </div>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-silver-metal animate-shine text-white dark:text-slate-950 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          포스트 작성
        </button>
      </div>

      {/* 에러 배너 */}
      {listError && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{listError}</span>
          <button onClick={() => setListError(null)} className="ml-auto p-0.5 hover:bg-red-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-background rounded-xl border border-foreground/10 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-foreground/40 gap-3">
            <div className="w-5 h-5 border-2 border-foreground/10 border-t-foreground/50 rounded-full animate-spin" />
            <span className="text-sm">불러오는 중...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-foreground/40">
            <FileText className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">등록된 포스트가 없습니다</p>
            <p className="text-sm mt-1">&#39;포스트 작성&#39; 버튼을 눌러 시작하세요</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-foreground/8 bg-foreground/3">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/50 uppercase tracking-wider w-28">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                    태그
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/50 uppercase tracking-wider w-32">
                    작성일
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-foreground/50 uppercase tracking-wider w-32">
                    액션
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-foreground/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-foreground/3 transition-colors group">
                    {/* 제목 */}
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-foreground text-sm">{post.title}</span>
                        <p className="text-xs text-foreground/40 mt-0.5">{post.slug}</p>
                      </div>
                    </td>

                    {/* 상태 뱃지 */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_BADGE[post.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_LABEL[post.status] ?? post.status}
                      </span>
                    </td>

                    {/* 태그 */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-xs bg-foreground/5 text-foreground/50 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-1.5 py-0.5 text-xs text-foreground/40">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 작성일 */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground/50">
                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </td>

                    {/* 액션 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 발행 토글 */}
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className="p-1.5 rounded-lg text-foreground/40 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all opacity-0 group-hover:opacity-100"
                          title={post.status === 'published' ? '발행 취소' : '발행'}
                        >
                          {post.status === 'published'
                            ? <EyeOff className="w-4 h-4" />
                            : <Eye    className="w-4 h-4" />}
                        </button>

                        {/* 수정 */}
                        <button
                          onClick={() => openEditForm(post)}
                          className="p-1.5 rounded-lg text-foreground/40 hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all opacity-0 group-hover:opacity-100"
                          title="수정"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* 삭제 (2단계) */}
                        {deletingId === post.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="flex items-center gap-1 px-2 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              확인
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="p-1.5 rounded-lg text-foreground/40 hover:bg-foreground/8 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 rounded-lg text-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 개수 표시 */}
      {!isLoading && posts.length > 0 && (
        <p className="mt-3 text-xs text-foreground/40 text-right">
          총 {posts.length}개의 포스트
        </p>
      )}
    </div>
  )
}
