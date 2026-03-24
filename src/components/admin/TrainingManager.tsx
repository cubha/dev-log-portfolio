'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Award, BookOpen } from 'lucide-react'
import { SilverButton } from '@/src/components/common/SilverButton'
import { MonthPickerInput } from '@/src/components/ui/MonthPickerInput'
import {
  fetchTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
} from '@/src/utils/training/trainingActions'
import { TRAINING_TYPE_OPTIONS } from '@/src/types/profile'
import type { Training, TrainingInsert } from '@/src/types/profile'

// ─── 날짜 포맷 ───────────────────────────────────────────────────────────────
function formatMonth(d: string | null) {
  if (!d) return ''
  const [y, m] = d.split('-')
  return `${y}.${m}`
}

function formatDateRange(item: { type: string; start_date?: string | null; end_date?: string | null; acquired_date: string }) {
  if (item.type === 'education' && item.start_date && item.end_date) {
    return `${formatMonth(item.start_date)} – ${formatMonth(item.end_date)}`
  }
  return formatMonth(item.acquired_date)
}

// ─── 초기 폼 ─────────────────────────────────────────────────────────────────
const EMPTY: TrainingInsert = {
  title: '',
  institution: '',
  acquired_date: '',
  description: null,
  type: 'education',
  start_date: '',
  end_date: '',
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export function TrainingManager() {
  const [items, setItems]           = useState<Training[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [listError, setListError]   = useState<string | null>(null)

  const [isOpen, setIsOpen]         = useState(false)
  const [editing, setEditing]       = useState<Training | null>(null)
  const [form, setForm]             = useState<TrainingInsert>(EMPTY)
  const [isSaving, setIsSaving]     = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<number | null>(null)

  // ── 데이터 로드 ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await fetchTrainings()
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

  function openEdit(item: Training) {
    setEditing(item)
    // 교육 타입이면서 start_date/end_date가 없으면(구 데이터) acquired_date를 end_date로 사용
    const endDate = item.end_date ?? (item.type === 'education' ? item.acquired_date : '')
    const startDate = item.start_date ?? ''
    setForm({
      title:         item.title,
      institution:   item.institution,
      acquired_date: item.acquired_date,
      description:   item.description,
      type:          item.type,
      start_date:    startDate,
      end_date:      endDate,
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
    const isEducation = form.type === 'education'
    if (!form.title.trim() || !form.institution.trim()) {
      setFormError('명칭과 기관명은 필수입니다.')
      return
    }
    if (isEducation) {
      if (!form.start_date?.trim() || !form.end_date?.trim()) {
        setFormError('교육의 경우 시작일과 수료일을 모두 입력해주세요.')
        return
      }
    } else {
      if (!form.acquired_date) {
        setFormError('자격증의 경우 취득일을 입력해주세요.')
        return
      }
    }

    setIsSaving(true)
    setFormError(null)

    const payload: TrainingInsert = {
      ...form,
      description: form.description?.trim() || null,
      // 교육: acquired_date = end_date (정렬용), start_date/end_date 저장
      // 자격증: acquired_date만 사용
      ...(isEducation
        ? {
            start_date: form.start_date || null,
            end_date: form.end_date || null,
            acquired_date: form.end_date || '',
          }
        : {
            start_date: null,
            end_date: null,
          }),
    }

    const { error } = editing
      ? await updateTraining(editing.id, payload)
      : await createTraining(payload)

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
    const { error } = await deleteTraining(id)
    if (!error) load()
    setDeletingId(null)
  }

  function set<K extends keyof TrainingInsert>(key: K, val: TrainingInsert[K]) {
    setForm(p => ({ ...p, [key]: val }))
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">교육/자격증 관리</h2>
          <p className="text-sm text-foreground/50 mt-0.5">수료한 교육과 취득 자격증을 관리합니다.</p>
        </div>
        <SilverButton type="button" size="md" onClick={openAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          항목 추가
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
          <Award className="w-10 h-10 mb-3 opacity-30" />
          <p className="font-medium">등록된 교육/자격증이 없습니다</p>
          <p className="text-sm mt-1">&lsquo;항목 추가&rsquo; 버튼으로 시작하세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-start justify-between gap-4 p-5 bg-background rounded-xl border border-foreground/8 hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-lg bg-silver-metal flex items-center justify-center flex-shrink-0">
                  {item.type === 'certification'
                    ? <Award className="w-4 h-4 text-white dark:text-slate-950" />
                    : <BookOpen className="w-4 h-4 text-white dark:text-slate-950" />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{item.title}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      item.type === 'certification'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-sky-50 text-sky-700'
                    }`}>
                      {TRAINING_TYPE_OPTIONS.find(t => t.value === item.type)?.label ?? item.type}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/60">{item.institution}</p>
                  <p className="text-xs text-foreground/40 mt-1 tabular-nums">
                    {formatDateRange(item)}
                  </p>
                  {item.description && (
                    <p className="text-xs text-foreground/50 mt-1 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 액션 */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg text-foreground/40 hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all"
                  title="수정"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {deletingId === item.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(item.id)}
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
                    onClick={() => handleDelete(item.id)}
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
                {editing ? '항목 수정' : '항목 추가'}
              </h2>
              <button onClick={close} className="p-1.5 rounded-lg text-foreground/40 hover:bg-foreground/8 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* 종류 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  종류
                </label>
                <div className="flex gap-2">
                  {TRAINING_TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        set('type', opt.value)
                        if (opt.value === 'education') {
                          set('acquired_date', '')
                        } else {
                          set('start_date', '')
                          set('end_date', '')
                        }
                      }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        form.type === opt.value
                          ? 'bg-silver-metal text-white dark:text-slate-950 border-transparent shadow-sm'
                          : 'border-foreground/10 text-foreground/60 hover:border-foreground/20 hover:bg-foreground/5'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 명칭 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  명칭 <span className="text-red-400 normal-case tracking-normal">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder={form.type === 'certification' ? '예: 정보처리기사' : '예: React 심화 과정'}
                  autoFocus
                  className="admin-input w-full h-10 px-3 border rounded-lg text-sm transition-all"
                />
              </div>

              {/* 기관 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  기관 <span className="text-red-400 normal-case tracking-normal">*</span>
                </label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => set('institution', e.target.value)}
                  placeholder="예: 한국산업인력공단"
                  className="admin-input w-full h-10 px-3 border rounded-lg text-sm transition-all"
                />
              </div>

              {/* 교육: 시작일 ~ 수료일 | 자격증: 취득일 */}
              {form.type === 'education' ? (
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
                      수료일 <span className="text-red-400 normal-case tracking-normal">*</span>
                    </label>
                    <MonthPickerInput
                      value={form.end_date || null}
                      onChange={(v) => set('end_date', v ?? '')}
                      placeholder="수료 연월"
                      label="수료일 선택"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                    취득일 <span className="text-red-400 normal-case tracking-normal">*</span>
                  </label>
                  <MonthPickerInput
                    value={form.acquired_date || null}
                    onChange={(v) => set('acquired_date', v ?? '')}
                    placeholder="취득 연월"
                    label="취득일 선택"
                  />
                </div>
              )}

              {/* 설명 */}
              <div>
                <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wide">
                  설명 <span className="text-foreground/40 normal-case font-normal">(선택)</span>
                </label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) => set('description', e.target.value || null)}
                  rows={2}
                  placeholder="간단한 설명을 입력하세요..."
                  className="admin-input w-full px-3 py-2 border rounded-lg text-sm transition-all resize-none"
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
