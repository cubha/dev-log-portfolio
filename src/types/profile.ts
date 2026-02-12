/**
 * About 페이지 프로필 데이터 타입
 */

export interface StorySection {
  id: string
  title: string
  content: string
  icon?: string
}

export interface AboutProfile {
  id?: string
  user_id: string
  main_copy: string // 메인 카피 (한 줄 요약)
  intro_text: string // 서두 소개글
  profile_image_url: string | null
  story_json: StorySection[] // 스토리 섹션들
  created_at?: string
  updated_at?: string
}

// 기본 스토리 섹션 템플릿
export const DEFAULT_STORY_SECTIONS: StorySection[] = [
  {
    id: 'growth',
    title: '성장 과정',
    content: '',
    icon: '🌱'
  },
  {
    id: 'mindset',
    title: '긍정적 마인드',
    content: '',
    icon: '💡'
  },
  {
    id: 'willpower',
    title: '의지력',
    content: '',
    icon: '💪'
  },
  {
    id: 'communication',
    title: '소통',
    content: '',
    icon: '💬'
  },
  {
    id: 'aspiration',
    title: '포부',
    content: '',
    icon: '🚀'
  }
]
