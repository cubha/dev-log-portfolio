'use client'

import { useAtom } from 'jotai'
import { blogStatusAtom, type BlogStatusFilter } from '@/src/store/filterAtom'
import { STATUS_LABEL } from '@/src/types/blog'

export function BlogStatusDropdown() {
  const [status, setStatus] = useAtom(blogStatusAtom)

  return (
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value as BlogStatusFilter)}
      style={{
        background: 'var(--bg-1)',
        border: '1px solid var(--border)',
        color: 'var(--fg-muted)',
        padding: '13px 36px 13px 22px',
        fontSize: 14,
        fontFamily: "inherit",
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
      }}
    >
      <option value="all">전체 상태</option>
      {(['published', 'draft', 'archived'] as const).map((s) => (
        <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>
      ))}
    </select>
  )
}
