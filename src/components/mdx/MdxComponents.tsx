// src/components/mdx/MdxComponents.tsx

import React from 'react'
import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { baseIdFromText } from '@/src/utils/blog/headingUtils'

/** children에서 순수 텍스트를 재귀 추출 */
const extractText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node !== null && typeof node === 'object' && 'props' in node) {
    const el = node as React.ReactElement<{ children?: ReactNode }>
    return extractText(el.props.children)
  }
  return ''
}

const getHeadingId = (children: ReactNode): string =>
  baseIdFromText(extractText(children).trim())

/**
 * MDX 컴포넌트 팩토리 — 중복 heading ID를 순서대로 자동 처리 (-2, -3 suffix)
 * page.tsx에서 createMdxComponents()를 호출해 생성한 컴포넌트를 MDXComponent에 전달한다.
 */
export const createMdxComponents = (): MDXComponents => {
  const idCountMap = new Map<string, number>()

  const getUniqueId = (children: ReactNode): string => {
    const baseId = getHeadingId(children)
    const count = (idCountMap.get(baseId) ?? 0) + 1
    idCountMap.set(baseId, count)
    return count === 1 ? baseId : `${baseId}-${count}`
  }

  return {
    h2: ({ children, ...props }) => (
      <h2
        {...props}
        id={getUniqueId(children)}
        className="mt-12 mb-4 text-lg font-bold text-foreground border-l-4 border-brand-primary pl-4 py-1 dark:border-brand-primary scroll-mt-20"
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        id={getUniqueId(children)}
        className="mt-10 mb-3 text-base font-semibold text-foreground dark:text-foreground scroll-mt-20"
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p {...props} className="mb-4 text-foreground leading-relaxed dark:text-foreground">
        {children}
      </p>
    ),
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
        className="text-brand-secondary hover:underline dark:text-brand-secondary"
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul {...props} className="mb-4 ml-6 list-disc space-y-1 text-foreground dark:text-foreground">
        {children}
      </ul>
    ),
    li: ({ children, ...props }) => (
      <li {...props} className="leading-relaxed">
        {children}
      </li>
    ),
    code: ({ children, className, ...props }) => {
      const isBlock = typeof className === 'string' && className.includes('language-')
      return (
        <code
          {...props}
          className={
            isBlock
              ? className
              : `rounded bg-foreground/10 px-1.5 py-0.5 text-sm font-mono text-foreground dark:bg-foreground/20 dark:text-foreground ${className ?? ''}`
          }
        >
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }) => (
      <pre
        {...props}
        className="mb-4 overflow-x-auto rounded-lg bg-[#24292e] p-4 text-sm text-[#e1e4e8] [&>code]:!text-inherit [&>code]:!bg-transparent [&>code]:!p-0 [&>code]:!rounded-none"
      >
        {children}
      </pre>
    ),
    strong: ({ children, ...props }) => (
      <strong {...props} className="font-bold text-foreground dark:text-foreground">
        {children}
      </strong>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        {...props}
        className="border-l-4 border-brand-secondary/50 pl-4 py-2 my-4 italic text-foreground/90 dark:border-brand-secondary/50 dark:text-foreground/90"
      >
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }) => (
      <div className="mb-4 overflow-x-auto not-prose">
        <table {...props} className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead {...props} className="bg-foreground/5 dark:bg-foreground/10">
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody {...props} className="divide-y divide-foreground/10">
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr {...props} className="hover:bg-foreground/5 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th
        {...props}
        className="px-4 py-2 text-left font-semibold text-foreground border border-foreground/15"
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        {...props}
        className="px-4 py-2 text-foreground/90 border border-foreground/15"
      >
        {children}
      </td>
    ),
  }
}
