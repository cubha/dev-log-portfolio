import { getPublishedBlogPosts, getAllBlogPosts } from '@/src/utils/blog/getBlogPosts'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { BlogList } from '@/src/components/blog/BlogList'
import { BlogStatusDropdown } from '@/src/components/blog/BlogStatusDropdown'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { PageHeader } from '@/src/components/common/PageHeader'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const { user, isAdmin } = await getCurrentUserRole()
  const posts = isAdmin ? await getAllBlogPosts() : await getPublishedBlogPosts()
  const px = 'clamp(20px, 5.5vw, 80px)'

  return (
    <main>
      <AuthStateInitializer isAdmin={isAdmin} isLoggedIn={!!user} />

      <PageHeader
        context="PORTFOLIO · WRITING ─────────────"
        title="개발 경험과 기술적 인사이트를 공유합니다."
        aside={isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            <BlogStatusDropdown />
            <Link href="/blog/new" scroll={false} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              새 글 작성 <span className="arrow">→</span>
            </Link>
          </div>
        ) : undefined}
      />

      <section style={{ padding: `0 ${px} clamp(80px, 9vw, 140px)` }}>
        {posts.length === 0 ? (
          <div className="sv-mono text-subtle" style={{ fontSize: 13, letterSpacing: '0.08em', padding: '40px 0' }}>
            아직 작성된 글이 없습니다.
          </div>
        ) : (
          <BlogList posts={posts} isAdmin={isAdmin} />
        )}
      </section>

      <FloatingUserButton />
    </main>
  )
}
