'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wrench, Home, LayoutDashboard, FolderKanban, Layers, User } from 'lucide-react'
import { ThemeToggle } from '@/src/components/common/ThemeToggle'
import { LogoutButton } from '@/src/components/admin/LogoutButton'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: '대시보드',       icon: LayoutDashboard },
  { href: '/admin/projects',  label: '프로젝트 관리',  icon: FolderKanban    },
  { href: '/admin/skills',    label: '기술 스택 관리', icon: Layers          },
  { href: '/admin/profile',   label: '프로필 관리',    icon: User            },
]

/**
 * 어드민 공통 헤더 + 사이드바 (클라이언트 컴포넌트)
 *
 * - ThemeToggle 통합
 * - 현재 경로에 따라 사이드바 활성 항목 강조
 * - 전역 CSS 변수 기반 실버 메탈 테마 사용
 */
export function AdminHeader() {
  const pathname = usePathname()

  return (
    <>
      {/* ── 상단 헤더 ───────────────────────────────────────────────────── */}
      <header className="bg-background border-b border-foreground/10 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 타이틀 */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-silver-metal rounded-lg">
                <Wrench className="w-5 h-5 text-white dark:text-slate-950" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground leading-tight">
                  Portfolio Admin
                </h1>
                <p className="text-xs text-foreground/50">관리자 대시보드</p>
              </div>
            </div>

            {/* 우측 액션 */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">메인으로</span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* ── 사이드바는 layout에서 AdminSidebar를 따로 렌더링 ─────────────── */}
    </>
  )
}

/**
 * 어드민 사이드바 (클라이언트 컴포넌트)
 */
export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-background border-r border-foreground/10 min-h-[calc(100vh-65px)] p-3">
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-foreground/8 text-foreground border border-foreground/10'
                  : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground',
              ].join(' ')}
            >
              <Icon
                className={[
                  'w-4 h-4 transition-transform group-hover:scale-110',
                  isActive ? 'text-foreground' : 'text-foreground/50',
                ].join(' ')}
              />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
