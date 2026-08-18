"use client";

import { useState } from "react";
import { formatProjectAssetFileSize } from "../../lib/format-file-size";
import {
  assetCategoryOptions,
  assetProviderLabels,
  getAssetCategoryOption,
  ownershipOptions,
} from "../../model/options";
import type {
  AssetAccessRequirement,
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
  onAddAssetLink: (
    assetId: string,
    url: string,
    accessRequirement: AssetAccessRequirement,
  ) => boolean;
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
  onAddLink: (url: string, accessRequirement: AssetAccessRequirement) => boolean;
  onRemoveSource: (sourceId: string) => void;
}) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkAccess, setLinkAccess] = useState<AssetAccessRequirement>("PUBLIC");
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const categoryOption = getAssetCategoryOption(asset.category);

  function handleFileChange(files: FileList | null) {
    if (!files?.length) return;
    if (!asset.category) {
      setSourceError("파일을 추가하기 전에 자산 분야를 선택해 주세요.");
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
        `${rejectedFile.name}은(는) 이 분야의 권장 형식이 아닙니다. 다른 분야를 선택하거나 기타 자산으로 등록해 주세요.`,
      );
      return;
    }

    setSourceError(null);
    onAddFiles(files);
  }

  function handleAddLink() {
    if (!onAddLink(linkUrl, linkAccess)) {
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
          <p className="text-xs text-slate-500">자산 {index + 1}</p>
          <p className="mt-1 truncate font-bold text-slate-900">
            {asset.title || "새 자산 — 내용을 입력해 주세요"}
          </p>
        </div>
        <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border-r-2 border-b-2 border-brand group-open:-rotate-135" />
      </summary>

      <div className="space-y-7 border-t border-slate-200 py-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={`asset-${asset.id}-category`} label="자산 분야" required error={errors[`asset-${asset.id}-category`]}>
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
          <Field id={`asset-${asset.id}-title`} label="자산명" required error={errors[`asset-${asset.id}-title`]}>
            <TextInput
              id={`asset-${asset.id}-title`}
              value={asset.title}
              error={errors[`asset-${asset.id}-title`]}
              placeholder="예: 최종 서비스 기획서"
              onChange={(event) => onUpdate({ title: event.target.value })}
            />
          </Field>
        </div>

        <Field id={`asset-${asset.id}-role`} label="프로젝트에서 맡은 역할" required helper="이 자산이 어떤 결정이나 결과를 보여주는지 적어주세요." error={errors[`asset-${asset.id}-role`]}>
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
            하나의 자산에 원본 파일과 Figma·GitHub 같은 작업 링크를 함께 연결할 수 있습니다.
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
                  : "자산 분야를 선택하면 권장 형식을 안내합니다."}
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
              <div className="mt-2 flex gap-2">
                <select
                  aria-label="외부 링크 접근 상태"
                  value={linkAccess}
                  onChange={(event) => setLinkAccess(event.target.value as AssetAccessRequirement)}
                  className="min-h-10 min-w-0 flex-1 border border-slate-300 bg-white px-2 text-xs text-slate-700 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-soft"
                >
                  <option value="PUBLIC">링크로 접근 가능</option>
                  <option value="PERMISSION_REQUIRED">접근 권한 필요</option>
                  <option value="PRIVATE">현재 비공개</option>
                </select>
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
            <ul className="mt-4 divide-y divide-slate-200 border-b border-slate-200" aria-label={`${asset.title || `자산 ${index + 1}`} 연결 자료`}>
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
                        <p className="mt-1 text-xs text-slate-500">
                          {source.accessRequirement === "PUBLIC" ? "링크로 접근 가능" : source.accessRequirement === "PERMISSION_REQUIRED" ? "접근 권한 필요" : "현재 비공개"}
                        </p>
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

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={`asset-${asset.id}-ownership`} label="소유·사용 권한" required error={errors[`asset-${asset.id}-ownership`]}>
            <SelectInput
              id={`asset-${asset.id}-ownership`}
              value={asset.ownershipStatus}
              error={errors[`asset-${asset.id}-ownership`]}
              onChange={(event) => onUpdate({ ownershipStatus: event.target.value as ProjectAssetDraft["ownershipStatus"] })}
            >
              <option value="">선택해 주세요</option>
              {ownershipOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </SelectInput>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id={`asset-${asset.id}-version`} label="버전">
              <TextInput id={`asset-${asset.id}-version`} value={asset.versionLabel} placeholder="예: 최종본" onChange={(event) => onUpdate({ versionLabel: event.target.value })} />
            </Field>
            <Field id={`asset-${asset.id}-updated`} label="최종 수정일">
              <TextInput id={`asset-${asset.id}-updated`} type="date" value={asset.updatedAt} onChange={(event) => onUpdate({ updatedAt: event.target.value })} />
            </Field>
          </div>
        </div>

        <Field id={`asset-${asset.id}-rights`} label="권리 범위 설명" helper="팀 공동 자산이나 외부 자료가 있다면 어떤 동의가 필요한지도 적어주세요.">
          <TextArea id={`asset-${asset.id}-rights`} value={asset.rightsDescription} className="min-h-24" placeholder="예: 팀원 4인의 공동 저작물이며 공개 전 동의를 받았습니다." onChange={(event) => onUpdate({ rightsDescription: event.target.value })} />
        </Field>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="button" onClick={onRemove} className="min-h-10 text-sm font-medium text-red-700 underline decoration-red-300 underline-offset-4 hover:decoration-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">이 자산 삭제</button>
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
        <h2 id="retrospective-title" className="text-lg font-bold text-slate-950">시행착오와 다음 과제</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">완성된 결과보다 무엇을 시도했고 어디에서 막혔는지가 다음 실행자에게 더 유용할 수 있습니다.</p>
        <div className="mt-6 space-y-6">
          <Field id="attempts" label="시도한 방법" required error={errors.attempts}>
            <TextArea id="attempts" value={draft.attempts} error={errors.attempts} placeholder="문제를 해결하기 위해 실제로 시도했던 접근을 적어주세요." onChange={(event) => onUpdateField("attempts", event.target.value)} />
          </Field>
          <Field id="difficulties" label="어려웠던 점">
            <TextArea id="difficulties" value={draft.difficulties} className="min-h-24" placeholder="일정, 기술, 팀, 사용자 검증 등 진행 과정에서 어려웠던 점을 적어주세요." onChange={(event) => onUpdateField("difficulties", event.target.value)} />
          </Field>
          <Field id="limitations" label="한계와 배운 점" required error={errors.limitations}>
            <TextArea id="limitations" value={draft.limitations} error={errors.limitations} placeholder="결과의 한계와 다시 한다면 바꾸고 싶은 점을 적어주세요." onChange={(event) => onUpdateField("limitations", event.target.value)} />
          </Field>
          {draft.activityStatus === "PAUSED" || draft.activityStatus === "ENDED" ? (
            <Field id="endReason" label={draft.activityStatus === "PAUSED" ? "현재 멈춘 이유" : "활동을 종료한 이유"} required error={errors.endReason}>
              <TextArea id="endReason" value={draft.endReason} error={errors.endReason} className="min-h-24" placeholder="단순한 상태명이 아니라 실제로 이어가기 어려웠던 이유를 적어주세요." onChange={(event) => onUpdateField("endReason", event.target.value)} />
            </Field>
          ) : null}
          <Field id="nextSteps" label="후속 과제" required error={errors.nextSteps}>
            <TextArea id="nextSteps" value={draft.nextSteps} error={errors.nextSteps} className="min-h-24" placeholder="다음 팀이 이어간다면 먼저 확인하거나 개선해야 할 일을 적어주세요." onChange={(event) => onUpdateField("nextSteps", event.target.value)} />
          </Field>
        </div>
      </section>

      <section aria-labelledby="assets-title" className="border-t border-slate-200 pt-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="assets-title" className="text-lg font-bold text-slate-950">보유 자산</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">파일 개수가 아니라 자산의 내용·역할·접근성·권리 설명이 정보 충실도 평가에 활용됩니다.</p>
          </div>
          <button type="button" onClick={onAddAsset} className="min-h-11 shrink-0 border-b-2 border-brand-accent px-1 text-sm font-bold text-brand hover:border-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">자산 추가</button>
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
                onAddLink={(url, accessRequirement) => onAddAssetLink(asset.id, url, accessRequirement)}
                onRemoveSource={(sourceId) => onRemoveAssetSource(asset.id, sourceId)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 border-y border-slate-200 py-7">
            <p className="font-medium text-slate-800">등록한 자산이 없습니다.</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">아카이브 등록은 계속할 수 있지만, 좀비 공개나 프로젝트 판매를 선택하려면 자산이 필요합니다.</p>
          </div>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-500">
          파일은 아직 서버에 업로드되지 않습니다. 텍스트와 링크는 이 브라우저에 임시 저장되지만 파일은 새로고침 후 다시 첨부해야 합니다.
        </p>
      </section>
    </div>
  );
}
