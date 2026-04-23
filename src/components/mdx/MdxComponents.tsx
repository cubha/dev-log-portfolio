// src/components/mdx/MdxComponents.tsx

import React from 'react'
import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { baseIdFromText } from '@/src/utils/blog/headingUtils'

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
        className="h-2"
        style={{ margin: '48px 0 20px', borderLeft: '2px solid var(--accent)', paddingLeft: 16, scrollMarginTop: 96 }}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        id={getUniqueId(children)}
        style={{ margin: '32px 0 14px', fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg)', lineHeight: 1.3, scrollMarginTop: 96 }}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p {...props} style={{ marginBottom: 28, fontSize: 16, lineHeight: 1.8, color: 'var(--fg)' }}>
        {children}
      </p>
    ),
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
        style={{ borderBottom: '1px solid var(--accent)', color: 'var(--fg)', paddingBottom: 1, textDecoration: 'none' }}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul {...props} style={{ marginBottom: 28, paddingLeft: 24, listStyleType: 'disc', color: 'var(--fg)' }}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol {...props} style={{ marginBottom: 28, paddingLeft: 24, listStyleType: 'decimal', color: 'var(--fg)' }}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li {...props} style={{ lineHeight: 1.8, marginBottom: 6 }}>
        {children}
      </li>
    ),
    code: ({ children, className, ...props }) => {
      const isBlock = typeof className === 'string' && className.includes('language-')
      if (isBlock) return <code {...props} className={className}>{children}</code>
      return (
        <code
          {...props}
          style={{ background: 'var(--accent-dim)', padding: '2px 7px', borderRadius: 3, fontSize: '0.875em', fontFamily: "'JetBrains Mono', monospace", color: 'var(--fg)' }}
        >
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }) => (
      <pre
        {...props}
        style={{ marginBottom: 32, overflowX: 'auto', borderRadius: 8, background: 'var(--code-bg)', padding: '20px 24px', fontSize: 13, lineHeight: 1.65 }}
      >
        {children}
      </pre>
    ),
    strong: ({ children, ...props }) => (
      <strong {...props} style={{ fontWeight: 600, color: 'var(--fg)' }}>
        {children}
      </strong>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        {...props}
        style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 20, margin: '0 0 40px', fontStyle: 'italic', fontSize: 17, color: 'var(--fg-muted)', lineHeight: 1.6 }}
      >
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }) => (
      <div style={{ marginBottom: 28, overflowX: 'auto' }}>
        <table {...props} style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead {...props} style={{ background: 'var(--accent-dim)' }}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th {...props} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--fg)', border: '1px solid var(--border)' }}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td {...props} style={{ padding: '10px 16px', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>
        {children}
      </td>
    ),
    hr: ({ ...props }) => (
      <hr {...props} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' }} />
    ),
  }
}
