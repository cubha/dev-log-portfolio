import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 미들웨어에서 사용할 Supabase 세션 갱신 함수
 * 
 * 모든 요청에 대해 Supabase 세션을 확인하고 만료된 토큰을 자동으로 갱신합니다.
 * 이 함수는 Next.js 미들웨어에서 호출되어 쿠키를 통해 세션을 관리합니다.
 * 
 * @param {NextRequest} request - Next.js 요청 객체
 * @returns {Promise<NextResponse>} 업데이트된 응답 객체
 * 
 * @example
 * ```tsx
 * // middleware.ts에서 사용
 * import { updateSession } from '@/src/utils/supabase/middleware'
 * 
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request)
 * }
 * ```
 */
export async function updateSession(request: NextRequest) {
  // 초기 응답 객체 생성
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 미들웨어용 Supabase 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 요청에서 모든 쿠키를 가져옵니다
        getAll() {
          return request.cookies.getAll()
        },
        // 쿠키를 설정하고 응답에 반영합니다
        setAll(cookiesToSet) {
          // 먼저 요청 쿠키를 업데이트
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          // 새로운 응답 객체 생성
          supabaseResponse = NextResponse.next({
            request,
          })
          // 응답 쿠키에 설정 (옵션 포함)
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 세션을 갱신합니다. 만료된 토큰이 있으면 자동으로 갱신하고 쿠키를 업데이트합니다.
  // 이 호출은 쿠키를 통해 세션 상태를 확인하고 필요시 갱신합니다.
  await supabase.auth.getUser()

  return supabaseResponse
}
