import ProjectExplorerViewNavigation, {
  type ProjectExplorerView,
} from "./project-explorer-view-navigation";

interface ProjectExplorerHeaderProps {
  activeView: ProjectExplorerView;
  headingId: string;
}

export default function ProjectExplorerHeader({
  activeView,
  headingId,
}: ProjectExplorerHeaderProps) {
  return (
    <header>
      <div className="max-w-3xl">
        <h1
          id={headingId}
          className="font-display text-balance break-keep text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl"
        >
          프로젝트 탐색
        </h1>
        <p className="mt-3 text-pretty break-keep text-base leading-7 text-slate-600">
          모든 출품작을 한곳에서 찾고, 좀비 프로젝트나 판매 중인 프로젝트로 범위를 좁혀보세요.
        </p>
      </div>

      <ProjectExplorerViewNavigation activeView={activeView} />
    </header>
  );
}
