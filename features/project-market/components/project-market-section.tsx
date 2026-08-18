import { Suspense } from "react";
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
        <header className="max-w-3xl">
          <h1
            id="project-market-heading"
            className="text-balance break-keep text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
          >
            프로젝트 마켓
          </h1>
          <p className="mt-3 text-pretty break-keep text-base leading-7 text-slate-600">
            판매할 프로젝트의 자산, 권리 범위와 희망 가격을 확인하세요.
          </p>
        </header>

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
