import {
  assetCategoryOptions,
  recruitmentRoleOptions,
  registrationPurposeOptions,
} from "../../model/options";
import type {
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
  ZombieAssetTermsDraft,
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
    field:
      | "recruitmentRoles"
      | "zombieAssetIds"
      | "saleAssetIds"
      | "recruitmentReferenceAssetIds",
    value: string,
  ) => void;
  onUpdateZombieAssetTerms: (
    assetId: string,
    values: Partial<ZombieAssetTermsDraft>,
  ) => void;
}

function AssetSelectionList({
  id,
  legend,
  helper,
  assets,
  selectedAssetIds,
  error,
  onToggle,
  required = false,
}: {
  id: string;
  legend: string;
  helper: string;
  assets: ProjectRegistrationDraft["assets"];
  selectedAssetIds: string[];
  error?: string;
  onToggle: (assetId: string) => void;
  required?: boolean;
}) {
  return (
    <ChoiceList id={id} legend={legend} helper={helper} required={required} error={error}>
      {assets.length > 0 ? (
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {assets.map((asset) => {
            const categoryLabel = assetCategoryOptions.find((option) => option.value === asset.category)?.label ?? "분야 미선택";
            return (
              <label key={asset.id} className="grid min-h-16 cursor-pointer grid-cols-[1.25rem_1fr_auto] items-center gap-3 py-3 text-sm">
                <input type="checkbox" checked={selectedAssetIds.includes(asset.id)} onChange={() => onToggle(asset.id)} className="size-4 accent-brand" />
                <span className="min-w-0">
                  <strong className="block truncate text-slate-800">{asset.title || "이름 없는 자산"}</strong>
                  <span className="mt-1 block text-xs text-slate-500">{asset.projectRole || "역할 설명 없음"}</span>
                </span>
                <span className="text-xs text-slate-500">{categoryLabel}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <p className="border-y border-slate-200 py-5 text-sm leading-6 text-slate-500">앞 단계에서 보유 자산을 먼저 추가해 주세요.</p>
      )}
    </ChoiceList>
  );
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
  onUpdateZombieAssetTerms,
}: PurposeStepProps) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="purpose-title">
        <h2 id="purpose-title" className="text-lg font-bold text-slate-950">등록 목적</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">같은 출품작이라도 기록, 공개 계승, 권리 이전, 팀원 모집은 필요한 정보와 책임이 다릅니다.</p>
        <div className="mt-6">
          <PurposeChoice draft={draft} errors={errors} onUpdateField={onUpdateField} />
        </div>
      </section>

      {draft.purpose === "ARCHIVE" ? (
        <section aria-labelledby="archive-purpose-title" className="border-t border-slate-200 pt-8">
          <h2 id="archive-purpose-title" className="text-lg font-bold text-slate-950">아카이브 등록</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">기본정보는 탐색 목록에 공개되고, 문제 정의·해결 과정·회고와 첨부 자산은 결제 후 상세 리포트로 제공됩니다. 자산의 사용권이나 소유권은 상세 리포트 열람에 포함되지 않습니다.</p>
        </section>
      ) : null}

      {draft.purpose === "ZOMBIE" ? (
        <section aria-labelledby="zombie-purpose-title" className="space-y-7 border-t border-slate-200 pt-8">
          <div>
            <h2 id="zombie-purpose-title" className="text-lg font-bold text-slate-950">공개 계승 조건</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">좀비 프로젝트는 단순히 멈춘 프로젝트가 아닙니다. 실제 재사용 가능한 자산과 이용조건을 공개해야 합니다.</p>
          </div>
          <AssetSelectionList
            id="zombieAssetIds"
            legend="공개 재사용 자산"
            helper="여기서 선택한 자산은 결제 없이 확인하고 라이선스 조건에 따라 활용할 수 있습니다."
            required
            assets={draft.assets}
            selectedAssetIds={draft.zombieAssetIds}
            error={errors.zombieAssetIds}
            onToggle={(assetId) => onToggleListField("zombieAssetIds", assetId)}
          />
          {draft.zombieAssetIds.length > 0 ? (
            <div className="divide-y divide-slate-300 border-y border-slate-300">
              {draft.zombieAssetIds.map((assetId) => {
                const asset = draft.assets.find((item) => item.id === assetId);
                const terms = draft.zombieAssetTerms[assetId] ?? {
                  licenseName: "",
                  attribution: "",
                  reuseTerms: "",
                };
                return (
                  <section key={assetId} aria-labelledby={`zombie-${assetId}-title`} className="py-6">
                    <h3 id={`zombie-${assetId}-title`} className="font-bold text-slate-900">{asset?.title || "이름 없는 자산"} 이용조건</h3>
                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                      <Field id={`zombie-${assetId}-license`} label="라이선스·이용조건 이름" required error={errors[`zombie-${assetId}-license`]}>
                        <TextInput id={`zombie-${assetId}-license`} value={terms.licenseName} error={errors[`zombie-${assetId}-license`]} placeholder="예: MIT License, CC BY 4.0" onChange={(event) => onUpdateZombieAssetTerms(assetId, { licenseName: event.target.value })} />
                      </Field>
                      <Field id={`zombie-${assetId}-attribution`} label="출처 표시 방법">
                        <TextInput id={`zombie-${assetId}-attribution`} value={terms.attribution} placeholder="예: 프로젝트명과 원작자 이름 표시" onChange={(event) => onUpdateZombieAssetTerms(assetId, { attribution: event.target.value })} />
                      </Field>
                    </div>
                    <Field id={`zombie-${assetId}-terms`} label="재사용 조건" required helper="상업적 이용, 수정, 재배포 조건을 설명해 주세요. 플랫폼은 법적 적합성을 보증하지 않습니다." error={errors[`zombie-${assetId}-terms`]} className="mt-6">
                      <TextArea id={`zombie-${assetId}-terms`} value={terms.reuseTerms} error={errors[`zombie-${assetId}-terms`]} placeholder="허용하는 활용 범위와 반드시 지켜야 할 조건을 적어주세요." onChange={(event) => onUpdateZombieAssetTerms(assetId, { reuseTerms: event.target.value })} />
                    </Field>
                  </section>
                );
              })}
            </div>
          ) : null}
        </section>
      ) : null}

      {draft.purpose === "SELL" ? (
        <section aria-labelledby="sale-purpose-title" className="space-y-7 border-t border-slate-200 pt-8">
          <div>
            <h2 id="sale-purpose-title" className="text-lg font-bold text-slate-950">판매 조건</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">상세 리포트 열람과 프로젝트 판매는 별도 거래입니다. 무상 공유는 아카이브 또는 좀비 프로젝트에서 설정하며, 계좌나 결제 정보는 등록 단계에서 받지 않습니다.</p>
          </div>
          <AssetSelectionList
            id="saleAssetIds"
            legend="판매 대상 자산"
            helper="목록에는 판매 자산명과 권리 요약만 공개되고 실제 파일은 거래가 성사된 뒤 전달합니다."
            required
            assets={draft.assets}
            selectedAssetIds={draft.saleAssetIds}
            error={errors.saleAssetIds}
            onToggle={(assetId) => onToggleListField("saleAssetIds", assetId)}
          />
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
          <Field id="saleRightsScope" label="판매에 포함할 권리 범위" required helper="소유권, 독점적 사용권, 수정·배포 가능 여부와 팀원 동의 범위를 구체적으로 적어주세요." error={errors.saleRightsScope}>
            <TextArea id="saleRightsScope" value={draft.saleRightsScope} error={errors.saleRightsScope} placeholder="판매할 권리와 판매에 포함하지 않는 권리를 구분해 적어주세요." onChange={(event) => onUpdateField("saleRightsScope", event.target.value)} />
          </Field>
        </section>
      ) : null}

      {draft.purpose === "TEAM_RECRUIT" ? (
        <section aria-labelledby="recruitment-purpose-title" className="space-y-7 border-t border-slate-200 pt-8">
          <div>
            <h2 id="recruitment-purpose-title" className="text-lg font-bold text-slate-950">팀원 모집 조건</h2>
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
          <AssetSelectionList
            id="recruitmentReferenceAssetIds"
            legend="모집 참고 자산"
            helper="지원자가 결제하지 않아도 확인할 수 있는 자료만 선택해 주세요. 선택하지 않아도 됩니다."
            assets={draft.assets}
            selectedAssetIds={draft.recruitmentReferenceAssetIds}
            onToggle={(assetId) => onToggleListField("recruitmentReferenceAssetIds", assetId)}
          />
        </section>
      ) : null}
    </div>
  );
}
