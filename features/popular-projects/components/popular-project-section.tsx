import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import PopularProjectList from "./popular-project-list";

export default function PopularProjectSection() {
  return (
    <section className="border-y border-slate-300 bg-brand-canvas py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-balance break-keep text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
              인기 프로젝트
            </h2>
          </div>
          <p className="max-w-md text-pretty break-keep text-sm leading-6 text-slate-600 sm:text-right">
            지금 가장 많은 관심을 받고 있는 프로젝트와 아이디어를
            살펴보세요.
          </p>
        </div>
        <SectionErrorBoundary message="인기 프로젝트를 불러오지 못했습니다.">
          <Suspense fallback={<SectionLoadingSpinner />}>
            <PopularProjectList />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </section>
  );
}
