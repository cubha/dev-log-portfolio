'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, FileText, Image as ImageIcon, Save, Eye,
  AlertCircle, X, Upload, Briefcase, GraduationCap, Award,
} from 'lucide-react'
import { uploadImage }      from '@/src/utils/storage/uploadImage'
import { upsertProfile }    from '@/src/utils/profile/upsertProfile'
import { getProfileClient } from '@/src/utils/profile/getProfileClient'
import { DEFAULT_STORY_SECTIONS, type StorySection } from '@/src/types/profile'
import { ProfilePreview }   from '@/src/components/admin/ProfilePreview'
import { ExperienceManager } from '@/src/components/admin/ExperienceManager'
import { EducationManager }  from '@/src/components/admin/EducationManager'
import { TrainingManager }   from '@/src/components/admin/TrainingManager'

// ─── 탭 정의 ─────────────────────────────────────────────────────────────────
type TabId = 'profile' | 'experience' | 'education' | 'training'

const TABS: { id: TabId; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'profile',    label: '기본정보',    Icon: User },
  { id: 'experience', label: '경력관리',    Icon: Briefcase },
  { id: 'education',  label: '학력관리',    Icon: GraduationCap },
  { id: 'training',   label: '교육/자격증', Icon: Award },
]

// ─── Silver Toggle ────────────────────────────────────────────────────────────
function SilverSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="text-xs font-medium text-muted">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--border)] ${
          checked
            ? 'bg-silver-metal shadow-inner'
            : 'bg-[var(--surface)]'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </label>
  )
}

// ─── 섹션 공개 배너 ───────────────────────────────────────────────────────────
function SectionVisibilityBanner({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl border mb-6 transition-colors"
      style={{ background: checked ? 'var(--surface)' : 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-colors ${checked ? 'bg-green-400' : 'bg-[var(--border)]'}`} />
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
          checked
            ? 'bg-green-100 text-green-700'
            : 'bg-[var(--surface)] text-subtle'
        }`}>
          {checked ? 'About 공개' : '숨김'}
        </span>
      </div>
      <SilverSwitch checked={checked} onChange={onChange} label="" />
    </div>
  )
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function AdminProfilePage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabId>('profile')

  // 기본정보 탭 상태
  const [isLoading, setIsLoading]       = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [success, setSuccess]           = useState(false)
  const [showPreview, setShowPreview]   = useState(false)

  // 섹션 공개 여부
  const [showExperience, setShowExperience] = useState(true)
  const [showEducation,  setShowEducation]  = useState(true)
  const [showTraining,   setShowTraining]   = useState(true)

  // 이미지 업로드
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl,   setPreviewUrl]   = useState<string | null>(null)
  const [isDragging,   setIsDragging]   = useState(false)

  // 폼 데이터
  const [formData, setFormData] = useState({
    main_copy:         '',
    intro_text:        '',
    profile_image_url: '',
    story_sections:    DEFAULT_STORY_SECTIONS as StorySection[],
  })

  // ── 기존 프로필 로드 ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getProfileClient()
        if (profile) {
          // story_json에 isVisible 기본값 병합 (기존 데이터 호환)
          const rawSections = Array.isArray(profile.story_json) && profile.story_json.length > 0
            ? profile.story_json
            : DEFAULT_STORY_SECTIONS
          const mergedSections = rawSections.map((s) => ({
            ...s,
            isVisible: s.isVisible !== false,
          }))

          setFormData({
            main_copy:         profile.main_copy || '',
            intro_text:        profile.intro_text || '',
            profile_image_url: profile.profile_image_url || '',
            story_sections:    mergedSections,
          })
          setShowExperience(profile.show_experience ?? true)
          setShowEducation(profile.show_education ?? true)
          setShowTraining(profile.show_training ?? true)
          if (profile.profile_image_url) setPreviewUrl(profile.profile_image_url)
        }
      } catch (err) {
        console.error('프로필 불러오기 오류:', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ── previewUrl 메모리 해제 ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // ── 폼 제출 ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      let imageUrl = formData.profile_image_url
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile, 'project-images', 'profile/')
        } catch (uploadError) {
          throw new Error(
            uploadError instanceof Error
              ? `이미지 업로드 실패: ${uploadError.message}`
              : '이미지 업로드 중 오류가 발생했습니다.'
          )
        }
      }

      const fd = new FormData()
      fd.append('main_copy',         formData.main_copy)
      fd.append('intro_text',        formData.intro_text)
      fd.append('profile_image_url', imageUrl || '')
      fd.append('story_json',        JSON.stringify(formData.story_sections))
      fd.append('is_intro_visible',  'true')
      fd.append('show_experience',   String(showExperience))
      fd.append('show_education',    String(showEducation))
      fd.append('show_training',     String(showTraining))

      await upsertProfile(fd)
      setSuccess(true)
      setTimeout(() => router.push('/about'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 저장 중 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  // ── 입력 핸들러 ──────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStoryChange = (index: number, content: string) => {
    setFormData(prev => ({
      ...prev,
      story_sections: prev.story_sections.map((s, i) => i === index ? { ...s, content } : s),
    }))
  }

  const handleStoryVisibility = (index: number, isVisible: boolean) => {
    setFormData(prev => ({
      ...prev,
      story_sections: prev.story_sections.map((s, i) => i === index ? { ...s, isVisible } : s),
    }))
  }

  // ── 이미지 핸들러 ────────────────────────────────────────────────────────
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('이미지 파일만 업로드 가능합니다.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('이미지 크기는 5MB 이하여야 합니다.'); return }
    setSelectedFile(file)
    setError(null)
    const url = URL.createObjectURL(file)
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(url)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setFormData(prev => ({ ...prev, profile_image_url: '' }))
    const fi = document.getElementById('profile_image') as HTMLInputElement
    if (fi) fi.value = ''
  }

  // ── 로딩 ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--border)] mb-4" />
          <p className="text-muted">프로필 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* 페이지 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--fg)' }}>프로필 편집</h1>
          <p className="text-muted">About 페이지에 표시될 나의 프로필을 관리합니다.</p>
        </div>
        {activeTab === 'profile' && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 text-muted rounded-lg hover:bg-[var(--surface)] transition-colors"
            style={{ border: '1px solid var(--border)' }}
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">{showPreview ? '미리보기 닫기' : '미리보기'}</span>
          </button>
        )}
      </div>

      {/* ── 탭 네비게이션 (Silver Metal) ────────────────────────────────── */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit mb-8 shadow-inner"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-silver-metal text-white shadow-md'
                : 'text-muted hover:text-[var(--fg)] hover:bg-[var(--bg)]'
            }`}
          >
            {activeTab === id && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-lg bg-silver-metal shadow-md -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── 기본정보 탭 ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* 성공 메시지 */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-sm font-semibold text-green-800">✓ 프로필이 성공적으로 저장되었습니다!</p>
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
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 편집 폼 */}
              <form
                onSubmit={handleSubmit}
                className="rounded-xl shadow-sm p-8"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div className="space-y-8">

                  {/* ── 기본 정보 ── */}
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                      <User className="w-5 h-5 text-subtle" />
                      기본 정보
                    </h2>

                    {/* 메인 카피 */}
                    <div className="mb-6">
                      <label htmlFor="main_copy" className="block text-sm font-medium text-muted mb-2">
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
                        className="admin-input w-full px-4 py-3 border rounded-lg transition-all"
                      />
                    </div>

                    {/* 서두 소개글 (항상 공개 — 토글 없음) */}
                    <div className="mb-4">
                      <label htmlFor="intro_text" className="block text-sm font-medium text-muted mb-2">
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
                        className="admin-input w-full px-4 py-3 border rounded-lg transition-all resize-none"
                      />
                      <p className="mt-1.5 text-xs text-subtle">
                        줄바꿈이 About 페이지에 그대로 반영됩니다.
                      </p>
                    </div>

                    {/* 프로필 이미지 */}
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">
                        <ImageIcon className="w-4 h-4 inline mr-1" />
                        프로필 이미지
                      </label>

                      {previewUrl && (
                        <div className="mb-4 relative w-40 h-40 group mx-auto">
                          <Image
                            src={previewUrl}
                            alt="프로필 미리보기"
                            fill
                            className="object-cover rounded-full border-4 border-[var(--border)]"
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

                      <div
                        className={`rounded-lg border-2 border-dashed p-6 transition-all ${
                          isDragging
                            ? 'border-[var(--accent)] bg-[var(--surface)]'
                            : 'border-[var(--border)] hover:bg-[var(--surface)]'
                        }`}
                        style={{ background: isDragging ? undefined : 'var(--bg)' }}
                        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
                        onDragOver={(e)  => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false) }}
                        onDrop={handleDrop}
                      >
                        <div className="text-center">
                          <label
                            htmlFor="profile_image"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--surface)] transition-all cursor-pointer"
                            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                          >
                            <Upload className="w-5 h-5 text-subtle" />
                            <span className="text-sm font-medium text-muted">
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
                          <p className="mt-3 text-xs text-subtle">JPG, PNG, GIF (최대 5MB)</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ── About Me 스토리 섹션 ── */}
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                      <FileText className="w-5 h-5 text-subtle" />
                      About Me
                    </h2>
                    <div className="space-y-4">
                      {formData.story_sections.map((section, index) => {
                        const visible = section.isVisible !== false
                        return (
                          <div
                            key={section.id}
                            className={`p-4 rounded-xl border transition-all ${
                              visible
                                ? ''
                                : 'opacity-60'
                            }`}
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                          >
                            {/* 카드 헤더: 제목 + 토글 */}
                            <div className="flex items-center justify-between mb-3">
                              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                                <span className="text-xl">{section.icon}</span>
                                {section.title}
                              </label>
                              <SilverSwitch
                                checked={visible}
                                onChange={(v) => handleStoryVisibility(index, v)}
                                label={visible ? 'About 공개' : '숨김'}
                              />
                            </div>
                            <AnimatePresence>
                              {visible && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <textarea
                                    value={section.content}
                                    onChange={(e) => handleStoryChange(index, e.target.value)}
                                    rows={3}
                                    placeholder={`${section.title}에 대해 작성하세요...`}
                                    className="admin-input w-full px-4 py-3 border rounded-lg transition-all resize-none"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                            {!visible && (
                              <p className="text-xs text-subtle mt-1">About 페이지에서 이 항목을 숨깁니다</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </section>

                  {/* 제출 버튼 */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-silver-metal animate-shine text-white font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5" />
                      {isSubmitting ? '저장 중...' : '저장하기'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                      className="px-6 py-3 text-muted bg-[var(--surface)] rounded-lg hover:bg-[var(--surface)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </form>

              {/* 미리보기 */}
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
          </motion.div>
        )}

        {/* ── 경력관리 탭 ─────────────────────────────────────────────────── */}
        {activeTab === 'experience' && (
          <motion.div
            key="experience"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl shadow-sm p-8"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <SectionVisibilityBanner
              label="경력 섹션 공개 여부"
              checked={showExperience}
              onChange={setShowExperience}
            />
            <ExperienceManager />
          </motion.div>
        )}

        {/* ── 학력관리 탭 ─────────────────────────────────────────────────── */}
        {activeTab === 'education' && (
          <motion.div
            key="education"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl shadow-sm p-8"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <SectionVisibilityBanner
              label="학력 섹션 공개 여부"
              checked={showEducation}
              onChange={setShowEducation}
            />
            <EducationManager />
          </motion.div>
        )}

        {/* ── 교육/자격증 탭 ───────────────────────────────────────────────── */}
        {activeTab === 'training' && (
          <motion.div
            key="training"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl shadow-sm p-8"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <SectionVisibilityBanner
              label="교육/자격증 섹션 공개 여부"
              checked={showTraining}
              onChange={setShowTraining}
            />
            <TrainingManager />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 경력·학력·교육 탭의 공개 여부는 프로필 저장으로 함께 반영됩니다 */}
      {activeTab !== 'profile' && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={async () => {
              setError(null)
              setSuccess(false)
              setIsSubmitting(true)
              try {
                const fd = new FormData()
                fd.append('main_copy',         formData.main_copy || 'untitled')
                fd.append('intro_text',        formData.intro_text || '')
                fd.append('profile_image_url', formData.profile_image_url || '')
                fd.append('story_json',        JSON.stringify(formData.story_sections))
                fd.append('is_intro_visible',  'true')
                fd.append('show_experience',   String(showExperience))
                fd.append('show_education',    String(showEducation))
                fd.append('show_training',     String(showTraining))
                await upsertProfile(fd)
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
              } catch (err) {
                setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
              } finally {
                setIsSubmitting(false)
              }
            }}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-silver-metal animate-shine text-white font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? '저장 중...' : '공개 설정 저장'}
          </button>
        </div>
      )}
      {success && activeTab !== 'profile' && (
        <p className="text-right text-xs text-green-600 mt-2">✓ 공개 설정이 저장되었습니다.</p>
      )}
      {error && activeTab !== 'profile' && (
        <p className="text-right text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
