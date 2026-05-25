import { createClient } from '@/src/utils/supabase/server'

// Vercel Cron Job이 3일마다 호출해 Supabase Free tier 자동 pause를 방지합니다.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('blog_posts').select('id').limit(1)
    if (error) throw error
    return Response.json({ ok: true, timestamp: new Date().toISOString() })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
