import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar } from 'lucide-react'
import { getRecentBlogPosts } from '@/src/utils/blog/getBlogPosts'

/**
 * 홈페이지 최근 블로그 글 섹션 (서버 컴포넌트)
 *
 * - 최신 발행 글 3건을 Supabase에서 직접 조회
 * - 글이 없으면 섹션 자체를 렌더링하지 않음
 */
export async function RecentBlogSection() {
  const posts = await getRecentBlogPosts(3)

  if (posts.length === 0) return null

  return (
    <section className="mt-20 w-full">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-foreground/50" />
          <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
            Recent Posts
          </h2>
        </div>
        <Link
          href="/blog"
          scroll={false}
          className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-colors group"
        >
          전체 보기
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 포스트 목록 */}
      <div className="flex flex-col divide-y divide-foreground/8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            scroll={false}
            className="group py-4 flex flex-col gap-1.5 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-1 group-hover:text-foreground/80 transition-colors">
                {post.title}
              </h3>
              {post.published_at && (
                <span className="flex items-center gap-1 text-xs text-foreground/40 shrink-0">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.published_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            {post.description && (
              <p className="text-xs text-foreground/50 line-clamp-1">{post.description}</p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/6 text-foreground/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
