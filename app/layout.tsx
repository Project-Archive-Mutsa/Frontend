import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import SiteHeader from "@/shared/components/site-header/site-header";
import "./globals.css";
import Providers from "./providers";

const notoSansKr = Noto_Sans_KR({
  display: "swap",
  preload: false,
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Project Archive | 프로젝트의 다음 가능성을 찾다",
  description:
    "과거 프로젝트와 아이디어를 탐색하고, 중단된 프로젝트의 새로운 가능성을 발견하는 AI 프로젝트 아카이브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full scroll-smooth antialiased">
      <body
        className={`${notoSansKr.className} flex min-h-full flex-col bg-slate-50 text-slate-900`}
      >
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
