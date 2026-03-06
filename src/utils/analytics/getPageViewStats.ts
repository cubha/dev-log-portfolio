import { createClient } from '@/src/utils/supabase/server'

export type DailyView = {
  date: string   // 'YYYY-MM-DD'
  count: number
}

export type PageRank = {
  path: string
  count: number
}

export type PageViewStats = {
  todayTotal: number
  weekTotal: number
  allTotal: number
  todayUnique: number
  last7Days: DailyView[]
  topPages: PageRank[]
}

export async function getPageViewStats(): Promise<PageViewStats> {
  const supabase = await createClient()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: allTotal },
    { count: todayTotal },
    { count: weekTotal },
    { data: todayVisitors },
    { data: last7Raw },
    { data: topPagesRaw },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart),
    supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart),
    supabase
      .from('page_views')
      .select('visitor_id')
      .gte('created_at', todayStart)
      .not('visitor_id', 'is', null),
    supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', weekStart)
      .order('created_at', { ascending: true }),
    supabase
      .from('page_views')
      .select('path')
      .gte('created_at', weekStart),
  ])

  // 오늘 유니크 방문자 수
  const todayUnique = new Set(todayVisitors?.map((r) => r.visitor_id) ?? []).size

  // 최근 7일 일별 집계
  const last7Days = buildLast7Days(last7Raw ?? [])

  // 인기 페이지 TOP 5
  const topPages = buildTopPages(topPagesRaw ?? [])

  return {
    allTotal: allTotal ?? 0,
    todayTotal: todayTotal ?? 0,
    weekTotal: weekTotal ?? 0,
    todayUnique,
    last7Days,
    topPages,
  }
}

function buildLast7Days(rows: { created_at: string }[]): DailyView[] {
  const now = new Date()
  const days: DailyView[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({ date, count: 0 })
  }

  for (const row of rows) {
    const date = row.created_at.slice(0, 10)
    const entry = days.find((d) => d.date === date)
    if (entry) entry.count++
  }

  return days
}

function buildTopPages(rows: { path: string }[]): PageRank[] {
  const map = new Map<string, number>()
  for (const row of rows) {
    map.set(row.path, (map.get(row.path) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}
