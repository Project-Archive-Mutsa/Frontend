import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import RecentAwardProjectList from "./recent-award-project-list";

export default function RecentAwardProjectSection() {
  return (
    <section>
      <h2>최근 수상작</h2>
      <SectionErrorBoundary message="최근 수상작을 불러오지 못했습니다.">
        <Suspense fallback={<SectionLoadingSpinner />}>
          <RecentAwardProjectList />
        </Suspense>
      </SectionErrorBoundary>
    </section>
  );
}
