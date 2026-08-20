import { Suspense } from "react";
import AiProcessingState from "@/shared/components/ai-processing-state/ai-processing-state";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import ProjectDiscoveryResults from "./project-discovery-results";
import ProjectDiscoverySearchForm from "./project-discovery-search-form";

interface ProjectDiscoverySectionProps {
  query: string;
}

export default function ProjectDiscoverySection({
  query,
}: ProjectDiscoverySectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <header className="max-w-3xl">
        <h1 className="font-display text-balance break-keep text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
          AI 프로젝트 검색
        </h1>
        <p className="mt-3 text-pretty break-keep text-base leading-7 text-slate-600">
          문제 정의와 해결 방식을 분석해 기존 출품작의 유사점과 차이점을 비교합니다.
        </p>
      </header>

      <div className="mt-8">
        <ProjectDiscoverySearchForm key={query} defaultQuery={query} />
      </div>

      <div className="mt-10 sm:mt-12">
        {query ? (
          <SectionErrorBoundary message="AI 검색 결과를 불러오지 못했습니다.">
            <Suspense
              key={query}
              fallback={
                <AiProcessingState
                  title="AI가 생각 중입니다"
                  description="검색어의 문제 정의·대상 사용자·해결 방식을 분석해 유사 프로젝트를 비교하고 있습니다."
                  items={["문제 정의", "대상 사용자", "해결 방식"]}
                />
              }
            >
              <ProjectDiscoveryResults query={query} />
            </Suspense>
          </SectionErrorBoundary>
        ) : (
          <div className="border-y border-slate-300 py-16 text-center">
            <h2 className="font-display text-lg font-bold text-slate-900">
              검색어를 입력해 주세요.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              만들려는 서비스나 기능을 입력하면 관련 사례를 찾아드립니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
