/** @type {import('next').NextConfig} */
const nextConfig = {
  watchOptions: {
    pollIntervalMs: 300,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  // self-host 폰트(/fonts/*)를 1년 immutable 캐시 → 2MB 재검증(304) 제거.
  // 주의: 파일명이 content-hash가 아니므로 폰트 교체 시 파일명을 바꿔야 캐시가 갱신된다.
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
