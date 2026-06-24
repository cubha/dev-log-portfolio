'use client'

import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import { createClient } from '@/src/utils/supabase/client'
import type { BlogPost } from '@/src/types/blog'
import { BlogList } from './BlogList'

interface BlogPostsSectionProps {
  /** 서버(ISR)에서 정적으로 전달되는 공개(published) 글 목록 */
  publishedPosts: BlogPost[]
}

/**
 * blog 글 목록 섹션 (client 오버레이).
 *
 * 공개 글은 서버 ISR로 즉시 렌더하고, admin이면 브라우저 client(authed)로 초안 포함
 * 전체 글을 추가 조회해 덧붙인다. RLS: 비로그인은 published만, author(admin)는 own 글 전체.
 * 초안 로드 전에도 published는 즉시 보이므로 admin 체감 지연이 없다.
 */
export function BlogPostsSection({ publishedPosts }: BlogPostsSectionProps) {
  const isAdmin = useAtomValue(isAdminAtom)
  const [adminPosts, setAdminPosts] = useState<BlogPost[] | null>(null)

  useEffect(() => {
    if (!isAdmin) {
      setAdminPosts(null)
      return
    }
    let cancelled = false
    const fetchAll = async () => {
      try {
        const supabase = createClient()
        // 초안 포함 전체 (getAllBlogPosts와 동일하게 created_at 최신순)
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) {
          console.error('관리자 글 목록 조회 오류:', error.message)
          return
        }
        if (!cancelled) setAdminPosts((data as BlogPost[]) ?? [])
      } catch (err) {
        console.error('관리자 글 목록 조회 예외:', err)
      }
    }
    fetchAll()
    return () => {
      cancelled = true
    }
    // publishedPosts 의존: 서버 액션(발행/삭제) 후 router.refresh로 새 prop이 오면 초안도 갱신
  }, [isAdmin, publishedPosts])

  const posts = isAdmin && adminPosts ? adminPosts : publishedPosts

  if (posts.length === 0) {
    return (
      <div className="sv-mono text-subtle" style={{ fontSize: 13, letterSpacing: '0.08em', padding: '40px 0' }}>
        아직 작성된 글이 없습니다.
      </div>
    )
  }

  return <BlogList posts={posts} isAdmin={isAdmin} />
}
