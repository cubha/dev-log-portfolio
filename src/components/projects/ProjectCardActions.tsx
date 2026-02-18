'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSetAtom } from 'jotai'
import { Settings, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteProject } from '@/src/utils/projects/delete'
import { editingProjectAtom } from '@/src/store/authAtom'
import { Database } from '@/src/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardActionsProps {
  project: Project
}

/**
 * 프로젝트 카드 관리자 액션 컴포넌트
 *
 * 관리자 전용 수정/삭제 드롭다운 메뉴입니다.
 * 카드에 마우스를 올렸을 때만 표시됩니다.
 */
export function ProjectCardActions({ project }: ProjectCardActionsProps) {
  const router = useRouter()
  const setEditingProject = useSetAtom(editingProjectAtom)
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 수정 모드 진입: editingProjectAtom에 프로젝트 데이터 저장 후 폼 페이지로 이동
  const handleEdit = () => {
    setEditingProject(project)
    router.push('/admin/projects')
  }

  // 삭제 확인 및 실행
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `정말 "${project.title}" 프로젝트를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`
    )

    if (!confirmed) return

    setIsDeleting(true)
    try {
      await deleteProject(project.id)
      // 삭제 성공 시 atom 초기화 및 페이지 새로고침
      setEditingProject(null)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '프로젝트 삭제 중 오류가 발생했습니다.')
      setIsDeleting(false)
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* 설정 아이콘 버튼 */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="opacity-50 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white/80 backdrop-blur-sm"
        aria-label="프로젝트 설정"
      >
        <Settings className="w-5 h-5 text-gray-700" />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit()
              setIsOpen(false)
            }}
            disabled={isDeleting}
            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit className="w-4 h-4" />
            <span>수정</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
              setIsOpen(false)
            }}
            disabled={isDeleting}
            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? '삭제 중...' : '삭제'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
