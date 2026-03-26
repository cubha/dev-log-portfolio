import { redirect } from 'next/navigation'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { BlogEditForm } from '@/src/components/blog/BlogEditForm'

export const dynamic = 'force-dynamic'

export default async function BlogNewPage() {
  const { isAdmin } = await getCurrentUserRole()
  if (!isAdmin) redirect('/blog')

  return <BlogEditForm mode="create" />
}
