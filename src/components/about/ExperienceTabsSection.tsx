'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Experience, Education, Training } from '@/src/types/profile'

function fmt(d: string | null): string {
  if (!d) return ''
  const [y, m] = d.split('-')
  return `${y}.${m}`
}

function buildRange(start: string, end: string | null, isCurrent: boolean): string {
  const s = fmt(start)
  const e = isCurrent ? '현재' : end ? fmt(end) : ''
  return e ? `${s} ~ ${e}` : s
}

function calcTotalCareer(experiences: Experience[]): string {
  if (!experiences.length) return ''
  const now = new Date()
  let totalMonths = 0
  for (const exp of experiences) {
    const start = new Date(exp.start_date + '-01')
    const end = exp.is_current || !exp.end_date ? now : new Date(exp.end_date + '-01')
    totalMonths += Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()))
  }
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (years === 0) return `총 ${months}개월의 경력`
  if (months === 0) return `총 ${years}년의 경력`
  return `총 ${years}년 ${months}개월의 경력`
}

interface ExperienceTabsSectionProps {
  experiences: Experience[]
  educations: Education[]
  trainings: Training[]
  showExperience: boolean
  showEducation: boolean
  showTraining: boolean
}

type TabId = 'experience' | 'education' | 'training'

interface TimelineItem {
  key: string
  title: string
  subtitle: string
  dateRange: string
  description: string | null
  isCurrent?: boolean
}

function TimelineItems({ items }: { items: TimelineItem[] }) {
  if (!items.length) {
    return (
      <div
        className="sv-mono text-subtle"
        style={{ fontSize: 12, padding: '24px 0', letterSpacing: '0.08em' }}
      >
        등록된 항목이 없습니다.
      </div>
    )
  }
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 14,
          bottom: 0,
          width: 1,
          background: 'var(--border)',
        }}
      />
      {items.map((item) => (
        <div
          key={item.key}
          style={{ position: 'relative', paddingLeft: 40, marginBottom: 40 }}
        >
          <div
            style={{
              position: 'absolute',
              left: 2,
              top: 8,
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: 'var(--bg)',
              border: '1px solid var(--accent)',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 6,
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <div className="h-4">{item.title}</div>
              {item.isCurrent && (
                <span
                  className="sv-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    padding: '3px 8px',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                  }}
                >
                  CURRENT
                </span>
              )}
            </div>
            <div
              className="sv-mono text-subtle"
              style={{ fontSize: 11, letterSpacing: '0.06em', flexShrink: 0 }}
            >
              {item.dateRange}
            </div>
          </div>
          <div
            className="sv-mono text-muted"
            style={{ fontSize: 12, marginBottom: 10, letterSpacing: '0.04em' }}
          >
            {item.subtitle}
          </div>
          {item.description && (
            <div className="text-muted" style={{ fontSize: 14, lineHeight: 1.65, maxWidth: 720 }}>
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function ExperienceTabsSection({
  experiences,
  educations,
  trainings,
  showExperience,
  showEducation,
  showTraining,
}: ExperienceTabsSectionProps) {
  const tabs: { id: TabId; label: string }[] = []
  if (showExperience && experiences.length > 0) tabs.push({ id: 'experience', label: '경력 사항' })
  if (showEducation && educations.length > 0)   tabs.push({ id: 'education',  label: '학력 사항' })
  if (showTraining && trainings.length > 0)     tabs.push({ id: 'training',   label: '교육 및 자격증' })

  const [activeTab, setActiveTab] = useState<TabId>(tabs[0]?.id ?? 'experience')

  if (tabs.length === 0) return null

  const expItems: TimelineItem[] = experiences.map((e) => ({
    key: `exp-${e.id}`,
    title: e.company_name,
    subtitle: e.position,
    dateRange: buildRange(e.start_date, e.end_date, e.is_current),
    description: e.description,
    isCurrent: e.is_current,
  }))

  const eduItems: TimelineItem[] = educations.map((e) => ({
    key: `edu-${e.id}`,
    title: e.school_name,
    subtitle: `${e.major} · ${e.status}`,
    dateRange: buildRange(e.start_date, e.end_date, false),
    description: null,
  }))

  const trainItems: TimelineItem[] = trainings.map((t) => ({
    key: `tr-${t.id}`,
    title: t.title,
    subtitle: t.institution,
    dateRange: t.type === 'education' && t.start_date && t.end_date
      ? `${fmt(t.start_date)} ~ ${fmt(t.end_date)}`
      : fmt(t.acquired_date),
    description: t.description,
  }))

  const itemMap: Record<TabId, TimelineItem[]> = {
    experience: expItems,
    education: eduItems,
    training: trainItems,
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(100px, 12.5vw, 180px) 1fr',
        gap: 'clamp(40px, 5.5vw, 80px)',
      }}
    >
      {/* Left: label + tab buttons */}
      <div>
        <div className="sv-label">CAREER</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: '8px 0 8px 14px',
                borderLeft: activeTab === id
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border)',
                color: activeTab === id ? 'var(--fg)' : 'var(--fg-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'color .15s, border-color .15s',
              }}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>
        {activeTab === 'experience' && (
          <div
            className="sv-mono text-subtle"
            style={{ fontSize: 11, marginTop: 24, lineHeight: 1.6 }}
          >
            {calcTotalCareer(experiences)}
            <br />FULL-TIME · FREELANCE
          </div>
        )}
      </div>

      {/* Right: timeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <TimelineItems items={itemMap[activeTab]} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
