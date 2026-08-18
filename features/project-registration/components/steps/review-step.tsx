import Image from "next/image";
import ProjectInformationCompleteness from "@/shared/components/project-information-completeness/project-information-completeness";
import {
  getActivityStatusLabel,
  getPurposeLabel,
  getResultLevelLabel,
} from "../../model/options";
import type { ProjectRegistrationDraft } from "../../model/types";

interface ReviewStepProps {
  draft: ProjectRegistrationDraft;
  representativeImageUrl: string | null;
  onReviewAllSteps: () => boolean;
}

function AccessBoundaryReview({ draft }: { draft: ProjectRegistrationDraft }) {
  const purposeSpecificItems =
    draft.purpose === "ZOMBIE"
      ? ["선택한 공개 재사용 자산", "라이선스와 출처·재사용 조건"]
      : draft.purpose === "SELL"
        ? ["판매 대상 자산과 권리 요약", "포인트 판매가와 협의 조건"]
        : draft.purpose === "TEAM_RECRUIT"
          ? ["모집 역할·인원·일정·마감", "선택한 모집 참고 자산"]
          : [];

  return (
    <section aria-labelledby="access-boundary-title" className="border-t border-slate-200 pt-8">
      <h2 id="access-boundary-title" className="text-lg font-bold text-slate-950">공개 범위</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">상세정보 열람권과 프로젝트 자산의 사용권·소유권은 서로 다른 권리입니다.</p>
      <div className="mt-6 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="border-b border-slate-300 pb-3 text-sm font-bold text-slate-900">무료 기본정보</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>제목·한 줄 소개·대표 이미지</li>
            <li>출품 행사·분야·태그·수상 이력</li>
            <li>결과물 단계·활동 상태·등록 목적</li>
            <li>자산 종류와 개수·정보 충실도</li>
          </ul>
        </div>
        <div>
          <h3 className="border-b border-slate-300 pb-3 text-sm font-bold text-slate-900">결제 후 상세 리포트</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>문제 정의와 해결 과정</li>
            <li>검증 결과와 차별점</li>
            <li>시행착오·한계·후속 과제</li>
            <li>상세 자산 설명과 리포트 자료</li>
          </ul>
        </div>
        <div>
          <h3 className="border-b border-slate-300 pb-3 text-sm font-bold text-slate-900">목적별 공개정보</h3>
          {purposeSpecificItems.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {purposeSpecificItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-500">아카이브 등록에는 별도 공개 자산이 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ReviewStep({
  draft,
  representativeImageUrl,
  onReviewAllSteps,
}: ReviewStepProps) {
  const tags = [...draft.categories, ...draft.problemAreas, ...draft.methods, ...draft.customTags];

  return (
    <div className="space-y-10">
      <section aria-labelledby="public-preview-title">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="public-preview-title" className="text-lg font-bold text-slate-950">탐색 카드 미리보기</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">프로젝트를 열기 전에 다른 사용자가 확인할 무료 기본정보입니다.</p>
          </div>
          <button
            type="button"
            onClick={onReviewAllSteps}
            className="min-h-11 shrink-0 border-b-2 border-brand-accent px-1 text-sm font-bold text-brand hover:border-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            입력 오류 확인
          </button>
        </div>

        <article className="mt-6 grid gap-7 border-y border-slate-300 py-7 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
              <span>{getPurposeLabel(draft.purpose)}</span>
              <span>{draft.eventName || "행사명 미입력"}</span>
              {draft.eventDate ? <time dateTime={draft.eventDate}>{draft.eventDate.slice(0, 4)}년 출품</time> : null}
            </div>
            <h3 className="mt-3 text-pretty break-keep text-2xl font-bold tracking-[-0.03em] text-slate-950 [overflow-wrap:anywhere]">
              {draft.projectName || "프로젝트명을 입력해 주세요"}
            </h3>
            <p className="mt-3 max-w-3xl text-pretty break-keep text-sm leading-7 text-slate-600 [overflow-wrap:anywhere]">
              {draft.summary || "프로젝트의 한 줄 소개가 표시됩니다."}
            </p>
            {tags.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs text-slate-600" aria-label={`프로젝트 태그: ${tags.join(", ")}`}>
                {tags.slice(0, 7).map((tag) => <li key={tag} className="border-b border-brand-accent pb-0.5">{tag}</li>)}
                {tags.length > 7 ? <li className="text-slate-500">외 {tags.length - 7}개</li> : null}
              </ul>
            ) : null}
            <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-3">
              <div><dt className="text-xs text-slate-500">결과물 단계</dt><dd className="mt-1 font-bold text-slate-800">{getResultLevelLabel(draft.resultLevel)}</dd></div>
              <div><dt className="text-xs text-slate-500">현재 활동 상태</dt><dd className="mt-1 font-bold text-slate-800">{getActivityStatusLabel(draft.activityStatus)}</dd></div>
              <div><dt className="text-xs text-slate-500">보유 자산</dt><dd className="mt-1 font-bold text-slate-800">{draft.assets.length}개</dd></div>
            </dl>
          </div>

          <aside className="border-t border-slate-200 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
            <div className="relative mb-5 aspect-[16/10] overflow-hidden bg-brand-canvas">
              {representativeImageUrl ? (
                <Image src={representativeImageUrl} alt={`${draft.projectName || "프로젝트"} 대표 이미지`} fill unoptimized className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-xs leading-5 text-slate-500">
                  {draft.representativeImageName
                    ? "선택한 대표 이미지는 새로고침 후 다시 첨부해 주세요."
                    : "대표 이미지 미등록"}
                </div>
              )}
            </div>
            <ProjectInformationCompleteness projectName={draft.projectName || "프로젝트"} score={null} />
            <dl className="mt-5 border-t border-slate-200 pt-4 text-sm">
              <dt className="text-xs text-slate-500">수상 이력</dt>
              <dd className="mt-1 font-medium text-slate-800">
                {draft.awards.filter((award) => award.title.trim()).map((award) => award.title).join(", ") || "없음"}
              </dd>
            </dl>
          </aside>
        </article>
      </section>

      <AccessBoundaryReview draft={draft} />

      <section aria-labelledby="completeness-review-title" className="border-t border-slate-200 pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div>
            <h2 id="completeness-review-title" className="text-lg font-bold text-slate-950">AI 정보 충실도 점검</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">프로젝트 설명과 자산이 서로 연결되는지, 분야와 결과물 단계에 맞는 근거·권리·회고가 충분한지 점검합니다. 파일 개수나 특정 확장자만으로 점수를 올리지 않습니다.</p>
            <ul className="mt-5 grid gap-x-6 gap-y-2 text-sm leading-6 text-slate-600 sm:grid-cols-2">
              <li>문제·해결 맥락</li>
              <li>출품·결과 근거</li>
              <li>검증·회고</li>
              <li>자산 설명과 접근성</li>
              <li>권리·등록 목적 적합성</li>
            </ul>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <p className="text-xs font-bold text-slate-700">백엔드 미구현</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">AI 평가 API가 연결되면 점수, 항목별 근거와 우선 보완 항목을 표시합니다.</p>
            <button type="button" disabled className="mt-5 min-h-11 w-full cursor-not-allowed bg-slate-300 px-4 text-sm font-bold text-slate-600">AI 점검 실행</button>
          </div>
        </div>
      </section>

      <section aria-labelledby="registration-submit-title" className="border-t border-slate-300 pt-8">
        <h2 id="registration-submit-title" className="text-lg font-bold text-slate-950">프로젝트 등록</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">필수 입력과 공개 범위를 확인했습니다. 현재 최종 등록·파일 업로드 API는 백엔드 미구현 상태입니다.</p>
        <button type="button" disabled className="mt-5 min-h-12 w-full cursor-not-allowed bg-slate-300 px-5 text-sm font-bold text-slate-600 sm:w-auto">프로젝트 등록</button>
      </section>
    </div>
  );
}
