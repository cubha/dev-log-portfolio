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

  useEffect(() => {
    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    if (headingEls.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    headingEls.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [items])

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  if (items.length === 0) return null

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">
        목차
      </p>
      <ul className="space-y-1.5 text-sm border-l border-foreground/10">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleClick(item.id)}
              className={`block w-full text-left transition-colors duration-200 cursor-pointer ${
                item.level === 3 ? 'pl-6' : 'pl-3'
              } py-0.5 -ml-px border-l-2 ${
                activeId === item.id
                  ? 'border-foreground/70 text-foreground font-medium'
                  : 'border-transparent text-foreground/40 hover:text-foreground/70'
              }`}
            >
              <span className="line-clamp-2">{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
