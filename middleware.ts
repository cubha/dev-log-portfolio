import { type NextRequest } from 'next/server'
import { updateSession } from '@/src/utils/supabase/middleware'

/**
 * Next.js 미들웨어
 * 
 * 모든 요청에 대해 Supabase 세션을 자동으로 갱신합니다.
 * 이 미들웨어는 만료된 인증 토큰을 자동으로 갱신하여
 * 사용자 세션이 끊기지 않도록 보장합니다.
 * 
 * @param {NextRequest} request - Next.js 요청 객체
 * @returns {Promise<NextResponse>} 세션이 갱신된 응답 객체
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * 미들웨어가 실행될 경로 패턴 설정
 * 
 * 정적 파일과 이미지 파일은 제외하여 성능을 최적화합니다.
 */
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청 경로와 일치:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     * - public 폴더의 이미지 파일들 (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
