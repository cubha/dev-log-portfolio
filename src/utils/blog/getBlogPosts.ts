import { createClient } from '@/src/utils/supabase/server'
import type { BlogPost } from '@/src/types/blog'

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    if (error) { console.error('블로그 글 조회 오류:', error.message); return [] }
    return (data as BlogPost[]) ?? []
  } catch (err) { console.error('블로그 글 조회 예외:', err); return [] }
}

export async function getBlogPostBySlug(rawSlug: string): Promise<BlogPost | null> {
  try {
    const slug = decodeURIComponent(rawSlug)
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .limit(1)
    if (error) { console.error('블로그 글 단일 조회 오류:', error.message); return null }
    return (data?.[0] as BlogPost) ?? null
  } catch (err) { console.error('블로그 글 단일 조회 예외:', err); return null }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { console.error('블로그 글 전체 조회 오류:', error.message); return [] }
    return (data as BlogPost[]) ?? []
  } catch (err) { console.error('블로그 글 전체 조회 예외:', err); return [] }
}

export type AdjacentPost = Pick<BlogPost, 'slug' | 'title'>
export type PostSummary = Pick<BlogPost, 'id' | 'slug' | 'title' | 'published_at'>

export async function getAdjacentPosts(
  currentPublishedAt: string,
  currentId: string
): Promise<{ prev: AdjacentPost | null; next: AdjacentPost | null }> {
  try {
    const supabase = await createClient()

    const [prevResult, nextResult] = await Promise.all([
      // 이전글: published_at이 더 오래된(이전) 포스트 중 가장 최신
      supabase
        .from('blog_posts')
        .select('slug, title')
        .eq('status', 'published')
        .lt('published_at', currentPublishedAt)
        .neq('id', currentId)
        .order('published_at', { ascending: false })
        .limit(1),
      // 다음글: published_at이 더 최신인 포스트 중 가장 오래된
      supabase
        .from('blog_posts')
        .select('slug, title')
        .eq('status', 'published')
        .gt('published_at', currentPublishedAt)
        .neq('id', currentId)
        .order('published_at', { ascending: true })
        .limit(1),
    ])

    return {
      prev: (prevResult.data?.[0] as AdjacentPost) ?? null,
      next: (nextResult.data?.[0] as AdjacentPost) ?? null,
    }
  } catch (err) {
    console.error('인접 포스트 조회 예외:', err)
    return { prev: null, next: null }
  }
}

export async function getPublishedPostSummaries(): Promise<PostSummary[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    if (error) { console.error('글 요약 목록 조회 오류:', error.message); return [] }
    return (data as PostSummary[]) ?? []
  } catch (err) { console.error('글 요약 목록 조회 예외:', err); return [] }
}

export async function getRecentBlogPosts(limit: number): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) { console.error('최신 블로그 글 조회 오류:', error.message); return [] }
    return (data as BlogPost[]) ?? []
  } catch (err) { console.error('최신 블로그 글 조회 예외:', err); return [] }
}
