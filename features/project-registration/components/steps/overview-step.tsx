"use client";

import Image from "next/image";
import { useState } from "react";
import {
  methodOptions,
  problemAreaOptions,
  projectCategoryOptions,
} from "../../model/options";
import type {
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
} from "../../model/types";
import { ChoiceList, Field, TextInput } from "../project-registration-form-controls";

interface OverviewStepProps {
  draft: ProjectRegistrationDraft;
  errors: ProjectRegistrationFieldErrors;
  representativeImageUrl: string | null;
  onUpdateField: <FieldName extends keyof ProjectRegistrationDraft>(
    field: FieldName,
    value: ProjectRegistrationDraft[FieldName],
  ) => void;
  onToggleListField: (
    field: "categories" | "problemAreas" | "methods",
    value: string,
  ) => void;
  onAddCustomTag: (tag: string) => void;
  onRemoveCustomTag: (tag: string) => void;
  onRepresentativeImageChange: (file: File | null) => void;
}

function CheckboxOptions({
  name,
  options,
  values,
  onToggle,
}: {
  name: string;
  options: readonly string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 border-b border-slate-200 text-sm text-slate-700">
          <input
            type="checkbox"
            name={name}
            value={option}
            checked={values.includes(option)}
            onChange={() => onToggle(option)}
            className="size-4 accent-brand"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

export default function OverviewStep({
  draft,
  errors,
  representativeImageUrl,
  onUpdateField,
  onToggleListField,
  onAddCustomTag,
  onRemoveCustomTag,
  onRepresentativeImageChange,
}: OverviewStepProps) {
  const [customTag, setCustomTag] = useState("");

  function handleAddTag() {
    onAddCustomTag(customTag);
    setCustomTag("");
  }

  return (
    <div className="space-y-10">
      <section aria-labelledby="overview-basic-title">
        <h2 id="overview-basic-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">목록에 보일 기본정보</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">제목과 한 줄 소개는 프로젝트 탐색 결과에 무료로 공개됩니다.</p>

        <div className="mt-6 space-y-6">
          <Field id="projectName" label="프로젝트명" required error={errors.projectName}>
            <TextInput
              id="projectName"
              value={draft.projectName}
              error={errors.projectName}
              placeholder="프로젝트 이름을 입력해 주세요"
              onChange={(event) => onUpdateField("projectName", event.target.value)}
            />
          </Field>
          <Field id="summary" label="한 줄 소개" required helper={`${draft.summary.length} / 100자`} error={errors.summary}>
            <TextInput
              id="summary"
              value={draft.summary}
              maxLength={100}
              error={errors.summary}
              placeholder="누구의 어떤 문제를 어떻게 해결한 프로젝트인지 적어주세요"
              onChange={(event) => onUpdateField("summary", event.target.value)}
            />
          </Field>

          <Field
            id="representativeImageName"
            label="대표 이미지 (선택)"
            helper="필수 항목은 아닙니다. 탐색 카드에서 프로젝트를 구분할 수 있는 결과물 이미지가 있다면 추가해 주세요."
          >
            <div className="grid gap-4 sm:grid-cols-[12rem_1fr] sm:items-center">
              <div className="relative aspect-[16/10] overflow-hidden border border-slate-300 bg-brand-canvas">
                {representativeImageUrl ? (
                  <Image
                    src={representativeImageUrl}
                    alt="선택한 프로젝트 대표 이미지 미리보기"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs leading-5 text-slate-500">
                    {draft.representativeImageName ? "새로고침 후 파일을 다시 첨부해 주세요." : "선택한 이미지가 여기에 표시됩니다."}
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex min-h-11 cursor-pointer items-center border border-slate-300 bg-white px-4 text-sm font-bold text-brand hover:border-brand-accent focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
                  이미지 선택
                  <input
                    id="representativeImageName"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => onRepresentativeImageChange(event.target.files?.[0] ?? null)}
                  />
                </label>
                <p className="mt-2 break-all text-xs text-slate-500">{draft.representativeImageName || "PNG, JPG, WebP"}</p>
                {draft.representativeImageName ? (
                  <button
                    type="button"
                    onClick={() => onRepresentativeImageChange(null)}
                    className="mt-3 min-h-9 text-xs font-medium text-red-700 underline decoration-red-300 underline-offset-4"
                  >
                    대표 이미지 제거
                  </button>
                ) : null}
              </div>
            </div>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="teamName" label="팀명" helper="개인 프로젝트라면 비워도 됩니다.">
              <TextInput
                id="teamName"
                value={draft.teamName}
                placeholder="예: 다시, 봄"
                onChange={(event) => onUpdateField("teamName", event.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field id="projectStartedAt" label="시작일" required error={errors.projectStartedAt}>
                <TextInput id="projectStartedAt" type="date" value={draft.projectStartedAt} error={errors.projectStartedAt} onChange={(event) => onUpdateField("projectStartedAt", event.target.value)} />
              </Field>
              <Field id="projectEndedAt" label="종료일" required error={errors.projectEndedAt}>
                <TextInput id="projectEndedAt" type="date" value={draft.projectEndedAt} error={errors.projectEndedAt} onChange={(event) => onUpdateField("projectEndedAt", event.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="classification-title" className="border-t border-slate-200 pt-8">
        <h2 id="classification-title" className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">프로젝트 분류</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">개발 기술만이 아니라 프로젝트가 다룬 문제와 사용한 방법을 함께 분류합니다.</p>
        <div className="mt-6 space-y-8">
          <ChoiceList id="categories" legend="분야" required error={errors.categories}>
            <CheckboxOptions name="categories" options={projectCategoryOptions} values={draft.categories} onToggle={(value) => onToggleListField("categories", value)} />
          </ChoiceList>
          <ChoiceList id="problemAreas" legend="문제 영역" required error={errors.problemAreas}>
            <CheckboxOptions name="problemAreas" options={problemAreaOptions} values={draft.problemAreas} onToggle={(value) => onToggleListField("problemAreas", value)} />
          </ChoiceList>
          <ChoiceList id="methods" legend="방법·기술" required error={errors.methods}>
            <CheckboxOptions name="methods" options={methodOptions} values={draft.methods} onToggle={(value) => onToggleListField("methods", value)} />
          </ChoiceList>

          <Field id="customTag" label="직접 태그" helper="선택지에 없는 분야나 방법을 최대 5개까지 추가할 수 있습니다.">
            <div className="flex gap-2">
              <TextInput
                id="customTag"
                value={customTag}
                disabled={draft.customTags.length >= 5}
                placeholder="태그를 입력해 주세요"
                onChange={(event) => setCustomTag(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                disabled={!customTag.trim() || draft.customTags.length >= 5}
                onClick={handleAddTag}
                className="min-h-11 shrink-0 bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                추가
              </button>
            </div>
            {draft.customTags.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700" aria-label="추가한 직접 태그">
                {draft.customTags.map((tag) => (
                  <li key={tag} className="flex items-center gap-2 border-b border-brand-accent pb-1">
                    <span>{tag}</span>
                    <button type="button" onClick={() => onRemoveCustomTag(tag)} aria-label={`${tag} 태그 삭제`} className="min-h-7 text-xs text-red-700">삭제</button>
                  </li>
                ))}
              </ul>
            ) : null}
          </Field>
        </div>
      </section>
    </div>
  );
}
