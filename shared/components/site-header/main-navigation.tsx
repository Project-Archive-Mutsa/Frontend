import Link from "next/link";

const navigationItems = [
  { label: "프로젝트 마켓", href: "/project-market" },
  { label: "중단 프로젝트", href: "/zombie-projects" },
  { label: "팀원 구하기", href: "/team-recruitment" },
];

export function MainNavigation() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="order-4 mt-3 flex w-full items-center gap-1 overflow-x-auto border-t border-white/10 pt-3 text-xs font-medium whitespace-nowrap lg:order-none lg:mt-0 lg:w-auto lg:border-0 lg:pt-0"
    >
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg px-3 py-2 text-[#d8e8f7] transition-colors hover:bg-white/10 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
