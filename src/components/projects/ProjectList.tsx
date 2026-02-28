'use client'

import { useMemo } from 'react'
import { Database } from '@/src/types/supabase'
import { Plus } from 'lucide-react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { isAdminAtom, editingProjectAtom } from '@/src/store/authAtom'
import { projectFilterAtom, FILTER_OPTIONS, type ProjectFilter } from '@/src/store/filterAtom'
import { ProjectCard } from './ProjectCard'
import { ProjectDetailModal } from './ProjectDetailModal'
import Link from 'next/link'
import { motion } from 'framer-motion'

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

  // 필터링된 프로젝트 목록
  const filteredProjects = useMemo(() => {
    if (activeFilter === '전체') return projects
    return projects.filter((project) => project.category === activeFilter)
  }, [projects, activeFilter])

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
              <EmptyFilterState activeFilter={activeFilter} />
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

function EmptyFilterState({ activeFilter }: { activeFilter: ProjectFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12"
    >
      <p className="text-foreground/40 text-lg">
        &apos;{activeFilter}&apos; 카테고리에 해당하는 프로젝트가 없습니다.
      </p>
    </motion.div>
  )
}
