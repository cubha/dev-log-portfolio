import { redirect, notFound } from 'next/navigation'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { getBlogPostById } from '@/src/utils/blog/getBlogPosts'
import { BlogEditForm } from '@/src/components/blog/BlogEditForm'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ id: string }> }

export default async function BlogEditPage({ params }: PageProps) {
  const { id } = await params
  const [{ isAdmin }, post] = await Promise.all([
    getCurrentUserRole(),
    getBlogPostById(id),
  ])

  if (!isAdmin) redirect('/blog')
  if (!post) notFound()

  return <BlogEditForm mode="edit" initialData={post} />
}
