import { createClient } from '@/src/utils/supabase/server'
import { createPublicClient } from '@/src/utils/supabase/public'
import type { BlogPost } from '@/src/types/blog'

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    // 공개(published) 글은 anon read 가능 → 쿠키-프리 public 클라이언트로 blog 목록 ISR 캐시 유지.
    const supabase = createPublicClient()
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

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .limit(1)
    if (error) { console.error('블로그 글 ID 조회 오류:', error.message); return null }
    return (data?.[0] as BlogPost) ?? null
  } catch (err) { console.error('블로그 글 ID 조회 예외:', err); return null }
}

export type AdjacentPost = Pick<BlogPost, 'slug' | 'title' | 'published_at'>
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
        .select('slug, title, published_at')
        .eq('status', 'published')
        .lt('published_at', currentPublishedAt)
        .neq('id', currentId)
        .order('published_at', { ascending: false })
        .limit(1),
      // 다음글: published_at이 더 최신인 포스트 중 가장 오래된
      supabase
        .from('blog_posts')
        .select('slug, title, published_at')
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
    // 쿠키-프리 public 클라이언트 사용 → 홈 페이지가 ISR/CDN 캐시 가능해진다.
    const supabase = createPublicClient()
    // race 대상을 "값만 추출하는 Promise"로 정규화 (폴백 타입 안전).
    const data = await Promise.race([
      supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit)
        .then(({ data }) => data),
      new Promise<BlogPost[] | null>((resolve) =>
        setTimeout(() => resolve(null), 4000)
      ),
    ])
    return (data as BlogPost[]) ?? []
  } catch (err) { console.error('최신 블로그 글 조회 예외:', err); return [] }
}
