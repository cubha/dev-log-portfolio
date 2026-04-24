import { createClient } from '@/src/utils/supabase/server'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { ContactInfo } from '@/src/components/contact/ContactInfo'
import { LiveStatusWidget } from '@/src/components/contact/LiveStatusWidget'
import { GuestbookForm } from '@/src/components/contact/GuestbookForm'
import { GuestbookList } from '@/src/components/contact/GuestbookList'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { PageHeader } from '@/src/components/common/PageHeader'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import type { ContactLink } from '@/src/types/contact'

export const dynamic = 'force-dynamic'

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ guestbookPage?: string }>
}) {
  const params = await searchParams
  const guestbookPage = Math.max(1, parseInt(params.guestbookPage ?? '1', 10) || 1)
  const { user, role, isAdmin } = await getCurrentUserRole()

  const supabase = await createClient()

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

  if (error) console.error('[ContactPage] contact_links fetch error:', error)
  const contactLinks: ContactLink[] = data ?? []

  const px = 'clamp(20px, 5.5vw, 80px)'

  return (
    <main>
      <AuthStateInitializer isAdmin={isAdmin} />

      <PageHeader
        context="PORTFOLIO · CONTACT ─────────────"
        title={<>새 프로젝트든, <span className="metallic">가벼운 인사</span>든 환영합니다.</>}
        desc="보통 하루 안에 답장드립니다. 아래 방명록은 공개, 이메일은 비공개로 받고 있습니다."
        titleStyle={{ maxWidth: 900 }}
        marginBottom={120}
      />

      {/* Contact info + Guestbook form */}
      <section
        style={{
          padding: `clamp(60px, 6vw, 96px) ${px} 80px`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(40px, 5.5vw, 80px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {/* Left: Contact info + Live Status */}
        <div>
          <div className="sv-label" style={{ marginBottom: 28 }}>CONTACT INFO</div>
          <ContactInfo initialData={contactLinks} isAdmin={isAdmin} />
          <div style={{ marginTop: 48 }}>
            <div className="sv-label" style={{ marginBottom: 20 }}>LIVE STATUS</div>
            <LiveStatusWidget />
          </div>
        </div>

        {/* Right: Guestbook form */}
        <div>
          <div className="sv-label" style={{ marginBottom: 28 }}>방명록 GUESTBOOK</div>
          <GuestbookForm
            user={user}
            isAdmin={isAdmin}
            displayName={displayName}
            avatarUrl={userAvatarUrl}
          />
        </div>
      </section>

      {/* Guestbook list */}
      <section style={{ padding: `56px ${px} clamp(80px, 9vw, 140px)`, borderTop: '1px solid var(--border)' }}>
        <GuestbookList
          isAdmin={isAdmin}
          currentUserId={user?.id ?? null}
          currentUserName={displayName}
          page={guestbookPage}
        />
      </section>

      {role !== 'guest' && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  )
}
