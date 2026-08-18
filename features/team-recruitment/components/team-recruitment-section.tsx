import { Suspense } from "react";
import SectionErrorBoundary from "@/shared/components/section-error-boundary/section-error-boundary";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import TeamRecruitmentControls from "./team-recruitment-controls";
import TeamRecruitmentList from "./team-recruitment-list";

export default function TeamRecruitmentSection() {
  return (
    <section
      className="flex-1 py-12 sm:py-16"
      aria-labelledby="team-recruitment-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-3xl">
            <h1
              id="team-recruitment-heading"
              className="text-balance break-keep text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
            >
              팀원 모집
            </h1>
            <p className="mt-3 text-pretty break-keep text-base leading-7 text-slate-600">
              프로젝트와 참가 예정 대회의 역할, 기술, 일정과 모집 마감일을 확인하세요.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              disabled
              aria-describedby="team-recruitment-create-description"
              className="min-h-11 cursor-not-allowed border border-slate-300 bg-slate-200 px-5 text-sm font-bold text-slate-500 opacity-70"
            >
              모집글 작성
            </button>
            <p
              id="team-recruitment-create-description"
              className="text-xs text-slate-600"
            >
              <strong className="font-bold text-brand">백엔드 미구현</strong>
              {" · "}모집글 작성 기능은 연결 전입니다.
            </p>
          </div>
        </header>

        <TeamRecruitmentControls />

        <div className="mt-10 grid min-h-[28rem]">
          <SectionErrorBoundary message="팀원 모집글을 불러오지 못했습니다.">
            <Suspense fallback={<SectionLoadingSpinner />}>
              <TeamRecruitmentList />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </div>
    </section>
  );
}
