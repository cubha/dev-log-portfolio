import { getPublishedBlogPosts, getAllBlogPosts } from '@/src/utils/blog/getBlogPosts'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { BlogList } from '@/src/components/blog/BlogList'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const { user, isAdmin } = await getCurrentUserRole()
  const posts = isAdmin ? await getAllBlogPosts() : await getPublishedBlogPosts()
  const px = 'clamp(20px, 5.5vw, 80px)'

  return (
    <main>
      <AuthStateInitializer isAdmin={isAdmin} />

      {/* Page header */}
      <section style={{ padding: `72px ${px} 40px` }}>
        <div className="page-context" style={{ marginBottom: 32 }}>
          PORTFOLIO · WRITING ─────────────
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" style={{ marginBottom: 60 }}>
          <h1 className="h-1" style={{ margin: 0, letterSpacing: '-0.04em' }}>
            개발 경험과 기술적 인사이트를 공유합니다.
          </h1>
          {isAdmin && (
            <Link href="/blog/new" scroll={false} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              새 글 작성 <span className="arrow">→</span>
            </Link>
          )}
        </div>
      </section>

      <section style={{ padding: `0 ${px} clamp(80px, 9vw, 140px)` }}>
        {posts.length === 0 ? (
          <div className="sv-mono text-subtle" style={{ fontSize: 13, letterSpacing: '0.08em', padding: '40px 0' }}>
            아직 작성된 글이 없습니다.
          </div>
        ) : (
          <BlogList posts={posts} isAdmin={isAdmin} />
        )}
      </section>

      {user && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  )
}
