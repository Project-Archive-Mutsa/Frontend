import { getZombieProjects } from "@/features/zombie-projects/api/get-zombie-projects";
import ZombieProjectItem from "./zombie-project-item";

export default async function ZombieProjectList() {
  const projects = await getZombieProjects();

  if (projects.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center border-y border-[#cfdae4] px-6 text-center text-sm text-[#5d7285]">
        아직 등록된 중단 프로젝트가 없습니다.
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-[#5d7285]">
        총 <strong className="font-bold text-[#24445f]">{projects.length}</strong>
        개의 중단 프로젝트
      </p>
      <ul className="mt-4 divide-y divide-[#cfdae4] border-y border-[#cfdae4]">
        {projects.map((project) => (
          <li key={project.id}>
            <ZombieProjectItem project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
