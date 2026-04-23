'use client'

import { Database } from '@/src/types/supabase'
import Image from 'next/image'
import { useAtomValue, useSetAtom } from 'jotai'
import { isAdminAtom } from '@/src/store/authAtom'
import { selectedProjectAtom } from '@/src/store/projectAtom'
import { ProjectCardActions } from './ProjectCardActions'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
  index: number
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

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isAdmin = useAtomValue(isAdminAtom)
  const setSelectedProject = useSetAtom(selectedProjectAtom)

  const isFeatured = project.is_featured && index < 2
  const thumbH = isFeatured ? 300 : 220

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
        gridColumn: isFeatured ? 'span 2' : 'span 1',
        overflow: 'hidden',
      }}
    >
      {/* Admin actions */}
      {isAdmin && (
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <ProjectCardActions project={project} />
        </div>
      )}

      {/* Thumbnail */}
      <ProjectThumb project={project} height={thumbH} />

      {/* Content */}
      <div style={{ padding: isFeatured ? '24px 26px 22px' : '18px 20px 18px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
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
          {isFeatured && (
            <span className="sv-mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--fg)' }}>
              ★ FEATURED
            </span>
          )}
        </div>

        {/* Title */}
        <div className={isFeatured ? 'h-3' : 'h-4'} style={{ marginBottom: 8, letterSpacing: '-0.015em', lineHeight: 1.3 }}>
          {project.title}
        </div>

        {/* Description */}
        <div className="text-muted" style={{ fontSize: isFeatured ? 14 : 13, lineHeight: 1.55, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description || '프로젝트 설명이 없습니다.'}
        </div>

        {/* Tech stack + arrow */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
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
