import { createClient } from '@/src/utils/supabase/server'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { Database } from '@/src/types/supabase'
import { FolderKanban } from 'lucide-react'
import { ProjectList } from '@/src/components/projects/ProjectList'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializer } from '@/src/components/providers/AuthStateInitializer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  try {
    const { role: userRole, isAdmin } = await getCurrentUserRole()
    const supabase = await createClient()

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('is_ongoing', { ascending: false })
      .order('end_date', { ascending: false, nullsFirst: false })

    const typedProjects: Database['public']['Tables']['projects']['Row'][] = projects || []
    const px = 'clamp(20px, 5.5vw, 80px)'

    return (
      <main>
        <AuthStateInitializer isAdmin={isAdmin} />

        <section style={{ padding: `72px ${px} 40px` }}>
          <div className="page-context" style={{ marginBottom: 32 }}>
            PORTFOLIO · PROJECTS ─────────────
          </div>
          <div className="grid page-header-grid page-header-grid-2col-25vw" style={{ gap: 'clamp(40px, 5.5vw, 80px)', alignItems: 'end', marginBottom: 100 }}>
            <h1 className="h-1" style={{ margin: 0, maxWidth: 820, letterSpacing: '-0.04em' }}>
              제가 진행했던 프로젝트들의{' '}
              <span className="metallic">연대기</span>입니다.
            </h1>
            <p className="text-muted hidden md:block" style={{ fontSize: 14, lineHeight: 1.7 }}>
              금융권·제조업·공공 분야. 업무 / 개인 / 팀으로 분류.
            </p>
          </div>
        </section>

        <section style={{ padding: `clamp(60px, 6vw, 96px) ${px} clamp(80px, 9vw, 140px)`, borderTop: '1px solid var(--border)' }}>
          {error ? (
            <ErrorState message={error.message} />
          ) : typedProjects.length === 0 ? (
            <EmptyState isAdmin={isAdmin} />
          ) : (
            <ProjectList projects={typedProjects} />
          )}
        </section>

        {userRole !== 'guest' && <FloatingUserButton isAdmin={isAdmin} />}
      </main>
    )
  } catch (error) {
    console.error('페이지 렌더링 오류:', error)
    const px = 'clamp(20px, 5.5vw, 80px)'
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return (
      <main style={{ padding: `clamp(60px, 5.5vw, 80px) ${px}` }}>
        <ErrorState message={message} />
      </main>
    )
  }
}

function ErrorState({ message }: { message: string }) {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <p className="sv-label" style={{ marginBottom: 12, color: 'var(--fg-muted)' }}>데이터 로딩 오류</p>
      <p className="text-muted" style={{ fontSize: 14 }}>{message}</p>
    </div>
  )
}

function EmptyState({ isAdmin }: { isAdmin: boolean }) {
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
