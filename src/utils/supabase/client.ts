import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/src/types/supabase'

/**
 * 클라이언트 컴포넌트에서 사용할 Supabase 클라이언트
 *
 * 브라우저 환경에서 실행되며, localStorage를 통해 세션을 관리합니다.
 * Database 타입이 주입되어 TypeScript의 자동 완성과 타입 안정성을 제공합니다.
 *
 * @returns {SupabaseClient<Database>} Supabase 클라이언트 인스턴스
 *
 * @example
 * ```tsx
 * 'use client'
 * import { createClient } from '@/src/utils/supabase/client'
 *
 * export function ClientComponent() {
 *   const supabase = createClient()
 *   // Storage API 사용 가능
 *   await supabase.storage.from('bucket').upload('path', file)
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
