import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/src/types/supabase'

/**
 * 미들웨어 전용 Supabase 클라이언트 및 세션/권한 검증 함수
 *
 * Supabase JWT 토큰을 기반으로 세션을 갱신하고,
 * profiles 테이블에서 실제 role을 검증합니다.
 *
 * @param {NextRequest} request - Next.js 요청 객체
 * @returns {Promise<NextResponse>} 권한 검증이 완료된 응답 객체
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --------------------------------------------------
  // 1. 미들웨어 전용 Supabase 클라이언트 생성
  // --------------------------------------------------
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 요청 쿠키 업데이트
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          // 응답 객체를 새로 생성하여 쿠키 반영
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // --------------------------------------------------
  // 2. JWT 토큰 검증 — Supabase 서버에서 실제 유저 확인
  //    (getUser()는 JWT를 서버에서 검증하므로 위변조가 불가능)
  // --------------------------------------------------
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // --------------------------------------------------
  // 3. 비로그인 상태 처리 (정방향 가드)
  //    - /login 페이지는 예외 (무한 리다이렉트 방지)
  //    - /admin 경로에 비로그인 접근 시 /login으로 리다이렉트
  // --------------------------------------------------
  if (!user) {
    // /login은 예외 (로그인 페이지 자체는 접근 허용)
    if (pathname === '/login') {
      console.log(`🌍 [Auth Guard] Path: ${pathname} | Role: 없음 | Status: 승인 (로그인 페이지)`)
      return supabaseResponse
    }

    // /admin 경로에 비로그인 접근 → 로그인으로
    console.log(`🚫 [Auth Guard] Path: ${pathname} | Role: 없음 | Status: 거부 → /login`)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'no_session')
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // --------------------------------------------------
  // 3-1. 역방향 가드 — 이미 로그인한 유저가 /login 접근 시 메인으로
  //      중복 로그인을 방지합니다.
  // --------------------------------------------------
  if (pathname === '/login') {
    console.log(`🔄 [Auth Guard] Path: /login | Status: 이미 로그인됨 → /`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // --------------------------------------------------
  // 4. 로그인 유저의 role 확인 — profiles 테이블에서 조회
  //    (JWT만으로는 role을 알 수 없으므로 DB에서 직접 확인)
  // --------------------------------------------------
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role || 'user'

  // --------------------------------------------------
  // 5. 권한 검사 — 관리자 <--> 나머지 분리
  //    - 관리자(admin): /admin/* 경로 접근 허용
  //    - 관리자 외(일반 유저, 기타): /admin/* 접근 시 메인(/)으로 리다이렉트
  // --------------------------------------------------
  if (userRole === 'admin') {
    // 관리자: 모든 /admin/* 경로 접근 허용
    console.log(`✅ [Auth Guard] Path: ${pathname} | Role: admin | Status: 승인`)
    return supabaseResponse
  } else {
    // 관리자 외: /admin/* 경로 접근 차단 → 메인으로 리다이렉트
    console.log(`⛔ [Auth Guard] Path: ${pathname} | Role: ${userRole} | Status: 거부 → /`)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
