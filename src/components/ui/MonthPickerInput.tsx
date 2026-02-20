'use client'

import { useState, useRef, useEffect } from 'react'
import { format, parse, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── 상수 ───────────────────────────────────────────────────────────────────
const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

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
  disabledText?: string  // disabled 상태일 때 표시할 텍스트 (예: "현재")
  label?: string         // 접근성 aria-label
}

/**
 * Shadcn 스타일 Month Picker
 *
 * - 값 포맷: "YYYY-MM" (DB 저장 형식)
 * - 표시 포맷: "yyyy.MM"
 * - 선택된 달: bg-brand-secondary 강조
 * - 팝업: bg-background + border-brand-primary/20
 * - 다크모드 완전 지원
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

  const containerRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // value가 바뀌면 viewYear 동기화
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

  const buttonText = disabled && disabledText
    ? disabledText
    : displayValue(value) || placeholder

  const isPlaceholder = !value || (disabled && disabledText)

  return (
    <div ref={containerRef} className="relative">
      {/* 트리거 버튼 */}
      <button
        type="button"
        aria-label={label ?? placeholder}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(o => !o)}
        className={`
          w-full h-10 px-3 flex items-center justify-between gap-2
          border rounded-lg text-sm transition-all
          bg-background border-foreground/10
          focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/40
          disabled:opacity-40 disabled:cursor-not-allowed
          ${isOpen ? 'border-brand-primary/40 ring-2 ring-brand-primary/20' : 'hover:border-foreground/25'}
        `}
      >
        <span className={isPlaceholder ? 'text-foreground/35' : 'text-foreground font-medium tabular-nums'}>
          {buttonText}
        </span>
        <CalendarDays className={`w-4 h-4 flex-shrink-0 transition-colors ${isOpen ? 'text-brand-primary' : 'text-foreground/35'}`} />
      </button>

      {/* 팝오버 */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="월 선택"
          className="
            absolute z-50 top-[calc(100%+6px)] left-0
            w-64 rounded-xl shadow-xl
            bg-background border border-brand-primary/20
            dark:border-brand-primary/15
            p-4
            animate-in fade-in-0 zoom-in-95 duration-150
          "
          style={{ minWidth: '15rem' }}
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
            {MONTH_LABELS.map((label, idx) => {
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
                      ? 'bg-brand-secondary text-white shadow-sm scale-[1.04]'
                      : 'text-foreground/70 hover:bg-foreground/8 hover:text-foreground'
                    }
                  `}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* 초기화 버튼 */}
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
      )}
    </div>
  )
}
