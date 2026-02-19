import { createClient } from '@/src/utils/supabase/server'
import type { Skill } from '@/src/types/skill'

/**
 * 서버 컴포넌트에서 전체 기술 스택을 가져옵니다.
 * 1순위: category(오름차순), 2순위: proficiency(내림차순)
 */
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('proficiency', { ascending: false })

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
