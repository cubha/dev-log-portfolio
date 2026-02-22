'use client'

/**
 * 프로젝트 리스트 로딩 스켈레톤
 */
export function ProjectListSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="mb-8">
        <div className="h-9 w-32 bg-foreground/10 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-foreground/8 rounded" />
      </div>
      <div className="flex gap-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-20 bg-foreground/10 rounded-full" />
        ))}
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[280px] rounded-xl border border-foreground/10 bg-card-surface overflow-hidden"
          >
            <div className="h-36 bg-foreground/10" />
            <div className="p-3.5 space-y-2">
              <div className="h-4 w-3/4 bg-foreground/10 rounded" />
              <div className="h-3 w-full bg-foreground/8 rounded" />
              <div className="h-3 w-1/2 bg-foreground/8 rounded" />
              <div className="flex gap-1 pt-2">
                <div className="h-5 w-12 bg-foreground/8 rounded" />
                <div className="h-5 w-14 bg-foreground/8 rounded" />
                <div className="h-5 w-10 bg-foreground/8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
