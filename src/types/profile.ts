/**
 * About 페이지 프로필 데이터 타입
 */

export interface StorySection {
  id: string
  title: string
  content: string
  icon?: string
  isVisible?: boolean
}

export interface AboutProfile {
  id?: string
  user_id: string
  main_copy: string
  intro_text: string
  profile_image_url: string | null
  story_json: StorySection[]
  is_intro_visible: boolean
  show_experience: boolean
  show_education: boolean
  show_training: boolean
  created_at?: string
  updated_at?: string
}

// ─── 경력 ────────────────────────────────────────────────────────────────────

export interface Experience {
  id: number
  company_name: string
  position: string
  start_date: string        // YYYY-MM
  end_date: string | null   // YYYY-MM
  description: string | null
  is_current: boolean
  created_at: string | null
}

export type ExperienceInsert = Omit<Experience, 'id' | 'created_at'>
export type ExperienceUpdate = Partial<ExperienceInsert>

// ─── 학력 ────────────────────────────────────────────────────────────────────

export interface Education {
  id: number
  school_name: string
  major: string
  status: string            // '졸업' | '재학중' | '휴학' | '중퇴' | '수료'
  start_date: string        // YYYY-MM
  end_date: string | null   // YYYY-MM
  created_at: string | null
}

export type EducationInsert = Omit<Education, 'id' | 'created_at'>
export type EducationUpdate = Partial<EducationInsert>

export const EDUCATION_STATUS_OPTIONS = ['졸업', '재학중', '휴학', '중퇴', '수료'] as const
export type EducationStatus = (typeof EDUCATION_STATUS_OPTIONS)[number]

// ─── 교육/자격증 ──────────────────────────────────────────────────────────────

export interface Training {
  id: number
  title: string
  institution: string
  acquired_date: string       // YYYY-MM. 자격증: 취득일, 교육: 수료일(end_date)과 동일
  description: string | null
  type: 'education' | 'certification'
  created_at: string | null
  /** 교육 시작일 (YYYY-MM). education 타입에서만 사용 */
  start_date?: string | null
  /** 교육 수료일 (YYYY-MM). education 타입에서만 사용 */
  end_date?: string | null
}

export type TrainingInsert = Omit<Training, 'id' | 'created_at'>
export type TrainingUpdate = Partial<TrainingInsert>

export const TRAINING_TYPE_OPTIONS = [
  { value: 'education',     label: '교육' },
  { value: 'certification', label: '자격증' },
] as const
export type TrainingType = Training['type']

// ─── 기본 스토리 섹션 ─────────────────────────────────────────────────────────

export const DEFAULT_STORY_SECTIONS: StorySection[] = [
  { id: 'growth',        title: '성장 과정',   content: '', icon: '🌱', isVisible: true },
  { id: 'mindset',       title: '긍정적 마인드', content: '', icon: '💡', isVisible: true },
  { id: 'willpower',     title: '의지력',      content: '', icon: '💪', isVisible: true },
  { id: 'communication', title: '소통',        content: '', icon: '💬', isVisible: true },
  { id: 'aspiration',    title: '포부',        content: '', icon: '🚀', isVisible: true },
]
