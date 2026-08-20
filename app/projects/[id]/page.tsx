import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailView from "@/features/project-detail/components/project-detail-view";
import {
  getProjectDetail,
  ProjectDetailNotFoundError,
} from "@/features/project-detail/api/get-project-detail";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

function parseProjectId(value: string) {
  if (!/^\d+$/.test(value)) return null;
  const projectId = Number(value);
  return Number.isSafeInteger(projectId) && projectId > 0 ? projectId : null;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const projectId = parseProjectId((await params).id);
  if (!projectId) notFound();

  try {
    const project = await getProjectDetail(projectId);
    return {
      title: `${project.name} | Project Archive`,
      description: project.summary,
    };
  } catch (error) {
    if (error instanceof ProjectDetailNotFoundError) notFound();
    return { title: "프로젝트 상세 | Project Archive" };
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const projectId = parseProjectId((await params).id);
  if (!projectId) notFound();

  let project;
  try {
    project = await getProjectDetail(projectId);
  } catch (error) {
    if (error instanceof ProjectDetailNotFoundError) notFound();
    throw error;
  }

  return (
    <main className="flex flex-1 bg-slate-50">
      <ProjectDetailView project={project} />
    </main>
  );
}
