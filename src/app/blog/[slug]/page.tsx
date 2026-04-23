// src/app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
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
import { BlogShareLinks } from '@/src/components/blog/BlogShareLinks'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import { format } from 'date-fns'
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
  if (!post || (post.status !== 'published' && !isAdmin)) notFound()

  const currentIdx = allPosts.findIndex((p) => p.id === post.id)
  const adjacent = {
    prev: currentIdx >= 0 && currentIdx < allPosts.length - 1
      ? { slug: allPosts[currentIdx + 1].slug, title: allPosts[currentIdx + 1].title, published_at: allPosts[currentIdx + 1].published_at }
      : null,
    next: currentIdx > 0
      ? { slug: allPosts[currentIdx - 1].slug, title: allPosts[currentIdx - 1].title, published_at: allPosts[currentIdx - 1].published_at }
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

  const readingTime = Math.max(1, Math.ceil(post.content.length / 500))

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

  const px = 'clamp(16px, 3.9vw, 56px)'
  const publishedDate = post.published_at
    ? format(new Date(post.published_at), 'yyyy.MM.dd')
    : post.updated_at
    ? format(new Date(post.updated_at), 'yyyy.MM.dd')
    : null

  return (
    <main>
      <ReadingProgressBar />
      <AuthStateInitializer isAdmin={isAdmin} />

      {/* Mobile top bar (< xl) */}
      <div
        className="xl:hidden"
        style={{
          padding: `32px ${px} 24px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link href="/blog" className="sv-mono" style={{ fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none', letterSpacing: '0.04em' }}>
          ← ALL POSTS
        </Link>
        {isAdmin && (
          <Link
            href={`/blog/edit/${post.id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none', padding: '4px 10px', border: '1px solid var(--border)', background: 'none' }}
          >
            <Pencil style={{ width: 12, height: 12 }} />
            수정
          </Link>
        )}
      </div>

      {/* 3-col grid on xl+, single col below */}
      <div
        className="xl:grid xl:grid-cols-[240px_minmax(0,1fr)_260px] xl:gap-14 blog-detail-grid"
        style={{ paddingLeft: px, paddingRight: px, paddingBottom: 120, alignItems: 'start' }}
      >
        {/* Left sidebar */}
        <aside className="hidden xl:block blog-detail-sidebar" style={{ position: 'sticky', top: 88, height: 'fit-content' }}>
          <Link href="/blog" className="sv-mono" style={{ fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-flex', gap: 8, alignItems: 'center', marginBottom: 32 }}>
            ← ALL POSTS
          </Link>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {publishedDate && (
              <div>
                <div className="sv-label" style={{ marginBottom: 6 }}>PUBLISHED</div>
                <div className="sv-mono" style={{ fontSize: 13, color: 'var(--fg)' }}>{publishedDate}</div>
              </div>
            )}
            <div>
              <div className="sv-label" style={{ marginBottom: 6 }}>READ TIME</div>
              <div className="sv-mono" style={{ fontSize: 13, color: 'var(--fg)' }}>{readingTime} MIN</div>
            </div>
            {post.tags.length > 0 && (
              <div>
                <div className="sv-label" style={{ marginBottom: 10 }}>TAGS</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag" style={{ fontSize: 10 }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="sv-label" style={{ marginBottom: 10 }}>SHARE</div>
              <BlogShareLinks title={post.title} />
            </div>
            {isAdmin && (
              <div style={{ paddingTop: 4 }}>
                <Link
                  href={`/blog/edit/${post.id}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none', padding: '4px 10px', border: '1px solid var(--border)', background: 'none' }}
                >
                  <Pencil style={{ width: 12, height: 12 }} />
                  수정
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main article */}
        <article style={{ maxWidth: 720, minWidth: 0 }}>
          {/* Mobile meta */}
          <div className="xl:hidden" style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {publishedDate && (
              <span className="sv-mono" style={{ fontSize: 11, color: 'var(--fg-subtle)', letterSpacing: '0.08em' }}>{publishedDate}</span>
            )}
            <span className="sv-mono" style={{ fontSize: 11, color: 'var(--fg-subtle)', letterSpacing: '0.08em' }}>{readingTime} MIN READ</span>
          </div>

          <div className="sv-eyebrow" style={{ marginBottom: 24, color: 'var(--accent)' }}>WRITING</div>
          <h1 className="h-1 metallic" style={{ margin: '0 0 24px', lineHeight: 1.05 }}>
            {post.title}
          </h1>
          {post.description && (
            <div className="text-muted" style={{ fontSize: 19, lineHeight: 1.55, marginBottom: 48 }}>
              {post.description}
            </div>
          )}

          {/* Mobile tags */}
          {post.tags.length > 0 && (
            <div className="xl:hidden" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 40 }}>
              {post.tags.map((tag) => (
                <span key={tag} className="tag" style={{ fontSize: 10 }}>{tag}</span>
              ))}
            </div>
          )}

          <MDXComponent components={mdxComponents} />

          <PostNavigation
            prev={adjacent.prev}
            next={adjacent.next}
            allPosts={allPosts}
            currentSlug={slug}
          />

          <div style={{ marginTop: 56, borderTop: '1px solid var(--border)', paddingTop: 28 }}>
            <div className="sv-label" style={{ marginBottom: 16 }}>GISCUS · COMMENTS</div>
            <GiscusComments />
          </div>
        </article>

        {/* Right TOC */}
        {tocItems.length > 0 && (
          <aside className="hidden xl:block" style={{ position: 'sticky', top: 88, height: 'fit-content' }}>
            <TableOfContents items={tocItems} />
          </aside>
        )}
      </div>

      {user && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  )
}
