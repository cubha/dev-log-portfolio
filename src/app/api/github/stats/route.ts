/**
 * GitHub 최근 30일 커밋 통계 조회
 * GET /api/github/stats
 */

const MS_30_DAYS = 30 * 24 * 60 * 60 * 1000

type GitHubEvent = {
  type?: string
  created_at?: string
  repo?: { name?: string }
  payload?: { size?: number }
}

export async function GET() {
  const headers = new Headers()
  headers.set('Cache-Control', 'max-age=3600')

  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME

  if (!token || !username) {
    return Response.json(
      { totalCommits: 0, topRepo: null, lastActiveDate: null },
      { headers }
    )
  }

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    }
  ).catch(() => null)

  if (!res?.ok) {
    return Response.json(
      { totalCommits: 0, topRepo: null, lastActiveDate: null },
      { headers }
    )
  }

  const events = (await res.json()) as GitHubEvent[]

  if (!Array.isArray(events)) {
    return Response.json(
      { totalCommits: 0, topRepo: null, lastActiveDate: null },
      { headers }
    )
  }

  const cutoff = new Date(Date.now() - MS_30_DAYS)
  const repoCounts: Record<string, number> = {}
  let totalCommits = 0
  let lastActiveDate: string | null = null

  for (const event of events) {
    if (event.type !== 'PushEvent') continue

    const createdAt = event.created_at ? new Date(event.created_at) : null
    if (createdAt && createdAt < cutoff) continue

    const size = event.payload?.size ?? 0
    totalCommits += size

    const repoName = event.repo?.name ?? ''
    if (repoName) {
      repoCounts[repoName] = (repoCounts[repoName] ?? 0) + size
    }

    if (event.created_at) {
      if (
        !lastActiveDate ||
        new Date(event.created_at) > new Date(lastActiveDate)
      ) {
        lastActiveDate = event.created_at
      }
    }
  }

  const topRepo =
    Object.keys(repoCounts).length > 0
      ? Object.entries(repoCounts).reduce((a, b) =>
          a[1] >= b[1] ? a : b
        )[0]
      : null

  return Response.json(
    {
      totalCommits,
      topRepo,
      lastActiveDate,
    },
    { headers }
  )
}
