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
      {(profile?.story_json ?? []).filter(s => s.isVisible !== false && s.content).length > 0 && (
        <section className="grid two-col-label-grid" style={{ padding: `clamp(40px, 4vw, 56px) ${px} 80px`, gap: 'clamp(40px, 5.5vw, 80px)', borderTop: '1px solid var(--border)' }}>
          <div className="sv-label">ABOUT</div>
          <div style={{ maxWidth: 820 }}>
            {(profile?.story_json ?? [])
              .filter(s => s.isVisible !== false && s.content)
              .map((s) => (
                <div key={s.id} style={{ borderTop: '1px solid var(--border)', padding: '32px 0 28px' }}>
                  <div className="h-4" style={{ marginBottom: 12, color: 'var(--fg)' }}>{s.title}</div>
                  <p className="text-muted" style={{ fontSize: 15, lineHeight: 1.75 }}>{s.content}</p>
                </div>
              ))}
            <div style={{ borderTop: '1px solid var(--border)' }} />
          </div>
        </section>
      )}

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
