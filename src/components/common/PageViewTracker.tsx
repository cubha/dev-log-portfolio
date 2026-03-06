'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const VISITOR_ID_KEY = 'pv_visitor_id'
const EXCLUDED_PREFIXES = ['/admin', '/login', '/api']

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(VISITOR_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_ID_KEY, id)
  }
  return id
}

export function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return

    const visitor_id = getOrCreateVisitorId()

    fetch('/api/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, visitor_id }),
    }).catch(() => {
      // 추적 실패는 무시
    })
  }, [pathname])

  return null
}
