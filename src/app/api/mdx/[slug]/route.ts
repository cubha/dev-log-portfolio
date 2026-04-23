import { NextResponse } from 'next/server'
import { compile, run } from '@mdx-js/mdx'
import { createElement } from 'react'
import * as runtime from 'react/jsx-runtime'
import { getRawMdxContent, rehypeShiki } from '@/src/utils/mdx'
import { createMdxComponents } from '@/src/components/mdx/MdxComponents'
import type { MDXComponents } from 'mdx/types'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return NextResponse.json({ html: null }, { status: 400 })
  }
  const raw = await getRawMdxContent(slug)
  if (!raw) return NextResponse.json({ html: null }, { status: 404 })

  try {
    const compiled = await compile(raw, {
      outputFormat: 'function-body',
      rehypePlugins: [rehypeShiki],
    })

    const { default: Content } = await run(String(compiled), {
      ...(runtime as Parameters<typeof run>[1]),
      baseUrl: import.meta.url,
    })

    // 동적 import로 react-dom/server 로드 (Next.js 정적 분석 회피)
    const { renderToStaticMarkup } = await import('react-dom/server')
    const html = renderToStaticMarkup(
      createElement(
        Content as React.ComponentType<{ components?: MDXComponents }>,
        { components: createMdxComponents() }
      )
    )
    return NextResponse.json({ html })
  } catch {
    return NextResponse.json({ html: null }, { status: 500 })
  }
}
