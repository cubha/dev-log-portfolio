import { createClient } from '@/src/utils/supabase/client'
import type { BlogPost } from '@/src/types/blog'

export async function fetchBlogPosts(): Promise<{ data: BlogPost[] | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return { data: null, error: error.message }
    return { data: data as BlogPost[], error: null }
  } catch (err) { return { data: null, error: String(err) } }
}

export async function fetchBlogPostById(id: string): Promise<{ data: BlogPost | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return { data: null, error: error.message }
    return { data: data as BlogPost, error: null }
  } catch (err) { return { data: null, error: String(err) } }
}
