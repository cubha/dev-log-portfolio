import { createPublicClient } from '@/src/utils/supabase/public'
import type { Skill } from '@/src/types/skill'

/**
 * 전체 기술 스택을 가져옵니다 (category 오름차순).
 * 공개 데이터(anon read)이므로 쿠키-프리 public 클라이언트 사용 → 호출 페이지의 ISR/CDN 캐시 유지.
 */
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })

    if (error) {
      console.error('기술 스택 조회 오류:', error.message)
      return []
    }

    return (data as Skill[]) ?? []
  } catch (err) {
    console.error('기술 스택 조회 예외:', err)
    return []
  }
}
