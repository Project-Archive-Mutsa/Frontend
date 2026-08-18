import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import BackendContractNotice from "@/shared/components/backend-contract-notice/backend-contract-notice";
import RecentAwardProjectList from "./recent-award-project-list";

export default function RecentAwardProjectSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-balance break-keep text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              최근 수상작
            </h2>
          </div>
          <p className="text-sm leading-6 text-slate-600 sm:text-right">
            좋은 평가를 받은 프로젝트의 문제 정의와 해결 방식을 아카이브에서 확인해 보세요.
          </p>
        </div>
        <div className="mb-5">
          <BackendContractNotice>
            최근 수상작에도 선택형 대표 이미지·결과물 단계·활동 상태·자산 요약과 정보 충실도 응답이 필요합니다.
          </BackendContractNotice>
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
