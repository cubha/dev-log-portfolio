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

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills.length) return null

  const grouped = groupByCategory(skills)

  return (
    <div className="grid two-col-label-grid" style={{ gap: 'clamp(40px, 5.5vw, 80px)' }}>
      <div>
        <div className="sv-label">TECHNICAL SKILLS</div>
        <div className="sv-mono text-subtle" style={{ fontSize: 11, marginTop: 8 }}>
          {skills.length} ITEMS
        </div>
      </div>

      <div>
        {grouped.map(([category, items], i) => (
          <div
            key={category}
            className="grid two-col-label-grid-sm"
            style={{
              gap: 'clamp(24px, 4vw, 40px)',
              padding: '22px 0',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div className="sv-mono" style={{ fontSize: 12, letterSpacing: '0.06em', color: 'var(--fg-muted)', paddingTop: 2 }}>
              {category.toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', fontSize: 15 }}>
              {items.map((skill, j) => (
                <span key={skill.id} style={{ color: 'var(--fg)' }}>
                  {skill.name}
                  {j < items.length - 1 && (
                    <span className="text-subtle" style={{ marginLeft: 20 }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>
    </div>
  )
}
