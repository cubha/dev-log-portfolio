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

function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const map = new Map<string, Skill[]>()
  for (const skill of skills) {
    const cat = skill.category || 'Other'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(skill)
  }
  return Array.from(map.entries())
}

function pickBestPerCategory(skills: Skill[]): Skill[] {
  const firstMap = new Map<string, Skill>()
  for (const skill of skills) {
    const cat = skill.category || 'Other'
    if (!firstMap.has(cat)) firstMap.set(cat, skill)
  }
  return Array.from(firstMap.values()).sort(
    (a, b) => (a.category ?? '').localeCompare(b.category ?? '')
  )
}

// stagger delay 0.06→0.02 축소: 카드 100개 기준 최대 2초→0.2초
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: i * 0.02,
    },
  }),
}

const expandVariants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.45, ease: 'easeOut' as const } },
  exit:    { opacity: 0, height: 0,      transition: { duration: 0.3,  ease: 'easeIn'  as const } },
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!skills.length) return null

  const bestSkills = pickBestPerCategory(skills)
  const hiddenCount = skills.length - bestSkills.length
  const grouped = groupByCategory(skills)
  let cardIndex = 0

  return (
    <section className="mt-16">
      <div className="mb-12 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      {/* Section header */}
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

      {/* Collapsed — representative badges */}
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
          </ThemeCard>
        ))}
        {hiddenCount > 0 && !isExpanded && (
          <div className="flex items-center px-3.5 py-2 bg-foreground/5 rounded-xl border border-foreground/8 text-sm text-foreground/40">
            +{hiddenCount}개
          </div>
        )}
      </motion.div>

      {/* Expand / collapse button */}
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

      {/* Full category grid */}
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
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/8 flex items-center justify-center transition-colors">
                            <SkillIcon name={skill.name} iconName={skill.icon_name} size={22} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground truncate">{skill.name}</span>
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
