import { eventTypeOptions } from "../../model/options";
import type {
  ProjectAwardDraft,
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
} from "../../model/types";
import { Field, SelectInput, TextInput } from "../project-registration-form-controls";

interface SubmissionStepProps {
  draft: ProjectRegistrationDraft;
  errors: ProjectRegistrationFieldErrors;
  onUpdateField: <FieldName extends keyof ProjectRegistrationDraft>(
    field: FieldName,
    value: ProjectRegistrationDraft[FieldName],
  ) => void;
  onAddAward: () => void;
  onUpdateAward: (id: string, values: Partial<ProjectAwardDraft>) => void;
  onRemoveAward: (id: string) => void;
}

export default function SubmissionStep({
  draft,
  errors,
  onUpdateField,
  onAddAward,
  onUpdateAward,
  onRemoveAward,
}: SubmissionStepProps) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="event-information-title">
        <h2 id="event-information-title" className="text-lg font-bold text-slate-950">
          출품한 행사
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          실제 제출했던 대회·공모전·수업 등의 맥락을 남겨야 이후 프로젝트를 정확히 찾을 수 있습니다.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field id="eventType" label="행사 유형" required error={errors.eventType}>
            <SelectInput
              id="eventType"
              value={draft.eventType}
              error={errors.eventType}
              onChange={(event) => onUpdateField("eventType", event.target.value as ProjectRegistrationDraft["eventType"])}
            >
              <option value="">선택해 주세요</option>
              {eventTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectInput>
          </Field>

          {draft.eventType === "OTHER" ? (
            <Field id="customEventType" label="기타 행사 유형" required error={errors.customEventType}>
              <TextInput
                id="customEventType"
                value={draft.customEventType}
                error={errors.customEventType}
                placeholder="예: 교내 창업 프로그램"
                onChange={(event) => onUpdateField("customEventType", event.target.value)}
              />
            </Field>
          ) : null}

          <Field id="eventName" label="행사명" required error={errors.eventName}>
            <TextInput
              id="eventName"
              value={draft.eventName}
              error={errors.eventName}
              placeholder="예: 2026 대학생 사회혁신 공모전"
              onChange={(event) => onUpdateField("eventName", event.target.value)}
            />
          </Field>

          <Field id="organizer" label="주최 기관" required error={errors.organizer}>
            <TextInput
              id="organizer"
              value={draft.organizer}
              error={errors.organizer}
              placeholder="예: OO대학교 산학협력단"
              onChange={(event) => onUpdateField("organizer", event.target.value)}
            />
          </Field>

          <Field id="eventDate" label="출품 시기" required error={errors.eventDate}>
            <TextInput
              id="eventDate"
              type="month"
              value={draft.eventDate}
              error={errors.eventDate}
              onChange={(event) => onUpdateField("eventDate", event.target.value)}
            />
          </Field>

          <Field id="participationTrack" label="참가 부문" helper="부문이 없었다면 비워도 됩니다.">
            <TextInput
              id="participationTrack"
              value={draft.participationTrack}
              placeholder="예: 서비스 기획 부문"
              onChange={(event) => onUpdateField("participationTrack", event.target.value)}
            />
          </Field>
        </div>
      </section>

      <section aria-labelledby="award-history-title" className="border-t border-slate-200 pt-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="award-history-title" className="text-lg font-bold text-slate-950">수상 이력</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              이력서처럼 직접 입력합니다. 별도 증빙은 받지 않으며 입력한 내용이 공개됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddAward}
            className="min-h-11 shrink-0 border-b-2 border-brand-accent px-1 text-sm font-bold text-brand hover:border-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            수상 이력 추가
          </button>
        </div>

        {draft.awards.length > 0 ? (
          <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {draft.awards.map((award, index) => (
              <div key={award.id} className="grid gap-4 py-5 sm:grid-cols-[1fr_11rem_auto] sm:items-end">
                <Field id={`award-${award.id}-title`} label={`수상명 ${index + 1}`}>
                  <TextInput
                    id={`award-${award.id}-title`}
                    value={award.title}
                    placeholder="예: 대상"
                    onChange={(event) => onUpdateAward(award.id, { title: event.target.value })}
                  />
                </Field>
                <Field id={`award-${award.id}-date`} label="수상일">
                  <TextInput
                    id={`award-${award.id}-date`}
                    type="date"
                    value={award.awardedAt}
                    onChange={(event) => onUpdateAward(award.id, { awardedAt: event.target.value })}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => onRemoveAward(award.id)}
                  className="min-h-11 px-2 text-sm font-medium text-red-700 underline decoration-red-300 underline-offset-4 hover:decoration-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 border-y border-slate-200 py-5 text-sm text-slate-500">수상 이력이 없어도 프로젝트를 등록할 수 있습니다.</p>
        )}
      </section>
    </div>
  );
}
