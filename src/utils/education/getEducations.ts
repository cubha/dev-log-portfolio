import { createClient } from '@/src/utils/supabase/server'
import type { Education } from '@/src/types/profile'

/** 서버 컴포넌트에서 전체 학력을 가져옵니다 (최신순). */
export async function getAllEducations(): Promise<Education[]> {
  try {
    const supabase = await createClient()
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
