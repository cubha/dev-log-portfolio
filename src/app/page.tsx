import Link from 'next/link'
import { FolderKanban, ArrowRight, Zap, Code2, Database, Palette, Sparkles } from 'lucide-react'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AboutLink } from '@/src/components/home/AboutLink'
import { ContactLink } from '@/src/components/home/ContactLink'

/**
 * 홈페이지
 *
 * 프로젝트의 메인 랜딩 페이지입니다.
 * 프로젝트 리스트 및 About 페이지로 이동할 수 있는 버튼을 제공합니다.
 * 로그인 유저에게 우측 하단에 플로팅 메뉴가 표시됩니다.
 */
export default async function Home() {
  const { user, isAdmin } = await getCurrentUserRole()
  const isLoggedIn = !!user

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* 메인 타이틀 */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dev Log Portfolio
          </h1>
          <p className="text-base md:text-lg text-foreground/60">
            개발 블로그 포트폴리오 프로젝트
          </p>
          <p className="text-sm text-foreground/50 max-w-2xl mx-auto">
            Next.js 15와 Supabase로 구축한 포트폴리오 관리 시스템입니다.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex justify-center items-center pt-8">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-silver-metal animate-shine text-white dark:text-slate-950 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <FolderKanban className="w-6 h-6" />
            <span>프로젝트 보기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* About 링크 */}
        <AboutLink />

        {/* Contact 링크 */}
        <ContactLink />

        {/* 기술 스택 표시 */}
        <div className="pt-16">
          <p className="text-sm text-foreground/50 mb-4">사용 기술</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Next.js 15', icon: Zap },
              { name: 'TypeScript', icon: Code2 },
              { name: 'Supabase', icon: Database },
              { name: 'Tailwind CSS', icon: Palette },
              { name: 'Framer Motion', icon: Sparkles },
            ].map((tech) => {
              const Icon = tech.icon
              return (
                <span
                  key={tech.name}
                  className="flex items-center gap-2 px-4 py-2 bg-foreground/5 text-foreground/70 text-sm font-medium rounded-lg border border-foreground/10 hover:border-brand-primary hover:shadow-md transition-all"
                >
                  <Icon className="w-4 h-4 text-foreground/50" />
                  {tech.name}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {isLoggedIn && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  )
}
