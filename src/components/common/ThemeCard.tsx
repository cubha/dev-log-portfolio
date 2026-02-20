import { type HTMLAttributes, forwardRef } from 'react'

/**
 * ThemeCard — 프로젝트 공통 카드 컴포넌트
 *
 * Design spec (Rim Light Bevel):
 * - Border  : border border-brand-primary/10 + border-rim-light (top/left 하이라이트)
 * - Surface : bg-card-surface (::before 오버레이로 상단 미세 밝기)
 * - Shadow  : shadow-sharp (blur 최소, 잔상 없는 선명한 드롭 섀도)
 * - Hover   : hover:border-rim-intense (상단 빛이 강하게 맺히는 효과)
 * - noHoverLift: hover 효과 비활성화 (framer-motion 카드에서 충돌 방지)
 */

// ─── 클래스 상수 (motion element 등에서 직접 spread 가능) ─────────────────────
export const THEME_CARD_CLASS =
  'relative bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl ' +
  'border border-brand-primary/10 border-rim-light ' +
  'bg-card-surface ' +
  'shadow-sharp ' +
  'transition-all duration-300 ' +
  'hover:border-rim-intense'

// ─── Props ───────────────────────────────────────────────────────────────────
interface ThemeCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** hover 효과(rim light 강화) 비활성화 (framer-motion 사용 카드에서 충돌 방지) */
  noHoverLift?: boolean
}

export const ThemeCard = forwardRef<HTMLDivElement, ThemeCardProps>(
  ({ children, className = '', noHoverLift = false, ...props }, ref) => {
    const base =
      'relative bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl ' +
      'border border-brand-primary/10 border-rim-light ' +
      'bg-card-surface ' +
      'shadow-sharp ' +
      'transition-all duration-300'

    const hover = noHoverLift ? '' : ' hover:border-rim-intense'

    return (
      <div ref={ref} className={`${base}${hover} ${className}`} {...props}>
        {children}
      </div>
    )
  }
)

ThemeCard.displayName = 'ThemeCard'
