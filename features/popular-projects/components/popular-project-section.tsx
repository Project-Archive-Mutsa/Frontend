import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import PopularProjectList from "./popular-project-list";

export default function PopularProjectSection() {
  return (
    <section className="border-y border-[#dce9f2] bg-[linear-gradient(180deg,#f9fcff_0%,#f1f7fb_100%)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#527697] uppercase">
              Most Viewed
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#152f49] sm:text-4xl">
              인기 프로젝트
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6c757d] sm:text-right">
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
