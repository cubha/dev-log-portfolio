'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/src/types/supabase'

/**
 * 클라이언트 컴포넌트에서 사용할 Supabase 브라우저 클라이언트
 * 
 * 'use client' 지시어를 사용하여 클라이언트 번들에 포함됩니다.
 * 브라우저 환경에서 실행되며, 로컬 스토리지와 쿠키를 모두 사용합니다.
 * 
 * Database 타입이 주입되어 TypeScript의 자동 완성과 타입 안정성을 제공합니다.
 * 
 * @returns {SupabaseClient<Database>} Supabase 브라우저 클라이언트 인스턴스
 * 
 * @example
 * ```tsx
 * 'use client'
 * import { createClient } from '@/src/utils/supabase/client'
 * 
 * export default function ClientComponent() {
 *   const supabase = createClient()
 *   // 클라이언트 사이드 로직...
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
