import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/src/types/supabase'

/**
 * 쿠키를 읽지 않는 공개 데이터 전용 Supabase 클라이언트.
 *
 * server.ts의 createClient는 쿠키 스토어를 읽으므로, 이를 사용하는 페이지는
 * Next.js가 동적 렌더링으로 강제 전환해 ISR/CDN 캐시가 불가능해진다.
 * 이 클라이언트는 쿠키 스토어를 읽지 않으므로, 공개(RLS anon 허용) 데이터만
 * 조회하는 페이지는 revalidate 기반 ISR/CDN 캐시가 가능하다.
 *
 * 주의: 세션·인증이 필요한 조회에는 사용하지 말 것 (server.ts 사용).
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
    }
  )
}
