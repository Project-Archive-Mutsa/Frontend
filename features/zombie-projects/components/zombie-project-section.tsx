import { Suspense } from "react";
import ProjectExplorerHeader from "@/features/project-explorer/components/project-explorer-header";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import ZombieProjectFilterPreview from "./zombie-project-filter-preview";
import ZombieProjectResults from "./zombie-project-results";
import ZombieProjectSearchForm from "./zombie-project-search-form";

interface ZombieProjectSectionProps {
  state: { query: string; category: string; assetCategory: string; resultLevel: string; activityStatus: string; eventType: string; sort: "RECENT" | "POPULAR"; page: number };
}

export default function ZombieProjectSection({ state }: ZombieProjectSectionProps) {
  const { query } = state;
  return (
    <section
      className="flex-1 py-12 sm:py-16"
      aria-labelledby="zombie-project-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ProjectExplorerHeader
          activeView="continuation"
          headingId="zombie-project-heading"
        />

        <div className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-950">
            좀비 프로젝트
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            공개 기본정보를 비교하고, 필요한 프로젝트의 상세 정보를 1,000P로 열람할 수 있습니다.
          </p>
        </div>

        <ZombieProjectSearchForm
          key={query || "empty-query"}
          defaultQuery={query}
          hiddenFields={{
            category: state.category,
            assetCategory: state.assetCategory,
            resultLevel: state.resultLevel,
            activityStatus: state.activityStatus,
            eventType: state.eventType,
            sort: state.sort,
          }}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <ZombieProjectFilterPreview state={state} />
          <div className="min-h-[32rem] min-w-0">
            <SectionErrorBoundary
              message={
                query
                  ? "검색 결과를 불러오지 못했습니다. 검색어를 확인하고 다시 시도해 주세요."
                  : "좀비 프로젝트를 불러오지 못했습니다."
              }
            >
              <Suspense
                key={JSON.stringify(state)}
                fallback={<SectionLoadingSpinner />}
              >
                <ZombieProjectResults state={state} />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
