'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import { FolderKanban, Calendar, Code, Link as LinkIcon, Image as ImageIcon, AlertCircle, X, Upload } from 'lucide-react'
import { createProject } from '@/src/utils/projects/create'
import { updateProject } from '@/src/utils/projects/update'
import { TechStackInput } from '@/src/components/admin/TechStackInput'
import { editingProjectAtom } from '@/src/store/authAtom'
import { uploadImage } from '@/src/utils/storage/uploadImage'

/**
 * 프로젝트 등록/수정 페이지 (공용 폼)
 *
 * 관리자 전용 프로젝트 등록 및 수정 폼입니다.
 * editingProjectAtom에 데이터가 있으면 수정 모드, 없으면 등록 모드로 작동합니다.
 */
export default function ProjectFormPage() {
  const router = useRouter()
  const [editingProject, setEditingProject] = useAtom(editingProjectAtom)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const isEditMode = editingProject !== null;

  // 폼 상태 관리 - 수정 모드일 경우 기존 데이터로 초기화
  const [formData, setFormData] = useState({
    title: editingProject?.title || '',
    description: editingProject?.description || '',
    thumbnail_url: editingProject?.thumbnail_url || '',
    github_url: editingProject?.github_url || '',
    link_url: editingProject?.link_url || '',
    start_date: editingProject?.start_date || '',
    end_date: editingProject?.end_date || '',
    tech_stack: editingProject?.tech_stack || [],
    category: editingProject?.category || '',
    is_featured: editingProject?.is_featured || false,
    is_ongoing: editingProject?.is_ongoing || false,
  })

  // editingProjectAtom이 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        thumbnail_url: editingProject.thumbnail_url || '',
        github_url: editingProject.github_url || '',
        link_url: editingProject.link_url || '',
        start_date: editingProject.start_date || '',
        end_date: editingProject.end_date || '',
        tech_stack: editingProject.tech_stack || [],
        category: editingProject.category || '',
        is_featured: editingProject.is_featured || false,
        is_ongoing: editingProject.is_ongoing || false,
      })
      // 수정 모드일 때 기존 이미지를 미리보기로 표시
      setPreviewUrl(editingProject.thumbnail_url || null)
      setSelectedFile(null)
    }
  }, [editingProject])

  // 미리보기 URL cleanup
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // atom 초기화는 handleSubmit / handleCancel에서 명시적으로 처리
  // (useEffect cleanup 방식은 React 18 Strict Mode 이중 실행과 충돌하여 제거)

  // 폼 제출 처리 (등록/수정 분기)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      let thumbnailUrl = formData.thumbnail_url

      // 새로운 이미지 파일이 선택되었으면 업로드
      if (selectedFile) {
        try {
          thumbnailUrl = await uploadImage(selectedFile)
        } catch (uploadError) {
          throw new Error(
            uploadError instanceof Error
              ? `이미지 업로드 실패: ${uploadError.message}`
              : '이미지 업로드 중 오류가 발생했습니다.'
          )
        }
      }

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('thumbnail_url', thumbnailUrl || '')
      formDataToSend.append('github_url', formData.github_url)
      formDataToSend.append('link_url', formData.link_url)
      formDataToSend.append('start_date', formData.start_date)
      formDataToSend.append('end_date', formData.end_date)
      // 기술 스택을 쉼표로 구분된 문자열로 변환
      formDataToSend.append('tech_stack', formData.tech_stack.join(','))
      formDataToSend.append('category', formData.category)
      formDataToSend.append('is_featured', formData.is_featured ? 'on' : '')
      formDataToSend.append('is_ongoing', formData.is_ongoing ? 'on' : '')

      if (isEditMode && editingProject) {
        // 수정 모드
        await updateProject(editingProject.id, formDataToSend)
      } else {
        // 등록 모드
        await createProject(formDataToSend)
      }

      // 성공 시 atom 초기화 및 리다이렉트 (서버 액션에서 redirect 처리됨)
      setEditingProject(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditMode
            ? '프로젝트 수정 중 오류가 발생했습니다.'
            : '프로젝트 등록 중 오류가 발생했습니다.'
      )
      setIsSubmitting(false)
    }
  }

  // 취소 버튼 클릭 시 atom 초기화
  const handleCancel = () => {
    setEditingProject(null)
    router.back()
  }

  // 입력 필드 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const processSelectedFile = (file: File) => {
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 크기는 5MB 이하여야 합니다.')
      return
    }

    setSelectedFile(file)
    setError(null)

    // 미리보기 URL 생성
    const objectUrl = URL.createObjectURL(file)
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(objectUrl)
  }

  // 이미지 파일 선택 핸들러
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
    e.dataTransfer.dropEffect = 'copy'
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // dropzone 내부 이동은 dragleave로 처리하지 않음
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

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setSelectedFile(null)
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setFormData(prev => ({ ...prev, thumbnail_url: '' }))
    setIsDragging(false)
    // file input value 초기화 (동일 파일 재선택 가능하도록)
    const fileInput = document.getElementById('thumbnail_file') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? '프로젝트 수정' : '새 프로젝트 등록'}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? '프로젝트 정보를 수정하세요'
            : '포트폴리오에 추가할 프로젝트 정보를 입력하세요'}
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              {isEditMode ? '수정 실패' : '등록 실패'}
            </p>
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

      {/* 프로젝트 등록 폼 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* 구분 (category) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트 구분 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                { value: '업무', label: '업무' },
                { value: '개인', label: '개인' },
                { value: '팀', label: '팀' },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                    formData.category === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={type.value}
                    checked={formData.category === type.value}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="예: 포트폴리오 웹사이트"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트 설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="프로젝트에 대한 간략한 소개를 작성하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* 기간 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                시작 날짜 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  종료 날짜 {!formData.is_ongoing && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">진행중</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        is_ongoing: !prev.is_ongoing,
                        end_date: !prev.is_ongoing ? '' : prev.end_date, // 진행중으로 변경 시 종료일 초기화
                      }))
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.is_ongoing ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={formData.is_ongoing}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.is_ongoing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date || undefined}
                disabled={formData.is_ongoing}
                required={!formData.is_ongoing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  formData.is_ongoing
                    ? 'bg-gray-100 cursor-not-allowed opacity-60'
                    : 'bg-white'
                }`}
              />
            </div>
          </div>

          {/* 기술 스택 */}
          <div>
            <TechStackInput
              value={formData.tech_stack}
              onChange={(techStack) =>
                setFormData(prev => ({ ...prev, tech_stack: techStack }))
              }
            />
          </div>

          {/* 링크 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon className="w-4 h-4 inline mr-1" />
                GitHub URL
              </label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="link_url" className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon className="w-4 h-4 inline mr-1" />
                배포 URL
              </label>
              <input
                type="url"
                id="link_url"
                name="link_url"
                value={formData.link_url}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* 썸네일 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              썸네일 이미지
            </label>

            {/* 이미지 미리보기 */}
            {previewUrl && (
              <div className="mb-4 relative w-full max-w-md h-48 group">
                <Image
                  src={previewUrl}
                  alt="썸네일 미리보기"
                  fill
                  className="object-cover rounded-lg border-2 border-gray-300"
                  unoptimized={previewUrl.startsWith('blob:')}
                />
                {/* 이미지 제거 버튼 */}
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

            {/* 파일 선택 + 드래그 앤 드롭 영역 */}
            <div
              className={`rounded-lg border-2 border-dashed p-4 transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-wrap items-center gap-3">
                <label
                  htmlFor="thumbnail_file"
                  className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {previewUrl ? '다른 이미지 선택' : '이미지 선택'}
                  </span>
                </label>
                <input
                  type="file"
                  id="thumbnail_file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="text-xs text-gray-500">
                  JPG, PNG, GIF (최대 5MB)
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                또는 이 영역으로 이미지를 드래그해서 놓아주세요.
              </p>
            </div>
          </div>

          {/* 주요 프로젝트 체크박스 */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700 cursor-pointer">
              주요 프로젝트로 표시
            </label>
          </div>

          {/* 제출 버튼 */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FolderKanban className="w-5 h-5" />
              {isSubmitting
                ? isEditMode
                  ? '수정 중...'
                  : '등록 중...'
                : isEditMode
                  ? '프로젝트 수정'
                  : '프로젝트 등록'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
