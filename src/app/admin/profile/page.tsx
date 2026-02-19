'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, FileText, Image as ImageIcon, Save, Eye, AlertCircle, X, Upload } from 'lucide-react'
import { uploadImage } from '@/src/utils/storage/uploadImage'
import { upsertProfile } from '@/src/utils/profile/upsertProfile'
import { getProfileClient } from '@/src/utils/profile/getProfileClient'
import { DEFAULT_STORY_SECTIONS, type StorySection } from '@/src/types/profile'
import { ProfilePreview } from '@/src/components/admin/ProfilePreview'

/**
 * 관리자용 프로필 편집 페이지
 * 
 * About 페이지에 표시될 프로필 정보를 수정합니다.
 * - 메인 카피, 서두 소개글, 프로필 이미지
 * - 5가지 스토리 섹션 (성장 과정, 마인드, 의지력, 소통, 포부)
 */
export default function AdminProfilePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // 이미지 업로드 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // 폼 데이터
  const [formData, setFormData] = useState({
    main_copy: '',
    intro_text: '',
    profile_image_url: '',
    story_sections: DEFAULT_STORY_SECTIONS,
  })

  // 기존 프로필 데이터 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfileClient()
        if (profile) {
          setFormData({
            main_copy: profile.main_copy || '',
            intro_text: profile.intro_text || '',
            profile_image_url: profile.profile_image_url || '',
            story_sections: Array.isArray(profile.story_json) && profile.story_json.length > 0
              ? profile.story_json
              : DEFAULT_STORY_SECTIONS,
          })
          if (profile.profile_image_url) {
            setPreviewUrl(profile.profile_image_url)
          }
        }
      } catch (err) {
        console.error('프로필 불러오기 오류:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  // 미리보기 URL cleanup
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      let imageUrl = formData.profile_image_url

      // 새로운 이미지 파일이 선택되었으면 업로드
      if (selectedFile) {
        try {
          // project-images 버킷의 profile/ 폴더에 저장하여 프로젝트 썸네일과 구분
          imageUrl = await uploadImage(selectedFile, 'project-images', 'profile/')
        } catch (uploadError) {
          throw new Error(
            uploadError instanceof Error
              ? `이미지 업로드 실패: ${uploadError.message}`
              : '이미지 업로드 중 오류가 발생했습니다.'
          )
        }
      }

      const formDataToSend = new FormData()
      formDataToSend.append('main_copy', formData.main_copy)
      formDataToSend.append('intro_text', formData.intro_text)
      formDataToSend.append('profile_image_url', imageUrl || '')
      formDataToSend.append('story_json', JSON.stringify(formData.story_sections))

      await upsertProfile(formDataToSend)
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/about')
      }, 1500)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '프로필 저장 중 오류가 발생했습니다.'
      )
      setIsSubmitting(false)
    }
  }

  // 입력 필드 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // 스토리 섹션 변경 핸들러
  const handleStoryChange = (index: number, content: string) => {
    setFormData(prev => ({
      ...prev,
      story_sections: prev.story_sections.map((section, i) =>
        i === index ? { ...section, content } : section
      ),
    }))
  }

  // 이미지 파일 선택 핸들러
  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 크기는 5MB 이하여야 합니다.')
      return
    }

    setSelectedFile(file)
    setError(null)

    const objectUrl = URL.createObjectURL(file)
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(objectUrl)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processSelectedFile(file)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return
    processSelectedFile(file)
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setFormData(prev => ({ ...prev, profile_image_url: '' }))
    setIsDragging(false)
    const fileInput = document.getElementById('profile_image') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
            <p className="text-foreground/60">프로필 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* 페이지 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            프로필 편집
          </h1>
          <p className="text-foreground/60">
            About 페이지에 표시될 나의 프로필을 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 text-foreground/70 bg-foreground/5 border border-foreground/10 rounded-lg hover:bg-foreground/10 transition-colors"
        >
          <Eye className="w-5 h-5" />
          <span className="font-medium">{showPreview ? '미리보기 닫기' : '미리보기'}</span>
        </button>
      </div>

      {/* 성공 메시지 */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p className="text-sm font-semibold text-green-800">
            ✓ 프로필이 성공적으로 저장되었습니다!
          </p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">저장 실패</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 레이아웃: 폼 + 미리보기 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 편집 폼 */}
        <form onSubmit={handleSubmit} className="bg-background rounded-xl shadow-sm border border-foreground/10 p-8">
          <div className="space-y-8">
            {/* 기본 정보 섹션 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-foreground/50" />
                기본 정보
              </h2>

              {/* 메인 카피 */}
              <div className="mb-6">
                <label htmlFor="main_copy" className="block text-sm font-medium text-foreground/60 mb-2">
                  메인 카피 (한 줄 요약) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="main_copy"
                  name="main_copy"
                  value={formData.main_copy}
                  onChange={handleChange}
                  required
                  placeholder="예: 문제 해결을 즐기는 풀스택 개발자"
                  className="w-full px-4 py-3 border border-foreground/10 rounded-lg bg-background text-foreground placeholder:text-foreground/30 focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                />
              </div>

              {/* 서두 소개글 */}
              <div className="mb-6">
                <label htmlFor="intro_text" className="block text-sm font-medium text-foreground/60 mb-2">
                  서두 소개글 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="intro_text"
                  name="intro_text"
                  value={formData.intro_text}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="나를 소개하는 짧은 글을 작성하세요..."
                  className="w-full px-4 py-3 border border-foreground/10 rounded-lg bg-background text-foreground placeholder:text-foreground/30 focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all resize-none"
                />
              </div>

              {/* 프로필 이미지 */}
              <div>
                <label className="block text-sm font-medium text-foreground/60 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  프로필 이미지
                </label>

                {/* 이미지 미리보기 */}
                {previewUrl && (
                  <div className="mb-4 relative w-40 h-40 group mx-auto">
                    <Image
                      src={previewUrl}
                      alt="프로필 미리보기"
                      fill
                      className="object-cover rounded-full border-4 border-foreground/20"
                      unoptimized={previewUrl.startsWith('blob:')}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      title="이미지 제거"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 드래그 앤 드롭 영역 */}
                <div
                  className={`rounded-lg border-2 border-dashed p-6 transition-all ${
                    isDragging
                      ? 'border-brand-secondary/60 bg-brand-secondary/5'
                      : 'border-foreground/15 bg-background hover:border-foreground/30 hover:bg-foreground/3'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <label
                      htmlFor="profile_image"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-foreground/15 rounded-lg hover:border-foreground/30 hover:bg-foreground/5 transition-all cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-foreground/50" />
                      <span className="text-sm font-medium text-foreground/70">
                        {previewUrl ? '다른 이미지 선택' : '이미지 선택'}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="profile_image"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="mt-3 text-xs text-foreground/40">
                      JPG, PNG, GIF (최대 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 스토리 섹션 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-foreground/50" />
                About Me
              </h2>

              <div className="space-y-6">
                {formData.story_sections.map((section, index) => (
                  <div key={section.id} className="bg-foreground/3 p-4 rounded-lg border border-foreground/8">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <span className="text-2xl">{section.icon}</span>
                      {section.title}
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) => handleStoryChange(index, e.target.value)}
                      rows={4}
                      placeholder={`${section.title}에 대해 작성하세요...`}
                      className="w-full px-4 py-3 border border-foreground/10 rounded-lg bg-background text-foreground placeholder:text-foreground/30 focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all resize-none"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 제출 버튼 */}
            <div className="flex items-center gap-4 pt-4 border-t border-foreground/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-silver-metal animate-shine text-white dark:text-slate-950 font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? '저장 중...' : '저장하기'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-6 py-3 text-foreground/60 bg-foreground/8 border border-foreground/10 rounded-lg hover:bg-foreground/12 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
            </div>
          </div>
        </form>

        {/* 오른쪽: 실시간 미리보기 */}
        {showPreview && (
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <ProfilePreview
              mainCopy={formData.main_copy}
              introText={formData.intro_text}
              profileImageUrl={previewUrl || formData.profile_image_url}
              storySections={formData.story_sections}
            />
          </div>
        )}
      </div>
    </div>
  )
}
