import { Suspense } from "react";
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
      className="flex-1 bg-brand-canvas py-12 sm:py-16"
      aria-labelledby="zombie-project-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <header className="max-w-3xl">
          <h1
            id="zombie-project-heading"
            className="text-balance break-keep text-3xl font-bold tracking-[-0.04em] text-[#102f4a] sm:text-4xl"
          >
            중단 프로젝트
          </h1>
          <p className="mt-3 text-pretty break-keep text-base leading-7 text-[#5a7185]">
            멈춰 있는 프로젝트의 자산과 맥락을 살펴보고, 후속 개발이나 협업의 가능성을 찾아보세요.
          </p>
        </header>

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
                : "중단 프로젝트를 불러오지 못했습니다."
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
