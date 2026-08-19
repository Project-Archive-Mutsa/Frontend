import {
  activityStatusOptions,
  resultLevelOptions,
} from "../../model/options";
import type {
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
} from "../../model/types";
import { ChoiceList, Field, TextArea } from "../project-registration-form-controls";

interface ContentStepProps {
  draft: ProjectRegistrationDraft;
  errors: ProjectRegistrationFieldErrors;
  onUpdateField: <FieldName extends keyof ProjectRegistrationDraft>(
    field: FieldName,
    value: ProjectRegistrationDraft[FieldName],
  ) => void;
}

export default function ContentStep({ draft, errors, onUpdateField }: ContentStepProps) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="problem-solution-title">
        <h2 id="problem-solution-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">문제와 해결 방식</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">이 내용은 결제 후 상세 리포트의 핵심이 되며 AI 유사 프로젝트 검색에도 활용됩니다.</p>
        <div className="mt-6 space-y-6">
          <Field id="problemDefinition" label="문제 정의" required helper="어떤 상황에서 누구에게 어떤 문제가 발생했는지 적어주세요." error={errors.problemDefinition}>
            <TextArea id="problemDefinition" value={draft.problemDefinition} error={errors.problemDefinition} placeholder="문제가 발생한 배경과 구체적인 불편을 설명해 주세요." onChange={(event) => onUpdateField("problemDefinition", event.target.value)} />
          </Field>
          <Field id="targetAudience" label="대상 사용자·영역" required error={errors.targetAudience}>
            <TextArea id="targetAudience" value={draft.targetAudience} error={errors.targetAudience} className="min-h-24" placeholder="대상 사용자, 현장 또는 적용 영역을 구체적으로 적어주세요." onChange={(event) => onUpdateField("targetAudience", event.target.value)} />
          </Field>
          <Field id="solution" label="해결 방식" required error={errors.solution}>
            <TextArea id="solution" value={draft.solution} error={errors.solution} placeholder="문제를 어떤 원리와 흐름으로 해결하려 했는지 적어주세요." onChange={(event) => onUpdateField("solution", event.target.value)} />
          </Field>
          <Field id="coreApproach" label="핵심 기능·수행 방식" required helper="앱 기능뿐 아니라 캠페인, 연구, 제품 제작 과정 등 프로젝트의 핵심 작동 방식을 포함합니다." error={errors.coreApproach}>
            <TextArea id="coreApproach" value={draft.coreApproach} error={errors.coreApproach} placeholder="핵심 기능, 프로그램 구성 또는 제작·운영 방식을 설명해 주세요." onChange={(event) => onUpdateField("coreApproach", event.target.value)} />
          </Field>
          <Field id="differentiation" label="기존 방식과의 차이" required error={errors.differentiation}>
            <TextArea id="differentiation" value={draft.differentiation} error={errors.differentiation} className="min-h-24" placeholder="기존 사례와 비교했을 때 달랐던 선택을 적어주세요." onChange={(event) => onUpdateField("differentiation", event.target.value)} />
          </Field>
          <Field id="validation" label="검증 방법과 결과" required helper="사용자 반응, 심사 피드백, 실험, 설문, 판매, 전시 등 분야에 맞는 근거를 적어주세요." error={errors.validation}>
            <TextArea id="validation" value={draft.validation} error={errors.validation} placeholder="무엇을 어떻게 확인했고 어떤 결과가 있었는지 적어주세요." onChange={(event) => onUpdateField("validation", event.target.value)} />
          </Field>
        </div>
      </section>

      <section aria-labelledby="project-state-title" className="border-t border-slate-200 pt-8">
        <h2 id="project-state-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">결과물과 현재 상태</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">출품 당시 만든 결과의 수준과 지금 프로젝트가 움직이고 있는지는 서로 다른 정보입니다.</p>
        <div className="mt-6 space-y-8">
          <ChoiceList id="resultLevel" legend="출품 당시 결과물 단계" required error={errors.resultLevel}>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {resultLevelOptions.map((option) => (
                <label key={option.value} className="grid min-h-16 cursor-pointer grid-cols-[1.25rem_10rem_1fr] items-center gap-3 py-3 text-sm">
                  <input type="radio" name="resultLevel" value={option.value} checked={draft.resultLevel === option.value} onChange={() => onUpdateField("resultLevel", option.value)} className="size-4 accent-brand" />
                  <strong className="text-slate-800">{option.label}</strong>
                  <span className="leading-6 text-slate-500">{option.description}</span>
                </label>
              ))}
            </div>
          </ChoiceList>

          <ChoiceList id="activityStatus" legend="현재 활동 상태" required error={errors.activityStatus}>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {activityStatusOptions.map((option) => (
                <label key={option.value} className="grid min-h-16 cursor-pointer grid-cols-[1.25rem_7rem_1fr] items-center gap-3 py-3 text-sm">
                  <input type="radio" name="activityStatus" value={option.value} checked={draft.activityStatus === option.value} onChange={() => onUpdateField("activityStatus", option.value)} className="size-4 accent-brand" />
                  <strong className="text-slate-800">{option.label}</strong>
                  <span className="leading-6 text-slate-500">{option.description}</span>
                </label>
              ))}
            </div>
          </ChoiceList>
        </div>
      </section>
    </div>
  );
}
