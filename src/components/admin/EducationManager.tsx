'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Check, AlertCircle, GraduationCap } from 'lucide-react'
import { SilverButton } from '@/src/components/common/SilverButton'
import { MonthPickerInput } from '@/src/components/ui/MonthPickerInput'
import {
  fetchEducations,
  createEducation,
  updateEducation,
  deleteEducation,
} from '@/src/utils/education/educationActions'
import { EDUCATION_STATUS_OPTIONS } from '@/src/types/profile'
import type { Education, EducationInsert } from '@/src/types/profile'

// ─── 날짜 포맷 ───────────────────────────────────────────────────────────────
function formatMonth(d: string | null) {
  if (!d) return ''
  const [y, m] = d.split('-')
  return `${y}.${m}`
}

function dateRange(edu: Education) {
  const start = formatMonth(edu.start_date)
  const end = formatMonth(edu.end_date)
  return end ? `${start} – ${end}` : `${start} –`
}

// ─── 초기 폼 ─────────────────────────────────────────────────────────────────
const EMPTY: EducationInsert = {
  school_name: '',
  major: '',
  status: '졸업',
  start_date: '',
  end_date: null,
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export function EducationManager() {
  const [items, setItems]           = useState<Education[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [listError, setListError]   = useState<string | null>(null)

  // 모달
  const [isOpen, setIsOpen]         = useState(false)
  const [editing, setEditing]       = useState<Education | null>(null)
  const [form, setForm]             = useState<EducationInsert>(EMPTY)
  const [isSaving, setIsSaving]     = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)

  // 삭제 2단계
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // ── 데이터 로드 ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await fetchEducations()
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

  function openEdit(edu: Education) {
    setEditing(edu)
    setForm({
      school_name: edu.school_name,
      major:       edu.major,
      status:      edu.status,
      start_date:  edu.start_date,
      end_date:    edu.end_date,
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
    if (!form.school_name.trim() || !form.major.trim() || !form.start_date) {
      setFormError('학교명, 전공, 입학일은 필수입니다.')
      return
    }

    setIsSaving(true)
    setFormError(null)

    const payload: EducationInsert = {
      ...form,
      end_date: form.end_date || null,
    }

    const { error } = editing
      ? await updateEducation(editing.id, payload)
      : await createEducation(payload)

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
    const { error } = await deleteEducation(id)
    if (!error) load()
    setDeletingId(null)
  }

  function set<K extends keyof EducationInsert>(key: K, val: EducationInsert[K]) {
    setForm(p => ({ ...p, [key]: val }))
  }

  // 상태에 따른 배지 색상
  const statusColor: Record<string, string> = {
    '졸업':   'bg-green-50 text-green-700',
    '재학중': 'bg-brand-secondary/10 text-brand-secondary',
    '휴학':   'bg-yellow-50 text-yellow-700',
    '중퇴':   'bg-red-50 text-red-600',
    '수료':   'bg-purple-50 text-purple-700',
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">학력 관리</h2>
          <p className="text-sm text-foreground/50 mt-0.5">학력 사항을 추가하고 관리합니다.</p>
        </div>
        <SilverButton type="button" size="md" onClick={openAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          학력 추가
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
          <GraduationCap className="w-10 h-10 mb-3 opacity-30" />
          <p className="font-medium">등록된 학력이 없습니다</p>
          <p className="text-sm mt-1">&lsquo;학력 추가&rsquo; 버튼으로 시작하세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((edu) => (
            <div
              key={edu.id}
              className="group flex items-start justify-between gap-4 p-5 bg-background rounded-xl border border-foreground/8 hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-lg bg-silver-metal flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-white dark:text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{edu.school_name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColor[edu.status] ?? 'bg-foreground/10 text-foreground/60'}`}>
                      {edu.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/60">{edu.major}</p>
                  <p className="text-xs text-foreground/40 mt-1 tabular-nums">{dateRange(edu)}</p>
                </div>
              </div>

              {/* 액션 */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => openEdit(edu)}
                  className="p-1.5 rounded-lg text-foreground/40 hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all"
                  title="수정"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {deletingId === edu.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(edu.id)}
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
                    onClick={() => handleDelete(edu.id)}
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
                {editing ? '학력 수정' : '학력 추가'}
              </h2>
              <button onClick={close} className="p-1.5 rounded-lg text-foreground/40 hover:bg-foreground/8 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* 학교명 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  학교명 <span className="text-red-400 normal-case tracking-normal">*</span>
                </label>
                <input
                  type="text"
                  value={form.school_name}
                  onChange={(e) => set('school_name', e.target.value)}
                  placeholder="예: 한국대학교"
                  autoFocus
                  className="admin-input w-full h-10 px-3 border rounded-lg text-sm transition-all"
                />
              </div>

              {/* 전공 + 상태 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                    전공 <span className="text-red-400 normal-case tracking-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.major}
                    onChange={(e) => set('major', e.target.value)}
                    placeholder="예: 컴퓨터공학"
                    className="admin-input w-full h-10 px-3 border rounded-lg text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                    상태
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => set('status', e.target.value)}
                    className="admin-input w-full h-10 px-3 border rounded-lg text-sm transition-all appearance-none cursor-pointer"
                  >
                    {EDUCATION_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 기간 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                    입학일 <span className="text-red-400 normal-case tracking-normal">*</span>
                  </label>
                  <MonthPickerInput
                    value={form.start_date || null}
                    onChange={(v) => set('start_date', v ?? '')}
                    placeholder="입학 연월"
                    label="입학일 선택"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                    졸업/수료일 <span className="text-foreground/40 normal-case font-normal">(선택)</span>
                  </label>
                  <MonthPickerInput
                    value={form.end_date ?? null}
                    onChange={(v) => set('end_date', v)}
                    placeholder="졸업 연월 (선택)"
                    label="졸업/수료일 선택"
                  />
                </div>
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
