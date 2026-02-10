'use server'

import { createClient } from '@/src/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * 프로젝트 삭제 서버 액션
 *
 * Supabase의 projects 테이블에서 프로젝트를 삭제합니다.
 * 관리자 권한이 필요합니다.
 */
export async function deleteProject(projectId: number) {
  const supabase = await createClient()

  // 현재 사용자 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('관리자 권한이 필요합니다.')
  }

  // 프로젝트 삭제
  const { error: deleteError } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (deleteError) {
    console.error('프로젝트 삭제 오류:', deleteError)
    throw new Error(`프로젝트 삭제에 실패했습니다: ${deleteError.message}`)
  }

  // 캐시 무효화
  revalidatePath('/projects')
  revalidatePath('/admin/dashboard')
}
