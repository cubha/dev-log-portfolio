'use client'

import { useMemo, useRef } from 'react'
import { Database } from '@/src/types/supabase'
import { Plus, Search, X } from 'lucide-react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { isAdminAtom, editingProjectAtom } from '@/src/store/authAtom'
import { projectFilterAtom, searchQueryAtom, FILTER_OPTIONS, type ProjectFilter } from '@/src/store/filterAtom'
import { ProjectCard } from './ProjectCard'
import { ProjectDetailModal } from './ProjectDetailModal'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [activeFilter, setActiveFilter] = useAtom(projectFilterAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)

  // 카테고리 필터 + 검색어 AND 조건
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesFilter =
        activeFilter === '전체' || project.category === activeFilter

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
  }, [projects, activeFilter, searchQuery])

  return (
    <>
      <ProjectDetailModal />

      {/* 페이지 헤더 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">프로젝트</h1>
          {isAdmin && (
            <Link
              href="/admin/projects?mode=new"
              onClick={() => setEditingProject(null)}
              className="group flex items-center gap-2 px-3 py-1.5 text-foreground/70 bg-background border border-foreground/20 rounded-lg hover:bg-foreground/5 hover:border-foreground/40 hover:text-foreground transition-all shadow-sm hover:shadow-md"
              title="새 프로젝트 추가"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-xs font-medium hidden sm:inline">새 프로젝트</span>
            </Link>
          )}
        </div>
        <p className="text-foreground/60 text-sm">
          제가 작업한 프로젝트들을 소개합니다.
        </p>
      </div>

      {/* SearchBar */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className="mb-4"
      >
        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      </motion.div>

      {/* FilterBar */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      >
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </motion.div>

      {/* CSS Grid */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full">
              <EmptyFilterState
                activeFilter={activeFilter}
                searchQuery={searchQuery}
                onReset={() => { setSearchQuery(''); setActiveFilter('전체') }}
              />
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))
          )}
        </div>
      </motion.div>
    </>
  )
}

function SearchBar({
  query,
  onQueryChange,
}: {
  query: string
  onQueryChange: (q: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="프로젝트 검색 (제목, 기술스택, 회사 ...)"
        className="w-full pl-10 pr-10 py-2.5 bg-background border border-foreground/20 rounded-xl text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/10 transition-colors duration-200"
      />
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => { onQueryChange(''); inputRef.current?.focus() }}
            className="absolute right-3 p-0.5 text-foreground/40 hover:text-foreground transition-colors"
            aria-label="검색어 초기화"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterBar({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: ProjectFilter
  onFilterChange: (filter: ProjectFilter) => void
}) {
  return (
    <div className="flex items-center gap-3 mb-10 flex-wrap">
      {FILTER_OPTIONS.map((filter) => {
        const isActive = activeFilter === filter

        return (
          <motion.button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-5 py-2 rounded-full text-sm font-semibold
              transition-colors duration-200 cursor-pointer
              ${
                isActive
                  ? 'bg-silver-metal text-white dark:text-slate-950 shadow-md'
                  : 'bg-background text-foreground/60 border border-foreground/20 hover:border-foreground/40 hover:text-foreground'
              }
            `}
          >
            {filter}
            {isActive && (
              <motion.span
                layoutId="filterIndicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-foreground/40 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

function EmptyFilterState({
  activeFilter,
  searchQuery,
  onReset,
}: {
  activeFilter: ProjectFilter
  searchQuery: string
  onReset: () => void
}) {
  const hasSearch = searchQuery.trim().length > 0

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
          : `'${activeFilter}' 카테고리에 해당하는 프로젝트가 없습니다.`}
      </p>
      {(hasSearch || activeFilter !== '전체') && (
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
