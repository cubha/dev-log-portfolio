'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/src/components/common/Logo'
import { ThemeToggle } from '@/src/components/common/ThemeToggle'

/** GNB 네비게이션 항목 */
const NAV_ITEMS = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

/**
 * 전역 헤더 네비게이션
 *
 * - sticky 포지셔닝으로 스크롤 시 상단 고정
 * - backdrop-blur + 반투명 배경 (라이트: white/70, 다크: slate-950/80)
 * - 스크롤 감지 후 border-bottom 표시
 * - 활성 페이지: brand-primary 텍스트 + brand-primary 언더라인
 * - 우측: ThemeToggle(다크모드 전환) + 햄버거(모바일)
 * - /admin 경로에서는 헤더 숨김
 */
export function Header() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-background/70 backdrop-blur-md transition-all duration-300 border-b ${
          isScrolled
            ? 'border-brand-primary/10 shadow-sm'
            : 'border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Logo />

            {/* 데스크탑 네비게이션 + 다크모드 토글 */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname?.startsWith(item.href)

                return (
                  <Link key={item.href} href={item.href} scroll={false}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? 'text-foreground font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-white/5'
                      }`}
                    >
                      {item.label}

                      {/* 활성 언더라인 */}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-foreground/40"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}

              {/* 구분선 */}
              <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />

              {/* 다크모드 토글 */}
              <ThemeToggle />
            </div>

            {/* 모바일 우측: 다크모드 토글 + 햄버거 */}
            <div className="md:hidden flex items-center gap-1">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileOpen((prev) => !prev)}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label={isMobileOpen ? '메뉴 닫기' : '메뉴 열기'}
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* 모바일 드로어 오버레이 */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* 딤 배경 */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* 슬라이드 드로어 */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-slate-950 shadow-2xl md:hidden flex flex-col"
            >
              {/* 드로어 헤더 */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-white/10">
                <Logo />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  aria-label="메뉴 닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 드로어 네비게이션 */}
              <nav className="flex flex-col gap-1 p-4 flex-1">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = pathname?.startsWith(item.href)

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        scroll={false}
                        className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-foreground/8 text-foreground font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-foreground/40" />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* 드로어 하단 */}
              <div className="px-5 py-4 border-t border-slate-100 dark:border-white/10">
                <p className="text-xs text-slate-400 dark:text-slate-600">© 2026 Silver.dev</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
