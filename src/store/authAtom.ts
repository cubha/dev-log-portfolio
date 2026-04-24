import { atom } from 'jotai'
import { Database } from '@/src/types/supabase'

export const isAdminAtom = atom<boolean>(false)

export const isLoggedInAtom = atom<boolean>(false)

/**
 * 편집 중인 프로젝트 Atom
 *
 * 프로젝트 수정 모드에서 편집 중인 프로젝트 데이터를 저장합니다.
 * null이면 등록 모드, 데이터가 있으면 수정 모드입니다.
 */
export const editingProjectAtom = atom<Database['public']['Tables']['projects']['Row'] | null>(null)
