import { Suspense } from "react";
import ProjectExplorerHeader from "@/features/project-explorer/components/project-explorer-header";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import ProjectMarketControls from "./project-market-controls";
import ProjectMarketList from "./project-market-list";

interface ProjectMarketSectionProps {
  query: string;
}

export default function ProjectMarketSection({
  query,
}: ProjectMarketSectionProps) {
  return (
    <section
      className="flex-1 py-12 sm:py-16"
      aria-labelledby="project-market-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <ProjectExplorerHeader
          activeView="proposals"
          headingId="project-market-heading"
        />

        <div className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-950">
            판매 중인 프로젝트
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            판매자가 공개한 자산, 권리 범위와 희망 가격을 확인합니다. 거래 기능은 백엔드 미구현 상태입니다.
          </p>
        </div>

        <ProjectMarketControls defaultQuery={query} />

        <div className="mt-10 grid min-h-[32rem]">
          <SectionErrorBoundary
            message={
              query
                ? "판매 프로젝트 검색 결과를 불러오지 못했습니다."
                : "프로젝트 마켓을 불러오지 못했습니다."
            }
          >
            <Suspense
              key={query || "all-projects"}
              fallback={<SectionLoadingSpinner />}
            >
              <ProjectMarketList query={query} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </div>
    </section>
  );
}
