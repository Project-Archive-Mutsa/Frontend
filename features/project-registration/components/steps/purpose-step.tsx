import {
  recruitmentRoleOptions,
  registrationPurposeOptions,
} from "../../model/options";
import type {
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
} from "../../model/types";
import {
  ChoiceList,
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from "../project-registration-form-controls";

interface PurposeStepProps {
  draft: ProjectRegistrationDraft;
  errors: ProjectRegistrationFieldErrors;
  onUpdateField: <FieldName extends keyof ProjectRegistrationDraft>(
    field: FieldName,
    value: ProjectRegistrationDraft[FieldName],
  ) => void;
  onToggleListField: (
    field: "recruitmentRoles",
    value: string,
  ) => void;
}

function PurposeChoice({
  draft,
  errors,
  onUpdateField,
}: Pick<PurposeStepProps, "draft" | "errors" | "onUpdateField">) {
  return (
    <ChoiceList
      id="purpose"
      legend="프로젝트를 어떤 방식으로 연결할까요?"
      helper="현재 목적은 하나만 선택하며 프로젝트의 활동 상태와는 별개입니다."
      required
      error={errors.purpose}
    >
      <div className="divide-y divide-slate-200 border-y border-slate-200">
        {registrationPurposeOptions.map((option) => (
          <label key={option.value} className="grid min-h-20 cursor-pointer grid-cols-[1.25rem_10rem_1fr] items-center gap-3 py-4 text-sm">
            <input
              type="radio"
              name="purpose"
              value={option.value}
              checked={draft.purpose === option.value}
              onChange={() => onUpdateField("purpose", option.value)}
              className="size-4 accent-brand"
            />
            <strong className="text-slate-900">{option.label}</strong>
            <span className="leading-6 text-slate-500">{option.description}</span>
          </label>
        ))}
      </div>
    </ChoiceList>
  );
}

export default function PurposeStep({
  draft,
  errors,
  onUpdateField,
  onToggleListField,
}: PurposeStepProps) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="purpose-title">
        <h2 id="purpose-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">등록 목적</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">프로젝트 상세 정보를 공유할지, 프로젝트를 판매할지, 팀원을 모집할지 선택합니다.</p>
        <div className="mt-6">
          <PurposeChoice draft={draft} errors={errors} onUpdateField={onUpdateField} />
        </div>
      </section>

      {draft.purpose === "ZOMBIE" ? (
        <section aria-labelledby="zombie-purpose-title" className="border-t border-slate-200 pt-8">
          <h2 id="zombie-purpose-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">좀비 프로젝트 상세 정보</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">프로젝트명, 100자 소개, 출품 맥락, 상태와 자료 종류·개수는 무료로 공개됩니다. 문제 상황, 해결 방법, 검증 결과, 한계와 자료 파일·링크는 다른 사용자가 1,000P로 프로젝트 상세 정보를 열람한 뒤 볼 수 있습니다.</p>
          <p className="mt-3 text-sm font-bold text-slate-800">열람이 발생하면 정보 충실도에 따라 등록자에게 콘텐츠 정산 포인트가 지급됩니다.</p>
        </section>
      ) : null}

      {draft.purpose === "SELL" ? (
        <section aria-labelledby="sale-purpose-title" className="space-y-7 border-t border-slate-200 pt-8">
          <div>
            <h2 id="sale-purpose-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">판매 조건</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">프로젝트에 등록한 모든 정보와 자료를 하나의 판매 대상으로 묶고 희망 가격을 정합니다.</p>
          </div>
          <div id="saleAssets" className="border-y border-slate-200 py-5">
            <p className="text-sm font-bold text-slate-900">등록한 자료 전체가 판매에 포함됩니다.</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">앞 단계에서 추가한 자료 {draft.assets.length}개를 별도로 다시 선택하지 않습니다.</p>
            {errors.saleAssets ? <p role="alert" className="mt-2 text-sm text-red-700">{errors.saleAssets}</p> : null}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <ChoiceList id="pricingMode" legend="가격 조건" required>
              <div className="space-y-2 border-y border-slate-200 py-3 text-sm">
                <label className="flex min-h-11 cursor-pointer items-center gap-3"><input type="radio" name="pricingMode" checked={draft.pricingMode === "FIXED"} onChange={() => onUpdateField("pricingMode", "FIXED")} className="size-4 accent-brand" />제시한 가격으로 판매</label>
                <label className="flex min-h-11 cursor-pointer items-center gap-3"><input type="radio" name="pricingMode" checked={draft.pricingMode === "NEGOTIABLE"} onChange={() => onUpdateField("pricingMode", "NEGOTIABLE")} className="size-4 accent-brand" />가격 협의 가능</label>
              </div>
            </ChoiceList>
            <Field id="desiredPoints" label="희망 판매가" required helper="데모 버전에서는 충전 포인트로 거래합니다. 실서비스에서는 추가 결제수단이 제공될 예정입니다." error={errors.desiredPoints}>
              <div className="relative">
                <TextInput id="desiredPoints" inputMode="numeric" value={draft.desiredPoints} error={errors.desiredPoints} className="pr-16 text-right tabular-nums" placeholder="0" onChange={(event) => onUpdateField("desiredPoints", event.target.value.replace(/\D/g, ""))} />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-600">P</span>
              </div>
            </Field>
          </div>
        </section>
      ) : null}

      {draft.purpose === "TEAM_RECRUIT" ? (
        <section aria-labelledby="recruitment-purpose-title" className="space-y-7 border-t border-slate-200 pt-8">
          <div>
            <h2 id="recruitment-purpose-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">팀원 모집 조건</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">등록자가 프로젝트를 계속 주도합니다. 지원자가 판단하는 데 필요한 조건은 결제 없이 공개됩니다.</p>
          </div>
          <Field id="recruitmentTitle" label="모집 제목" required error={errors.recruitmentTitle}>
            <TextInput id="recruitmentTitle" value={draft.recruitmentTitle} error={errors.recruitmentTitle} placeholder="예: 전시 프로토타입을 함께 완성할 제품 디자이너를 찾습니다" onChange={(event) => onUpdateField("recruitmentTitle", event.target.value)} />
          </Field>
          <ChoiceList id="recruitmentRoles" legend="필요 역할" required error={errors.recruitmentRoles}>
            <div className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
              {recruitmentRoleOptions.map((role) => (
                <label key={role} className="flex min-h-11 cursor-pointer items-center gap-3 border-b border-slate-200 text-sm text-slate-700"><input type="checkbox" checked={draft.recruitmentRoles.includes(role)} onChange={() => onToggleListField("recruitmentRoles", role)} className="size-4 accent-brand" />{role}</label>
              ))}
            </div>
          </ChoiceList>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="recruitmentSkills" label="필요 역량·경험">
              <TextInput id="recruitmentSkills" value={draft.recruitmentSkills} placeholder="예: 사용자 인터뷰, Figma 프로토타이핑" onChange={(event) => onUpdateField("recruitmentSkills", event.target.value)} />
            </Field>
            <Field id="recruitmentHeadcount" label="모집 인원" required error={errors.recruitmentHeadcount}>
              <TextInput id="recruitmentHeadcount" inputMode="numeric" value={draft.recruitmentHeadcount} error={errors.recruitmentHeadcount} placeholder="1" onChange={(event) => onUpdateField("recruitmentHeadcount", event.target.value.replace(/\D/g, ""))} />
            </Field>
            <Field id="recruitmentDeadline" label="모집 마감일" required error={errors.recruitmentDeadline}>
              <TextInput id="recruitmentDeadline" type="date" value={draft.recruitmentDeadline} error={errors.recruitmentDeadline} onChange={(event) => onUpdateField("recruitmentDeadline", event.target.value)} />
            </Field>
            <Field id="recruitmentWorkMode" label="진행 방식">
              <SelectInput id="recruitmentWorkMode" value={draft.recruitmentWorkMode} onChange={(event) => onUpdateField("recruitmentWorkMode", event.target.value)}>
                <option value="">선택해 주세요</option>
                <option value="ONLINE">온라인</option>
                <option value="OFFLINE">오프라인</option>
                <option value="HYBRID">온·오프라인 병행</option>
              </SelectInput>
            </Field>
          </div>
          <Field id="recruitmentSchedule" label="예상 활동 일정" required error={errors.recruitmentSchedule}>
            <TextArea id="recruitmentSchedule" value={draft.recruitmentSchedule} error={errors.recruitmentSchedule} className="min-h-24" placeholder="예상 기간, 정기 회의와 주요 마일스톤을 적어주세요." onChange={(event) => onUpdateField("recruitmentSchedule", event.target.value)} />
          </Field>
          <Field id="recruitmentApplicationNote" label="지원 안내">
            <TextArea id="recruitmentApplicationNote" value={draft.recruitmentApplicationNote} className="min-h-24" placeholder="지원할 때 알려주면 좋은 경험, 일정과 연락 방식을 적어주세요." onChange={(event) => onUpdateField("recruitmentApplicationNote", event.target.value)} />
          </Field>
        </section>
      ) : null}
    </div>
  );
}
