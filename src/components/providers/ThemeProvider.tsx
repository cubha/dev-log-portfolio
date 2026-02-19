'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

/**
 * next-themes ThemeProvider 클라이언트 래퍼
 *
 * layout.tsx(서버 컴포넌트)에서 직접 사용할 수 없는 next-themes를
 * 클라이언트 컴포넌트로 감싸서 제공합니다.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
