interface StatusBadgeProps {
  children: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs font-medium rounded-full',
  md: 'px-4 py-1.5 text-sm font-semibold rounded-full',
} as const

const BASE_CLASSES = 'inline-block bg-brand-secondary/10 text-brand-secondary'

export function StatusBadge({
  children,
  size = 'sm',
  className,
}: StatusBadgeProps) {
  const classes = [BASE_CLASSES, SIZE_CLASSES[size], className]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
