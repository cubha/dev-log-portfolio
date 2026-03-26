'use client'

import { useEffect, useState } from 'react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import { mdxComponents } from '@/src/components/mdx/MdxComponents'
import type { MDXContent } from 'mdx/types'

interface MarkdownPreviewProps {
  content: string
}

export const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  const [MdxContent, setMdxContent] = useState<MDXContent | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!content.trim()) {
      setMdxContent(null)
      setError(null)
      return
    }

    let cancelled = false

    const compile = async () => {
      try {
        const result = await evaluate(content, {
          ...(runtime as Parameters<typeof evaluate>[1]),
          format: 'md',
          remarkPlugins: [remarkGfm],
        })
        if (!cancelled) {
          setMdxContent(() => result.default as MDXContent)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '마크다운 파싱 오류')
          setMdxContent(null)
        }
      }
    }

    const timer = setTimeout(compile, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [content])

  if (!content.trim()) {
    return (
      <div className="flex items-center justify-center py-16 text-foreground/30 text-sm">
        미리보기할 내용이 없습니다.
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
        <p className="font-medium mb-1">마크다운 파싱 오류</p>
        <pre className="text-xs whitespace-pre-wrap opacity-70">{error}</pre>
      </div>
    )
  }

  if (!MdxContent) {
    return (
      <div className="flex items-center justify-center py-16 text-foreground/30 text-sm">
        <div className="w-4 h-4 border-2 border-foreground/10 border-t-foreground/50 rounded-full animate-spin mr-2" />
        컴파일 중...
      </div>
    )
  }

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <MdxContent components={mdxComponents} />
    </article>
  )
}
