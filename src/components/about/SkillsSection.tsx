'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SkillIcon } from '@/src/components/common/SkillIcon'
import { ThemeCard, THEME_CARD_CLASS } from '@/src/components/common/ThemeCard'
import type { Skill } from '@/src/types/skill'

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
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay: i * 0.04 },
  }),
}

const expandVariants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, height: 0,      transition: { duration: 0.3,  ease: 'easeIn'  } },
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
      {/* 섹션 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <span className="w-1 h-7 bg-foreground/30 rounded-full" />
        <h2 className="text-2xl font-bold text-foreground">Technical Skills</h2>
        <span className="text-sm text-foreground/40 ml-1">{skills.length}개</span>
      </motion.div>

      {/* ── Collapsed: 카테고리별 대표 기술 배지 ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
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
                          animate="visible"
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
