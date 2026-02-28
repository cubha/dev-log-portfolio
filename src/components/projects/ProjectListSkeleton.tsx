/**
 * 프로젝트 리스트 로딩 스켈레톤
 *
 * Grid 레이아웃 형태로 스켈레톤을 표시합니다.
 */
export function ProjectListSkeleton() {
  return (
    <div className="w-full">
      {/* 필터 바 스켈레톤 */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-16 bg-foreground/8 rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* 카드 Grid 스켈레톤 — 6개 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-foreground/10 overflow-hidden animate-pulse"
          >
            <div className="w-full aspect-video bg-foreground/8" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-foreground/8 rounded w-3/4" />
              <div className="h-4 bg-foreground/8 rounded w-full" />
              <div className="h-4 bg-foreground/8 rounded w-2/3" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-foreground/8 rounded-md" />
                <div className="h-6 w-16 bg-foreground/8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
