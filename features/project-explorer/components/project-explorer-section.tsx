import { Suspense } from "react";
import type { ProjectExplorerSearchState } from "@/features/project-explorer/model/types";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import ProjectExplorerFilters from "./project-explorer-filters";
import ProjectExplorerHeader from "./project-explorer-header";
import ProjectExplorerResults from "./project-explorer-results";
import ProjectExplorerSearch from "./project-explorer-search";

interface ProjectExplorerSectionProps {
  state: ProjectExplorerSearchState;
}

export default function ProjectExplorerSection({
  state,
}: ProjectExplorerSectionProps) {
  return (
    <section
      className="flex-1 py-12 sm:py-16"
      aria-labelledby="project-explorer-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ProjectExplorerHeader
          activeView="all"
          headingId="project-explorer-heading"
        />

        <div className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-950">
            전체 프로젝트
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            공모전·대회·해커톤·캡스톤에서 나온 실제 출품작을 검색하고 비교합니다.
          </p>
        </div>

        <ProjectExplorerSearch state={state} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <ProjectExplorerFilters state={state} />
          <div className="min-h-[32rem] min-w-0">
            <SectionErrorBoundary message="프로젝트 목록을 불러오지 못했습니다.">
              <Suspense
                key={JSON.stringify(state)}
                fallback={<SectionLoadingSpinner />}
              >
                <ProjectExplorerResults state={state} />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
