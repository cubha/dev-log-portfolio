'use client'

import { Database } from '@/src/types/supabase'
import Image from 'next/image'
import { useAtomValue, useSetAtom } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import { selectedProjectAtom } from '@/src/store/projectAtom'
import { ProjectCardActions } from './ProjectCardActions'

type Project = Database['public']['Tables']['projects']['Row']
export type CardType = 'hero' | 'featured' | 'normal'

interface ProjectCardProps {
  project: Project
  index: number
  cardType: CardType
}

function ProjectThumb({ project, height }: { project: Project; height: number }) {
  if (project.thumbnail_url) {
    return (
      <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', flexShrink: 0 }}>
        <Image
          src={project.thumbnail_url}
          alt={project.title}
          fill
          priority={false}
          className="object-cover"
          style={{ transition: 'transform .4s ease', objectFit: 'cover' }}
        />
      </div>
    )
  }
  return (
    <div
      style={{
        height,
        width: '100%',
        background: '#1E1E1E',
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 800,
        fontSize: height < 200 ? 26 : 42,
        letterSpacing: '-0.02em',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,0.02) 14px 15px)',
        }}
      />
      <span style={{ position: 'relative' }}>
        {project.title.slice(0, 8).toUpperCase()}
      </span>
    </div>
  )
}

export function ProjectCard({ project, index, cardType }: ProjectCardProps) {
  const isAdmin = useAtomValue(isAdminAtom)
  const setSelectedProject = useSetAtom(selectedProjectAtom)

  const isHero = cardType === 'hero'
  const isFeaturedBadge = cardType === 'featured'
  const thumbH = isHero ? 220 : 160

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) return
    setSelectedProject(project)
  }

  const dateRange = (() => {
    if (!project.start_date) return ''
    const s = project.start_date.slice(0, 7).replace('-', '.')
    const e = project.is_ongoing ? '현재' : project.end_date ? project.end_date.slice(0, 7).replace('-', '.') : ''
    return e ? `${s} ~ ${e}` : s
  })()

  return (
    <article
      className="card"
      onClick={handleCardClick}
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        gridRow: isHero ? 'span 2' : 'span 1',
        overflow: 'hidden',
      }}
    >
      {isAdmin && (
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <ProjectCardActions project={project} />
        </div>
      )}

      <ProjectThumb project={project} height={thumbH} />

      <div style={{ padding: isHero ? '24px 26px 22px' : '18px 20px 18px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Meta row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="sv-mono text-subtle" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
            {dateRange}{dateRange && project.category ? ' · ' : ''}{project.category?.toUpperCase()}
          </span>
          {project.is_ongoing && (
            <span className="sv-mono" style={{ fontSize: 10, letterSpacing: '0.1em', padding: '2px 7px', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 999 }}>
              ONGOING
            </span>
          )}
        </div>

        {/* Title + featured badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <div className={isHero ? 'h-3' : 'h-4'} style={{ letterSpacing: '-0.015em', lineHeight: 1.3, flex: 1 }}>
            {project.title}
          </div>
          {isHero && (
            <span
              className="sv-mono metallic"
              style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                padding: '3px 10px', border: '1px solid var(--accent-line)',
                borderRadius: 2, flexShrink: 0, marginTop: 3,
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}
            >
              <span style={{ fontSize: 11 }}>★</span>FEATURED
            </span>
          )}
          {isFeaturedBadge && (
            <span
              className="metallic"
              style={{ fontSize: 15, flexShrink: 0, marginTop: 2, lineHeight: 1 }}
            >
              ★
            </span>
          )}
        </div>

        {/* Description */}
        <div className="text-muted" style={{ fontSize: isHero ? 14 : 13, lineHeight: 1.55, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description || '프로젝트 설명이 없습니다.'}
        </div>

        {/* Hero only: detailed tasks */}
        {isHero && project.detailed_tasks && project.detailed_tasks.length > 0 && (
          <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {project.detailed_tasks.map((task, i) => (
              <li key={i} className="sv-mono text-subtle" style={{ fontSize: 12, letterSpacing: '0.02em', lineHeight: 1.5, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>—</span>
                {task}
              </li>
            ))}
          </ul>
        )}

        {/* Tech stack + arrow */}
        <div style={{ marginTop: isHero ? 0 : 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(project.tech_stack ?? []).slice(0, 3).map((t, j) => (
              <span key={j} className="tag" style={{ fontSize: 10.5, padding: '3px 9px' }}>{t}</span>
            ))}
          </div>
          <div className="card-arrow" style={{ fontSize: 16 }}>↗</div>
        </div>
      </div>
    </article>
  )
}
