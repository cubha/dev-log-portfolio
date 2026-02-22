/**
 * Contact 페이지 로딩 UI
 */
export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 animate-pulse">
        <div className="h-9 w-32 mx-auto mb-10 bg-foreground/10 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="h-64 bg-foreground/8 rounded-xl" />
          <div className="h-64 bg-foreground/8 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
