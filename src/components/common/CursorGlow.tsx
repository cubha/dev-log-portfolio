'use client'

import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current?.parentElement as HTMLElement | null
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%')
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%')
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return <div ref={ref} className="cursor-glow" />
}
