import type { Metadata } from "next";
import { Geist } from "next/font/google";
import SiteHeader from "@/shared/components/site-header/site-header";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  subsets: ["latin"],
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
        className={`${geistSans.className} flex min-h-full flex-col bg-[#f8fbff] text-[#102a43]`}
      >
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
