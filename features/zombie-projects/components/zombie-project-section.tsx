import { Suspense } from "react";
import ProjectExplorerHeader from "@/features/project-explorer/components/project-explorer-header";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import ZombieProjectFilterPreview from "./zombie-project-filter-preview";
import ZombieProjectResults from "./zombie-project-results";
import ZombieProjectSearchForm from "./zombie-project-search-form";

interface ZombieProjectSectionProps {
  query: string;
}

export default function ZombieProjectSection({
  query,
}: ZombieProjectSectionProps) {
  return (
    <section
      className="flex-1 py-12 sm:py-16"
      aria-labelledby="zombie-project-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <ProjectExplorerHeader
          activeView="continuation"
          headingId="zombie-project-heading"
        />

        <div className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-950">
            좀비 프로젝트
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            공개 자산과 활용 조건을 확인하고 후속 개발로 계승할 프로젝트를 찾습니다.
          </p>
        </div>

        <ZombieProjectSearchForm
          key={query || "empty-query"}
          defaultQuery={query}
        />
        <ZombieProjectFilterPreview />

        <div className="mt-10 grid min-h-[32rem]">
          <SectionErrorBoundary
            message={
              query
                ? "검색 결과를 불러오지 못했습니다. 검색어를 확인하고 다시 시도해 주세요."
                : "좀비 프로젝트를 불러오지 못했습니다."
            }
          >
            <Suspense
              key={query || "all-projects"}
              fallback={<SectionLoadingSpinner />}
            >
              <ZombieProjectResults query={query} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </div>
    </section>
  );
}
