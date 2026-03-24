'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, GraduationCap, Award, BookOpen } from 'lucide-react'
import type { Experience, Education, Training } from '@/src/types/profile'
import { StatusBadge } from '@/src/components/common/StatusBadge'

// ─── 날짜 유틸 ───────────────────────────────────────────────────────────────
function fmt(d: string | null): string {
  if (!d) return ''
  const [y, m] = d.split('-')
  return `${y}.${m}`
}

function buildRange(start: string, end: string | null, isCurrent: boolean): string {
  const s = fmt(start)
  const e = isCurrent ? '현재' : (end ? fmt(end) : '')
  return e ? `${s} – ${e}` : s
}

// ─── 타임라인 아이템 ──────────────────────────────────────────────────────────
interface TimelineItem {
  type: 'work' | 'education' | 'training-edu' | 'training-cert'
  id: number
  title: string
  subtitle: string
  dateRange: string
  description: string | null
  isCurrent: boolean
  sortKey: string
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface TimelineSectionProps {
  experiences:     Experience[]
  educations:      Education[]
  trainings?:      Training[]
  showExperience?: boolean
  showEducation?:  boolean
  showTraining?:   boolean
}

/**
 * About 페이지 경력·학력·교육/자격증 수직 타임라인
 *
 * - show_* 플래그로 각 섹션 표시 여부를 제어합니다.
 * - 경력·학력·교육/자격증을 날짜 기준 최신순으로 합산 정렬합니다.
 * - framer-motion stagger 페이드인 + AnimatePresence 전환 효과.
 */
export function TimelineSection({
  experiences,
  educations,
  trainings = [],
  showExperience = true,
  showEducation  = true,
  showTraining   = true,
}: TimelineSectionProps) {
  const items: TimelineItem[] = []

  if (showExperience) {
    items.push(
      ...experiences.map((exp): TimelineItem => ({
        type:      'work',
        id:        exp.id,
        title:     exp.company_name,
        subtitle:  exp.position,
        dateRange: buildRange(exp.start_date, exp.end_date, exp.is_current),
        description: exp.description,
        isCurrent: exp.is_current,
        sortKey:   exp.start_date,
      }))
    )
  }

  if (showEducation) {
    items.push(
      ...educations.map((edu): TimelineItem => ({
        type:      'education',
        id:        edu.id,
        title:     edu.school_name,
        subtitle:  `${edu.major} · ${edu.status}`,
        dateRange: buildRange(edu.start_date, edu.end_date, false),
        description: null,
        isCurrent: false,
        sortKey:   edu.start_date,
      }))
    )
  }

  if (showTraining) {
    items.push(
      ...trainings.map((tr): TimelineItem => ({
        type:      tr.type === 'certification' ? 'training-cert' : 'training-edu',
        id:        tr.id,
        title:     tr.title,
        subtitle:  tr.institution,
        dateRange: tr.type === 'education' && tr.start_date && tr.end_date
          ? `${fmt(tr.start_date)} – ${fmt(tr.end_date)}`
          : fmt(tr.acquired_date),
        description: tr.description,
        isCurrent: false,
        sortKey:   tr.type === 'education' && tr.end_date ? tr.end_date : tr.acquired_date,
      }))
    )
  }

  items.sort((a, b) => b.sortKey.localeCompare(a.sortKey))

  if (items.length === 0) return null

  return (
    <section className="mt-14">
      {/* 섹션 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-10"
      >
        <span className="w-1 h-7 bg-foreground/30 rounded-full" />
        <h2 className="text-2xl font-bold text-foreground">Experience</h2>
      </motion.div>

      {/* 타임라인 */}
      <div className="relative pl-10">
        <div
          className="absolute left-[18px] top-[11px] w-px bg-gradient-to-b from-foreground/25 via-foreground/10 to-transparent"
          style={{ bottom: '11px' }}
        />

        <AnimatePresence>
          <div className="space-y-7">
            {items.map((item, i) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-10 top-[9px] w-[22px] h-[22px] rounded-full bg-silver-metal flex items-center justify-center shadow-sm ring-2 ring-background flex-shrink-0">
                  {item.type === 'work' && (
                    <Briefcase className="w-3 h-3 text-white dark:text-slate-950" />
                  )}
                  {item.type === 'education' && (
                    <GraduationCap className="w-3 h-3 text-white dark:text-slate-950" />
                  )}
                  {item.type === 'training-cert' && (
                    <Award className="w-3 h-3 text-white dark:text-slate-950" />
                  )}
                  {item.type === 'training-edu' && (
                    <BookOpen className="w-3 h-3 text-white dark:text-slate-950" />
                  )}
                </div>

                {/* 카드 */}
                <div className="group bg-background rounded-xl border border-foreground/8 hover:border-foreground/20 hover:shadow-md transition-all duration-200 p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        {item.isCurrent && (
                          <StatusBadge size="sm">재직중</StatusBadge>
                        )}
                        {item.type === 'training-cert' && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-full font-medium">
                            자격증
                          </span>
                        )}
                        {item.type === 'training-edu' && (
                          <span className="px-2 py-0.5 bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400 text-xs rounded-full font-medium">
                            교육
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
                    <p className="mt-3 pt-3 text-sm text-foreground/60 leading-relaxed whitespace-pre-line border-t border-foreground/5">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </section>
  )
}
