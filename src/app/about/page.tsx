import { createClient } from '@/src/utils/supabase/server'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AuthStateInitializerClient } from '@/src/components/providers/AuthStateInitializer'
import { PageHeader } from '@/src/components/common/PageHeader'
import { ProfilePhotoCard } from '@/src/components/about/ProfilePhotoCard'
import { MapPin } from 'lucide-react'
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

  const [skillsData, experiencesData, educationsData, trainingsData, profileRes, locationRes] = await Promise.all([
    getAllSkills(),
    getAllExperiences(),
    getAllEducations(),
    getAllTrainings(),
    supabase.from('about_profiles').select('*').order('updated_at', { ascending: false }).limit(1).single(),
    supabase.from('contact_links').select('value').eq('icon_key', 'location').maybeSingle(),
  ])

  const profile: AboutProfile | null =
    !profileRes.error && profileRes.data ? (profileRes.data as unknown as AboutProfile) : null
  const location: string | null = locationRes.data?.value ?? null

  const px = 'clamp(20px, 5.5vw, 80px)'

  const visibleStories = (profile?.story_json ?? []).filter(s => s.isVisible !== false && s.content)

  return (
    <main>
      <AuthStateInitializerClient />
      <PageHeader
        context="PORTFOLIO · ABOUT ─────────────"
        title="제 기술과 이력을 소개합니다."
        titleStyle={{ maxWidth: 900, marginBottom: 28 }}
      />

      {/* ─── About Essay ──────────────────────────────────────────── */}
      {visibleStories.length > 0 && (
        <section
          style={{
            padding: `clamp(40px, 4vw, 56px) ${px} 80px`,
            borderTop: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: '3fr 7fr',
            gap: 'clamp(32px, 4vw, 56px)',
            alignItems: 'start',
          }}
          className="about-section-grid"
        >
          {/* 좌: ABOUT 라벨 + 프로필 사진 + 위치 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <span className="sv-label" style={{ marginBottom: 0, alignSelf: 'flex-start' }}>ABOUT</span>
            <ProfilePhotoCard imageUrl={profile?.profile_image_url ?? null} />
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, alignSelf: 'center' }}>
                <MapPin style={{ width: 11, height: 11, color: 'var(--fg-subtle)', flexShrink: 0 }} />
                <span className="sv-label" style={{ marginBottom: 0 }}>{location}</span>
              </div>
            )}
          </div>

          {/* 우: main_copy + intro_text + 스토리 섹션 스택 */}
          <div>
            {profile?.main_copy && (
              <div style={{ marginBottom: 'clamp(20px, 2.5vw, 28px)' }}>
                <p className="h-2" style={{ margin: '0 0 10px' }}>{profile.main_copy}</p>
                {profile?.intro_text && (
                  <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.7 }}>{profile.intro_text}</p>
                )}
              </div>
            )}
            {visibleStories.map(s => (
              <div
                key={s.id}
                style={{
                  borderTop: '1px solid var(--border)',
                  padding: 'clamp(24px, 3vw, 32px) 0 clamp(20px, 2.5vw, 28px)',
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <div className="about-story-tag">{s.title}</div>
                </div>
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
