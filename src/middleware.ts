import { type NextRequest } from 'next/server'
import { updateSession } from '@/src/utils/supabase/middleware'

/**
 * Next.js 15 전역 미들웨어
 *
 * Supabase Auth의 JWT 세션을 기반으로 인증 및 권한을 검증합니다.
 *
 * 검증 흐름:
 *   1. supabase.auth.getUser()로 JWT 서버 검증 (위변조 불가)
 *   2. profiles 테이블에서 실제 role 조회
 *   3. 정방향 가드: 비로그인 시 /admin 경로 차단 → /login
 *   4. 역방향 가드: 로그인 상태에서 /login 접근 → / (중복 로그인 방지)
 *   5. role이 'admin'이 아니면 /admin 경로 차단 → /
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
 * /admin 하위 경로를 명시적으로 포함하여 감시를 놓치지 않습니다.
 * 정적 파일, 이미지, 시스템 경로는 제외하여 성능을 최적화합니다.
 */
export const config = {
  matcher: [
    // /admin 하위 모든 경로 (명시적 감시)
    '/admin/:path*',
    // 나머지 동적 경로 (정적 파일 제외)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
