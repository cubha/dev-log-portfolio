'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

const NAV_ITEMS = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setIsMobileOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  if (pathname?.startsWith('/admin')) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 64,
          padding: '0 clamp(20px, 4vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--bg) 78%, transparent)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            letterSpacing: '0.06em',
            fontWeight: 500,
            color: 'var(--fg)',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent-line)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          SILVER.DEV
        </Link>

        {/* Desktop nav */}
        <nav style={{ alignItems: 'center', gap: 30, fontSize: 13 }} className="hidden md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/blog'
              ? pathname?.startsWith('/blog')
              : pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
                  backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
                  borderRadius: 4,
                  textDecoration: 'none',
                  padding: '4px 8px',
                  transition: 'color .15s, background-color .15s',
                }}
                className="nav-link"
              >
                {item.label}
              </Link>
            )
          })}

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="테마 전환"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--fg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 14,
                transition: 'color .15s, border-color .15s',
              }}
            >
              {isDark ? '☾' : '☀'}
            </button>
          )}
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="테마 전환"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--fg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              {isDark ? '☾' : '☀'}
            </button>
          )}
          <button
            onClick={() => setIsMobileOpen((p) => !p)}
            aria-label={isMobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            style={{
              width: 34,
              height: 34,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--fg-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span style={{ width: 16, height: 1.5, background: 'var(--fg-muted)', display: 'block', transition: 'transform .2s', transform: isMobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ width: 16, height: 1.5, background: 'var(--fg-muted)', display: 'block', opacity: isMobileOpen ? 0 : 1, transition: 'opacity .2s' }} />
            <span style={{ width: 16, height: 1.5, background: 'var(--fg-muted)', display: 'block', transition: 'transform .2s', transform: isMobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <>
          <div
            onClick={() => setIsMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 60,
              width: 260,
              background: 'var(--bg)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              padding: '80px 32px 32px',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === '/blog'
                  ? pathname?.startsWith('/blog')
                  : pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
                      backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
                      textDecoration: 'none',
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      transition: 'color .15s, background-color .15s',
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div
              style={{
                marginTop: 'auto',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.1em',
                color: 'var(--fg-subtle)',
              }}
            >
              © 2026 SILVER.DEV
            </div>
          </div>
        </>
      )}
    </>
  )
}
