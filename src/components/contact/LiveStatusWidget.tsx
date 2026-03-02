'use client'

import { useEffect, useState } from 'react'
import { THEME_CARD_CLASS } from '@/src/components/common/ThemeCard'

// API 응답 타입 (route.ts 반환 형식에 맞춤)
type SpotifyResponse =
  | { isPlaying: true; title: string; artist: string; albumImageUrl: string; songUrl: string }
  | { isPlaying: false }

type GitHubResponse = {
  totalCommits: number
  repos: { name: string; commits: number }[]
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

  useEffect(() => {
    fetch('/api/github/stats')
      .then((res) => res.json())
      .then((json: GitHubResponse) => setData(json))
      .catch(() => {})
  }, [])

  // 로딩 스켈레톤 (API 호출 중): min-h 동기화로 CLS 방지
  if (data === null) {
    return (
      <div className="flex flex-col gap-1 min-h-[5.5rem]">
        <div className="h-4 w-40 animate-pulse rounded bg-foreground/10" />
        <div className="min-h-[5.5rem] flex flex-col gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-3 w-full max-w-[90%] animate-pulse rounded bg-foreground/10"
            />
          ))}
        </div>
      </div>
    )
  }

  if (data.repos.length === 0) return null

  const displayedRepos = data.repos.slice(0, 5)

  return (
    <div className="flex flex-col gap-1">
      <div className="text-foreground/80 text-sm font-medium">
        💻 최근 30일 {data.totalCommits}회 커밋
      </div>
      <div className="min-h-[5.5rem] flex flex-col gap-1">
        {displayedRepos.map((repo) => (
          <div
            key={repo.name}
            className="flex items-center justify-between gap-2 pl-1"
          >
            <span className="text-foreground/65 text-xs truncate">
              · {repo.name}
            </span>
            <span className="text-foreground/50 text-xs flex-shrink-0">
              {repo.commits}회
            </span>
          </div>
        ))}
      </div>
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
      <div className="mt-2 flex flex-col gap-1.5 text-sm min-h-[9rem]">
        <SpotifyStatus />
        <GitHubStatus />
      </div>
    </div>
  )
}
