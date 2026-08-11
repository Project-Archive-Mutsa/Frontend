import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import IdeaList from "./idea-list";

export default function IdeaSearchSection() {
  return (
    <section className="max-w-3xl mx-auto py-10 px-5">
      <h1>아이디어 검색 결과</h1>
      <SectionErrorBoundary message="아이디어 검색 결과를 불러오지 못했습니다.">
        <Suspense fallback={<SectionLoadingSpinner />}>
          <IdeaList />
        </Suspense>
      </SectionErrorBoundary>
    </section>
  );
}
