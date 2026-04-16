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
        // items 순서(DOM 위에서 아래)를 기준으로 첫 번째 가시 섹션 선택
        const firstVisible = items.find((item) => visibleIdsRef.current.has(item.id))
        if (firstVisible) {
          setActiveId(firstVisible.id)
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
    // 클릭 즉시 활성 표시, 1초간 observer 재정의 방지
    setActiveId(id)
    clickCooldownRef.current = true
    setTimeout(() => { clickCooldownRef.current = false }, 1000)
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
        {items.map((item, idx) => (
          <li key={`${item.id}-${idx}`}>
            <button
              type="button"
              onClick={() => handleClick(item.id)}
              className={`block w-full text-left transition-colors duration-200 cursor-pointer pl-3 py-0.5 -ml-px border-l-2 ${
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
