import type { Metadata } from "next";
import "./globals.css";
import { JotaiProvider } from "@/src/components/providers/JotaiProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dev Log Portfolio",
  description: "개발 블로그 포트폴리오",
};

/**
 * 루트 레이아웃
 *
 * 전역 헤더 네비게이션을 포함합니다.
 * 관리자 기능(로그아웃 등)은 각 페이지에서 필요 시 개별 렌더링합니다.
 * /admin 경로는 별도의 AdminLayout이 담당합니다.
 *
 * Jotai Provider를 통해 전역 상태 관리를 제공합니다.
 * Toaster를 통해 전역 토스트 알림을 제공합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* font-sans: tailwind.config.ts에서 Pretendard로 설정된 기본 폰트 적용 */}
      <body className="font-sans antialiased">
        <JotaiProvider>
          {children}
        </JotaiProvider>
        {/* 전역 토스트 알림 (sonner) */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
