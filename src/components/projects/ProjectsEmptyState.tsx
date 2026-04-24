'use client'

import { FolderKanban } from 'lucide-react'
import { useAtomValue } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import Link from 'next/link'

export function ProjectsEmptyState() {
  const isAdmin = useAtomValue(isAdminAtom)

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <FolderKanban style={{ width: 64, height: 64, margin: '0 auto 32px', color: 'var(--fg-subtle)' }} />
      <p className="h-3" style={{ marginBottom: 16 }}>아직 등록된 프로젝트가 없습니다</p>
      {isAdmin ? (
        <>
          <p className="text-muted" style={{ fontSize: 14, marginBottom: 32 }}>첫 번째 프로젝트를 등록해 보세요!</p>
          <Link
            href="/admin/projects?mode=new"
            scroll={false}
            className="inline-flex items-center gap-2 px-6 py-3 bg-silver-metal animate-shine text-white dark:text-slate-950 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <FolderKanban className="w-5 h-5" />
            <span className="font-medium">프로젝트 추가하기</span>
          </Link>
        </>
      ) : (
        <p className="text-muted" style={{ fontSize: 14 }}>프로젝트가 곧 업데이트될 예정입니다.</p>
      )}
    </div>
  )
}
