// src/app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Pencil } from 'lucide-react'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import { rehypeShiki } from '@/src/utils/mdx'
import { createMdxComponents } from '@/src/components/mdx/MdxComponents'
import { getBlogPostBySlug, getPublishedPostSummaries } from '@/src/utils/blog/getBlogPosts'
import { markdownTextToPlain, baseIdFromText } from '@/src/utils/blog/headingUtils'
import { PostNavigation } from '@/src/components/blog/PostNavigation'
import { GiscusComments } from '@/src/components/blog/GiscusComments'
import { TableOfContents } from '@/src/components/blog/TableOfContents'
import type { TocItem } from '@/src/components/blog/TableOfContents'
import { ReadingProgressBar } from '@/src/components/blog/ReadingProgressBar'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { MDXContent } from 'mdx/types'
import type { Metadata } from 'next'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: '글을 찾을 수 없습니다' }
  return {
    title: post.title,
    description: post.description ?? `${post.title} — 기술 블로그`,
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [post, { user, isAdmin }, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getCurrentUserRole(),
    getPublishedPostSummaries(),
  ])
  // 글이 없거나, 비발행 상태이면서 관리자가 아닌 경우 404
  if (!post || (post.status !== 'published' && !isAdmin)) notFound()
  const isLoggedIn = !!user

  // 전체 글 목록에서 이전/다음글 계산 (published_at 내림차순 기준)
  const currentIdx = allPosts.findIndex((p) => p.id === post.id)
  const adjacent = {
    prev: currentIdx >= 0 && currentIdx < allPosts.length - 1
      ? {
          slug: allPosts[currentIdx + 1].slug,
          title: allPosts[currentIdx + 1].title,
          published_at: allPosts[currentIdx + 1].published_at,
        }
      : null,
    next: currentIdx > 0
      ? {
          slug: allPosts[currentIdx - 1].slug,
          title: allPosts[currentIdx - 1].title,
          published_at: allPosts[currentIdx - 1].published_at,
        }
      : null,
  }

  const compiled = await compile(post.content, {
    outputFormat: 'function-body',
    format: 'md',
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeShiki],
  })
  const { default: Content } = await run(String(compiled), {
    ...(runtime as Parameters<typeof run>[1]),
    baseUrl: import.meta.url,
  })
  const MDXComponent = Content as MDXContent
  const mdxComponents = createMdxComponents()

  // 읽기 시간 계산 (한국어 기준 ~500자/분)
  const readingTime = Math.max(1, Math.ceil(post.content.length / 500))

  // 마크다운 헤딩에서 TOC 데이터 추출 (h2만) — 코드 블록 내부 ## 제외, 중복 id는 -2, -3 suffix로 구분
  const contentWithoutCodeBlocks = post.content.replace(/```[\s\S]*?```/g, '')
  const tocItems: TocItem[] = []
  const idCountMap = new Map<string, number>()
  const headingRegex = /^(##)\s+(.+)$/gm
  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const text = markdownTextToPlain(match[2])
    const baseId = baseIdFromText(text)
    const count = (idCountMap.get(baseId) ?? 0) + 1
    idCountMap.set(baseId, count)
    const id = count === 1 ? baseId : `${baseId}-${count}`
    tocItems.push({ id, text, level: match[1].length })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <ReadingProgressBar />
      <AuthStateInitializer isAdmin={isAdmin} />
      {/* 상단 내비 */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>블로그 목록</span>
        </Link>
        {isAdmin && (
          <Link
            href={`/blog/edit/${post.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>수정</span>
          </Link>
        )}
      </div>

      {/* 헤더 */}
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-lg text-foreground/60 mb-4">{post.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/50">
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.published_at), 'yyyy년 M월 d일', { locale: ko })}
            </span>
          )}
          <span>{readingTime}분 읽기</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs font-medium bg-foreground/5 text-foreground/70 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 본문 + TOC 2컬럼 레이아웃 */}
      <div className="xl:grid xl:grid-cols-[minmax(0,3fr)_200px] xl:gap-8">
        <div className="min-w-0">
          {/* MDX 콘텐츠 */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <MDXComponent components={mdxComponents} />
          </article>

          {/* 이전/다음글 네비게이션 */}
          <PostNavigation
            prev={adjacent.prev}
            next={adjacent.next}
            allPosts={allPosts}
            currentSlug={slug}
          />

          {/* 댓글 */}
          <GiscusComments />
        </div>

        {/* TOC 사이드바 (xl 이상에서만 표시) */}
        {tocItems.length > 0 && (
          <aside className="hidden xl:block">
            <TableOfContents items={tocItems} />
          </aside>
        )}
      </div>

      {isLoggedIn && <FloatingUserButton isAdmin={isAdmin} />}
    </div>
  )
}
