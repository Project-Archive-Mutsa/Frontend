import { getRecentAwardProjects } from "@/features/recent-award-projects/api/get-recent-award-projects";
import RecentAwardProjectItem from "./recent-award-project-item";

export default async function RecentAwardProjectList() {
  const projects = await getRecentAwardProjects();

  if (projects.length === 0) {
    return <p>아직 등록된 최근 수상작이 없습니다.</p>;
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((project) => (
        <li key={project.id} className="h-full">
          <RecentAwardProjectItem project={project} />
        </li>
      ))}
    </ul>
  );
}
