import type { Metadata } from "next";
import "./globals.css";
import { JotaiProvider } from "@/src/components/providers/JotaiProvider";

export const metadata: Metadata = {
  title: "Dev Log Portfolio",
  description: "개발 블로그 포트폴리오",
};

/**
 * 루트 레이아웃
 *
 * 공통 전역 패널 없이 깔끔한 구조를 유지합니다.
 * 관리자 기능(로그아웃 등)은 각 페이지에서 필요 시 개별 렌더링합니다.
 * /admin 경로는 별도의 AdminLayout이 담당합니다.
 * 
 * Jotai Provider를 통해 전역 상태 관리를 제공합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  );
}
