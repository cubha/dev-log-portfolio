import { type NextRequest } from 'next/server'
import { updateSession } from '@/src/utils/supabase/middleware'

/**
 * Next.js 15 전역 미들웨어
 *
 * Supabase Auth의 JWT 세션을 기반으로 인증 및 권한을 검증합니다.
 *
 * 보안 정책:
 *   - 루트(/)와 /projects는 공개 페이지로 미들웨어 검사 제외
 *   - /admin/:path* 및 /login 경로 감시하여 관리자 영역 보호
 *   - 비로그인 시 /admin 접근 → /login 리다이렉트
 *   - 로그인 상태에서 /login 접근 → / 리다이렉트 (역방향 가드)
 *   - role이 'admin'이 아닌 유저의 /admin 접근 → / 차단
 *
 * 모든 보안 로직은 src/utils/supabase/middleware.ts에 위임합니다.
 */
export async function middleware(request: NextRequest) {
  console.log('✅ Middleware is running on:', request.nextUrl.pathname)
  return await updateSession(request)
}

/**
 * 미들웨어 감시 대상 경로
 *
 * /admin 하위 경로와 /login 경로를 감시합니다.
 * 루트(/)와 /projects는 공개 페이지로 미들웨어 검사를 건너뜁니다.
 */
export const config = {
  matcher: [
    // /admin 하위 모든 경로 감시
    '/admin/:path*',
    // /login 경로 감시 (역방향 가드용)
    '/login',
  ],
}
