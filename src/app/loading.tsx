/**
 * 루트 로딩 UI (홈 등)
 * 첫 진입 시 즉시 표시되어 체감 속도 개선
 */
export default function RootLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-12 pb-16 md:pt-14 md:pb-12 animate-pulse">
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center px-4">
        <div className="h-6 w-64 bg-foreground/10 rounded mb-10" />
        <div className="h-16 w-48 bg-foreground/10 rounded mb-12" />
        <div className="h-4 w-32 bg-foreground/8 rounded" />
      </div>
    </main>
  )
}
