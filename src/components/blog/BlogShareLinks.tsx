'use client'

import { useState, useEffect } from 'react'

export function BlogShareLinks({ title }: { title: string }) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { setUrl(window.location.href) }, [])

  const handleCopy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const twitterUrl = url
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    : '#'

  return (
    <div className="sv-mono" style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
        → Twitter
      </a>
      <button
        type="button"
        onClick={handleCopy}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit' }}
      >
        {copied ? '✓ Copied' : '→ Copy link'}
      </button>
    </div>
  )
}
