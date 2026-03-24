import { createClient } from '@/src/utils/supabase/server'
import { getPageViewStats, type PageViewStats, type DailyView, type PageRank } from '@/src/utils/analytics/getPageViewStats'
import { FolderKanban, Code2, TrendingUp, ArrowRight, User } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  try {
    const supabase = await createClient()

    const [
      { count: projectsCount },
      { count: skillsCount },
      { count: featuredCount },
      stats,
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      getPageViewStats(),
    ])

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">대시보드</h1>
          <p className="text-foreground/60">포트폴리오 관리 현황을 한눈에 확인하세요</p>
        </div>

        {/* 콘텐츠 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="전체 프로젝트"
            value={projectsCount ?? 0}
            icon={<FolderKanban className="w-8 h-8" />}
            color="blue"
            description="등록된 프로젝트"
          />
          <StatCard
            title="기술 스택"
            value={skillsCount ?? 0}
            icon={<Code2 className="w-8 h-8" />}
            color="purple"
            description="보유 기술"
          />
          <StatCard
            title="주요 프로젝트"
            value={featuredCount ?? 0}
            icon={<TrendingUp className="w-8 h-8" />}
            color="green"
            description="Featured 프로젝트"
          />
        </div>

        {/* 방문자 분석 통합 카드 */}
        <VisitorAnalyticsCard stats={stats} />

        {/* 빠른 액션 */}
        <div className="mt-6 bg-background rounded-xl border border-foreground/10 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">빠른 액션</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction href="/admin/projects?mode=new" icon={<FolderKanban className="w-5 h-5 text-white dark:text-slate-950" />} title="프로젝트 관리" desc="프로젝트 추가 및 수정" />
            <QuickAction href="/admin/skills" icon={<Code2 className="w-5 h-5 text-white dark:text-slate-950" />} title="기술 스택 관리" desc="기술 스택 추가 및 수정" />
            <QuickAction href="/admin/profile" icon={<User className="w-5 h-5 text-white dark:text-slate-950" />} title="프로필 관리" desc="About 프로필 편집" />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('대시보드 데이터 로딩 오류:', error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600 font-semibold">데이터를 불러올 수 없습니다.</p>
      </div>
    )
  }
}

// ─────────────────────────────────────────────
// VisitorAnalyticsCard — 통합 방문자 분석 패널
// ─────────────────────────────────────────────

function VisitorAnalyticsCard({ stats }: { stats: PageViewStats }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-foreground/[0.08] bg-foreground/[0.02] shadow-sm">

      {/* ① 상단 accent gradient 라인 */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent" />

      {/* ② 헤더 */}
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          {/* 라이브 펄싱 도트 */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-[10px] font-bold tracking-[0.22em] text-foreground/40 uppercase select-none">
            Visitor Analytics
          </span>
        </div>
        <span className="text-[10px] text-foreground/25 tracking-wider tabular-nums">
          UTC+9 · 실시간
        </span>
      </div>

      {/* ③ 핵심 수치 — 3열 */}
      <div className="grid grid-cols-3 border-t border-foreground/[0.07]">
        <MetricCell
          label="오늘 방문"
          value={stats.todayTotal}
          sub={`유니크 ${stats.todayUnique}명`}
          accent
        />
        <MetricCell
          label="이번 주"
          value={stats.weekTotal}
          sub="7일 페이지뷰"
          bordered
        />
        <MetricCell
          label="누적 합계"
          value={stats.allTotal}
          sub="전체 페이지뷰"
        />
      </div>

      {/* ④ 차트 + 인기페이지 */}
      <div className="grid grid-cols-1 md:grid-cols-5 border-t border-foreground/[0.07]">
        <div className="md:col-span-3 p-5 md:border-r border-b md:border-b-0 border-foreground/[0.07]">
          <SectionLabel>Daily Views — 최근 7일</SectionLabel>
          <VisitBarChart data={stats.last7Days} />
        </div>
        <div className="md:col-span-2 p-5">
          <SectionLabel>Top Pages — 이번 주</SectionLabel>
          <TopPagesList pages={stats.topPages} />
        </div>
      </div>

    </div>
  )
}

// ─── 내부 소형 컴포넌트 ───

function MetricCell({
  label,
  value,
  sub,
  accent = false,
  bordered = false,
}: {
  label: string
  value: number
  sub: string
  accent?: boolean
  bordered?: boolean
}) {
  return (
    <div
      className={[
        'px-6 py-5 space-y-0.5',
        bordered ? 'border-x border-foreground/[0.07]' : '',
      ].join(' ')}
    >
      <p className="text-[9px] font-bold tracking-[0.2em] text-foreground/35 uppercase mb-1.5">
        {label}
      </p>
      <p
        className={[
          'text-[2rem] leading-none font-extrabold tabular-nums transition-colors',
          accent ? 'text-brand-secondary' : 'text-foreground',
        ].join(' ')}
      >
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] text-foreground/35 pt-0.5">{sub}</p>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-bold tracking-[0.2em] text-foreground/30 uppercase mb-4 select-none">
      {children}
    </p>
  )
}

// ─────────────────────────────────────────────
// VisitBarChart — SVG 바차트
// viewBox를 충분히 넓게 설정해 스케일업으로 인한 바 비대화 방지
// ─────────────────────────────────────────────

function VisitBarChart({ data }: { data: DailyView[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)
  // viewBox를 넓게 고정 → 실제 렌더 너비(~360px)보다 커서 축소되어 바가 얇게 보임
  const VB_W = 560
  const VB_H = 64
  const LABEL_H = 18
  const TOTAL_H = VB_H + LABEL_H
  const slotW = VB_W / data.length   // 80px/slot
  const barW = 12
  const todayIdx = data.length - 1

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${VB_W} ${TOTAL_H}`}
        width="100%"
        height="72"
        aria-label="최근 7일 방문 추이"
      >
        <defs>
          {data.map((_, i) => {
            const isToday = i === todayIdx
            return (
              <linearGradient key={i} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isToday ? 'hsl(var(--brand-secondary))' : 'hsl(var(--foreground))'} stopOpacity={isToday ? 0.8 : 0.35} />
                <stop offset="100%" stopColor={isToday ? 'hsl(var(--brand-secondary))' : 'hsl(var(--foreground))'} stopOpacity={isToday ? 0.2 : 0.06} />
              </linearGradient>
            )
          })}
        </defs>

        {/* 베이스라인 */}
        <line x1={0} y1={VB_H} x2={VB_W} y2={VB_H} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />

        {data.map((d, i) => {
          const isToday = i === todayIdx
          const barH = d.count > 0 ? Math.max((d.count / maxCount) * (VB_H - 10), 4) : 0
          const slotCX = i * slotW + slotW / 2
          const barX = slotCX - barW / 2
          const barY = VB_H - barH
          const label = d.date.slice(5)

          return (
            <g key={d.date}>
              {/* 데이터 바 (값 없으면 미니 기준선 점) */}
              {barH > 0 ? (
                <rect x={barX} y={barY} width={barW} height={barH} rx={3} fill={`url(#g${i})`} />
              ) : (
                <rect x={slotCX - 2} y={VB_H - 2} width={4} height={2} rx={1} fill="currentColor" fillOpacity="0.12" />
              )}

              {/* count 레이블 */}
              {d.count > 0 && (
                <text
                  x={slotCX}
                  y={barY - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="currentColor"
                  fillOpacity={isToday ? 0.7 : 0.35}
                >
                  {d.count}
                </text>
              )}

              {/* 날짜 레이블 */}
              <text
                x={slotCX}
                y={VB_H + 13}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                fillOpacity={isToday ? 0.65 : 0.28}
                fontWeight={isToday ? '700' : '400'}
              >
                {isToday ? 'TODAY' : label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────
// TopPagesList — 인기 페이지 목록
// ─────────────────────────────────────────────

function TopPagesList({ pages }: { pages: PageRank[] }) {
  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-[11px] text-foreground/25 tracking-wider">데이터 없음</p>
      </div>
    )
  }

  const maxCount = Math.max(...pages.map((p) => p.count), 1)

  return (
    <ul className="space-y-3.5">
      {pages.map((page, i) => {
        const pct = Math.round((page.count / maxCount) * 100)
        const rankLabel = String(i + 1).padStart(2, '0')
        const pathLabel = page.path === '/' ? '홈' : page.path

        return (
          <li key={page.path}>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[9px] font-bold tabular-nums text-foreground/20 w-4 shrink-0 font-mono">
                {rankLabel}
              </span>
              <span
                className="text-[11px] font-medium text-foreground/70 truncate flex-1 min-w-0"
                title={page.path}
              >
                {pathLabel}
              </span>
              <span className="text-[11px] font-bold tabular-nums text-foreground/50 shrink-0">
                {page.count.toLocaleString()}
              </span>
            </div>
            {/* 프로그레스 바 */}
            <div className="h-[2px] bg-foreground/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-secondary/50 to-brand-secondary/20"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

// ─────────────────────────────────────────────
// StatCard — 콘텐츠 통계 카드
// ─────────────────────────────────────────────

function StatCard({
  title, value, icon, color, description,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'purple' | 'green'
  description: string
}) {
  const colorMap = {
    blue:   'text-brand-primary from-brand-primary/20 to-brand-primary/5',
    purple: 'text-brand-secondary from-brand-secondary/20 to-brand-secondary/5',
    green:  'text-green-500 from-green-500/20 to-green-500/5',
  }

  return (
    <div className="bg-background rounded-xl border border-foreground/10 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorMap[color]} rounded-lg`}>
          <div className={colorMap[color].split(' ')[0]}>{icon}</div>
        </div>
      </div>
      <p className="text-foreground/60 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-foreground/50 text-xs">{description}</p>
    </div>
  )
}

// ─────────────────────────────────────────────
// QuickAction — 빠른 액션 링크
// ─────────────────────────────────────────────

function QuickAction({
  href, icon, title, desc,
}: {
  href: string
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between p-4 bg-foreground/3 hover:bg-foreground/5 border border-foreground/10 hover:border-foreground/20 rounded-lg transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-silver-metal rounded-lg">{icon}</div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-foreground/50">{desc}</p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
    </Link>
  )
}
