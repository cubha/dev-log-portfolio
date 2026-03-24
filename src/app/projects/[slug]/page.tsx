// src/app/projects/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import {
  getRawMdxContent,
  rehypeShiki,
  getAllMdxSlugs,
} from '@/src/utils/mdx'
import { mdxComponents } from '@/src/components/mdx/MdxComponents'
import type { MDXContent } from 'mdx/types'

type PageProps = {
  params: Promise<{ slug: string }>
}

/** slug에 해당하는 MDX 정적 경로 생성 */
export async function generateStaticParams() {
  const slugs = await getAllMdxSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params

  const raw = await getRawMdxContent(slug)
  if (!raw) notFound()

  // MDX → function-body 컴파일
  const compiled = await compile(raw, {
    outputFormat: 'function-body',
    rehypePlugins: [rehypeShiki],
  })

  // Next.js와 동일한 React 인스턴스로 실행 (ESM import)
  const { default: Content } = await run(String(compiled), {
    ...(runtime as Parameters<typeof run>[1]),
    baseUrl: import.meta.url,
  })
  const MDXComponent = Content as MDXContent

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
      {/* 뒤로가기 */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>프로젝트 목록</span>
      </Link>

      {/* 프로젝트 제목 영역 */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {slugToTitle(slug)}
        </h1>
      </header>

      {/* MDX 콘텐츠 영역 */}
      <article className="max-w-3xl">
        <MDXComponent components={mdxComponents} />
      </article>
    </div>
  )
}

/** slug → 읽기 쉬운 제목 변환 */
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
