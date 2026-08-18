import { getPopularProjects } from "@/features/popular-projects/api/get-popular-projects";
import PopularProjectItem from "./popular-project-item";

export default async function PopularProjectList() {
  const projects = await getPopularProjects();

  if (projects.length === 0) {
    return <p>아직 등록된 인기 프로젝트가 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-slate-300 border-y border-slate-300">
      {projects.map((project) => (
        <li key={project.id}>
          <PopularProjectItem project={project} />
        </li>
      ))}
    </ul>
  );
}
