/**
 * 기술 스택(Skills) 관련 타입 정의
 *
 * DB 스키마: id(int PK), name(text), category(text?), proficiency(int?),
 *            icon_name(text?), created_at(timestamptz?)
 *
 * 정렬 기준: category(오름차순)
 */

export interface Skill {
  id: number
  name: string
  category: string | null
  icon_name: string | null
  created_at: string | null
}

export type SkillInsert = {
  name: string
  category: string
  icon_name?: string | null
}

export type SkillUpdate = Partial<SkillInsert>

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
] as const

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]
