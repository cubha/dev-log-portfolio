import { createClient } from '@/src/utils/supabase/client'
import type { Education, EducationInsert, EducationUpdate } from '@/src/types/profile'

/** 전체 학력 목록 조회 (최신순) */
export async function fetchEducations(): Promise<{ data: Education[] | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('educations')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) return { data: null, error: error.message }
    return { data: data as Education[], error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 학력 추가 */
export async function createEducation(
  edu: EducationInsert
): Promise<{ data: Education | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('educations')
      .insert([edu])
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as Education, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 학력 수정 */
export async function updateEducation(
  id: number,
  updates: EducationUpdate
): Promise<{ data: Education | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('educations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as Education, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 학력 삭제 */
export async function deleteEducation(id: number): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from('educations').delete().eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    return { error: String(err) }
  }
}
