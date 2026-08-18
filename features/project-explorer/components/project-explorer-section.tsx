import { Suspense } from "react";
import type { ProjectExplorerSearchState } from "@/features/project-explorer/model/types";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import ProjectExplorerFilters from "./project-explorer-filters";
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
        <header className="max-w-3xl">
          <h1
            id="project-explorer-heading"
            className="text-balance break-keep text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
          >
            프로젝트 탐색
          </h1>
          <p className="mt-3 text-pretty break-keep text-base leading-7 text-slate-600">
            공모전·대회·해커톤·캡스톤에서 나온 실제 출품작과 아이디어를 한곳에서 살펴보세요.
          </p>
        </header>

        <ProjectExplorerSearch query={state.query} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <ProjectExplorerFilters />
          <div className="min-h-[32rem] min-w-0">
            <SectionErrorBoundary message="프로젝트 목록을 불러오지 못했습니다.">
              <Suspense
                key={state.query || "popular-projects"}
                fallback={<SectionLoadingSpinner />}
              >
                <ProjectExplorerResults query={state.query} />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
