import Link from "next/link";

const navigationItems = [
  { label: "아이디어 마켓", href: "/project-market" },
  { label: "좀비 프로젝트", href: "/zombie-projects" },
  { label: "팀원 구하기", href: "/team-recruitment" },
];

export function MainNavigation() {
  return (
    <nav aria-label="주요 메뉴">
      {navigationItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
