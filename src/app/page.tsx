import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializerClient } from '@/src/components/providers/AuthStateInitializer'
import { HeroSection } from '@/src/components/home/HeroSection'
import { MenuPreviewSection } from '@/src/components/home/MenuPreviewSection'
import { AIWorkflowSection } from '@/src/components/home/AIWorkflowSection'
import { BufferPhilosophySection } from '@/src/components/home/BufferPhilosophySection'
import { RecentBlogSection } from '@/src/components/home/RecentBlogSection'

// 홈은 쿠키(인증)를 서버에서 읽지 않으므로 ISR/CDN 캐시가 가능하다.
// 인증 상태는 AuthStateInitializerClient가 클라이언트에서 동기화한다.
export const revalidate = 3600

export default function Home() {
  return (
    <main>
      <AuthStateInitializerClient />
      <HeroSection />
      <MenuPreviewSection />
      <AIWorkflowSection />
      <BufferPhilosophySection />
      <RecentBlogSection />
      <FloatingUserButton />
    </main>
  )
}
