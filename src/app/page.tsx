import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import { HeroSection } from '@/src/components/home/HeroSection'
import { MenuPreviewSection } from '@/src/components/home/MenuPreviewSection'
import { AIWorkflowSection } from '@/src/components/home/AIWorkflowSection'
import { BufferPhilosophySection } from '@/src/components/home/BufferPhilosophySection'
import { TechStackSection } from '@/src/components/home/TechStackSection'
import { RecentBlogSection } from '@/src/components/home/RecentBlogSection'

export default async function Home() {
  const { user, isAdmin } = await getCurrentUserRole()

  return (
    <main>
      <AuthStateInitializer isAdmin={isAdmin} isLoggedIn={!!user} />
      <HeroSection />
      <MenuPreviewSection />
      <AIWorkflowSection />
      <BufferPhilosophySection />
      <TechStackSection />
      <RecentBlogSection />
      <FloatingUserButton />
    </main>
  )
}
