import { getZombieProjects } from "@/features/zombie-projects/api/get-zombie-projects";
import BackendContractNotice from "@/shared/components/backend-contract-notice/backend-contract-notice";
import ZombieProjectItem from "./zombie-project-item";

export default async function ZombieProjectList() {
  const projects = await getZombieProjects();

  if (projects.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center border-y border-slate-300 px-6 text-center text-sm text-slate-600">
        아직 등록된 좀비 프로젝트가 없습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <p className="text-sm text-slate-600">
          총{" "}
          <strong className="font-bold text-slate-900">
            {projects.length}
          </strong>
          개의 좀비 프로젝트
        </p>
      </div>
      <div className="mt-4">
        <BackendContractNotice>
          공개 재사용 자산·자산별 라이선스·재사용 조건과 공통 출품 정보를 제공하는 좀비 프로젝트 요약 API가 필요합니다.
        </BackendContractNotice>
      </div>
      <ul className="mt-4 divide-y divide-slate-300 border-y border-slate-300">
        {projects.map((project) => (
          <li key={project.id}>
            <ZombieProjectItem project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
