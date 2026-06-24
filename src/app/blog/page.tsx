import { getPublishedBlogPosts } from '@/src/utils/blog/getBlogPosts'
import { BlogHeader } from '@/src/components/blog/BlogHeader'
import { BlogPostsSection } from '@/src/components/blog/BlogPostsSection'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializerClient } from '@/src/components/providers/AuthStateInitializer'

export const revalidate = 3600

export default async function BlogPage() {
  // 공개 글만 서버 ISR로 정적 렌더(쿠키-프리 public 클라이언트). admin 초안은 client 오버레이.
  const posts = await getPublishedBlogPosts()
  const px = 'clamp(20px, 5.5vw, 80px)'

  return (
    <main>
      <AuthStateInitializerClient />

      <BlogHeader />

      <section style={{ padding: `0 ${px} clamp(80px, 9vw, 140px)` }}>
        <BlogPostsSection publishedPosts={posts} />
      </section>

      <FloatingUserButton />
    </main>
  )
}
