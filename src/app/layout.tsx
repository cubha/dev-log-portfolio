import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { JotaiProvider } from "@/src/components/providers/JotaiProvider";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";
import { DynamicToaster } from "@/src/components/common/DynamicToaster";
import { ScrollToTop } from "@/src/components/common/ScrollToTop"
import { PageViewTracker } from "@/src/components/common/PageViewTracker";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { TopProgressBar } from "@/src/components/common/TopProgressBar";

export const metadata: Metadata = {
  title: "Silver.dev — Dev Log Portfolio",
  description: "Next.js & Supabase 기반 개발 포트폴리오 — 프로젝트, 기술 아티클, 이력을 담았습니다.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * 루트 레이아웃
 *
 * - Header: sticky GNB (admin 경로에서는 내부적으로 숨김 처리)
 * - Footer: 전역 하단 영역 (admin 경로에서는 내부적으로 숨김 처리)
 * - flex-col + flex-1 구조로 Footer를 항상 하단에 배치
 * - JotaiProvider: 전역 상태 관리
 * - Toaster: 전역 토스트 알림 (sonner)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes가 class 속성을 클라이언트에서 주입하므로 필수
    <html lang="ko" suppressHydrationWarning>
      {/* font-sans: tailwind.config.ts에서 Pretendard로 설정된 기본 폰트 적용 */}
      <body className="font-sans antialiased min-h-screen flex flex-col text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JotaiProvider>
            <Suspense fallback={null}>
              <TopProgressBar />
            </Suspense>
            <PageViewTracker />
            <ScrollToTop />
            {/* sticky 헤더: /admin 경로에서는 컴포넌트 내부에서 null 반환 */}
            <Header />

            {/* 페이지 본문: flex-1 + min-h-0, loading.tsx로 첫 진입 체감 속도 개선 */}
            <div className="flex-1 min-h-0">
              {children}
            </div>

            {/* 전역 푸터: /admin 경로에서는 컴포넌트 내부에서 null 반환 */}
            <Footer />
          </JotaiProvider>

          {/* 전역 토스트 알림 (dynamic import로 초기 번들 최소화) */}
          <DynamicToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
