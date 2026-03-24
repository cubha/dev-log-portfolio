/**
 * Spotify 현재 재생 중인 트랙 조회
 * GET /api/spotify/now-playing
 */
export async function GET() {
  const headers = new Headers()
  headers.set('Cache-Control', 'no-cache')

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    return Response.json({ isPlaying: false }, { headers })
  }

  // 1. access_token 갱신
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  }).catch(() => null)

  if (!tokenRes?.ok) {
    return Response.json({ isPlaying: false }, { headers })
  }

  const tokenData = (await tokenRes.json()) as {
    access_token?: string
  }
  const accessToken = tokenData?.access_token

  if (!accessToken) {
    return Response.json({ isPlaying: false }, { headers })
  }

  // 2. 현재 재생 중인 트랙 조회
  const playerRes = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  ).catch(() => null)

  if (!playerRes || playerRes.status === 204) {
    return Response.json({ isPlaying: false }, { headers })
  }

  if (!playerRes.ok) {
    return Response.json({ isPlaying: false }, { headers })
  }

  const data = (await playerRes.json()) as {
    is_playing?: boolean
    item?: {
      name?: string
      external_urls?: { spotify?: string }
      album?: { images?: Array<{ url?: string }> }
      artists?: Array<{ name?: string }>
    }
  }

  if (!data.is_playing || !data.item) {
    return Response.json({ isPlaying: false }, { headers })
  }

  const item = data.item
  const title = item.name ?? ''
  const artist = item.artists?.[0]?.name ?? ''
  const albumImageUrl = item.album?.images?.[0]?.url ?? ''
  const songUrl = item.external_urls?.spotify ?? ''

  return Response.json(
    {
      isPlaying: true,
      title,
      artist,
      albumImageUrl,
      songUrl,
    },
    { headers }
  )
}
