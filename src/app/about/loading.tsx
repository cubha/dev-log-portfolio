/**
 * About 페이지 로딩 UI
 */
export default function AboutLoading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col items-center py-16">
        <div className="w-80 h-80 rounded-full bg-foreground/10 mb-12" />
        <div className="h-6 w-48 bg-foreground/10 rounded mb-4" />
        <div className="h-4 w-72 bg-foreground/8 rounded" />
      </div>
      <div className="space-y-6 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-foreground/8 rounded-xl" />
        ))}
      </div>
    </main>
  )
}
