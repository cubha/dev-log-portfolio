'use client'

import Link from 'next/link'
import { useAtomValue } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import { PageHeader } from '@/src/components/common/PageHeader'
import { BlogStatusDropdown } from './BlogStatusDropdown'

/**
 * blog 목록 헤더 (client).
 *
 * blog 페이지가 ISR(정적)로 렌더되므로 admin 여부를 서버에서 알 수 없다.
 * isAdminAtom(클라이언트 하이드레이션 값)을 읽어 admin일 때만 PageHeader aside에
 * 관리 컨트롤(상태 필터 + 새 글 작성)을 노출한다. 비로그인 초기 렌더는 aside 없음 →
 * 서버 정적 HTML과 일치(하이드레이션 불일치 없음), admin은 하이드레이션 후 2-col로 전환.
 */
export function BlogHeader() {
  const isAdmin = useAtomValue(isAdminAtom)

  return (
    <PageHeader
      context="PORTFOLIO · WRITING ─────────────"
      title="개발 경험과 기술적 인사이트를 공유합니다."
      aside={isAdmin ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
          <BlogStatusDropdown />
          <Link href="/blog/new" scroll={false} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            새 글 작성 <span className="arrow">→</span>
          </Link>
        </div>
      ) : undefined}
    />
  )
}
