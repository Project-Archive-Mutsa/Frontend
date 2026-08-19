import type { Metadata } from "next";
import ProjectExplorerSection from "@/features/project-explorer/components/project-explorer-section";
import {
  parseProjectExplorerSearch,
  type ProjectExplorerSearchParams,
} from "@/features/project-explorer/model/project-explorer-search";

export const metadata: Metadata = {
  title: "프로젝트 탐색 | Project Archive",
  description:
    "공모전·대회·해커톤·캡스톤에서 나온 실제 프로젝트와 아이디어를 탐색하세요.",
};

interface ProjectsPageProps {
  searchParams: Promise<ProjectExplorerSearchParams>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const state = parseProjectExplorerSearch(await searchParams);

  return (
    <main className="flex flex-1 bg-slate-50">
      <ProjectExplorerSection state={state} />
    </main>
  );
}
