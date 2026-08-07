import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import OngoingContestList from "./ongoing-contest-list";

export default function OngoingContestSection() {
  return (
    <section>
      <h2>현재 진행 중인 공모전</h2>
      <SectionErrorBoundary message="진행 중인 공모전을 불러오지 못했습니다.">
        <Suspense fallback={<SectionLoadingSpinner />}>
          <OngoingContestList />
        </Suspense>
      </SectionErrorBoundary>
    </section>
  );
}
