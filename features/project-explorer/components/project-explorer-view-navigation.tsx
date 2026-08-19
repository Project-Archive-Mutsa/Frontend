import Link from "next/link";

export type ProjectExplorerView = "all" | "continuation" | "proposals";

const availableViews = [
  {
    id: "all",
    label: "전체 프로젝트",
    description: "모든 출품작",
    href: "/projects",
  },
  {
    id: "continuation",
    label: "좀비 프로젝트",
    description: "공개 자산으로 계승 · 후속 개발 필요",
    href: "/zombie-projects",
  },
  {
    id: "proposals",
    label: "판매 중인 프로젝트",
    description: "판매 자산·권리 범위·희망 가격 확인",
    href: "/project-market",
  },
] as const;

interface ProjectExplorerViewNavigationProps {
  activeView: ProjectExplorerView;
}

export default function ProjectExplorerViewNavigation({
  activeView,
}: ProjectExplorerViewNavigationProps) {
  return (
    <nav
      aria-label="프로젝트 탐색 보기"
      className="mt-8 border-y border-slate-300"
    >
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
        {availableViews.map((view) => {
          const isActive = view.id === activeView;

          return (
            <li
              key={view.id}
              className="border-b border-slate-200 sm:border-r lg:border-b-0 last:border-r-0"
            >
              <Link
                href={view.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-20 flex-col justify-center border-b-2 px-4 py-4 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-accent motion-reduce:transition-none ${
                  isActive
                    ? "border-brand bg-white text-slate-950"
                    : "border-transparent text-slate-700 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="text-sm font-bold">{view.label}</span>
                <span className="mt-1 text-xs text-slate-500">
                  {view.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
