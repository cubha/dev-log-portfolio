'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus, Pencil, Trash2, X, Layers, AlertCircle, Check,
  ChevronUp, ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '@/src/utils/skills/skillActions'
import { SkillIcon } from '@/src/components/common/SkillIcon'
import { SKILL_CATEGORIES, type Skill, type SkillInsert } from '@/src/types/skill'
import { POPULAR_TECHS } from '@/src/components/admin/TechStackInput'

// ─── 초기 폼 값 ─────────────────────────────────────────────────────────────
const EMPTY_FORM: SkillInsert = {
  name: '',
  category: 'Frontend',
  icon_name: '',
}

// ─── 카테고리별 배경 색상 (뱃지) ───────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'bg-blue-50 text-blue-700',
  Backend:  'bg-green-50 text-green-700',
  Database: 'bg-orange-50 text-orange-700',
  DevOps:   'bg-cyan-50 text-cyan-700',
  Tools:    'bg-gray-100 text-gray-600',
}

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-gray-100 text-gray-600'
}

// ─── 메인 페이지 ────────────────────────────────────────────────────────────

/**
 * 관리자 기술 스택 관리 페이지
 *
 * - 기술 목록 테이블 (아이콘 미리보기 포함)
 * - 추가 / 수정: 인라인 모달 Dialog
 * - 삭제: 2단계 확인 (실수 방지)
 */
export default function AdminSkillsPage() {
  const [skills, setSkills]       = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  // ── 모달 ──
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData]         = useState<SkillInsert>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError]       = useState<string | null>(null)

  // ── 이름 자동완성 ──
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const nameInputRef  = useRef<HTMLInputElement>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)

  // 삭제 2단계 확인
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // ── 정렬 (category 오름차순 기본)
  const [sortField, setSortField]       = useState<'name' | 'category'>('category')
  const [sortAsc, setSortAsc]           = useState(true)

  // ─── 데이터 로드 ──────────────────────────────────────────────────────────
  const loadSkills = useCallback(async () => {
    setIsLoading(true)
    setListError(null)
    const { data, error } = await fetchSkills()
    if (error) {
      setListError(error)
    } else {
      setSkills(data ?? [])
    }
    setIsLoading(false)
  }, [])

  useEffect(() => { loadSkills() }, [loadSkills])

  // ─── 이름 자동완성 필터링 ─────────────────────────────────────────────────
  useEffect(() => {
    const q = formData.name.trim()
    if (q.length > 0) {
      const filtered = POPULAR_TECHS.filter((t) =>
        t.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 7)
      setNameSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setNameSuggestions([])
      setShowSuggestions(false)
    }
  }, [formData.name])

  // 자동완성 외부 클릭 시 닫기
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        nameInputRef.current && !nameInputRef.current.contains(e.target as Node) &&
        suggestionRef.current && !suggestionRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function selectSuggestion(tech: string) {
    setFormData((p) => ({ ...p, name: tech }))
    setShowSuggestions(false)
    nameInputRef.current?.focus()
  }

  // ─── 정렬된 목록 ──────────────────────────────────────────────────────────
  const sortedSkills = [...skills].sort((a, b) => {
    let av: string | number = a[sortField] ?? 0
    let bv: string | number = b[sortField] ?? 0
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av < bv) return sortAsc ? -1 : 1
    if (av > bv) return sortAsc ? 1 : -1
    return 0
  })

  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortAsc((prev) => !prev)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  // ─── 모달 열기/닫기 ───────────────────────────────────────────────────────
  function openAddModal() {
    setEditingSkill(null)
    setFormData({ ...EMPTY_FORM })
    setFormError(null)
    setIsModalOpen(true)
  }

  function openEditModal(skill: Skill) {
    setEditingSkill(skill)
    setFormData({
      name:      skill.name,
      category:  skill.category || 'Frontend',
      icon_name: skill.icon_name ?? '',
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingSkill(null)
    setFormError(null)
    setShowSuggestions(false)
  }

  // ─── 폼 제출 ──────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = formData.name.trim()

    if (!trimmedName) {
      setFormError('기술 이름을 입력해주세요.')
      return
    }

    // ── 중복 이름 체크 (추가 시에만 / 대소문자 무시) ──────────────────────
    if (!editingSkill) {
      const isDuplicate = skills.some(
        (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
      )
      if (isDuplicate) {
        toast.error('이미 등록된 기술입니다.', {
          description: `"${trimmedName}"은(는) 이미 목록에 있습니다.`,
        })
        return
      }
    }

    setIsSubmitting(true)
    setFormError(null)

    const payload: SkillInsert = {
      ...formData,
      name:      trimmedName,
      icon_name: formData.icon_name?.trim() || null,
    }

    const result = editingSkill
      ? await updateSkill(editingSkill.id, payload)
      : await createSkill(payload)

    if (result.error) {
      setFormError(result.error)
    } else {
      toast.success(editingSkill ? '기술이 수정되었습니다.' : '새 기술이 추가되었습니다.')
      closeModal()
      await loadSkills()
    }
    setIsSubmitting(false)
  }

  // ─── 삭제 ─────────────────────────────────────────────────────────────────
  async function handleDelete(id: number) {
    if (deletingId !== id) {
      setDeletingId(id)
      return
    }
    // 2번째 클릭 → 실제 삭제
    setDeletingId(null)
    const { error } = await deleteSkill(id)
    if (error) {
      setListError(error)
    } else {
      setSkills((prev) => prev.filter((s) => s.id !== id))
    }
  }

  // ─── 정렬 헤더 컴포넌트 ───────────────────────────────────────────────────
  function SortTh({
    field,
    label,
    className = '',
  }: {
    field: typeof sortField
    label: string
    className?: string
  }) {
    const active = sortField === field
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-semibold text-foreground/50 uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors ${className}`}
        onClick={() => toggleSort(field)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          <span className="flex flex-col -space-y-1">
            <ChevronUp   className={`w-2.5 h-2.5 ${active && sortAsc  ? 'text-foreground' : 'text-foreground/20'}`} />
            <ChevronDown className={`w-2.5 h-2.5 ${active && !sortAsc ? 'text-foreground' : 'text-foreground/20'}`} />
          </span>
        </span>
      </th>
    )
  }

  // ─── 렌더 ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-silver-metal rounded-xl shadow-sm">
            <Layers className="w-5 h-5 text-white dark:text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">기술 스택 관리</h1>
            <p className="text-sm text-foreground/50 mt-0.5">About 페이지에 표시될 기술들을 관리합니다</p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-silver-metal animate-shine text-white dark:text-slate-950 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          기술 추가
        </button>
      </div>

      {/* 에러 배너 */}
      {listError && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{listError}</span>
          <button onClick={() => setListError(null)} className="ml-auto p-0.5 hover:bg-red-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-background rounded-xl border border-foreground/10 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-foreground/40 gap-3">
            <div className="w-5 h-5 border-2 border-foreground/10 border-t-foreground/50 rounded-full animate-spin" />
            <span className="text-sm">불러오는 중...</span>
          </div>
        ) : sortedSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-foreground/40">
            <Layers className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">등록된 기술이 없습니다</p>
            <p className="text-sm mt-1">&#39;기술 추가&#39; 버튼을 눌러 시작하세요</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-foreground/8 bg-foreground/3">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground/50 uppercase tracking-wider w-14">
                    아이콘
                  </th>
                  <SortTh field="name"     label="기술명"   />
                  <SortTh field="category" label="카테고리" />
                  <th className="px-4 py-3 text-right text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-foreground/5">
                {sortedSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-foreground/3 transition-colors group">
                    {/* 아이콘 */}
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-lg bg-foreground/8 flex items-center justify-center">
                        <SkillIcon name={skill.name} iconName={skill.icon_name} size={20} />
                      </div>
                    </td>

                    {/* 이름 */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground text-sm">{skill.name}</span>
                    </td>

                    {/* 카테고리 */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${categoryColor(skill.category ?? '')}`}>
                        {skill.category ?? '-'}
                      </span>
                    </td>

                    {/* 액션 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 수정 */}
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1.5 rounded-lg text-foreground/40 hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all opacity-0 group-hover:opacity-100"
                          title="수정"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* 삭제 (2단계) */}
                        {deletingId === skill.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(skill.id)}
                              className="flex items-center gap-1 px-2 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              확인
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="p-1.5 rounded-lg text-foreground/40 hover:bg-foreground/8 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="p-1.5 rounded-lg text-foreground/40 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 개수 표시 */}
      {!isLoading && sortedSkills.length > 0 && (
        <p className="mt-3 text-xs text-foreground/40 text-right">
          총 {sortedSkills.length}개의 기술 스택
        </p>
      )}

      {/* ─── 추가 / 수정 모달 ──────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 딤 배경 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* 모달 카드 */}
          <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-foreground/10">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-foreground/8">
              <h2 className="text-base font-bold text-foreground">
                {editingSkill ? '기술 스택 수정' : '새 기술 추가'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-foreground/40 hover:bg-foreground/8 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* 기술 이름 + 자동완성 */}
              <div className="relative">
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  기술 이름 <span className="text-red-400 normal-case tracking-normal">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  onFocus={() => formData.name.trim() && setShowSuggestions(nameSuggestions.length > 0)}
                  placeholder="예: TypeScript, Next.js"
                  autoFocus
                  autoComplete="off"
                  className="w-full h-10 px-3 border border-foreground/10 rounded-lg text-sm text-foreground placeholder:text-foreground/30 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                />
                {/* 추천 드롭다운 */}
                {showSuggestions && (
                  <div
                    ref={suggestionRef}
                    className="absolute z-20 left-0 right-0 top-full mt-1 bg-background border border-foreground/10 rounded-xl shadow-lg overflow-hidden"
                  >
                    {nameSuggestions.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); selectSuggestion(tech) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors text-left"
                      >
                        <SkillIcon name={tech} iconName={null} size={16} />
                        <span>{tech}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  카테고리
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full h-10 px-3 border border-foreground/10 rounded-lg text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all appearance-none cursor-pointer"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 아이콘 키 + 실시간 미리보기 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  아이콘 키&nbsp;
                  <span className="text-foreground/40 normal-case font-normal tracking-normal">(선택)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.icon_name ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, icon_name: e.target.value }))}
                    placeholder="예: typescript, react, nextjs"
                    className="flex-1 h-10 px-3 border border-foreground/10 rounded-lg text-sm text-foreground placeholder:text-foreground/30 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                  />
                  {/* 아이콘 실시간 미리보기 */}
                  <div
                    className="w-10 h-10 flex-shrink-0 rounded-lg bg-foreground/8 flex items-center justify-center border border-foreground/10"
                    title="아이콘 미리보기"
                  >
                    <SkillIcon
                      name={formData.name || 'XX'}
                      iconName={formData.icon_name || null}
                      size={20}
                    />
                  </div>
                </div>
                <p className="text-xs text-foreground/40 mt-1.5">
                  techIcons.ts에 등록된 키를 입력하세요 (소문자, 특수문자 없음)
                </p>
              </div>

              {/* 폼 에러 */}
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-sm font-medium text-foreground/60 bg-foreground/8 rounded-lg hover:bg-foreground/12 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 text-sm font-semibold bg-silver-metal animate-shine text-white dark:text-slate-950 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? '저장 중...'
                    : editingSkill
                      ? '수정 완료'
                      : '추가하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
