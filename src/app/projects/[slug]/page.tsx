// src/app/projects/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import {
  getMdxContent,
  mdxSerializeOptions,
  getAllMdxSlugs,
} from '@/src/utils/mdx'
import { mdxComponents } from '@/src/components/mdx/MdxComponents'

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

  const content = await getMdxContent(slug)
  if (!content) notFound()

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

      {/* MDX 콘텐츠 영역 (최대 너비 컨테이너) */}
      <article className="max-w-3xl">
        <MDXRemote
          source={content.raw}
          options={mdxSerializeOptions}
          components={mdxComponents}
        />
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
