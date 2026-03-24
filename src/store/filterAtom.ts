import { atom } from 'jotai'

/**
 * 프로젝트 카테고리 필터 타입
 *
 * '전체'는 모든 프로젝트를 표시하고,
 * 그 외에는 DB의 category 필드와 매칭됩니다.
 */
export type ProjectFilter = '전체' | '업무' | '개인' | '팀'

/**
 * 프로젝트 필터 상태 Atom
 *
 * 현재 선택된 카테고리 필터를 전역으로 관리합니다.
 * 초기값은 '전체'로 모든 프로젝트를 보여줍니다.
 */
export const projectFilterAtom = atom<ProjectFilter>('전체')

/**
 * 사용 가능한 필터 옵션 목록
 */
export const FILTER_OPTIONS: ProjectFilter[] = ['전체', '업무', '개인', '팀']

/**
 * 프로젝트 검색어 Atom
 *
 * title, description, tech_stack, company_name, project_role 필드에 대해
 * 클라이언트사이드 검색을 수행합니다.
 */
export const searchQueryAtom = atom<string>('')
