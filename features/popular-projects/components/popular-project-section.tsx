import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import PopularProjectList from "./popular-project-list";

export default function PopularProjectSection() {
  return (
    <section>
      <h2>인기 프로젝트</h2>
      <SectionErrorBoundary message="인기 프로젝트를 불러오지 못했습니다.">
        <Suspense fallback={<SectionLoadingSpinner />}>
          <PopularProjectList />
        </Suspense>
      </SectionErrorBoundary>
    </section>
  );
}
