// src/components/mdx/MdxComponents.tsx

import { Children } from 'react'
import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'

/** children에서 순수 텍스트를 추출하여 heading id를 생성 */
const getHeadingId = (children: ReactNode): string => {
  const text = Children.toArray(children)
    .map((child) => (typeof child === 'string' ? child : ''))
    .join('')
    .trim()
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
}

/** MDX 내 HTML 태그 → Tailwind 커스텀 컴포넌트 매핑 */
export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      id={getHeadingId(children)}
      className="mt-8 mb-4 text-lg font-bold text-foreground border-l-4 border-brand-primary pl-4 py-1 dark:border-brand-primary scroll-mt-24"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      {...props}
      id={getHeadingId(children)}
      className="mt-6 mb-3 text-base font-semibold text-foreground dark:text-foreground scroll-mt-24"
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
    const isBlock =
      typeof className === 'string' && className.includes('language-')
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
      className="mb-4 overflow-x-auto rounded-lg bg-foreground/5 p-4 text-sm dark:bg-foreground/10"
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
}
