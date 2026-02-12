import { atom } from 'jotai'
import { Database } from '@/src/types/supabase'

/**
 * 선택된 프로젝트 상태 Atom
 * 
 * 프로젝트 상세 모달에서 표시할 프로젝트 데이터를 저장합니다.
 * null이면 모달이 닫힌 상태, 데이터가 있으면 모달이 열린 상태입니다.
 */
export const selectedProjectAtom = atom<Database['public']['Tables']['projects']['Row'] | null>(null)
