import { createClient } from '@/src/utils/supabase/server'
import type { Skill } from '@/src/types/skill'

/**
 * 서버 컴포넌트에서 전체 기술 스택을 가져옵니다.
 * category(오름차순) 정렬
 */
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const supabase = await createClient()
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
