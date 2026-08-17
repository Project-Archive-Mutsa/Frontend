import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import OngoingContestList from "./ongoing-contest-list";

export default function OngoingContestSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-14">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <h2 className="text-balance break-keep text-4xl font-bold tracking-[-0.05em] text-[#122c45] sm:text-5xl">
            진행 중인 공모전
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty break-keep text-sm leading-7 text-[#6b7680] sm:text-base">
            지금 참여할 수 있는 공모전과 해커톤을 살펴보고 새로운
            프로젝트를 시작해 보세요.
          </p>
        </div>
        <SectionErrorBoundary message="진행 중인 공모전을 불러오지 못했습니다.">
          <Suspense fallback={<SectionLoadingSpinner />}>
            <OngoingContestList />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </section>
  );
}
