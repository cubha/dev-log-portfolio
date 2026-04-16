'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/utils/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

async function checkAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase: null, user: null, error: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { supabase: null, user: null, error: '관리자 권한이 필요합니다.' }

  return { supabase, user, error: null }
}

export async function createBlogPost(data: {
  title: string
  slug: string
  description: string | null
  content: string
  tags: string[]
  status: string
}): Promise<ActionResult> {
  const { supabase, user, error } = await checkAdmin()
  if (!supabase || !user) return { success: false, error: error ?? '인증 오류' }

  const { error: insertError } = await supabase.from('blog_posts').insert({
    ...data,
    author_id: user.id,
    published_at: data.status === 'published' ? new Date().toISOString() : null,
  })

  if (insertError) return { success: false, error: insertError.message }

  revalidatePath('/blog', 'layout')
  return { success: true }
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string
    slug?: string
    description?: string | null
    content?: string
    tags?: string[]
    status?: string
  },
): Promise<ActionResult> {
  const { supabase, error } = await checkAdmin()
  if (!supabase) return { success: false, error: error ?? '인증 오류' }

  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (updateError) return { success: false, error: updateError.message }

  revalidatePath('/blog', 'layout')
  return { success: true }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const { supabase, error } = await checkAdmin()
  if (!supabase) return { success: false, error: error ?? '인증 오류' }

  const { error: deleteError } = await supabase.from('blog_posts').delete().eq('id', id)

  if (deleteError) return { success: false, error: deleteError.message }

  revalidatePath('/blog', 'layout')
  return { success: true }
}

export async function togglePublish(id: string, publish: boolean): Promise<ActionResult> {
  const { supabase, error } = await checkAdmin()
  if (!supabase) return { success: false, error: error ?? '인증 오류' }

  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({
      status: publish ? 'published' : 'draft',
      published_at: publish ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) return { success: false, error: updateError.message }

  revalidatePath('/blog', 'layout')
  return { success: true }
}
