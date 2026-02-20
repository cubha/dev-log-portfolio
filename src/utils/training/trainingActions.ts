import { createClient } from '@/src/utils/supabase/client'
import type { Training, TrainingInsert, TrainingUpdate } from '@/src/types/profile'

type SupabaseClient = ReturnType<typeof createClient>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBuilder = any

/** 전체 교육/자격증 목록 조회 (최신순) */
export async function fetchTrainings(): Promise<{ data: Training[] | null; error: string | null }> {
  try {
    const supabase: SupabaseClient = createClient()
    const { data, error } = await (supabase as AnyBuilder)
      .from('trainings')
      .select('*')
      .order('acquired_date', { ascending: false })

    if (error) return { data: null, error: (error as { message: string }).message }
    return { data: data as Training[], error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 교육/자격증 추가 */
export async function createTraining(
  item: TrainingInsert
): Promise<{ data: Training | null; error: string | null }> {
  try {
    const supabase: SupabaseClient = createClient()
    const { data, error } = await (supabase as AnyBuilder)
      .from('trainings')
      .insert([item])
      .select()
      .single()

    if (error) return { data: null, error: (error as { message: string }).message }
    return { data: data as Training, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 교육/자격증 수정 */
export async function updateTraining(
  id: number,
  updates: TrainingUpdate
): Promise<{ data: Training | null; error: string | null }> {
  try {
    const supabase: SupabaseClient = createClient()
    const { data, error } = await (supabase as AnyBuilder)
      .from('trainings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: (error as { message: string }).message }
    return { data: data as Training, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 교육/자격증 삭제 */
export async function deleteTraining(id: number): Promise<{ error: string | null }> {
  try {
    const supabase: SupabaseClient = createClient()
    const { error } = await (supabase as AnyBuilder).from('trainings').delete().eq('id', id)
    if (error) return { error: (error as { message: string }).message }
    return { error: null }
  } catch (err) {
    return { error: String(err) }
  }
}
