import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import SiteHeader from "@/shared/components/site-header/site-header";
import "./globals.css";
import Providers from "./providers";

const notoSansKr = Noto_Sans_KR({
  display: "swap",
  preload: false,
  weight: "variable",
});

const notoSerifKr = Noto_Serif_KR({
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-kr",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Project Archive | 프로젝트의 다음 가능성을 찾다",
  description:
    "공모전·대회·해커톤·캡스톤 프로젝트를 탐색하고, AI 검색과 재활성화 기회를 연결하는 프로젝트 아카이브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKr.variable} h-full scroll-smooth antialiased`}
    >
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
