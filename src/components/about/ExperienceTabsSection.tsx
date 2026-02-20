'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, GraduationCap, Award, BookOpen } from 'lucide-react'
import { ThemeCard } from '@/src/components/common/ThemeCard'
import type { Experience, Education, Training } from '@/src/types/profile'

// ─── 날짜 유틸 ───────────────────────────────────────────────────────────────
function fmt(d: string | null): string {
  if (!d) return ''
  const [y, m] = d.split('-')
  return `${y}.${m}`
}

function buildRange(start: string, end: string | null, isCurrent: boolean): string {
  const s = fmt(start)
  const e = isCurrent ? '현재' : end ? fmt(end) : ''
  return e ? `${s} – ${e}` : s
}

/** 경력 연수 계산 (소수점 1자리, "총 n년 m개월" 형태) */
function calcTotalCareer(experiences: Experience[]): string {
  if (!experiences.length) return ''
  const now = new Date()

  let totalMonths = 0
  for (const exp of experiences) {
    const start = new Date(exp.start_date + '-01')
    const end = exp.is_current || !exp.end_date
      ? now
      : new Date(exp.end_date + '-01')
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth())
    totalMonths += Math.max(0, months)
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (years === 0) return `총 ${months}개월의 경력`
  if (months === 0) return `총 ${years}년의 경력`
  return `총 ${years}년 ${months}개월의 경력`
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface ExperienceTabsSectionProps {
  experiences: Experience[]
  educations: Education[]
  trainings: Training[]
  showExperience: boolean
  showEducation: boolean
  showTraining: boolean
}

// ─── 탭 패널 트랜지션 ────────────────────────────────────────────────────────
const panelVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' as const } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.18, ease: 'easeIn' as const } },
}

// ─── 타임라인 카드 ────────────────────────────────────────────────────────────
interface CardItem {
  key: string
  title: string
  subtitle: string
  dateRange: string
  description: string | null
  isCurrent?: boolean
  badge?: { label: string; className: string }
  dotIcon: React.ReactNode
}

function TimelineList({ items }: { items: CardItem[] }) {
  if (!items.length) {
    return (
      <div className="flex items-center justify-center py-16 text-foreground/35 text-sm">
        등록된 항목이 없습니다.
      </div>
    )
  }
  return (
    <div className="relative pl-10">
      {/* 세로 선 */}
      <div
        className="absolute left-[18px] top-[11px] w-px bg-gradient-to-b from-foreground/25 via-foreground/10 to-transparent"
        style={{ bottom: '11px' }}
      />
      <div className="space-y-6">
        {items.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.07 }}
            className="relative"
          >
            {/* Silver Dot */}
            <div className="absolute -left-10 top-[10px] w-[22px] h-[22px] rounded-full bg-silver-metal flex items-center justify-center shadow-sm ring-2 ring-background flex-shrink-0">
              {item.dotIcon}
            </div>
            {/* 카드 */}
            <ThemeCard noHoverLift className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    {item.isCurrent && (
                      <span className="px-2 py-0.5 bg-brand-secondary/10 text-brand-secondary text-xs rounded-full font-medium">
                        재직중
                      </span>
                    )}
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.badge.className}`}>
                        {item.badge.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/55 mt-0.5">{item.subtitle}</p>
                </div>
                <p className="text-xs text-foreground/40 tabular-nums flex-shrink-0 mt-0.5">
                  {item.dateRange}
                </p>
              </div>
              {item.description && (
                <p className="mt-3 pt-3 text-sm text-foreground/60 leading-relaxed whitespace-pre-line border-t border-foreground/8">
                  {item.description}
                </p>
              )}
            </ThemeCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── 요약 텍스트 ──────────────────────────────────────────────────────────────
function SummaryBanner({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground/55 mb-6">
      <span className="text-foreground/35">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export function ExperienceTabsSection({
  experiences,
  educations,
  trainings,
  showExperience,
  showEducation,
  showTraining,
}: ExperienceTabsSectionProps) {
  // 보이는 탭만 구성
  type TabId = 'experience' | 'education' | 'training'
  const tabs: { id: TabId; label: string; Icon: typeof Briefcase }[] = []
  if (showExperience && experiences.length > 0)
    tabs.push({ id: 'experience', label: '경력 사항',      Icon: Briefcase })
  if (showEducation && educations.length > 0)
    tabs.push({ id: 'education',  label: '학력 사항',      Icon: GraduationCap })
  if (showTraining && trainings.length > 0)
    tabs.push({ id: 'training',   label: '교육 및 자격증', Icon: Award })

  const [activeTab, setActiveTab] = useState<TabId>(tabs[0]?.id ?? 'experience')

  if (tabs.length === 0) return null

  // 탭별 아이템 변환
  const expItems: CardItem[] = experiences.map((exp) => ({
    key: `exp-${exp.id}`,
    title:     exp.company_name,
    subtitle:  exp.position,
    dateRange: buildRange(exp.start_date, exp.end_date, exp.is_current),
    description: exp.description,
    isCurrent: exp.is_current,
    dotIcon: <Briefcase className="w-3 h-3 text-white dark:text-slate-950" />,
  }))

  const eduItems: CardItem[] = educations.map((edu) => ({
    key: `edu-${edu.id}`,
    title:     edu.school_name,
    subtitle:  `${edu.major} · ${edu.status}`,
    dateRange: buildRange(edu.start_date, edu.end_date, false),
    description: null,
    dotIcon: <GraduationCap className="w-3 h-3 text-white dark:text-slate-950" />,
  }))

  const trainItems: CardItem[] = trainings.map((tr) => ({
    key: `tr-${tr.id}`,
    title:     tr.title,
    subtitle:  tr.institution,
    dateRange: tr.type === 'education' && tr.start_date && tr.end_date
      ? `${fmt(tr.start_date)} – ${fmt(tr.end_date)}`
      : fmt(tr.acquired_date),
    description: tr.description,
    badge: tr.type === 'certification'
      ? { label: '자격증', className: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' }
      : { label: '교육',   className: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400' },
    dotIcon: tr.type === 'certification'
      ? <Award    className="w-3 h-3 text-white dark:text-slate-950" />
      : <BookOpen className="w-3 h-3 text-white dark:text-slate-950" />,
  }))

  // 요약 텍스트
  const summaryMap: Record<TabId, { icon: React.ReactNode; text: string }> = {
    experience: {
      icon: <Briefcase className="w-4 h-4" />,
      text: calcTotalCareer(experiences) || `${experiences.length}건의 경력`,
    },
    education: {
      icon: <GraduationCap className="w-4 h-4" />,
      text: `${educations.length}건의 학력 사항`,
    },
    training: {
      icon: <Award className="w-4 h-4" />,
      text: `${trainings.filter(t => t.type === 'certification').length}건의 자격증 · ${trainings.filter(t => t.type === 'education').length}건의 교육 수료`,
    },
  }

  return (
    <section>
      {/* 섹션 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <span className="w-1 h-7 bg-foreground/30 rounded-full" />
        <h2 className="text-2xl font-bold text-foreground">Experience</h2>
      </motion.div>

      {/* ─── 탭 메뉴 ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative flex gap-0 mb-8 border-b border-foreground/10 dark:border-brand-primary/10"
      >
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-foreground'
                  : 'text-foreground/45 hover:text-foreground/75'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-foreground' : 'text-foreground/40'}`} />
              {label}
              {/* 활성 탭 언더라인 — Silver Gradient */}
              {isActive && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-silver-metal"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </motion.div>

      {/* ─── 탭 컨텐츠 ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* 요약 배너 */}
          <SummaryBanner
            icon={summaryMap[activeTab].icon}
            text={summaryMap[activeTab].text}
          />

          {/* 타임라인 */}
          {activeTab === 'experience' && <TimelineList items={expItems} />}
          {activeTab === 'education'  && <TimelineList items={eduItems} />}
          {activeTab === 'training'   && <TimelineList items={trainItems} />}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
