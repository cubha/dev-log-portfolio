import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { HeroSection } from '@/src/components/home/HeroSection'
import { AboutLink } from '@/src/components/home/AboutLink'
import { ContactLink } from '@/src/components/home/ContactLink'
import { AIWorkflowSection } from '@/src/components/home/AIWorkflowSection'
import { RecentBlogSection } from '@/src/components/home/RecentBlogSection'

/**
 * 홈페이지
 *
 * 구성:
 * - HeroSection: Buffer Progress Bar + Ambient Glow + CTA
 * - AIWorkflowSection: 3단계 Circuit 공정 + Buffer Dashboard + Precision Tools
 * - AboutLink / ContactLink: 페이지 이동 링크
 */
export default async function Home() {
  const { user, isAdmin } = await getCurrentUserRole()
  const isLoggedIn = !!user

  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      {/* ── Hero (전체 너비 배경) ───────────────────────────────────── */}
      <div className="w-full">
        <HeroSection />
      </div>

      <div className="max-w-5xl w-full flex flex-col px-4 md:px-6">
        {/* ── AI Workflow + Buffer + Tech ───────────────────────────── */}
        <AIWorkflowSection />

        {/* ── 최근 블로그 글 ───────────────────────────────────────── */}
        <RecentBlogSection />

        {/* ── Footer Link 영역 (수직 정렬) ───────────────────────────── */}
        <div className="flex flex-col items-center gap-5 mt-12 max-w-fit mx-auto">
          <AboutLink />
          <ContactLink />
        </div>
      </div>

      {isLoggedIn && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  )
}
