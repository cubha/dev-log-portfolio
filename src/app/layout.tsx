import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Log Portfolio",
  description: "개발 블로그 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
