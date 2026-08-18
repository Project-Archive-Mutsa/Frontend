"use client";

import { useSyncExternalStore } from "react";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import useProjectRegistrationWizard from "../hooks/use-project-registration-wizard";
import { projectRegistrationSteps } from "../model/options";
import ProjectRegistrationStepper from "./project-registration-stepper";
import AssetsStep from "./steps/assets-step";
import ContentStep from "./steps/content-step";
import OverviewStep from "./steps/overview-step";
import PurposeStep from "./steps/purpose-step";
import ReviewStep from "./steps/review-step";
import SubmissionStep from "./steps/submission-step";

function subscribeClientReady() {
  return () => undefined;
}

function ProjectRegistrationWizard() {
  const wizard = useProjectRegistrationWizard();
  const stepInformation = projectRegistrationSteps.find((item) => item.step === wizard.step);

  const savedTime = wizard.savedAt
    ? new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit" }).format(new Date(wizard.savedAt))
    : null;

  return (
    <section aria-labelledby="project-registration-title" className="mx-auto w-full max-w-7xl">
      <header className="flex items-end justify-between gap-8 border-b border-slate-300 pb-7">
        <div>
          <h1 id="project-registration-title" className="text-3xl font-bold tracking-[-0.04em] text-slate-950">프로젝트 등록</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">실제 출품했던 프로젝트의 배경, 결과와 남은 자산을 기록해 다음 실행으로 연결합니다.</p>
        </div>
        <div className="shrink-0 text-right text-xs leading-5 text-slate-500" aria-live="polite">
          <p>
            {wizard.saveStatus === "saving"
              ? "이 브라우저에 저장 중"
              : wizard.saveStatus === "saved" && savedTime
                ? `이 브라우저에 ${savedTime} 임시 저장됨`
                : wizard.saveStatus === "unavailable"
                  ? "브라우저 임시저장을 사용할 수 없음"
                  : "입력을 시작하면 이 브라우저에 임시 저장됩니다"}
          </p>
          <button type="button" onClick={wizard.discardDraft} className="mt-1 min-h-8 font-medium text-red-700 underline decoration-red-300 underline-offset-4 hover:decoration-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">작성 내용 지우기</button>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <ProjectRegistrationStepper currentStep={wizard.step} onStepChange={wizard.goToCompletedStep} />

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            wizard.goToNextStep();
          }}
          className="min-w-0"
        >
          <header className="mb-8">
            <p className="text-xs font-bold tabular-nums text-brand">{wizard.step} / {projectRegistrationSteps.length}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950">{stepInformation?.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{stepInformation?.description}</p>
          </header>

          {Object.keys(wizard.errors).length > 0 ? (
            <div id="registration-error-summary" role="alert" tabIndex={-1} className="mb-8 border-y border-slate-300 bg-white px-4 py-4 focus:outline-2 focus:outline-offset-2 focus:outline-red-700">
              <h3 className="font-bold text-red-900">확인할 입력이 {Object.keys(wizard.errors).length}개 있습니다.</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {Object.entries(wizard.errors).map(([field, message]) => (
                  <li key={field}><a href={`#${field}`} className="underline decoration-red-300 underline-offset-4 hover:decoration-red-700">{message}</a></li>
                ))}
              </ul>
            </div>
          ) : null}

          {wizard.step === 1 ? (
            <SubmissionStep draft={wizard.draft} errors={wizard.errors} onUpdateField={wizard.updateField} onAddAward={wizard.addAward} onUpdateAward={wizard.updateAward} onRemoveAward={wizard.removeAward} />
          ) : null}
          {wizard.step === 2 ? (
            <OverviewStep draft={wizard.draft} errors={wizard.errors} representativeImageUrl={wizard.representativeImageUrl} onUpdateField={wizard.updateField} onToggleListField={wizard.toggleListField} onAddCustomTag={wizard.addCustomTag} onRemoveCustomTag={wizard.removeCustomTag} onRepresentativeImageChange={wizard.setRepresentativeImage} />
          ) : null}
          {wizard.step === 3 ? (
            <ContentStep draft={wizard.draft} errors={wizard.errors} onUpdateField={wizard.updateField} />
          ) : null}
          {wizard.step === 4 ? (
            <AssetsStep draft={wizard.draft} errors={wizard.errors} onUpdateField={wizard.updateField} onAddAsset={wizard.addAsset} onUpdateAsset={wizard.updateAsset} onRemoveAsset={wizard.removeAsset} onAddAssetFiles={wizard.addAssetFiles} onAddAssetLink={wizard.addAssetLink} onRemoveAssetSource={wizard.removeAssetSource} />
          ) : null}
          {wizard.step === 5 ? (
            <PurposeStep draft={wizard.draft} errors={wizard.errors} onUpdateField={wizard.updateField} onToggleListField={wizard.toggleListField} onUpdateZombieAssetTerms={wizard.updateZombieAssetTerms} />
          ) : null}
          {wizard.step === 6 ? (
            <ReviewStep draft={wizard.draft} representativeImageUrl={wizard.representativeImageUrl} onReviewAllSteps={wizard.reviewAllSteps} />
          ) : null}

          {wizard.step < 6 ? (
            <div className="mt-12 flex items-center justify-between border-t border-slate-300 pt-6">
              {wizard.step > 1 ? (
                <button type="button" onClick={wizard.goToPreviousStep} className="min-h-11 px-1 text-sm font-bold text-slate-700 underline decoration-slate-300 decoration-2 underline-offset-4 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">이전 단계</button>
              ) : <span />}
              <button type="submit" className="min-h-11 bg-brand px-6 text-sm font-bold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">다음 단계</button>
            </div>
          ) : (
            <div className="mt-12 border-t border-slate-300 pt-6">
              <button type="button" onClick={wizard.goToPreviousStep} className="min-h-11 px-1 text-sm font-bold text-slate-700 underline decoration-slate-300 decoration-2 underline-offset-4 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">이전 단계</button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default function ProjectRegistrationSection() {
  const isClientReady = useSyncExternalStore(subscribeClientReady, () => true, () => false);
  const { isInitialized } = useAuthSession();

  if (!isClientReady || !isInitialized) {
    return <SectionLoadingSpinner />;
  }

  return <ProjectRegistrationWizard />;
}
