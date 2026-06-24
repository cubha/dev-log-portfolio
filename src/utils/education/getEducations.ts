import { createPublicClient } from '@/src/utils/supabase/public'
import type { Education } from '@/src/types/profile'

/** 전체 학력을 가져옵니다 (최신순). 공개 데이터라 public 클라이언트 사용 → ISR 캐시 유지. */
export async function getAllEducations(): Promise<Education[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('educations')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('학력 조회 오류:', error.message)
      return []
    }
    return (data as Education[]) ?? []
  } catch (err) {
    console.error('학력 조회 예외:', err)
    return []
  }
}
