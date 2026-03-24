import { createClient } from '@/src/utils/supabase/server'
import type { Experience } from '@/src/types/profile'

/** 서버 컴포넌트에서 전체 경력을 가져옵니다 (최신순). */
export async function getAllExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('경력 조회 오류:', error.message)
      return []
    }
    return (data as Experience[]) ?? []
  } catch (err) {
    console.error('경력 조회 예외:', err)
    return []
  }
}
