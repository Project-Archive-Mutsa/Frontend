import type { ProjectDetailViewModel } from "../model/types";
import ProjectDetailHeader from "./project-detail-header";
import ProjectPublicRecord from "./project-public-record";
import ProjectPurposeSection from "./project-purpose-section";
import ProjectReportAccessPanel from "./project-report-access-panel";
import ProjectReportSection from "./project-report-section";

interface ProjectDetailViewProps {
  project: ProjectDetailViewModel;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const showPointAccessPanel =
    project.detailAccess !== null
      ? project.detailAccess.unlockMode === "POINT_ACCESS" &&
        project.detailAccess.available
      : project.registrationPurpose === "ZOMBIE" &&
        project.reportOffer.available;

  return (
    <section className="flex-1 py-12 sm:py-16" aria-label={`${project.name} 프로젝트 상세`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ProjectDetailHeader project={project} />

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div className="min-w-0">
            <ProjectPublicRecord project={project} />
            <div className="mt-14">
              <ProjectPurposeSection project={project} />
              <ProjectReportSection project={project} />
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            {showPointAccessPanel ? (
              <ProjectReportAccessPanel
                projectId={project.id}
                projectName={project.name}
                offer={project.reportOffer}
                detailAccess={project.detailAccess}
              />
            ) : null}
            {project.stats ? (
              <ul
                className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs tabular-nums text-slate-500 lg:block lg:space-y-2"
                aria-label="프로젝트 반응 통계"
              >
                <li>조회 {project.stats.viewCount.toLocaleString("ko-KR")}</li>
                <li>좋아요 {project.stats.likeCount.toLocaleString("ko-KR")}</li>
                <li>저장 {project.stats.bookmarkCount.toLocaleString("ko-KR")}</li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
