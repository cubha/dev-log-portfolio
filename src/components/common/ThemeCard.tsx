import { type HTMLAttributes, forwardRef } from 'react'

/**
 * ThemeCard — 프로젝트 공통 카드 컴포넌트
 *
 * Variants:
 * - default  : bg gradient + border + rim light + shadow (일반 카드)
 * - featured : default + brand-secondary accent border glow (강조 카드)
 * - minimal  : 투명 배경 + 얇은 border만 (텍스트 중심 카드)
 */

type CardVariant = 'default' | 'featured' | 'minimal'

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default:
    'relative bg-surface rounded-2xl ' +
    'border border-foreground/[0.08] border-rim-light ' +
    'bg-card-surface shadow-sharp',
  featured:
    'relative bg-surface rounded-2xl ' +
    'border border-brand-secondary/20 border-rim-light ' +
    'bg-card-surface shadow-sharp',
  minimal:
    'relative rounded-2xl ' +
    'border border-foreground/[0.06]',
}

// static export for motion elements
export const THEME_CARD_CLASS = VARIANT_CLASSES.default +
  ' transition-all duration-300 hover:border-rim-intense'

interface ThemeCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: CardVariant
  noHoverLift?: boolean
}

export const ThemeCard = forwardRef<HTMLDivElement, ThemeCardProps>(
  ({ children, className = '', variant = 'default', noHoverLift = false, ...props }, ref) => {
    const base = VARIANT_CLASSES[variant] + ' transition-all duration-300'
    const hover = noHoverLift ? '' : ' hover:border-rim-intense'

    return (
      <div ref={ref} className={`${base}${hover} ${className}`} {...props}>
        {children}
      </div>
    )
  }
)

ThemeCard.displayName = 'ThemeCard'
