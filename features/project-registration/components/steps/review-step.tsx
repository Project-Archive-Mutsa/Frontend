import Image from "next/image";
import AiProcessingState from "@/shared/components/ai-processing-state/ai-processing-state";
import ProjectInformationCompleteness from "@/shared/components/project-information-completeness/project-information-completeness";
import Link from "next/link";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";
import {
  getActivityStatusLabel,
  getPurposeLabel,
  getResultLevelLabel,
} from "../../model/options";
import type {
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
} from "../../model/types";

interface ReviewStepProps {
  draft: ProjectRegistrationDraft;
  errors: ProjectRegistrationFieldErrors;
  representativeImageUrl: string | null;
  onReviewAllSteps: () => boolean;
  onSubmit: () => void;
  isPending: boolean;
  error: string | null;
  result: { project: { projectId: number; projectName: string; informationCompletenessScore?: number | null }; recruitmentCreated: boolean | null; warning: string | null } | null;
  onRetryRecruitment: () => void;
  isRetryingRecruitment: boolean;
  recruitmentRetrySucceeded: boolean;
  recruitmentRetryError: string | null;
  onDisclosureConsentChange: (checked: boolean) => void;
}

export default function ReviewStep({
  draft,
  errors,
  representativeImageUrl,
  onReviewAllSteps,
  onSubmit,
  isPending,
  error,
  result,
  onRetryRecruitment,
  isRetryingRecruitment,
  recruitmentRetrySucceeded,
  recruitmentRetryError,
  onDisclosureConsentChange,
}: ReviewStepProps) {
  const tags = [...draft.categories, ...draft.problemAreas, ...draft.methods, ...draft.customTags];

  return (
    <div className="space-y-10">
      <section aria-labelledby="public-preview-title">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="public-preview-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">탐색 카드 미리보기</h2>
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
            <h3 className="font-display mt-3 text-pretty break-keep text-2xl font-semibold tracking-[-0.02em] text-slate-950 [overflow-wrap:anywhere]">
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
              <div><dt className="text-xs text-slate-500">프로젝트 자료</dt><dd className="mt-1 font-bold text-slate-800">{draft.assets.length}개</dd></div>
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
            <ProjectInformationCompleteness
              projectName={draft.projectName || "프로젝트"}
              score={result?.project.informationCompletenessScore ?? null}
              isCalculating={isPending}
            />
            <dl className="mt-5 border-t border-slate-200 pt-4 text-sm">
              <dt className="text-xs text-slate-500">수상 이력</dt>
              <dd className="mt-1 font-medium text-slate-800">
                {draft.awards.filter((award) => award.title.trim()).map((award) => award.title).join(", ") || "없음"}
              </dd>
            </dl>
          </aside>
        </article>
      </section>

      <section
        aria-label={isPending ? "정보 충실도 계산" : undefined}
        aria-labelledby={isPending ? undefined : "completeness-review-title"}
        className="border-t border-slate-200 pt-8"
      >
        {isPending ? (
          <AiProcessingState
            title="정보 충실도를 계산하고 있습니다"
            description="문제 정의·해결 방식·검증 근거와 자료 설명을 확인하고 있습니다."
            items={["문제 정의·해결 방식", "검증 근거", "자료 설명"]}
          />
        ) : (
          <>
            <h2 id="completeness-review-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">정보 충실도</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">등록 시 입력한 문제·해결 맥락, 검증 결과, 제약·한계와 자료 설명을 기준으로 정보 충실도가 자동 계산됩니다. 별도 미리보기 호출은 하지 않습니다.</p>
          </>
        )}
      </section>

      <section aria-labelledby="material-disclosure-title" className="border-t border-slate-300 pt-8">
        <h2 id="material-disclosure-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">자료 공개 동의</h2>
        <div className="mt-5">
          <label className="flex cursor-pointer items-start gap-3 border-y border-slate-300 py-5 text-sm leading-6 text-slate-700">
            <input
              id="materialDisclosureConsent"
              type="checkbox"
              checked={draft.materialDisclosureConsent}
              aria-invalid={Boolean(errors.materialDisclosureConsent)}
              aria-describedby={errors.materialDisclosureConsent ? "materialDisclosureConsent-error" : "materialDisclosureConsent-help"}
              onChange={(event) => onDisclosureConsentChange(event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-brand"
            />
            <span>
              <strong className="block text-slate-950">이 프로젝트에 등록한 모든 자료의 공개·제공에 동의합니다.</strong>
              <span id="materialDisclosureConsent-help" className="mt-1 block text-slate-600">기본정보는 무료 공개되며, 상세 내용과 파일·링크는 좀비 프로젝트 열람 사용자, 프로젝트 구매자 또는 현재 소유자에게 등록 목적에 따라 제공됩니다. 직접 등록하거나 제공에 동의할 수 있는 자료만 첨부해 주세요.</span>
            </span>
          </label>
          {errors.materialDisclosureConsent ? <p id="materialDisclosureConsent-error" role="alert" className="mt-2 text-sm text-red-700">{errors.materialDisclosureConsent}</p> : null}
        </div>
      </section>

      <section aria-labelledby="registration-submit-title" className="border-t border-slate-300 pt-8">
        <h2 id="registration-submit-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">프로젝트 등록</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">필수 입력과 자료 공개 동의를 확인한 뒤 프로젝트와 첨부 파일을 등록합니다.</p>
        {result ? (
          <div className="mt-5 border-y border-emerald-300 bg-emerald-50 px-4 py-4 text-sm text-emerald-900" role="status">
            <p className="font-bold">{result.project.projectName} 등록 완료 · 프로젝트 #{result.project.projectId}</p>
            <p className="mt-2">정보 충실도 {result.project.informationCompletenessScore === null || result.project.informationCompletenessScore === undefined ? "미산정" : `${result.project.informationCompletenessScore}점`}</p>
            {result.warning ? <p className="mt-2 text-amber-900">{result.warning}</p> : null}
            {result.recruitmentCreated === false && !recruitmentRetrySucceeded ? <button type="button" onClick={onRetryRecruitment} disabled={isRetryingRecruitment} className="mt-3 inline-flex min-h-10 items-center gap-2 border border-amber-700 px-4 font-bold text-amber-900 disabled:opacity-60">{isRetryingRecruitment ? <LoadingSpinner size={16} /> : null}{isRetryingRecruitment ? "모집글 재등록 중" : "모집글 등록 재시도"}</button> : null}
            {recruitmentRetrySucceeded ? <p className="mt-2 font-bold text-emerald-900">팀원 모집글 등록도 완료됐습니다.</p> : null}
            {recruitmentRetryError ? <p role="alert" className="mt-2 text-red-800">{recruitmentRetryError}</p> : null}
            <Link href={`/projects/${result.project.projectId}`} className="mt-3 inline-block font-bold underline underline-offset-4">등록한 프로젝트 기록 보기</Link>
          </div>
        ) : (
          <button type="button" onClick={onSubmit} disabled={isPending} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{isPending ? <LoadingSpinner size={18} /> : null}{isPending ? "등록 중" : "프로젝트 등록"}</button>
        )}
        {error ? <p role="alert" className="mt-3 text-sm text-red-700">{error}</p> : null}
      </section>
    </div>
  );
}
