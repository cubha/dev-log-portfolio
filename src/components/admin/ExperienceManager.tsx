'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Briefcase } from 'lucide-react'
import { SilverButton } from '@/src/components/common/SilverButton'
import { MonthPickerInput } from '@/src/components/ui/MonthPickerInput'
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '@/src/utils/experience/experienceActions'
import type { Experience, ExperienceInsert } from '@/src/types/profile'

// ─── 날짜 포맷 ───────────────────────────────────────────────────────────────
function formatMonth(d: string | null) {
  if (!d) return ''
  const [y, m] = d.split('-')
  return `${y}.${m}`
}

function dateRange(exp: Experience) {
  const start = formatMonth(exp.start_date)
  const end = exp.is_current ? '현재' : formatMonth(exp.end_date)
  return `${start} – ${end}`
}

// ─── 초기 폼 ─────────────────────────────────────────────────────────────────
const EMPTY: ExperienceInsert = {
  company_name: '',
  position: '',
  start_date: '',
  end_date: null,
  description: '',
  is_current: false,
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export function ExperienceManager() {
  const [items, setItems]           = useState<Experience[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [listError, setListError]   = useState<string | null>(null)

  // 모달
  const [isOpen, setIsOpen]         = useState(false)
  const [editing, setEditing]       = useState<Experience | null>(null)
  const [form, setForm]             = useState<ExperienceInsert>(EMPTY)
  const [isSaving, setIsSaving]     = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)

  // 삭제 2단계
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // ── 데이터 로드 ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await fetchExperiences()
    if (error) setListError(error)
    else setItems(data ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // ── 모달 핸들러 ──────────────────────────────────────────────────────────
  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setFormError(null)
    setIsOpen(true)
  }

  function openEdit(exp: Experience) {
    setEditing(exp)
    setForm({
      company_name: exp.company_name,
      position:     exp.position,
      start_date:   exp.start_date,
      end_date:     exp.end_date,
      description:  exp.description ?? '',
      is_current:   exp.is_current,
    })
    setFormError(null)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    setEditing(null)
    setFormError(null)
  }

  // ── 제출 ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company_name.trim() || !form.position.trim() || !form.start_date) {
      setFormError('회사명, 직책, 시작일은 필수입니다.')
      return
    }

    setIsSaving(true)
    setFormError(null)

    const payload: ExperienceInsert = {
      ...form,
      end_date:    form.is_current ? null : (form.end_date || null),
      description: form.description?.trim() || null,
    }

    const { error } = editing
      ? await updateExperience(editing.id, payload)
      : await createExperience(payload)

    if (error) {
      setFormError(error)
    } else {
      close()
      load()
    }
    setIsSaving(false)
  }

  // ── 삭제 ──────────────────────────────────────────────────────────────────
  async function handleDelete(id: number) {
    if (deletingId !== id) { setDeletingId(id); return }
    const { error } = await deleteExperience(id)
    if (!error) load()
    setDeletingId(null)
  }

  // ── 필드 핸들러 ──────────────────────────────────────────────────────────
  function set<K extends keyof ExperienceInsert>(key: K, val: ExperienceInsert[K]) {
    setForm(p => ({ ...p, [key]: val }))
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">경력 관리</h2>
          <p className="text-sm text-foreground/50 mt-0.5">회사 경력을 추가하고 관리합니다.</p>
        </div>
        <SilverButton type="button" size="md" onClick={openAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          경력 추가
        </SilverButton>
      </div>

      {/* 에러 */}
      {listError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {listError}
        </div>
      )}

      {/* 로딩 */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground/30" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-foreground/40">
          <Briefcase className="w-10 h-10 mb-3 opacity-30" />
          <p className="font-medium">등록된 경력이 없습니다</p>
          <p className="text-sm mt-1">&lsquo;경력 추가&rsquo; 버튼으로 시작하세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((exp) => (
            <div
              key={exp.id}
              className="group flex items-start justify-between gap-4 p-5 bg-background rounded-xl border border-foreground/8 hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-lg bg-silver-metal flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-white dark:text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{exp.company_name}</span>
                    {exp.is_current && (
                      <span className="px-2 py-0.5 bg-brand-secondary/10 text-brand-secondary text-xs rounded-full font-medium">재직중</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60">{exp.position}</p>
                  <p className="text-xs text-foreground/40 mt-1 tabular-nums">{dateRange(exp)}</p>
                  {exp.description && (
                    <p className="text-xs text-foreground/50 mt-2 leading-relaxed line-clamp-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 액션 */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => openEdit(exp)}
                  className="p-1.5 rounded-lg text-foreground/40 hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all"
                  title="수정"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {deletingId === exp.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="flex items-center gap-1 px-2 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Check className="w-3 h-3" />확인
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
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 rounded-lg text-foreground/40 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── 모달 ────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-foreground/10">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-foreground/8">
              <h2 className="text-base font-bold text-foreground">
                {editing ? '경력 수정' : '경력 추가'}
              </h2>
              <button onClick={close} className="p-1.5 rounded-lg text-foreground/40 hover:bg-foreground/8 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* 회사명 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  회사명 <span className="text-red-400 normal-case tracking-normal">*</span>
                </label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => set('company_name', e.target.value)}
                  placeholder="예: (주)실버테크"
                  autoFocus
                  className="admin-input w-full h-10 px-3 border rounded-lg text-sm transition-all"
                />
              </div>

              {/* 직책 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  직책 / 포지션 <span className="text-red-400 normal-case tracking-normal">*</span>
                </label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => set('position', e.target.value)}
                  placeholder="예: 프론트엔드 개발자"
                  className="admin-input w-full h-10 px-3 border rounded-lg text-sm transition-all"
                />
              </div>

              {/* 기간 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                    시작일 <span className="text-red-400 normal-case tracking-normal">*</span>
                  </label>
                  <MonthPickerInput
                    value={form.start_date || null}
                    onChange={(v) => set('start_date', v ?? '')}
                    placeholder="시작 연월"
                    label="시작일 선택"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                    종료일
                  </label>
                  <MonthPickerInput
                    value={form.is_current ? null : (form.end_date ?? null)}
                    onChange={(v) => set('end_date', v)}
                    placeholder="종료 연월"
                    disabled={form.is_current}
                    disabledText="현재"
                    label="종료일 선택"
                  />
                </div>
              </div>

              {/* 현재 재직중 토글 */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => set('is_current', !form.is_current)}
                  className={`relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer ${form.is_current ? 'bg-silver-metal' : 'bg-foreground/20'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${form.is_current ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-foreground/70">현재 재직중</span>
              </label>

              {/* 업무 내용 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  업무 내용 <span className="text-foreground/40 normal-case font-normal tracking-normal">(선택)</span>
                </label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) => set('description', e.target.value)}
                  rows={3}
                  placeholder="주요 업무와 성과를 간략하게 적어주세요..."
                  className="admin-input w-full px-3 py-2.5 border rounded-lg text-sm transition-all resize-none"
                />
              </div>

              {/* 폼 에러 */}
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}

              {/* 액션 */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 py-2.5 text-sm font-medium text-foreground/60 bg-foreground/8 rounded-lg hover:bg-foreground/12 transition-colors"
                >
                  취소
                </button>
                <SilverButton
                  type="submit"
                  size="md"
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? '저장 중...' : editing ? '수정 완료' : '추가하기'}
                </SilverButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
