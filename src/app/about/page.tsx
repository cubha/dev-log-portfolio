import { createClient } from '@/src/utils/supabase/server'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AboutContent } from '@/src/components/about/AboutContent'
import { SkillsSection } from '@/src/components/about/SkillsSection'
import { ExperienceTabsSection } from '@/src/components/about/ExperienceTabsSection'
import { getAllSkills } from '@/src/utils/skills/getSkills'
import { getAllExperiences } from '@/src/utils/experience/getExperiences'
import { getAllEducations } from '@/src/utils/education/getEducations'
import { getAllTrainings } from '@/src/utils/training/getTrainings'
import Link from 'next/link'
import type { AboutProfile } from '@/src/types/profile'

/**
 * About 페이지
 *
 * - 프로필 히어로 + DB intro_text 소개글
 * - About Me 스토리 (isVisible 기반)
 * - Technical Skills
 * - Experience · Education · Training 수직 타임라인 (show_* 제어)
 */
export default async function AboutPage() {
  const { role: userRole, isAdmin } = await getCurrentUserRole()
  const supabase = await createClient()

  let profileData: AboutProfile | null = null

  const [skillsData, experiencesData, educationsData, trainingsData] = await Promise.all([
    getAllSkills(),
    getAllExperiences(),
    getAllEducations(),
    getAllTrainings(),
    (async () => {
      try {
        const { data, error } = await supabase
          .from('about_profiles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()
        if (!error && data) profileData = data as unknown as AboutProfile
      } catch (e) {
        console.error('프로필 조회 오류:', e)
      }
    })(),
  ])

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* 프로필 히어로 + About Me */}
      <AboutContent profile={profileData} />

      {/* Technical Skills */}
      <SkillsSection skills={skillsData} />

      {/* Experience · Education · Training 탭 섹션 */}
      <div className="mt-14">
        <ExperienceTabsSection
          experiences={experiencesData}
          educations={educationsData}
          trainings={trainingsData}
          showExperience={(profileData as AboutProfile | null)?.show_experience ?? true}
          showEducation={(profileData as AboutProfile | null)?.show_education  ?? true}
          showTraining={(profileData as AboutProfile | null)?.show_training    ?? true}
        />
      </div>

      {/* 관리자 안내 — 프로필이 없을 때만 표시 */}
      {isAdmin && !profileData && (
        <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-xl mt-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✏️</span>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">프로필을 작성해보세요!</h3>
              <p className="text-foreground/60 mb-4">
                관리자 페이지에서 프로필 정보를 입력하면 이 페이지에 표시됩니다.
              </p>
              <Link
                href="/admin/profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-silver-metal animate-shine text-white dark:text-slate-950 font-semibold rounded-lg hover:shadow-md transition-all"
              >
                프로필 편집하기
              </Link>
            </div>
          </div>
        </div>
      )}

      {userRole !== 'guest' && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  )
}
