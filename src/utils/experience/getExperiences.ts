import { createPublicClient } from '@/src/utils/supabase/public'
import type { Experience } from '@/src/types/profile'

/** 전체 경력을 가져옵니다 (최신순). 공개 데이터라 public 클라이언트 사용 → ISR 캐시 유지. */
export async function getAllExperiences(): Promise<Experience[]> {
  try {
    const supabase = createPublicClient()
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
