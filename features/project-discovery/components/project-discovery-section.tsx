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
    <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
      <header className="mx-auto max-w-4xl text-center">
        <h1 className="text-balance break-keep text-3xl font-bold tracking-[-0.04em] text-[#102a43] sm:text-4xl">
          AI 프로젝트 검색
        </h1>
        <p className="mt-3 text-pretty break-keep text-sm leading-7 text-[#63798e] sm:text-base">
          이미 시도된 프로젝트와 공모전, 아이디어, 수상작을 한 번에
          비교해 보세요.
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-4xl">
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
          <div className="border-y border-brand-soft py-16 text-center">
            <h2 className="text-lg font-bold text-[#173f68]">
              검색어를 입력해 주세요.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#687f94]">
              만들려는 서비스나 기능을 입력하면 관련 사례를 찾아드립니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
