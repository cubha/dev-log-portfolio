import { createClient } from '@/src/utils/supabase/client'
import type { Skill, SkillInsert, SkillUpdate } from '@/src/types/skill'

/** 전체 기술 스택 목록 조회 */
export async function fetchSkills(): Promise<{ data: Skill[] | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('proficiency', { ascending: false })

    if (error) return { data: null, error: error.message }
    return { data: data as Skill[], error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 새 기술 스택 추가 */
export async function createSkill(
  skill: SkillInsert
): Promise<{ data: Skill | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as Skill, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 기술 스택 수정 */
export async function updateSkill(
  id: number,
  updates: SkillUpdate
): Promise<{ data: Skill | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as Skill, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

/** 기술 스택 삭제 */
export async function deleteSkill(id: number): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from('skills').delete().eq('id', id)

    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    return { error: String(err) }
  }
}
