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
titleStyle={{ maxWidth: 900, marginBottom: 28 }}
        descStyle={{ fontSize: 15 }}
      />

      {/* ─── Essay ───────────────────────────────────────────────── */}
      {(profile?.story_json ?? []).filter(s => s.isVisible !== false && s.content).length > 0 && (
        <section style={{ padding: `clamp(40px, 4vw, 56px) ${px} 80px`, borderTop: '1px solid var(--border)' }}>
          {/* Section header: label only */}
          <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
            <span className="sv-label" style={{ marginBottom: 0 }}>ABOUT</span>
          </div>
          {/* 3-column story grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0 }}>
            {(profile?.story_json ?? [])
              .filter(s => s.isVisible !== false && s.content)
              .map((s, i, arr) => (
                <div
                  key={s.id}
                  style={{
                    paddingLeft: i > 0 ? 'clamp(24px, 3.5vw, 48px)' : 0,
                    paddingRight: i < arr.length - 1 ? 'clamp(24px, 3.5vw, 48px)' : 0,
                    borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {/* Metallic tag title with left vertical accent */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    {/* Vertical accent bar */}
                    <div style={{ width: 3, height: 16, flexShrink: 0, background: 'var(--metal-border)', borderRadius: 2 }} />
                    {/* Tag */}
                    <div className="about-story-tag">{s.title}</div>
                  </div>
                  <p className="text-muted" style={{ fontSize: 14, lineHeight: 1.8 }}>{s.content}</p>
                </div>
              ))}
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
