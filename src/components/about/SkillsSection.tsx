'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Cpu } from 'lucide-react'
import { SkillIcon } from '@/src/components/common/SkillIcon'
import { ThemeCard, THEME_CARD_CLASS } from '@/src/components/common/ThemeCard'
import type { Skill } from '@/src/types/skill'

// ─── AI Toolkit — Precision Dashboard 데이터 ────────────────────────────────
const AI_INSTRUMENTS = [
  {
    index:       '01',
    name:        'Cursor',
    role:        'IDE CONTROL',
    designation: '코드 작성 · 즉각 리팩토링 · 디버그 보조',
    phase:       'BUILD',
    phaseAccent: 'text-violet-400 dark:text-violet-300',
    meter:       95,
    accentBar:   'bg-violet-500',
  },
  {
    index:       '02',
    name:        'Claude',
    role:        'LOGIC ARCHITECT',
    designation: '아키텍처 설계 · 코드 리뷰 · 문서화',
    phase:       'DESIGN',
    phaseAccent: 'text-amber-400 dark:text-amber-300',
    meter:       90,
    accentBar:   'bg-amber-500',
  },
  {
    index:       '03',
    name:        'Gemini',
    role:        'SIGNAL SCANNER',
    designation: '기술 탐색 · API 리서치 · 번역',
    phase:       'RESEARCH',
    phaseAccent: 'text-sky-400 dark:text-sky-300',
    meter:       80,
    accentBar:   'bg-sky-500',
  },
] as const

/**
 * AI Instrument Panel 카드
 *
 * 기계 계기판(Dashboard) 스타일:
 *  - 좌상단: ● ACTIVE 상태 + 인덱스 번호
 *  - 중앙: 툴 이름(대) + 엔지니어링 역할명(모노스페이스)
 *  - 하단: 활용 단계 + Usage Meter 바
 */
function AIInstrumentCard({ inst, delay }: {
  inst: typeof AI_INSTRUMENTS[number]
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={`
        relative overflow-hidden cursor-default
        ${THEME_CARD_CLASS}
        p-4 flex flex-col gap-3
        hover:scale-[1.015] transition-transform duration-300
      `}
    >
      {/* 상단 rim 하이라이트 강조선 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      {/* 헤더: STATUS + INDEX */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {/* 녹색 LED 상태 점 */}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
          <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-emerald-400/80 uppercase">
            ACTIVE
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold text-foreground/20 tabular-nums">
          {inst.index}
        </span>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-foreground/8" />

      {/* 툴 이름 + 엔지니어링 역할 */}
      <div>
        <p className="text-lg font-extrabold text-foreground tracking-tight leading-none mb-1">
          {inst.name}
        </p>
        <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-silver-metal uppercase">
          {inst.role}
        </p>
      </div>

      {/* 용도 설명 */}
      <p className="text-xs text-foreground/45 leading-relaxed flex-1">
        {inst.designation}
      </p>

      {/* 하단: PHASE + Meter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={`font-mono text-[9px] font-bold tracking-[0.18em] ${inst.phaseAccent}`}>
            PHASE: {inst.phase}
          </span>
          <span className="font-mono text-[9px] text-foreground/25 tabular-nums">
            {inst.meter}%
          </span>
        </div>
        {/* Usage Meter */}
        <div className="h-0.5 bg-foreground/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${inst.accentBar}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${inst.meter}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: delay + 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

interface SkillsSectionProps {
  skills: Skill[]
}

/** 카테고리별 그루핑 (category 오름차순 정렬 유지) */
function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const map = new Map<string, Skill[]>()
  for (const skill of skills) {
    const cat = skill.category || 'Other'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(skill)
  }
  return Array.from(map.entries())
}

/**
 * 각 카테고리에서 숙련도가 가장 높은 기술 1개씩 뽑아 반환.
 * 결과는 category 오름차순 정렬.
 */
function pickBestPerCategory(skills: Skill[]): Skill[] {
  const bestMap = skills.reduce<Map<string, Skill>>((acc, skill) => {
    const cat = skill.category || 'Other'
    const prev = acc.get(cat)
    if (!prev || (skill.proficiency ?? 0) > (prev.proficiency ?? 0)) {
      acc.set(cat, skill)
    }
    return acc
  }, new Map())

  return Array.from(bestMap.values()).sort(
    (a, b) => (a.category ?? '').localeCompare(b.category ?? '')
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: i * 0.06,
    },
  }),
}

const expandVariants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.45, ease: 'easeOut' as const } },
  exit:    { opacity: 0, height: 0,      transition: { duration: 0.3,  ease: 'easeIn'  as const } },
}

/**
 * About 페이지 Technical Skills 섹션
 *
 * - 초기(Collapsed): 카테고리별 최고 숙련도 기술 1개씩 컴팩트 배지로 표시
 * - "모든 기술 보기" 클릭 시 framer-motion 애니메이션으로 전체 확장
 */
export function SkillsSection({ skills }: SkillsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!skills.length) return null

  // 카테고리별 최고 숙련도 기술 1개씩 (collapsed 뷰용)
  const bestSkills = pickBestPerCategory(skills)
  const hiddenCount = skills.length - bestSkills.length

  const grouped = groupByCategory(skills)
  let cardIndex = 0

  return (
    <section className="mt-14">
      {/* ── AI-Enhanced Development 그룹 ──────────────────────────────── */}
      <div className="mb-12 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      

      {/* ── 섹션 헤더 (Technical Skills) ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-8"
      >
        <span className="w-1 h-7 bg-foreground/30 rounded-full" />
        <h2 className="text-2xl font-bold text-foreground">Technical Skills</h2>
        <span className="text-sm text-foreground/40 ml-1">{skills.length}개</span>
      </motion.div>

      {/* ── Collapsed: 카테고리별 대표 기술 배지 ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex flex-wrap gap-2.5 mb-5"
      >
        {bestSkills.map((skill) => (
          <ThemeCard
            key={skill.id}
            noHoverLift
            className="flex items-center gap-2 px-3.5 py-2"
            title={`${skill.category ?? 'Other'} 카테고리 대표 기술`}
          >
            <SkillIcon name={skill.name} iconName={skill.icon_name} size={16} />
            <span className="text-sm font-medium text-foreground/80">{skill.name}</span>
            <span className="text-xs text-foreground/40 tabular-nums ml-0.5">{skill.proficiency ?? 0}%</span>
          </ThemeCard>
        ))}
        {hiddenCount > 0 && !isExpanded && (
          <div className="flex items-center px-3.5 py-2 bg-foreground/5 rounded-xl border border-foreground/8 text-sm text-foreground/40">
            +{hiddenCount}개
          </div>
        )}
      </motion.div>

      {/* ── 전체 펼치기 / 접기 버튼 ──────────────────────────────────── */}
      <button
        onClick={() => setIsExpanded((p) => !p)}
        className="group flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors mb-6"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        <span className="font-medium group-hover:underline underline-offset-2">
          {isExpanded ? '접기' : `모든 기술 보기 (${skills.length}개)`}
        </span>
      </button>

      {/* ── 전체 카테고리 그리드 (AnimatePresence) ──────────────────── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="full-skills"
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="space-y-10 pb-2">
              {grouped.map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-[0.12em] mb-4 pl-1">
                    {category}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {categorySkills.map((skill) => {
                      const idx = cardIndex++
                      return (
                        <motion.div
                          key={skill.id}
                          custom={idx}
                          variants={cardVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: '-20px' }}
                          className={`group flex items-center gap-3 p-3.5 ${THEME_CARD_CLASS}`}
                        >
                          {/* 아이콘 뱃지 */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/8 flex items-center justify-center transition-colors">
                            <SkillIcon name={skill.name} iconName={skill.icon_name} size={22} />
                          </div>

                          {/* 이름 + 숙련도 바 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-foreground truncate">{skill.name}</span>
                              <span className="text-xs text-foreground/40 ml-2 flex-shrink-0 tabular-nums">
                                {skill.proficiency ?? 0}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-foreground/8 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-silver-metal rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.proficiency ?? 0}%` }}
                                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 + idx * 0.02 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
