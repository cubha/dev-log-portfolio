'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { SkillIcon } from '@/src/components/common/SkillIcon'
import { SKILL_CATEGORIES } from '@/src/types/skill'
import type { Skill } from '@/src/types/skill'

const CARD_VISIBLE_COUNT = 5

interface SkillCategoryCardsProps {
  skills: Skill[]
}

interface CategoryModalProps {
  category: string
  skills: Skill[]
  onClose: () => void
}

function CategoryModal({ category, skills, onClose }: CategoryModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px 16px',
        }}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 480,
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* 헤더 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
          }}>
            <span className="metallic sv-mono" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>
              {category.toUpperCase()}
            </span>
            <button
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: 2,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--fg-muted)',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.background = 'var(--bg-1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.background = 'transparent' }}
              aria-label="닫기"
            >
              <X size={14} />
            </button>
          </div>

          {/* 스킬 목록 */}
          <div style={{
            padding: '16px 20px 20px',
            maxHeight: 'calc(80vh - 80px)',
            overflowY: 'auto',
          }}>
            {skills.length === 0 ? (
              <p className="sv-mono" style={{ fontSize: 11, color: 'var(--fg-subtle)', textAlign: 'center', padding: '20px 0' }}>
                등록된 스킬이 없습니다
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((skill) => (
                  <span key={skill.id} className="tag" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <SkillIcon name={skill.name} iconName={skill.icon_name} size={14} />
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

function CategoryCard({ category, skills }: { category: string; skills: Skill[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const visible = skills.slice(0, CARD_VISIBLE_COUNT)
  const hasMore = skills.length > CARD_VISIBLE_COUNT

  return (
    <>
      <div
        className="card"
        style={{
          display: 'flex', flexDirection: 'column',
          flex: '1 1 0', minWidth: 0,
          padding: '20px 18px 0',
          position: 'relative',
        }}
      >
        {/* 카테고리 타이틀 */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            className="metallic sv-mono"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}
          >
            {category.toUpperCase()}
          </span>
          <span className="sv-mono" style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>
            {skills.length}
          </span>
        </div>

        {/* 스킬 아이콘 리스트 */}
        <div style={{ flex: 1 }}>
          {skills.length === 0 ? (
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="sv-mono" style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>—</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visible.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <SkillIcon name={skill.name} iconName={skill.icon_name} size={16} />
                  <span style={{ fontSize: 13, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {skill.name}
                  </span>
                </div>
              ))}
              {hasMore && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 2 }}>
                  <div style={{ width: 16, height: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 14, color: 'var(--fg-subtle)', lineHeight: 1 }}>···</span>
                  </div>
                  <span className="sv-mono" style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>
                    +{skills.length - CARD_VISIBLE_COUNT} MORE
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 더보기 버튼 */}
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            width: '100%', padding: '12px 0',
            marginTop: 16,
            background: 'transparent', border: 'none', borderTop: '1px solid var(--border)',
            cursor: 'pointer',
            color: 'var(--fg-subtle)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-subtle)' }}
          aria-label={`${category} 전체 보기`}
        >
          <span className="sv-mono" style={{ fontSize: 10, letterSpacing: '0.08em' }}>VIEW ALL</span>
          <ChevronRight size={11} />
        </button>
      </div>

      {modalOpen && (
        <CategoryModal
          category={category}
          skills={skills}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

export function SkillCategoryCards({ skills }: SkillCategoryCardsProps) {
  const grouped = new Map<string, Skill[]>()
  for (const cat of SKILL_CATEGORIES) grouped.set(cat, [])
  for (const skill of skills) {
    const cat = skill.category ?? 'Other'
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(skill)
  }

  return (
    <div style={{
      display: 'flex', gap: 12,
      overflowX: 'auto',
      paddingBottom: 4,
    }}>
      {Array.from(grouped.entries()).map(([category, items]) => (
        <CategoryCard key={category} category={category} skills={items} />
      ))}
    </div>
  )
}
