import { createClient } from '@/src/utils/supabase/server'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { BackButton } from '@/src/components/common/BackButton'
import { ContactInfo } from '@/src/components/contact/ContactInfo'
import { InquiryForm } from '@/src/components/contact/InquiryForm'
import { InquiryList } from '@/src/components/contact/InquiryList'
import type { ContactLink } from '@/src/types/contact'

/**
 * Contact 페이지 (Server Component)
 *
 * - contact_links 테이블에서 sort_order 순으로 데이터 fetch
 * - 관리자 여부 확인 후 ContactInfo에 isAdmin prop 전달
 * - 좌측: Contact Info | 우측: Inquiry Form | 하단: 문의 목록
 */
export default async function ContactPage() {
  // ── 1. 관리자 권한 확인 (공통 유틸리티) ──────────────────
  const { isAdmin } = await getCurrentUserRole()

  // ── 2. contact_links 데이터 fetch ────────────────────────
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contact_links')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[ContactPage] contact_links fetch error:', error)
  }

  // 오류 시 빈 배열로 폴백
  const contactLinks: ContactLink[] = data ?? []

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <BackButton />

        {/* 페이지 헤더 */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
        </div>

        {/* 2열 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 좌측: Contact Info — DB 데이터 + 관리자 여부 전달 */}
          <ContactInfo initialData={contactLinks} isAdmin={isAdmin} />

          {/* 우측: Inquiry Form */}
          <InquiryForm />
        </div>

        {/* 하단: 공개된 문의 목록 */}
        <InquiryList />
      </div>
    </div>
  )
}
