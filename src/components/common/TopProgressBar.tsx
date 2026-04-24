'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export function TopProgressBar() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const prevPathname = useRef(pathname)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function startProgress() {
    setActive(true)
    setProgress(12)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setProgress(p => p < 82 ? p + Math.random() * 7 : p)
    }, 320)
  }

  function completeProgress() {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(100)
    doneTimerRef.current = setTimeout(() => {
      setActive(false)
      setProgress(0)
    }, 350)
  }

  // Detect navigation start via anchor click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return
      if (anchor.target === '_blank') return
      startProgress()
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // Detect navigation end via pathname change
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname
      completeProgress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (doneTimerRef.current) clearTimeout(doneTimerRef.current)
    }
  }, [])

  if (!active) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '2px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--accent) 0%, var(--fg) 60%, var(--accent) 100%)',
          backgroundSize: '200% 100%',
          transition: progress === 100
            ? 'width 0.12s ease-out, opacity 0.3s ease 0.1s'
            : 'width 0.32s ease-out',
          opacity: progress === 100 ? 0 : 1,
          boxShadow: '0 0 8px var(--accent-line)',
        }}
      />
    </div>
  )
}
