import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";
import type { ProjectDetailViewModel } from "../model/types";
import {
  formatProjectDate,
  formatProjectPeriod,
  getEventTypeLabel,
} from "../lib/format-project-detail";

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold leading-6 text-slate-800">
        {value}
      </dd>
    </div>
  );
}

interface ProjectPublicRecordProps {
  project: ProjectDetailViewModel;
}

export default function ProjectPublicRecord({ project }: ProjectPublicRecordProps) {
  const awardSummary = project.awards.length
    ? project.awards
        .map((award) =>
          award.awardedAt
            ? `${award.title} (${formatProjectDate(award.awardedAt)})`
            : award.title,
        )
        .join(", ")
    : "없음 또는 미입력";
  const teamSummary = project.team
    ? [
        project.team.memberCount === null ? null : `${project.team.memberCount}명`,
        project.team.roles.join(", "),
      ]
        .filter(Boolean)
        .join(" · ") || "미입력"
    : "미입력";
  const assetCount =
    project.assetSummary.publicCount + project.assetSummary.paidCount;
  const assetSummary = project.assetSummary.categories.length
    ? `총 ${assetCount}개 · ${project.assetSummary.categories.join(", ")}`
    : `총 ${assetCount}개`;

  return (
    <div className="space-y-14">
      <section aria-labelledby="record-context-title">
        <div className="border-b border-slate-300 pb-5">
          <h2 id="record-context-title" className="font-display text-2xl font-bold tracking-[-0.025em] text-slate-950">
            공개 프로젝트 기록
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            출품 맥락과 현재 상태처럼 프로젝트를 비교하는 데 필요한 기본정보입니다.
          </p>
        </div>

        <dl className="grid gap-x-8 gap-y-7 py-7 sm:grid-cols-2 xl:grid-cols-3">
          <Definition label="등록 목적" value={getProjectPurposeLabel(project.registrationPurpose) ?? "미입력"} />
          <Definition label="행사 유형" value={getEventTypeLabel(project.event?.type ?? null)} />
          <Definition label="출품 행사" value={project.event?.name ?? "미입력"} />
          <Definition label="주최 기관" value={project.event?.hostOrganization ?? "미입력"} />
          <Definition
            label="행사 기간"
            value={formatProjectPeriod(project.event?.startedAt ?? null, project.event?.endedAt ?? null)}
          />
          <Definition
            label="프로젝트 수행 기간"
            value={formatProjectPeriod(project.developmentPeriod.startedAt, project.developmentPeriod.endedAt)}
          />
          <Definition label="결과물 단계" value={getProjectResultLevelLabel(project.resultLevel)} />
          <Definition label="현재 활동 상태" value={getProjectActivityStatusLabel(project.activityStatus)} />
          <Definition label="팀 구성" value={teamSummary} />
          <Definition label="수상 이력" value={awardSummary} />
          <Definition
            label="보유 자산 요약"
            value={assetSummary}
          />
          <Definition label="등록일" value={formatProjectDate(project.registeredAt)} />
        </dl>
      </section>
    </div>
  );
}
