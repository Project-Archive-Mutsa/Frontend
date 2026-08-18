import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
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
        <h1 className="text-balance break-keep text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
          AI 프로젝트 검색
        </h1>
        <p className="mt-3 text-pretty break-keep text-base leading-7 text-slate-600">
          문제 정의와 해결 방식을 분석해 기존 출품작의 유사점과 차이점을 비교합니다.
        </p>
      </header>

      <aside
        className="mt-8 border-y border-slate-300 bg-white px-5 py-5 sm:px-6"
        aria-labelledby="ai-search-usage-heading"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="ai-search-usage-heading"
              className="text-base font-bold text-slate-900"
            >
              AI 검색 이용량
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              월 기본 제공량과 추가 토큰은 구독 정책 연결 후 표시됩니다.
            </p>
          </div>
          <strong className="text-xs font-bold text-brand">백엔드 미구현</strong>
        </div>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div className="border-t border-slate-200 pt-3">
            <dt className="text-xs text-slate-500">월 기본 제공량</dt>
            <dd className="mt-1 font-medium text-slate-700">요금제 연동 후 표시</dd>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <dt className="text-xs text-slate-500">추가 토큰</dt>
            <dd className="mt-1 font-medium text-slate-700">결제 연동 후 표시</dd>
          </div>
        </dl>
      </aside>

      <div className="mt-8">
        <ProjectDiscoverySearchForm defaultQuery={query} />
      </div>

      <div className="mt-10 sm:mt-12">
        {query ? (
          <SectionErrorBoundary message="AI 검색 결과를 불러오지 못했습니다.">
            <Suspense key={query} fallback={<SectionLoadingSpinner />}>
              <ProjectDiscoveryResults query={query} />
            </Suspense>
          </SectionErrorBoundary>
        ) : (
          <div className="border-y border-slate-300 py-16 text-center">
            <h2 className="text-lg font-bold text-slate-900">
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
