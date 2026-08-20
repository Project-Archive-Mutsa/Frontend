import { Suspense } from "react";
import ProjectExplorerHeader from "@/features/project-explorer/components/project-explorer-header";
import ProjectExplorerSearch from "@/features/project-explorer/components/project-explorer-search";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import ProjectMarketFilters from "./project-market-filters";
import ProjectMarketList from "./project-market-list";

interface ProjectMarketSectionProps {
  state: { query: string; assetCategory: string; category: string; sort: "RECENT" | "POPULAR"; page: number };
}

export default function ProjectMarketSection({ state }: ProjectMarketSectionProps) {
  const { query } = state;
  return (
    <section
      className="flex-1 py-12 sm:py-16"
      aria-labelledby="project-market-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ProjectExplorerHeader
          activeView="proposals"
          headingId="project-market-heading"
        />

        <div className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-950">
            판매 중인 프로젝트
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            판매자가 공개한 자산과 희망 가격을 확인하고 포인트로 구매합니다.
          </p>
        </div>

        <ProjectExplorerSearch
          action="/project-market"
          query={state.query}
          description="판매자가 공개한 프로젝트 이름을 검색합니다."
          inputId="project-market-search"
          hiddenFields={{
            assetCategory: state.assetCategory,
            category: state.category,
            sort: state.sort,
          }}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <ProjectMarketFilters state={state} />
          <div className="min-h-[32rem] min-w-0">
            <SectionErrorBoundary
              message={
                query
                  ? "판매 프로젝트 검색 결과를 불러오지 못했습니다."
                  : "프로젝트 마켓을 불러오지 못했습니다."
              }
            >
              <Suspense
                key={JSON.stringify(state)}
                fallback={<SectionLoadingSpinner />}
              >
                <ProjectMarketList state={state} />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
