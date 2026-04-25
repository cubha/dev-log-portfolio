import { createClient } from '@/src/utils/supabase/server'
import { Database } from '@/src/types/supabase'
import { ProjectList } from '@/src/components/projects/ProjectList'
import { ProjectsEmptyState } from '@/src/components/projects/ProjectsEmptyState'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { PageHeader } from '@/src/components/common/PageHeader'
import { AuthStateInitializerClient } from '@/src/components/providers/AuthStateInitializer'

export const revalidate = 3600

export default async function ProjectsPage() {
  try {
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
        <AuthStateInitializerClient />

        <PageHeader
          context="PORTFOLIO · PROJECTS ─────────────"
          title="그동안 진행한 프로젝트들입니다."
          desc="실무와 개인 작업을 함께 담았습니다. 업무 / 개인 / 팀으로 구분했습니다."
          titleStyle={{ maxWidth: 820 }}
        />

        <section style={{ padding: `clamp(40px, 4vw, 56px) ${px} clamp(80px, 9vw, 140px)`, borderTop: '1px solid var(--border)' }}>
          {error ? (
            <ErrorState message={error.message} />
          ) : typedProjects.length === 0 ? (
            <ProjectsEmptyState />
          ) : (
            <ProjectList projects={typedProjects} />
          )}
        </section>

        <FloatingUserButton />
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

