'use server'

import { createClient } from '@/src/utils/supabase/server'
import { Database } from '@/src/types/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * 프로젝트 수정 서버 액션
 *
 * Supabase의 projects 테이블에서 프로젝트를 업데이트합니다.
 * 관리자 권한이 필요합니다.
 */
export async function updateProject(projectId: number, formData: FormData) {
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

  // 폼 데이터 추출
  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const thumbnailUrl = formData.get('thumbnail_url') as string | null
  const githubUrl = formData.get('github_url') as string | null
  const linkUrl = formData.get('link_url') as string | null
  const startDate = formData.get('start_date') as string | null
  const endDate = formData.get('end_date') as string | null
  const category = formData.get('category') as string | null
  const isFeatured = formData.get('is_featured') === 'on'
  const isOngoing = formData.get('is_ongoing') === 'on'
  
  // 기술 스택 배열 처리 (쉼표로 구분된 문자열을 배열로 변환)
  const techStackInput = formData.get('tech_stack') as string | null
  const techStack = techStackInput
    ? techStackInput.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0)
    : null

  // 추가 필드 처리
  const companyName = formData.get('company_name') as string | null
  const projectRole = formData.get('project_role') as string | null
  const teamSizeInput = formData.get('team_size') as string | null
  const teamSize = teamSizeInput ? parseInt(teamSizeInput, 10) : null

  // 상세 업무 배열 처리 (|||로 구분된 문자열을 배열로 변환)
  const detailedTasksInput = formData.get('detailed_tasks') as string | null
  const detailedTasks = detailedTasksInput
    ? detailedTasksInput.split('|||').map(task => task.trim()).filter(task => task.length > 0)
    : null

  // 필수 필드 검증
  if (!title || title.trim().length === 0) {
    throw new Error('제목은 필수 입력 항목입니다.')
  }

  if (!startDate || startDate.trim().length === 0) {
    throw new Error('시작 날짜는 필수 입력 항목입니다.')
  }

  if (!category || category.trim().length === 0) {
    throw new Error('프로젝트 구분은 필수 선택 항목입니다.')
  }

  // 종료일 검증: 진행중이 아닐 때만 필수
  if (!isOngoing && (!endDate || endDate.trim().length === 0)) {
    throw new Error('종료 날짜는 필수 입력 항목입니다. (진행중 프로젝트가 아닌 경우)')
  }

  // 프로젝트 데이터 준비
  const projectData: Database['public']['Tables']['projects']['Update'] = {
    title: title.trim(),
    description: description?.trim() || null,
    thumbnail_url: thumbnailUrl?.trim() || null,
    github_url: githubUrl?.trim() || null,
    link_url: linkUrl?.trim() || null,
    start_date: startDate || null,
    end_date: endDate || null,
    tech_stack: techStack && techStack.length > 0 ? techStack : null,
    category: category?.trim() || null,
    is_featured: isFeatured || false,
    is_ongoing: isOngoing || false,
    company_name: companyName?.trim() || null,
    project_role: projectRole?.trim() || null,
    team_size: teamSize || null,
    detailed_tasks: detailedTasks && detailedTasks.length > 0 ? detailedTasks : null,
  }

  // Supabase에서 프로젝트 업데이트
  const { error: updateError } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId)

  if (updateError) {
    console.error('프로젝트 수정 오류:', updateError)
    throw new Error(`프로젝트 수정에 실패했습니다: ${updateError.message}`)
  }

  // 캐시 무효화 및 리다이렉트
  revalidatePath('/projects')
  redirect('/projects')
}
