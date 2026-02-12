'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

/**
 * 전역 헤더 네비게이션
 * 
 * 메인 페이지와 About 페이지를 연결하는 GNB입니다.
 */
export function Header() {
  const pathname = usePathname()

  // admin 페이지에서는 헤더 숨김
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const navItems = [
    { href: '/', label: '홈', icon: '🏠' },
    { href: '/projects', label: '프로젝트', icon: '📁' },
    { href: '/about', label: 'About', icon: '👤' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* 로고 아이콘 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-sm">SH</span>
              </div>
            </motion.div>
            
            {/* 로고 텍스트 */}
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                SILVER_SH
              </span>
              <span className="text-[10px] text-gray-500 -mt-0.5 tracking-wide">
                Full Stack Developer
              </span>
            </div>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="flex items-center gap-2">
            {navItems.slice(1).map((item) => {
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                      ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>

                    {/* 활성 인디케이터 */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </header>
  )
}
