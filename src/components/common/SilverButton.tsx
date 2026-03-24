'use client'

import { ButtonHTMLAttributes } from 'react'

interface SilverButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
  size?: 'md' | 'form'
  children: React.ReactNode
}

const SIZE_CLASSES = {
  md: 'px-4 py-2.5 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all',
  form:
    'px-4 py-2 text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
} as const

const BASE_CLASSES =
  'bg-silver-metal animate-shine text-white dark:text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed'

export function SilverButton({
  fullWidth = false,
  size = 'md',
  className,
  children,
  ...rest
}: SilverButtonProps) {
  const classes = [
    BASE_CLASSES,
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
