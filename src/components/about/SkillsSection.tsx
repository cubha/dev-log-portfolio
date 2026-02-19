'use client'

import { motion } from 'framer-motion'
import { SkillIcon } from '@/src/components/common/SkillIcon'
import type { Skill } from '@/src/types/skill'

interface SkillsSectionProps {
  skills: Skill[]
}

/** 카테고리별 그루핑 + 카테고리 순서 유지 */
function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const map = new Map<string, Skill[]>()

  for (const skill of skills) {
    const cat = skill.category || 'Other'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(skill)
  }

  return Array.from(map.entries())
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const cardVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

/**
 * About 페이지 Technical Skills 섹션
 *
 * - 카테고리별로 그루핑하여 표시
 * - 각 기술은 아이콘 + 이름 + 숙련도 Progress 바
 * - framer-motion stagger 페이드인 애니메이션
 */
export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills.length) return null

  const grouped = groupByCategory(skills)

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
        <h2 className="text-2xl font-bold text-foreground">Technical Skills</h2>
        <span className="text-sm text-foreground/40 ml-1">{skills.length}개</span>
      </motion.div>

      {/* 카테고리 목록 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {grouped.map(([category, categorySkills]) => (
          <motion.div key={category} variants={sectionVariants}>
            {/* 카테고리 레이블 */}
            <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-[0.12em] mb-4 pl-1">
              {category}
            </h3>

            {/* 기술 카드 그리드 */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              {categorySkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  variants={cardVariants}
                  className="group flex items-center gap-3 p-3.5 bg-background rounded-xl border border-foreground/8 hover:border-foreground/20 hover:shadow-sm transition-all duration-200"
                >
                  {/* 아이콘 뱃지 */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/8 flex items-center justify-center transition-colors">
                    <SkillIcon name={skill.name} iconName={skill.icon_name} size={22} />
                  </div>

                  {/* 이름 + 숙련도 바 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground truncate">
                        {skill.name}
                      </span>
                      <span className="text-xs text-foreground/40 ml-2 flex-shrink-0 tabular-nums">
                        {skill.proficiency ?? 0}%
                      </span>
                    </div>

                    {/* Progress 바 */}
                    <div className="h-1.5 bg-foreground/8 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-silver-metal rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency ?? 0}%` }}
                        transition={{
                          duration: 0.9,
                          ease: 'easeOut',
                          delay: 0.2,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
