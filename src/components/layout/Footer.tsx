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
        padding: '20px clamp(20px, 4.4vw, 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        fontSize: 12,
        color: 'var(--fg-muted)',
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.04em',
      }}
    >
      {/* Left: brand + location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--color-success)',
            boxShadow: '0 0 6px var(--color-success-glow)',
            flexShrink: 0,
            display: 'inline-block',
          }}
        />
        <span style={{ color: 'var(--fg)', fontWeight: 500 }}>SILVER.DEV</span>
        <span style={{ color: 'var(--fg-subtle)' }}>·</span>
        <span style={{ color: 'var(--fg-subtle)' }}>Seoul, KR</span>
      </div>

      {/* Right: nav links + copyright */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
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
              style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          )
        )}
        <span style={{ color: 'var(--fg-subtle)' }}>·</span>
        <span style={{ color: 'var(--fg-subtle)' }}>© 2026</span>
      </div>
    </footer>
  )
}
