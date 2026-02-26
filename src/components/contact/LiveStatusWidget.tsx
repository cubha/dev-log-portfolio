'use client'

import { useEffect, useState } from 'react'
import { THEME_CARD_CLASS } from '@/src/components/common/ThemeCard'

// API 응답 타입 (route.ts 반환 형식에 맞춤)
type SpotifyResponse =
  | { isPlaying: true; title: string; artist: string; albumImageUrl: string; songUrl: string }
  | { isPlaying: false }

type GitHubResponse = {
  totalCommits: number
  topRepo: string | null
  lastActiveDate: string | null
}

function SpotifyStatus() {
  const [data, setData] = useState<SpotifyResponse | null>(null)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing')
        const json = (await res.json()) as SpotifyResponse
        setData(json)
      } catch {
        setData({ isPlaying: false })
      }
    }

    fetchNowPlaying()
    const id = setInterval(fetchNowPlaying, 30_000)
    return () => clearInterval(id)
  }, [])

  if (data === null) {
    return (
      <div className="flex items-center gap-2 text-foreground/60">
        <span>🎵</span>
        <span className="h-4 w-32 animate-pulse rounded bg-foreground/10" />
      </div>
    )
  }

  const text = data.isPlaying
    ? `${data.artist} - ${data.title}`
    : 'Spotify 오프라인'

  return (
    <div className="text-foreground/70 truncate" title={text}>
      🎵 {text}
    </div>
  )
}

function GitHubStatus() {
  const [data, setData] = useState<GitHubResponse | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/github/stats')
      .then((res) => res.json())
      .then((json: GitHubResponse) => setData(json))
      .catch(() => setError(true))
  }, [])

  if (error || data === null) return null

  const parts = [`최근 30일 ${data.totalCommits}회 커밋`]
  if (data.topRepo) parts.push(`· ${data.topRepo}`)

  return (
    <div className="text-foreground/70 truncate" title={parts.join(' ')}>
      💻 {parts.join(' ')}
    </div>
  )
}

export function LiveStatusWidget() {
  return (
    <div className={`${THEME_CARD_CLASS} p-4`}>
      <div className="flex items-center justify-between gap-2 border-b border-foreground/5 pb-2">
        <span className="text-sm font-medium text-foreground/80">
          Live Status
        </span>
        <span
          className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500 animate-pulse"
          aria-hidden
        />
      </div>
      <div className="mt-2 flex flex-col gap-1.5 text-sm">
        <SpotifyStatus />
        <GitHubStatus />
      </div>
    </div>
  )
}
