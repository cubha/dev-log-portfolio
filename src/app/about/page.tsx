import { createClient } from '@/src/utils/supabase/server'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializerClient } from '@/src/components/providers/AuthStateInitializer'
import { PageHeader } from '@/src/components/common/PageHeader'
import { SkillsSection } from '@/src/components/about/SkillsSection'
import { ExperienceTabsSection } from '@/src/components/about/ExperienceTabsSection'
import { getAllSkills } from '@/src/utils/skills/getSkills'
import { getAllExperiences } from '@/src/utils/experience/getExperiences'
import { getAllEducations } from '@/src/utils/education/getEducations'
import { getAllTrainings } from '@/src/utils/training/getTrainings'
import type { AboutProfile } from '@/src/types/profile'

const ESSAY = [
  {
    t: '공평한 마인드',
    b: '기존의 공학적인 방식이 가지고 있는 성향으로부터 벗어난 태도를 지향하며, 그것을 시작으로 기술에 의한 편향이 한 지점으로 치우지 않도록 합니다. 기능 하나를 구현하는 데에도 사용자의 맥락과 팀의 맥락 둘을 같은 무게로 놓고 시작합니다.',
  },
  {
    t: '의사소통',
    b: '개발 언어를 노트북 프로그래밍 언어에서 관계하는 대화 언어까지 배분 없이 지으며, 부분과 전반 모든 단계에서 문제의 원인을 꾸미지 않습니다. 질문 대신 가설, 가설 대신 검증 가능한 스펙으로.',
  },
  {
    t: '꾸준함',
    b: '어떠한 상황에도 유연하지만, 작업물에서는 기복 없이 일관됩니다. 좋음의 기준을 코드, 문서, UX, 코드 리뷰, 인간관계 전반에 동일하게 적용합니다. 결과 뒤에 숨기지 않고 코드 리뷰를 반복하며 결정의 근거를 남깁니다.',
  },
]

export const revalidate = 3600

export default async function AboutPage() {
  const supabase = await createClient()

  const [skillsData, experiencesData, educationsData, trainingsData, profileRes] = await Promise.all([
    getAllSkills(),
    getAllExperiences(),
    getAllEducations(),
    getAllTrainings(),
    supabase.from('about_profiles').select('*').order('updated_at', { ascending: false }).limit(1).single(),
  ])

  const profile: AboutProfile | null =
    !profileRes.error && profileRes.data ? (profileRes.data as unknown as AboutProfile) : null

  const px = 'clamp(20px, 5.5vw, 80px)'

  return (
    <main>
      <AuthStateInitializerClient />
      <PageHeader
        context="PORTFOLIO · ABOUT ─────────────"
        title="제 기술과 이력을 소개합니다."
        desc={profile?.intro_text ?? undefined}
        aside={
          <div>
            <div className="sv-mono text-subtle" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 6 }}>CURRENTLY</div>
            <div className="sv-mono" style={{ fontSize: 13, color: 'var(--fg)' }}>새 프로젝트 상담 가능</div>
            <div className="sv-mono text-muted" style={{ fontSize: 12, marginTop: 4 }}>2026 Q2 ~</div>
          </div>
        }
        titleStyle={{ maxWidth: 900, marginBottom: 28 }}
        descStyle={{ fontSize: 15 }}
      />

      {/* ─── Essay ───────────────────────────────────────────────── */}
      <section className="grid two-col-label-grid" style={{ padding: `clamp(40px, 4vw, 56px) ${px} 80px`, gap: 'clamp(40px, 5.5vw, 80px)', borderTop: '1px solid var(--border)' }}>
        <div className="sv-label">ABOUT</div>
        <div style={{ maxWidth: 820 }}>
          {ESSAY.map((p, i) => (
            <div key={i} style={{ borderTop: '1px solid var(--border)', padding: '32px 0 28px' }}>
              <div className="h-4" style={{ marginBottom: 12, color: 'var(--fg)' }}>{p.t}</div>
              <p className="text-muted" style={{ fontSize: 15, lineHeight: 1.75 }}>{p.b}</p>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>
      </section>

      {/* ─── Technical Skills ────────────────────────────────────── */}
      <section style={{ padding: `clamp(40px, 4vw, 56px) ${px} 80px`, borderTop: '1px solid var(--border)' }}>
        <SkillsSection skills={skillsData} />
      </section>

      {/* ─── Career ──────────────────────────────────────────────── */}
      <section style={{ padding: `clamp(40px, 4vw, 56px) ${px} clamp(80px, 9vw, 140px)`, borderTop: '1px solid var(--border)' }}>
        <ExperienceTabsSection
          experiences={experiencesData}
          educations={educationsData}
          trainings={trainingsData}
          showExperience={profile?.show_experience ?? true}
          showEducation={profile?.show_education ?? true}
          showTraining={profile?.show_training ?? true}
        />
      </section>

      <FloatingUserButton />
    </main>
  )
}
