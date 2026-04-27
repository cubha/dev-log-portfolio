'use client'

import { useMemo } from 'react'
import { Database } from '@/src/types/supabase'
import { Plus, Search, X } from 'lucide-react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { isAdminAtom, editingProjectAtom } from '@/src/store/authAtom'
import { projectFilterAtom, searchQueryAtom, FILTER_OPTIONS, type ProjectFilter } from '@/src/store/filterAtom'
import { ProjectCard } from './ProjectCard'
import { ProjectDetailModal } from './ProjectDetailModal'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

type Project = Database['public']['Tables']['projects']['Row']

/**
 * 프로젝트 리스트 컴포넌트
 *
 * CSS Grid 레이아웃으로 프로젝트를 표시합니다.
 * 스크롤 시 각 카드가 whileInView로 fade-up 애니메이션 적용.
 */
export function ProjectList({ projects }: { projects: Project[] }) {
  const isAdmin = useAtomValue(isAdminAtom)
  const setEditingProject = useSetAtom(editingProjectAtom)
  const [activeFilters, setActiveFilters] = useAtom(projectFilterAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)

  const handleFilterClick = (filter: ProjectFilter) => {
    if (filter === '전체') {
      setActiveFilters(['전체'])
      return
    }
    const current = activeFilters.filter(f => f !== '전체')
    const isSelected = current.includes(filter)
    if (isSelected) {
      const next = current.filter(f => f !== filter)
      setActiveFilters(next.length === 0 ? ['전체'] : next)
    } else {
      const next = [...current, filter] as ProjectFilter[]
      const allIndividual = FILTER_OPTIONS.filter(f => f !== '전체')
      setActiveFilters(allIndividual.every(f => next.includes(f)) ? ['전체'] : next)
    }
  }

  // 카테고리 필터 + 검색어 AND 조건
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesFilter =
        activeFilters.includes('전체') || activeFilters.includes(project.category as ProjectFilter)

      if (!matchesFilter) return false
      if (!q) return true

      return (
        project.title.toLowerCase().includes(q) ||
        (project.description?.toLowerCase().includes(q) ?? false) ||
        (project.company_name?.toLowerCase().includes(q) ?? false) ||
        (project.project_role?.toLowerCase().includes(q) ?? false) ||
        (project.tech_stack?.some((t) => t.toLowerCase().includes(q)) ?? false)
      )
    })
  }, [projects, activeFilters, searchQuery])

  return (
    <>
      <ProjectDetailModal />

      {/* Filter + Search bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '18px 0',
          marginBottom: 40,
          flexWrap: 'wrap',
        }}
      >
        <div className="sv-label" style={{ margin: 0 }}>FILTER</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilterClick(filter)}
              className={`tag ${activeFilters.includes(filter) ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}
            >
              {filter}
            </button>
          ))}
        </div>
        <div
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-muted)', position: 'relative' }}
        >
          <Search className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="프로젝트 검색 (제목, 기술, 회사 …)"
            className="sv-input"
            style={{ width: 'clamp(180px, 19.4vw, 280px)', padding: '6px 2px', borderBottom: 'none', fontSize: 13 }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {isAdmin && (
          <Link
            href="/admin/projects?mode=new"
            onClick={() => setEditingProject(null)}
            className="btn"
            style={{ padding: '6px 14px', fontSize: 12 }}
          >
            <Plus className="w-3.5 h-3.5" />새 프로젝트
          </Link>
        )}
      </div>

      {/* Asymmetric editorial grid */}
      {filteredProjects.length === 0 ? (
        <EmptyFilterState
          activeFilters={activeFilters}
          searchQuery={searchQuery}
          onReset={() => { setSearchQuery(''); setActiveFilters(['전체']) }}
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 24 }}>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
          <div
            className="sv-mono text-subtle"
            style={{ fontSize: 11, letterSpacing: '0.1em', marginTop: 40, textAlign: 'center' }}
          >
            {filteredProjects.length} OF {projects.length} PROJECTS
          </div>
        </>
      )}
    </>
  )
}

function EmptyFilterState({
  activeFilters,
  searchQuery,
  onReset,
}: {
  activeFilters: ProjectFilter[]
  searchQuery: string
  onReset: () => void
}) {
  const hasSearch = searchQuery.trim().length > 0
  const hasFilter = !activeFilters.includes('전체')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12 flex flex-col items-center gap-3"
    >
      <Search className="w-8 h-8 text-foreground/20" />
      <p className="text-foreground/40 text-base">
        {hasSearch
          ? `'${searchQuery}'에 해당하는 프로젝트가 없습니다.`
          : `'${activeFilters.join(', ')}' 카테고리에 해당하는 프로젝트가 없습니다.`}
      </p>
      {(hasSearch || hasFilter) && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-foreground/50 hover:text-foreground underline underline-offset-2 transition-colors"
        >
          필터 초기화
        </button>
      )}
    </motion.div>
  )
}
