"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "프로젝트 탐색", href: "/projects" },
  { label: "AI 프로젝트 검색", href: "/search" },
  { label: "좀비 프로젝트", href: "/zombie-projects" },
  { label: "프로젝트 마켓", href: "/project-market" },
  { label: "팀원 모집", href: "/team-recruitment" },
];

export function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="order-4 mt-3 flex w-full items-center gap-x-6 overflow-x-auto border-t border-white/10 pt-3 text-xs font-medium whitespace-nowrap lg:order-none lg:mt-0 lg:w-auto lg:flex-1 lg:border-0 lg:pt-0"
    >
      {navigationItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-11 items-center border-b-2 px-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none ${
              isActive
                ? "border-white font-bold text-white"
                : "border-transparent text-[#d8e8f7] hover:border-white/40 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
