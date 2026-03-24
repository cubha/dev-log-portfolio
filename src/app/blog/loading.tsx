export default function BlogLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* 헤더 스켈레톤 */}
      <div className="mb-6">
        <div className="h-8 w-24 bg-foreground/10 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-foreground/8 rounded animate-pulse" />
      </div>
      {/* 검색바 스켈레톤 */}
      <div className="h-10 w-full bg-foreground/8 rounded-xl animate-pulse mb-4" />
      {/* 태그 스켈레톤 */}
      <div className="flex gap-2 mb-8">
        {[48, 56, 64, 52].map((w, i) => (
          <div
            key={i}
            className="h-7 rounded-full bg-foreground/8 animate-pulse"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
      {/* 카드 스켈레톤 */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 border border-foreground/10 rounded-xl animate-pulse"
          >
            <div className="h-5 w-3/4 bg-foreground/10 rounded mb-2" />
            <div className="h-4 w-full bg-foreground/8 rounded mb-1" />
            <div className="h-4 w-2/3 bg-foreground/8 rounded mb-4" />
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="h-5 w-14 bg-foreground/8 rounded-full" />
                <div className="h-5 w-16 bg-foreground/8 rounded-full" />
              </div>
              <div className="h-4 w-24 bg-foreground/8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
