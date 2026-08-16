import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import RecentAwardProjectList from "./recent-award-project-list";

export default function RecentAwardProjectSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#4b85ba] uppercase">
              Awarded Archives
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#102a43] sm:text-4xl">
              최근 수상작
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#647b92] sm:text-right">
            좋은 평가를 받은 프로젝트의 문제 정의와 해결 방식을 아카이브에서
            확인해 보세요.
          </p>
        </div>
        <SectionErrorBoundary message="최근 수상작을 불러오지 못했습니다.">
          <Suspense fallback={<SectionLoadingSpinner />}>
            <RecentAwardProjectList />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </section>
  );
}
