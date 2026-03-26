import { getPublishedBlogPosts, getAllBlogPosts } from '@/src/utils/blog/getBlogPosts'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { BlogList } from '@/src/components/blog/BlogList'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const { user, isAdmin } = await getCurrentUserRole()
  const posts = isAdmin ? await getAllBlogPosts() : await getPublishedBlogPosts()

  const isLoggedIn = !!user

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <AuthStateInitializer isAdmin={isAdmin} />

      {/* 관리자 새 글 작성 버튼 */}
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <Link
            href="/blog/new"
            scroll={false}
            className="inline-flex items-center gap-2 px-4 py-2 bg-silver-metal animate-shine text-white dark:text-slate-950 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            <FileText className="w-4 h-4" />
            새 글 작성
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <EmptyState isAdmin={isAdmin} />
      ) : (
        <BlogList posts={posts} isAdmin={isAdmin} />
      )}

      {isLoggedIn && <FloatingUserButton isAdmin={isAdmin} />}
    </div>
  )
}

function EmptyState({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <FileText className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">
          아직 작성된 글이 없습니다
        </h1>
        {isAdmin ? (
          <>
            <p className="text-foreground/60 text-lg mb-8">첫 번째 블로그 글을 작성해 보세요!</p>
            <Link
              href="/blog/new"
              scroll={false}
              className="inline-flex items-center gap-2 px-6 py-3 bg-silver-metal animate-shine text-white dark:text-slate-950 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">새 글 작성하기</span>
            </Link>
          </>
        ) : (
          <p className="text-foreground/60 text-lg">블로그 글이 곧 업데이트될 예정입니다.</p>
        )}
      </div>
    </div>
  )
}
