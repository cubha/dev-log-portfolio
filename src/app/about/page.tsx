import { createClient } from '@/src/utils/supabase/server'
import { getCurrentUserRole } from '@/src/utils/auth/serverAuth'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
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

  const px = 'clamp(20px, 5.5vw, 80px)'

  return (
    <main>
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <section style={{ padding: `72px ${px} 40px` }}>
        <div className="page-context" style={{ marginBottom: 40 }}>
          PORTFOLIO · ABOUT ─────────────
        </div>
        <div className="grid page-header-grid page-header-grid-2col-25vw" style={{ gap: 'clamp(40px, 5.5vw, 80px)', alignItems: 'end', marginBottom: 80 }}>
          <div>
            <h1 className="h-1" style={{ margin: '0 0 28px', maxWidth: 900, lineHeight: 1.1 }}>
              기술의 변화를{' '}
              <span className="metallic">실무의 효율</span>로 전환하는 데 집중하는 풀스택 개발자.
            </h1>
            <p className="text-muted" style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
              {(profileData as AboutProfile | null)?.intro_text ?? '금융권 SI 출신 · 서울시 중심 활동 · 원격지 유연 대응 가능'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="sv-mono text-subtle" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 6 }}>CURRENTLY</div>
            <div className="sv-mono" style={{ fontSize: 13, color: 'var(--fg)' }}>새 프로젝트 상담 가능</div>
            <div className="sv-mono text-muted" style={{ fontSize: 12, marginTop: 4 }}>2026 Q2 ~</div>
          </div>
        </div>
      </section>

      {/* ─── Essay ───────────────────────────────────────────────── */}
      <section className="grid two-col-label-grid" style={{ padding: `0 ${px} 120px`, gap: 'clamp(40px, 5.5vw, 80px)' }}>
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

      {/* ─── Technical Skills ────────────────────────────────���───── */}
      <section style={{ padding: `clamp(60px, 5.5vw, 80px) ${px} 120px`, borderTop: '1px solid var(--border)' }}>
        <SkillsSection skills={skillsData} />
      </section>

      {/* ─── Career ──────────────────────────────────────────────── */}
      <section style={{ padding: `clamp(60px, 5.5vw, 80px) ${px} clamp(80px, 9vw, 140px)`, borderTop: '1px solid var(--border)' }}>
        <ExperienceTabsSection
          experiences={experiencesData}
          educations={educationsData}
          trainings={trainingsData}
          showExperience={(profileData as AboutProfile | null)?.show_experience ?? true}
          showEducation={(profileData as AboutProfile | null)?.show_education ?? true}
          showTraining={(profileData as AboutProfile | null)?.show_training ?? true}
        />
      </section>

      {userRole !== 'guest' && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  )
}
