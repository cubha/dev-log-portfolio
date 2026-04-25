'use client'

import { useEffect, useState } from 'react'

type SpotifyResponse =
  | { isPlaying: true; title: string; artist: string; albumImageUrl: string; songUrl: string }
  | { isPlaying: false }

type GitHubResponse = {
  totalCommits: number
  repos: { name: string; commits: number }[]
  lastActiveDate: string | null
}

function formatNowKST(): string {
  return new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).replace(/\. /g, '.').replace('.', '').replace(', ', ' ')
}

export function LiveStatusWidget() {
  const [spotify, setSpotify] = useState<SpotifyResponse | null>(null)
  const [github, setGithub] = useState<GitHubResponse | null>(null)

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing')
        setSpotify((await res.json()) as SpotifyResponse)
      } catch {
        setSpotify({ isPlaying: false })
      }
    }
    fetchSpotify()
    const id = setInterval(fetchSpotify, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    fetch('/api/github/stats')
      .then((r) => r.json())
      .then((j: GitHubResponse) => setGithub(j))
      .catch(() => {})
  }, [])

  const spotifyText = spotify === null
    ? null
    : spotify.isPlaying
      ? `♪ ${spotify.artist} - ${spotify.title}`
      : '♪ Spotify offline'

  const githubText = github !== null
    ? `최근 30일 ${github.totalCommits}회 커밋`
    : null

  const summaryLine = [spotifyText, githubText].filter(Boolean).join(' · ')

  return (
    <div>
      {/* 온라인 상태 행 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#22C55E',
          boxShadow: '0 0 8px rgba(34,197,94,0.6)',
          flexShrink: 0,
        }} />
        <span className="sv-mono" style={{ fontSize: 13, color: 'var(--fg)' }}>
          ONLINE &nbsp;·&nbsp; {formatNowKST()} KST
        </span>
      </div>

      {/* 요약 행: Spotify + 커밋 수 */}
      {summaryLine ? (
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>
          {summaryLine}
        </p>
      ) : (
        <div className="skeleton" style={{ height: 13, width: '70%', marginBottom: 16 }} />
      )}

      {/* 레포 목록 */}
      {github === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[80, 70, 60, 65, 55].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 13, width: `${w}%` }} />
          ))}
        </div>
      ) : github.repos.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {github.repos.slice(0, 5).map((repo) => (
            <div key={repo.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span className="sv-mono text-muted" style={{ fontSize: 13 }}>{repo.name}</span>
              <span className="sv-mono text-subtle" style={{ fontSize: 13 }}>{repo.commits}회</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
