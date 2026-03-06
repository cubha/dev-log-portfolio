import { createClient } from '@/src/utils/supabase/server'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { ContactInfo } from '@/src/components/contact/ContactInfo'
import { LiveStatusWidget } from '@/src/components/contact/LiveStatusWidget'
import { GuestbookForm } from '@/src/components/contact/GuestbookForm'
import { GuestbookList } from '@/src/components/contact/GuestbookList'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { ThemeCard } from '@/src/components/common/ThemeCard'
import type { ContactLink } from '@/src/types/contact'

export const dynamic = 'force-dynamic'

/**
 * Contact 페이지 (Server Component)
 *
 * - contact_links 테이블에서 sort_order 순으로 데이터 fetch
 * - 관리자 여부 확인 후 ContactInfo에 isAdmin prop 전달
 * - 좌측: Contact Info | 우측: 방명록 폼 | 하단: 방명록 목록
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ guestbookPage?: string }>
}) {
  const params = await searchParams
  const guestbookPage = Math.max(1, parseInt(params.guestbookPage ?? '1', 10) || 1)
  // ── 1. 관리자 권한 확인 (공통 유틸리티) ──────────────────
  const { user, role, isAdmin } = await getCurrentUserRole()

  // ── 2. contact_links 데이터 fetch ────────────────────────
  const supabase = await createClient()

  // ── 3. 로그인 유저 닉네임/아바타 서버사이드 계산 ──────────
  let displayName: string | null = null
  let userAvatarUrl: string | null = null

  if (user) {
    userAvatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null

    if (isAdmin) {
      displayName = 'Admin'
    } else if (user.app_metadata?.provider === 'github') {
      displayName =
        (user.user_metadata?.user_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        'GitHub User'
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', user.id)
        .single()
      displayName = profile?.user_id ?? user.email?.split('@')[0] ?? 'User'
    }
  }

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
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 페이지 헤더 */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-foreground">Contact</h1>
          </div>

          {/* 2열 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* 좌측: Contact Info + Live Status */}
            <div className="flex flex-col gap-4">
              <ThemeCard noHoverLift className="p-6">
                <ContactInfo initialData={contactLinks} isAdmin={isAdmin} />
              </ThemeCard>
              <ThemeCard noHoverLift className="p-4">
                <LiveStatusWidget />
              </ThemeCard>
            </div>

            {/* 우측: 방명록 폼 */}
            <ThemeCard noHoverLift className="p-6 h-full">
              <GuestbookForm
                user={user}
                isAdmin={isAdmin}
                displayName={displayName}
                avatarUrl={userAvatarUrl}
              />
            </ThemeCard>
          </div>

          {/* 하단: 방명록 목록 */}
          <GuestbookList
            isAdmin={isAdmin}
            currentUserId={user?.id ?? null}
            currentUserName={displayName}
            page={guestbookPage}
          />
        </div>
      </div>

      {/* 로그인 유저: 플로팅 메뉴 */}
      {role !== 'guest' && <FloatingUserButton isAdmin={isAdmin} />}
    </>
  )
}
