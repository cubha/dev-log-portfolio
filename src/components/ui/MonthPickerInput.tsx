'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { format, parse, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── 상수 ───────────────────────────────────────────────────────────────────
const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const POPUP_H = 228 // 팝업 예상 높이 (px), 뷰포트 넘침 감지용

/** YYYY-MM 문자열 → Date (해당 월 1일) */
function parseYYYYMM(val: string | null): Date | null {
  if (!val) return null
  const d = parse(val + '-01', 'yyyy-MM-dd', new Date())
  return isValid(d) ? d : null
}

/** Date → YYYY-MM 문자열 */
function toYYYYMM(d: Date): string {
  return format(d, 'yyyy-MM')
}

/** 표시용: YYYY.MM */
function displayValue(val: string | null): string {
  const d = parseYYYYMM(val)
  if (!d) return ''
  return format(d, 'yyyy.MM', { locale: ko })
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface MonthPickerInputProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  /** disabled 상태일 때 표시할 텍스트 (예: "현재") */
  disabledText?: string
  /** 접근성 aria-label */
  label?: string
}

/**
 * Month Picker — Silver Metal 테마 적용
 *
 * - Portal 렌더링: createPortal(document.body)로 overflow-hidden 모달 내에서도 팝업 클리핑 없음
 * - 팝업 위치: 버튼의 getBoundingClientRect()로 fixed 좌표 계산, 뷰포트 하단 넘침 시 위쪽으로 역전
 * - 스크롤/리사이즈 시 좌표 실시간 업데이트
 * - 값 포맷: "YYYY-MM" (DB), 표시: "yyyy.MM"
 * - 선택된 달: bg-silver-metal 그라데이션 강조
 */
export function MonthPickerInput({
  value,
  onChange,
  placeholder = '연월 선택',
  disabled = false,
  disabledText,
  label,
}: MonthPickerInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewYear, setViewYear] = useState<number>(() => {
    const d = parseYYYYMM(value)
    return d ? d.getFullYear() : new Date().getFullYear()
  })
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({})
  const [mounted, setMounted] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)

  // SSR 안전: document.body는 클라이언트에서만 접근
  useEffect(() => { setMounted(true) }, [])

  // 팝업 위치 계산 (fixed 기준, 스크롤 무관)
  const calcPosition = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom - 8
    const openUpward = spaceBelow < POPUP_H && rect.top > POPUP_H

    setPopupStyle({
      position: 'fixed',
      top: openUpward ? rect.top - POPUP_H - 6 : rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 240),
      zIndex: 9999,
    })
  }, [])

  // 팝업 열릴 때 위치 계산 + scroll/resize 리스너
  useEffect(() => {
    if (!isOpen) return
    calcPosition()
    window.addEventListener('scroll', calcPosition, true)
    window.addEventListener('resize', calcPosition)
    return () => {
      window.removeEventListener('scroll', calcPosition, true)
      window.removeEventListener('resize', calcPosition)
    }
  }, [isOpen, calcPosition])

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      // 버튼 자체 클릭은 toggle로 처리
      if (buttonRef.current?.contains(e.target as Node)) return
      // 팝업 내부 클릭은 무시
      const popup = document.getElementById('month-picker-portal')
      if (popup?.contains(e.target as Node)) return
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // value 바뀌면 viewYear 동기화
  useEffect(() => {
    const d = parseYYYYMM(value)
    if (d) setViewYear(d.getFullYear())
  }, [value])

  function selectMonth(monthIdx: number) {
    const selected = new Date(viewYear, monthIdx, 1)
    onChange(toYYYYMM(selected))
    setIsOpen(false)
  }

  const selectedDate = parseYYYYMM(value)
  const buttonText = disabled && disabledText ? disabledText : displayValue(value) || placeholder
  const isPlaceholder = !value || (disabled && disabledText)

  // ─── 팝업 JSX ────────────────────────────────────────────────────────────
  const popup = (
    <div
      id="month-picker-portal"
      role="dialog"
      aria-label="월 선택"
      style={popupStyle}
      className="
        rounded-xl shadow-2xl
        bg-background
        border border-brand-primary/20 dark:border-brand-primary/15
        p-4
        animate-in fade-in-0 zoom-in-95 duration-150
      "
    >
      {/* 연도 네비게이션 */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setViewYear(y => y - 1)}
          className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/8 transition-colors"
          aria-label="이전 연도"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-semibold text-foreground tabular-nums">
          {viewYear}년
        </span>

        <button
          type="button"
          onClick={() => setViewYear(y => y + 1)}
          className="p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/8 transition-colors"
          aria-label="다음 연도"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 월 그리드 (4×3) */}
      <div className="grid grid-cols-4 gap-1">
        {MONTH_LABELS.map((lbl, idx) => {
          const isSelected =
            selectedDate &&
            selectedDate.getFullYear() === viewYear &&
            selectedDate.getMonth() === idx

          return (
            <button
              key={idx}
              type="button"
              onClick={() => selectMonth(idx)}
              className={`
                h-9 rounded-lg text-xs font-medium transition-all
                ${isSelected
                  ? 'bg-silver-metal text-white dark:text-slate-200 shadow-sm scale-[1.04]'
                  : 'text-foreground/70 hover:bg-foreground/8 hover:text-foreground'
                }
              `}
            >
              {lbl}
            </button>
          )
        })}
      </div>

      {/* 초기화 */}
      {value && (
        <button
          type="button"
          onClick={() => { onChange(null); setIsOpen(false) }}
          className="mt-3 w-full text-xs text-foreground/40 hover:text-foreground/70 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors"
        >
          선택 초기화
        </button>
      )}
    </div>
  )

  return (
    <div className="relative">
      {/* 트리거 버튼 */}
      <button
        ref={buttonRef}
        type="button"
        aria-label={label ?? placeholder}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          setIsOpen(o => !o)
        }}
        className={`
          w-full h-10 px-3 flex items-center justify-between gap-2
          border rounded-lg text-sm transition-all
          bg-background
          text-foreground
          disabled:opacity-40 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/40
          ${isOpen
            ? 'border-brand-primary/40 ring-2 ring-brand-primary/20'
            : 'border-foreground/15 hover:border-foreground/30 dark:border-foreground/20 dark:hover:border-foreground/35'
          }
        `}
      >
        <span className={
          isPlaceholder
            ? 'text-foreground/35 dark:text-foreground/30'
            : 'text-foreground font-medium tabular-nums'
        }>
          {buttonText}
        </span>
        <CalendarDays className={`
          w-4 h-4 flex-shrink-0 transition-colors
          ${isOpen ? 'text-brand-primary' : 'text-foreground/35 dark:text-foreground/30'}
        `} />
      </button>

      {/* Portal 팝업 — body에 마운트되어 overflow-hidden 모달 내 클리핑 없음 */}
      {mounted && isOpen && createPortal(popup, document.body)}
    </div>
  )
}
