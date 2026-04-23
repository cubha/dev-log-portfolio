'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return null

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'clamp(40px, 5vw, 56px) clamp(20px, 4.4vw, 64px) 32px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        fontSize: 13,
        color: 'var(--fg-muted)',
      }}
    >
      {/* Left: brand + contact */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--color-success)',
              boxShadow: '0 0 8px var(--color-success-glow)',
              flexShrink: 0,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              letterSpacing: '0.06em',
              fontWeight: 500,
              color: 'var(--fg)',
            }}
          >
            SILVER.DEV
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
          Seoul, KR · cubha@naver.com
        </div>
      </div>

      {/* Right: links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          gap: 28,
        }}
      >
        {[
          { href: '/about', label: 'About' },
          { href: '/contact', label: 'Contact' },
          { href: 'https://github.com/cubha', label: 'GitHub ↗', external: true },
        ].map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--fg-muted)', textDecoration: 'none', transition: 'color .15s' }}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: 'var(--fg-muted)', textDecoration: 'none', transition: 'color .15s' }}
            >
              {link.label}
            </Link>
          )
        )}
      </div>

      {/* Bottom: copyright row */}
      <div
        style={{
          gridColumn: '1 / -1',
          paddingTop: 28,
          marginTop: 16,
          borderTop: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--fg-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.06em',
        }}
      >
        <span>© 2026 SILVER.DEV</span>
        <span>BUILT WITH NEXT.JS 15 · SUPABASE · TYPESCRIPT</span>
      </div>
    </footer>
  )
}
