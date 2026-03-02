/**
 * GitHub 최근 30일 커밋 통계 조회 (GraphQL — Private 포함)
 * GET /api/github/stats
 */

const MS_30_DAYS = 30 * 24 * 60 * 60 * 1000

type ContributionByRepo = {
  repository: { nameWithOwner: string }
  contributions: { totalCount: number }
}

type GitHubGraphQLResponse = {
  data?: {
    viewer?: {
      contributionsCollection?: {
        totalCommitContributions?: number
        commitContributionsByRepository?: ContributionByRepo[]
      }
    }
  }
}

const GRAPHQL_QUERY = `
  query ($from: DateTime!, $to: DateTime!) {
    viewer {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
          }
          contributions {
            totalCount
          }
        }
      }
    }
  }
`

export async function GET() {
  const headers = new Headers()
  headers.set('Cache-Control', 'max-age=3600')

  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return Response.json(
      { totalCommits: 0, repos: [], lastActiveDate: null },
      { headers }
    )
  }

  const to = new Date().toISOString()
  const from = new Date(Date.now() - MS_30_DAYS).toISOString()

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { from, to } }),
  }).catch(() => null)

  if (!res?.ok) {
    return Response.json(
      { totalCommits: 0, repos: [], lastActiveDate: null },
      { headers }
    )
  }

  const json = (await res.json()) as GitHubGraphQLResponse
  const collection = json.data?.viewer?.contributionsCollection

  if (!collection) {
    return Response.json(
      { totalCommits: 0, repos: [], lastActiveDate: null },
      { headers }
    )
  }

  const totalCommits = collection.totalCommitContributions ?? 0

  const rawRepos = collection.commitContributionsByRepository ?? []
  const repos = rawRepos
    .filter((r) => (r.contributions?.totalCount ?? 0) > 0)
    .map((r) => ({
      name: r.repository.nameWithOwner,
      commits: r.contributions?.totalCount ?? 0,
    }))
    .sort((a, b) => b.commits - a.commits)

  return Response.json(
    { totalCommits, repos, lastActiveDate: null },
    { headers }
  )
}
