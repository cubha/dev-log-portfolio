import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'

const EXCLUDED_PREFIXES = ['/admin', '/login', '/api']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { path?: unknown; visitor_id?: unknown }
    const { path, visitor_id } = body

    if (typeof path !== 'string' || !path) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    // 추적 제외 경로
    if (EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      return NextResponse.json({ skipped: true }, { status: 200 })
    }

    const supabase = await createClient()

    await supabase.from('page_views').insert({
      path,
      visitor_id: typeof visitor_id === 'string' ? visitor_id : null,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
