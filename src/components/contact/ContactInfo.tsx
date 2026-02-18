'use client'

import { useOptimistic, useTransition, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, X, Check } from 'lucide-react'
import { updateContactLink } from '@/src/actions/contact'
import { getContactIcon } from '@/src/utils/contact/iconMap'
import type { ContactLink } from '@/src/types/contact'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactInfoProps {
  /** Supabase에서 sort_order 순으로 fetch된 연락처 데이터 */
  initialData: ContactLink[]
  /** 관리자 여부 (인라인 수정 UI 노출 조건) */
  isAdmin: boolean
}

// ─── 인라인 수정 드래프트 타입 ────────────────────────────────────────────────

type EditDraft = Record<string, { value: string; href: string }>

// ─── Ghost Input 공통 스타일 ──────────────────────────────────────────────────

/**
 * 텍스트처럼 보이는 인라인 입력 스타일
 * - 배경·패딩 없이 하단 border만 표시 → 기존 텍스트 자리 그대로 차지
 * - text-sm font-medium 를 정확히 맞춰 leading/font도 동일하게 유지
 */
const GHOST_VALUE =
  'w-full min-w-0 bg-transparent border-0 border-b border-gray-300 ' +
  'focus:border-brand-primary outline-none px-0 py-0 h-auto leading-5 ' +
  'text-sm text-gray-900 font-medium transition-colors placeholder:text-gray-300'

/**
 * href(URL) 전용 Ghost Input — value 입력 바로 아래에 배치
 * 폰트를 text-xs로 줄여 view 모드와의 row 높이 차이를 최소화
 */
const GHOST_HREF =
  'w-full min-w-0 bg-transparent border-0 border-b border-gray-200 ' +
  'focus:border-brand-primary/60 outline-none px-0 py-0 h-auto leading-4 ' +
  'text-xs text-gray-400 transition-colors placeholder:text-gray-200 mt-0.5'

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

/**
 * Contact Info 컴포넌트
 *
 * View  : DB에서 가져온 연락처를 카드 형태로 표시
 * Edit  : 헤더 우측 아이콘(✏ → ✕✓)으로 인라인 수정 진입
 *         Ghost Input으로 교체 → 레이아웃 변화 없음
 *         하단 버튼 없음 → 카드 높이 고정 유지
 */
export function ContactInfo({ initialData, isAdmin }: ContactInfoProps) {
  // ── 낙관적 상태 ───────────────────────────────────────────
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    initialData,
    (_: ContactLink[], next: ContactLink[]) => next
  )

  // ── 에딧 상태 ─────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false)
  const [editDraft, setEditDraft] = useState<EditDraft>({})
  const [isPending, startTransition] = useTransition()

  // ── 핸들러 ────────────────────────────────────────────────

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('클립보드에 복사되었습니다!')
  }

  const handleEditStart = () => {
    const draft: EditDraft = {}
    initialData.forEach((item) => {
      draft[item.id] = { value: item.value, href: item.href ?? '' }
    })
    setEditDraft(draft)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditDraft({})
  }

  const handleDraftChange = (
    id: string,
    field: 'value' | 'href',
    val: string
  ) => {
    setEditDraft((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: val },
    }))
  }

  const handleSave = () => {
    const updatedItems: ContactLink[] = initialData.map((item) => ({
      ...item,
      value: editDraft[item.id]?.value ?? item.value,
      href: editDraft[item.id]?.href?.trim() || null,
    }))

    startTransition(async () => {
      setOptimisticItems(updatedItems)
      try {
        const changedItems = initialData.filter((item) => {
          const draft = editDraft[item.id]
          if (!draft) return false
          return (
            draft.value !== item.value ||
            (draft.href.trim() || null) !== item.href
          )
        })

        if (changedItems.length > 0) {
          const results = await Promise.all(
            changedItems.map((item) =>
              updateContactLink(item.id, {
                value: editDraft[item.id].value,
                href: editDraft[item.id].href || null,
              })
            )
          )
          const failed = results.find((r) => !r.success)
          if (failed && !failed.success) throw new Error(failed.error)
        }

        setIsEditing(false)
        setEditDraft({})
        toast.success('연락처 정보가 저장되었습니다.')
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : '저장에 실패했습니다.'
        )
      }
    })
  }

  // ─── 렌더링 ────────────────────────────────────────────────────────────────

  return (
    <section>
      {/* ── 섹션 헤더 ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full" />
          <h2 className="text-xl font-semibold text-gray-900">Contact Info</h2>
        </div>

        {/*
          관리자 전용 컨트롤
          - View  : ✏ 수정 버튼
          - Edit  : ✕ 취소 + ✓ 저장 아이콘 (하단 버튼 없이 여기서 해결)
        */}
        {isAdmin && (
          <div className="flex items-center gap-0.5">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  title="취소"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  title={isPending ? '저장 중...' : '저장'}
                  className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-primary hover:text-white transition-all disabled:opacity-40"
                >
                  <Check className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleEditStart}
                title="연락처 수정"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                수정
              </button>
            )}
          </div>
        )}
      </div>

      {/*
        ── 카드 본문 ────────────────────────────────────────
        h-[350px] 고정 — Ghost Input 덕분에 Edit/View 모드에서
        row 높이가 동일하여 레이아웃 변화가 없습니다.
      */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-6 py-5 h-[350px] flex flex-col justify-center">
        {optimisticItems.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            연락처 정보가 없습니다.
          </p>
        )}

        <div className="space-y-3">
          {optimisticItems.map((item) => {
            const Icon = getContactIcon(item.icon_key)
            // href 수정이 필요한 항목: 기존 링크가 있거나 github 아이콘
            const needsHrefInput =
              isEditing && (item.href !== null || item.icon_key === 'github')

            /*
              Row 내부 콘텐츠를 분리해 두면
              <a> / <div> 래퍼 전환 시에도 내부 구조가 동일합니다.
            */
            const rowInner = (
              <>
                {/* 아이콘 (고정) */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* 텍스트 / Ghost Input 영역 */}
                <div className="flex-1 min-w-0">
                  {/* 라벨: 항상 고정 표시 */}
                  <p className="text-xs text-gray-500 leading-none mb-0.5">
                    {item.label}
                  </p>

                  {isEditing ? (
                    /*
                      Ghost Input — 폰트·행간을 기존 텍스트와 동일하게 맞춰
                      border-b 만으로 시각적 피드백을 줍니다.
                    */
                    <div className="space-y-0">
                      <input
                        type="text"
                        value={editDraft[item.id]?.value ?? item.value}
                        onChange={(e) =>
                          handleDraftChange(item.id, 'value', e.target.value)
                        }
                        className={GHOST_VALUE}
                        autoComplete="off"
                      />
                      {/*
                        GitHub·링크 항목: URL 입력을 text-xs로 최소화해
                        row 높이 증가를 최대한 억제합니다.
                      */}
                      {needsHrefInput && (
                        <input
                          type="url"
                          value={editDraft[item.id]?.href ?? item.href ?? ''}
                          onChange={(e) =>
                            handleDraftChange(item.id, 'href', e.target.value)
                          }
                          placeholder="https://"
                          className={GHOST_HREF}
                          autoComplete="off"
                        />
                      )}
                    </div>
                  ) : (
                    /* 뷰 모드: 기존 텍스트 그대로 */
                    <p className="text-sm text-gray-900 font-medium truncate leading-5">
                      {item.value}
                    </p>
                  )}
                </div>

                {/* Copy 버튼 (뷰 모드 & copyable 항목만) */}
                {!isEditing && item.is_copyable && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleCopy(item.value)
                    }}
                    className="flex-shrink-0 text-xs text-gray-400 hover:text-brand-primary transition-colors px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Copy
                  </button>
                )}
              </>
            )

            /*
              뷰 모드에서 href가 있으면 전체 row를 <a>로 감싸
              에딧 모드에서는 <div>로 전환 (input을 클릭 가능하게 유지)
            */
            return item.href && !isEditing ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2 px-2 -mx-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {rowInner}
              </a>
            ) : (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg"
              >
                {rowInner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
