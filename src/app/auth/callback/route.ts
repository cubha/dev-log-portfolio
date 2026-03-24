import { NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'

/**
 * GitHub OAuth 코드 교환 Route Handler
 * GET /auth/callback?code=xxx&next=/contact
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const nextUrl = searchParams.get('next') ?? '/contact'

  if (!code) {
    return NextResponse.redirect(new URL('/contact?error=oauth', request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/contact?error=oauth', request.url))
  }

  return NextResponse.redirect(new URL(nextUrl, request.url))
}
