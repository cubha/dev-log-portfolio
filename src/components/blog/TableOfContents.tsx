'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibleIdsRef = useRef<Set<string>>(new Set())
  const clickCooldownRef = useRef(false)

  useEffect(() => {
    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    if (headingEls.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (clickCooldownRef.current) return
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIdsRef.current.add(entry.target.id)
          } else {
            visibleIdsRef.current.delete(entry.target.id)
          }
        })
        const firstVisible = items.find((item) => visibleIdsRef.current.has(item.id))
        if (firstVisible) setActiveId(firstVisible.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    headingEls.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [items])

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setActiveId(id)
    clickCooldownRef.current = true
    setTimeout(() => { clickCooldownRef.current = false }, 1000)
    const y = el.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  if (items.length === 0) return null

  return (
    <nav style={{ position: 'sticky', top: 88, maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto' }}>
      <div className="sv-label" style={{ marginBottom: 16 }}>ON THIS PAGE</div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, idx) => {
          const isActive = activeId === item.id
          return (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              onClick={() => handleClick(item.id)}
              style={{
                textAlign: 'left',
                fontSize: 13,
                color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
                paddingLeft: 12,
                paddingTop: 0,
                paddingBottom: 0,
                paddingRight: 0,
                background: 'none',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                borderLeft: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
                lineHeight: 1.4,
                outline: 'none',
              }}
            >
              {item.text}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
