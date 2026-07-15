import { createClient } from '@/src/utils/supabase/server'

// Vercel Cron Job이 매일 호출해 Supabase Free tier 자동 pause를 방지합니다.
// pause 판정은 주간 DB activity 볼륨 기준이라 read ping은 임계 미달 →
// keep_alive_ping RPC로 write를 남긴다 (source='vercel', GH Actions 이중망과 구분).
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('keep_alive_ping', { src: 'vercel' })
    if (error) throw error
    return Response.json({ ok: true, pingedAt: data, timestamp: new Date().toISOString() })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
