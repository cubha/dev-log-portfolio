import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/src/types/supabase'

/**
 * 서버 컴포넌트, 서버 액션, Route Handler에서 사용할 Supabase 클라이언트
 * 
 * Next.js 15에서는 cookies() 함수가 비동기이므로 await를 사용해야 합니다.
 * 이 클라이언트는 서버 사이드에서만 사용되며, 쿠키를 통해 세션을 관리합니다.
 * 
 * Database 타입이 주입되어 TypeScript의 자동 완성과 타입 안정성을 제공합니다.
 * 
 * @returns {Promise<SupabaseClient<Database>>} Supabase 서버 클라이언트 인스턴스
 * 
 * @example
 * ```tsx
 * // 서버 컴포넌트에서 사용
 * import { createClient } from '@/src/utils/supabase/server'
 * 
 * export default async function ServerComponent() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('posts').select('*')
 *   return <div>{...}</div>
 * }
 * ```
 */
export async function createClient() {
  // Next.js 15에서는 cookies()가 비동기 함수이므로 await 필수
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 모든 쿠키를 가져옵니다
        getAll() {
          return cookieStore.getAll()
        },
        // 쿠키를 설정합니다
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // 서버 액션에서 호출되는 경우 setAll이 실패할 수 있습니다.
            // 이는 정상적인 동작이며, 클라이언트에서 자동으로 처리됩니다.
            // 에러를 무시하고 계속 진행합니다.
          }
        },
      },
    }
  )
}
