import type { Skill } from '@/src/types/skill'
import { SkillCategoryCards } from '@/src/components/about/SkillCategoryCards'

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="grid two-col-label-grid" style={{ gap: 'clamp(40px, 5.5vw, 80px)' }}>
      <div>
        <div className="sv-label">TECHNICAL SKILLS</div>
        <div className="sv-mono text-subtle" style={{ fontSize: 11, marginTop: 8 }}>
          {skills.length} ITEMS
        </div>
      </div>
      <SkillCategoryCards skills={skills} />
    </div>
  )
}
