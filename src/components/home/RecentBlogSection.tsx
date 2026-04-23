import Link from 'next/link'
import { getRecentBlogPosts } from '@/src/utils/blog/getBlogPosts'

export async function RecentBlogSection() {
  const posts = await getRecentBlogPosts(3)

  if (posts.length === 0) return null

  return (
    <section
      style={{
        padding: '0 clamp(20px, 5.5vw, 80px) clamp(80px, 9vw, 140px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 40 }}>
        <div className="sv-eyebrow">04 ──── RECENT WRITING</div>
        <Link
          href="/blog"
          className="sv-mono"
          style={{ fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color .15s' }}
        >
          WRITING 전체 보기 →
        </Link>
      </div>

      <div>
        {posts.map((post) => {
          const date = post.published_at
            ? new Date(post.published_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).replace(/\. /g, '.').replace('.', '')
            : ''

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="row-link"
              style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(100px, 9.7vw, 140px) 1fr',
                gap: 'clamp(20px, 2.8vw, 40px)',
                alignItems: 'start',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                className="sv-mono text-subtle"
                style={{ fontSize: 12, letterSpacing: '0.06em', paddingTop: 4 }}
              >
                {date}
              </div>
              <div>
                <div className="h-3" style={{ marginBottom: 10, letterSpacing: '-0.02em' }}>
                  {post.title}
                </div>
                {post.description && (
                  <div
                    className="text-muted"
                    style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 720, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {post.description}
                  </div>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {post.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>
    </section>
  )
}
