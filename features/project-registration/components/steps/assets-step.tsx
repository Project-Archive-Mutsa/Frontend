"use client";

import { useState } from "react";
import { formatProjectAssetFileSize } from "../../lib/format-file-size";
import {
  assetCategoryOptions,
  assetProviderLabels,
  getAssetCategoryOption,
} from "../../model/options";
import type {
  ProjectAssetDraft,
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
} from "../../model/types";
import {
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from "../project-registration-form-controls";

interface AssetsStepProps {
  draft: ProjectRegistrationDraft;
  errors: ProjectRegistrationFieldErrors;
  onUpdateField: <FieldName extends keyof ProjectRegistrationDraft>(
    field: FieldName,
    value: ProjectRegistrationDraft[FieldName],
  ) => void;
  onAddAsset: () => void;
  onUpdateAsset: (id: string, values: Partial<ProjectAssetDraft>) => void;
  onRemoveAsset: (id: string) => void;
  onAddAssetFiles: (assetId: string, files: FileList | null) => void;
  onAddAssetLink: (assetId: string, url: string) => boolean;
  onRemoveAssetSource: (assetId: string, sourceId: string) => void;
}

function AssetEditor({
  asset,
  index,
  isInitiallyOpen,
  errors,
  onUpdate,
  onRemove,
  onAddFiles,
  onAddLink,
  onRemoveSource,
}: {
  asset: ProjectAssetDraft;
  index: number;
  isInitiallyOpen: boolean;
  errors: ProjectRegistrationFieldErrors;
  onUpdate: (values: Partial<ProjectAssetDraft>) => void;
  onRemove: () => void;
  onAddFiles: (files: FileList | null) => void;
  onAddLink: (url: string) => boolean;
  onRemoveSource: (sourceId: string) => void;
}) {
  const [linkUrl, setLinkUrl] = useState("");
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const categoryOption = getAssetCategoryOption(asset.category);

  function handleFileChange(files: FileList | null) {
    if (!files?.length) return;
    if (!asset.category) {
      setSourceError("파일을 추가하기 전에 자료 분야를 선택해 주세요.");
      return;
    }

    const allowedExtensions = categoryOption?.acceptedExtensions
      .split(",")
      .filter(Boolean) ?? [];
    const rejectedFile = Array.from(files).find(
      (file) =>
        allowedExtensions.length > 0 &&
        !allowedExtensions.some((extension) =>
          file.name.toLowerCase().endsWith(extension),
        ),
    );
    if (rejectedFile) {
      setSourceError(
        `${rejectedFile.name}은(는) 이 분야의 권장 형식이 아닙니다. 다른 분야를 선택하거나 기타 자료로 등록해 주세요.`,
      );
      return;
    }

    setSourceError(null);
    onAddFiles(files);
  }

  function handleAddLink() {
    if (!onAddLink(linkUrl)) {
      setSourceError("http:// 또는 https://로 시작하는 올바른 링크를 입력해 주세요.");
      return;
    }
    setSourceError(null);
    setLinkUrl("");
  }

  return (
    <details
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      className="group border-t border-slate-300 last:border-b"
    >
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">자료 {index + 1}</p>
          <p className="mt-1 truncate font-bold text-slate-900">
            {asset.title || "새 자료 — 내용을 입력해 주세요"}
          </p>
        </div>
        <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border-r-2 border-b-2 border-brand group-open:-rotate-135" />
      </summary>

      <div className="space-y-7 border-t border-slate-200 py-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={`asset-${asset.id}-category`} label="자료 분야" required error={errors[`asset-${asset.id}-category`]}>
            <SelectInput
              id={`asset-${asset.id}-category`}
              value={asset.category}
              error={errors[`asset-${asset.id}-category`]}
              onChange={(event) => onUpdate({ category: event.target.value as ProjectAssetDraft["category"] })}
            >
              <option value="">선택해 주세요</option>
              {assetCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label} — {option.helper}</option>
              ))}
            </SelectInput>
          </Field>
          <Field id={`asset-${asset.id}-title`} label="자료명" required error={errors[`asset-${asset.id}-title`]}>
            <TextInput
              id={`asset-${asset.id}-title`}
              value={asset.title}
              error={errors[`asset-${asset.id}-title`]}
              placeholder="예: 최종 서비스 기획서"
              onChange={(event) => onUpdate({ title: event.target.value })}
            />
          </Field>
        </div>

        <Field id={`asset-${asset.id}-role`} label="프로젝트에서 맡은 역할" required helper="이 자료가 어떤 결정이나 결과를 보여주는지 적어주세요." error={errors[`asset-${asset.id}-role`]}>
          <TextInput
            id={`asset-${asset.id}-role`}
            value={asset.projectRole}
            error={errors[`asset-${asset.id}-role`]}
            placeholder="예: 사용자 문제와 핵심 기능을 정리한 최종 기획안"
            onChange={(event) => onUpdate({ projectRole: event.target.value })}
          />
        </Field>

        <Field id={`asset-${asset.id}-description`} label="내용과 활용 방법" required error={errors[`asset-${asset.id}-description`]}>
          <TextArea
            id={`asset-${asset.id}-description`}
            value={asset.description}
            error={errors[`asset-${asset.id}-description`]}
            className="min-h-24"
            placeholder="파일 안에 무엇이 있고 다른 사람이 어떤 판단이나 작업에 활용할 수 있는지 설명해 주세요."
            onChange={(event) => onUpdate({ description: event.target.value })}
          />
        </Field>

        <section
          id={`asset-${asset.id}-sources`}
          tabIndex={-1}
          aria-labelledby={`asset-${asset.id}-sources-title`}
        >
          <h3 id={`asset-${asset.id}-sources-title`} className="text-sm font-bold text-slate-800">파일과 외부 링크</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            하나의 자료에 파일과 Figma·GitHub 같은 작업 링크를 함께 연결할 수 있습니다.
          </p>

          <div className="mt-4 grid gap-5 border-y border-slate-200 py-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">파일 첨부</p>
              <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center border border-slate-300 bg-white px-4 text-sm font-bold text-brand hover:border-brand-accent focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
                파일 선택
                <input
                  type="file"
                  multiple
                  accept={categoryOption?.acceptedExtensions || undefined}
                  className="sr-only"
                  onChange={(event) => handleFileChange(event.target.files)}
                />
              </label>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {categoryOption?.acceptedExtensions
                  ? `권장 형식: ${categoryOption.acceptedExtensions.replaceAll(",", ", ")}`
                  : "자료 분야를 선택하면 권장 형식을 안내합니다."}
              </p>
            </div>

            <div>
              <label htmlFor={`asset-${asset.id}-link`} className="text-sm font-semibold text-slate-700">외부 링크</label>
              <TextInput
                id={`asset-${asset.id}-link`}
                type="url"
                value={linkUrl}
                placeholder="https://figma.com/..."
                className="mt-3"
                onChange={(event) => setLinkUrl(event.target.value)}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">외부 링크도 등록 자료에 포함되며 마지막 단계의 공개 동의가 함께 적용됩니다.</p>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!linkUrl.trim()}
                  onClick={handleAddLink}
                  className="min-h-10 shrink-0 bg-brand px-3 text-xs font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  링크 추가
                </button>
              </div>
            </div>
          </div>

          {sourceError ? <p role="alert" className="mt-3 text-sm font-medium text-red-700">{sourceError}</p> : null}
          {errors[`asset-${asset.id}-sources`] ? <p role="alert" className="mt-3 text-sm font-medium text-red-700">{errors[`asset-${asset.id}-sources`]}</p> : null}

          {asset.sources.length > 0 ? (
            <ul className="mt-4 divide-y divide-slate-200 border-b border-slate-200" aria-label={`${asset.title || `자료 ${index + 1}`} 연결 자료`}>
              {asset.sources.map((source) => (
                <li key={source.id} className="flex min-h-14 items-center justify-between gap-4 py-3 text-sm">
                  <div className="min-w-0">
                    {source.kind === "UPLOAD" ? (
                      <>
                        <p className="truncate font-medium text-slate-800">{source.fileName}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatProjectAssetFileSize(source.sizeInBytes)}
                          {source.needsReattach ? " · 새로고침 후 재첨부 필요" : " · 브라우저에서 선택됨"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-slate-800">{assetProviderLabels[source.provider]}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{source.url}</p>
                      </>
                    )}
                  </div>
                  <button type="button" onClick={() => onRemoveSource(source.id)} className="min-h-9 shrink-0 text-xs font-medium text-red-700 underline decoration-red-300 underline-offset-4">삭제</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">연결한 파일이나 링크가 없습니다.</p>
          )}
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Field id={`asset-${asset.id}-version`} label="버전">
            <TextInput id={`asset-${asset.id}-version`} value={asset.versionLabel} placeholder="예: 최종본" onChange={(event) => onUpdate({ versionLabel: event.target.value })} />
          </Field>
          <Field id={`asset-${asset.id}-updated`} label="최종 수정일">
            <TextInput id={`asset-${asset.id}-updated`} type="date" value={asset.updatedAt} onChange={(event) => onUpdate({ updatedAt: event.target.value })} />
          </Field>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="button" onClick={onRemove} className="min-h-10 text-sm font-medium text-red-700 underline decoration-red-300 underline-offset-4 hover:decoration-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">이 자료 삭제</button>
        </div>
      </div>
    </details>
  );
}

export default function AssetsStep({
  draft,
  errors,
  onUpdateField,
  onAddAsset,
  onUpdateAsset,
  onRemoveAsset,
  onAddAssetFiles,
  onAddAssetLink,
  onRemoveAssetSource,
}: AssetsStepProps) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="retrospective-title">
        <h2 id="retrospective-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">제약·한계와 후속 과제</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">실제로 적용한 접근, 확인된 제약과 검증이 필요한 항목을 관찰 가능한 사실 중심으로 작성합니다.</p>
        <div className="mt-6 space-y-6">
          <Field id="approaches" label="수행한 접근" required helper="적용한 방법·도구·절차와 확인된 결과를 구분해 작성해 주세요." error={errors.approaches}>
            <TextArea id="approaches" value={draft.approaches} error={errors.approaches} placeholder="예: 2주간 사용자 인터뷰 8건을 진행하고 요구사항을 우선순위별로 분류했습니다." onChange={(event) => onUpdateField("approaches", event.target.value)} />
          </Field>
          <Field id="constraints" label="발생한 제약 조건" helper="일정, 데이터, 장비, 규정, 인력, 기술 의존성처럼 결과에 영향을 준 조건을 적어주세요.">
            <TextArea id="constraints" value={draft.constraints} className="min-h-24" placeholder="예: 행사 일정상 현장 검증 기간이 3일로 제한됐고 iOS 기기 테스트는 진행하지 못했습니다." onChange={(event) => onUpdateField("constraints", event.target.value)} />
          </Field>
          <Field id="limitations" label="확인된 한계" required helper="적용 범위, 검증하지 못한 가정과 결과를 일반화하기 어려운 조건을 적어주세요." error={errors.limitations}>
            <TextArea id="limitations" value={draft.limitations} error={errors.limitations} placeholder="예: 참여자가 모두 대학생이어서 다른 연령대에서도 같은 결과가 나오는지는 확인하지 못했습니다." onChange={(event) => onUpdateField("limitations", event.target.value)} />
          </Field>
          {draft.activityStatus === "PAUSED" || draft.activityStatus === "ENDED" ? (
            <Field id="endReason" label={draft.activityStatus === "PAUSED" ? "중단 사유" : "종료 사유"} required error={errors.endReason}>
              <TextArea id="endReason" value={draft.endReason} error={errors.endReason} className="min-h-24" placeholder="예: 핵심 데이터 제공 계약이 종료되어 추가 검증을 진행할 수 없었습니다." onChange={(event) => onUpdateField("endReason", event.target.value)} />
            </Field>
          ) : null}
          <Field id="nextValidationTasks" label="후속 검증 과제" required error={errors.nextValidationTasks}>
            <TextArea id="nextValidationTasks" value={draft.nextValidationTasks} error={errors.nextValidationTasks} className="min-h-24" placeholder="예: 50대 이상 사용자 10명을 대상으로 동일 과업의 완료율을 다시 측정해야 합니다." onChange={(event) => onUpdateField("nextValidationTasks", event.target.value)} />
          </Field>
        </div>
      </section>

      <section aria-labelledby="assets-title" className="border-t border-slate-200 pt-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="assets-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">프로젝트 자료</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">각 자료가 프로젝트에서 어떤 역할을 했고 무엇을 확인할 수 있는지 적어주세요.</p>
          </div>
          <button type="button" onClick={onAddAsset} className="min-h-11 shrink-0 border-b-2 border-brand-accent px-1 text-sm font-bold text-brand hover:border-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">자료 추가</button>
        </div>

        {draft.assets.length > 0 ? (
          <div className="mt-6">
            {draft.assets.map((asset, index) => (
              <AssetEditor
                key={asset.id}
                asset={asset}
                index={index}
                isInitiallyOpen={index === draft.assets.length - 1}
                errors={errors}
                onUpdate={(values) => onUpdateAsset(asset.id, values)}
                onRemove={() => onRemoveAsset(asset.id)}
                onAddFiles={(files) => onAddAssetFiles(asset.id, files)}
                onAddLink={(url) => onAddAssetLink(asset.id, url)}
                onRemoveSource={(sourceId) => onRemoveAssetSource(asset.id, sourceId)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 border-y border-slate-200 py-7">
            <p className="font-medium text-slate-800">등록한 자료가 없습니다.</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">좀비 프로젝트와 팀원 모집은 자료 없이도 등록할 수 있습니다. 프로젝트 판매를 선택하려면 제공할 자료를 하나 이상 추가해야 합니다.</p>
          </div>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-500">
          텍스트와 링크는 이 브라우저에 임시 저장됩니다. 선택한 파일은 임시 저장되지 않으므로 새로고침 후 다시 첨부해야 하며, 최종 등록할 때 서버에 업로드됩니다.
        </p>
      </section>
    </div>
  );
}
