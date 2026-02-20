import { createClient } from '@/src/utils/supabase/client'
import type { Experience, ExperienceInsert, ExperienceUpdate } from '@/src/types/profile'

/** 전체 경력 목록 조회 (최신순) */
export async function fetchExperiences(): Promise<{ data: Experience[] | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) return { data: null, error: error.message }
    return { data: data as Experience[], error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 경력 추가 */
export async function createExperience(
  exp: ExperienceInsert
): Promise<{ data: Experience | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('experiences')
      .insert([exp])
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as Experience, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 경력 수정 */
export async function updateExperience(
  id: number,
  updates: ExperienceUpdate
): Promise<{ data: Experience | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as Experience, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 경력 삭제 */
export async function deleteExperience(id: number): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    return { error: String(err) }
  }
}
