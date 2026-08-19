import { formatRecruitmentDeadline } from "@/features/team-recruitment/lib/format-recruitment-deadline";
import type { TeamRecruitment } from "@/features/team-recruitment/types";
import ProjectListCard from "@/shared/components/project-list-card/project-list-card";
import {
  getProjectActivityStatusLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

interface TeamRecruitmentCardProps {
  recruitment: TeamRecruitment;
}

function getReferenceAssetSummary(recruitment: TeamRecruitment) {
  if (recruitment.referenceAssetCount === null || recruitment.referenceAssetCount === undefined) {
    return "연동 전";
  }
  const categories = recruitment.referenceAssetCategories?.slice(0, 2).join(" · ");
  return categories
    ? `${recruitment.referenceAssetCount}개 · ${categories}`
    : `${recruitment.referenceAssetCount}개`;
}

function getAwardSummary(recruitment: TeamRecruitment) {
  if (recruitment.awardTitles === undefined || recruitment.awardTitles === null) {
    return "연동 전";
  }
  return recruitment.awardTitles.length > 0
    ? recruitment.awardTitles.slice(0, 2).join(", ")
    : "없음";
}

export default function TeamRecruitmentCard({
  recruitment,
}: TeamRecruitmentCardProps) {
  const eventYear = recruitment.eventDate?.slice(0, 4);
  const projectTitle = recruitment.projectName ?? recruitment.title;
  const projectSummary = recruitment.projectSummary ?? recruitment.description;

  return (
    <ProjectListCard
      title={projectTitle}
      summary={projectSummary}
      contextItems={[
        { label: "팀원 모집" },
        {
          label: recruitment.eventName
            ? `${recruitment.eventName}${eventYear ? ` · ${eventYear}년 출품` : ""}`
            : "출품 행사 연동 전",
        },
        ...(recruitment.registeredDate
          ? [{
              label: `${recruitment.registeredDate} 등록`,
              dateTime: recruitment.registeredDate,
            }]
          : []),
      ]}
      tags={[
        ...new Set(
          [recruitment.category ?? "", ...(recruitment.tags ?? [])].filter(Boolean),
        ),
      ]}
      facts={[
        {
          label: "결과물 단계",
          value: getProjectResultLevelLabel(recruitment.resultLevel),
        },
        {
          label: "현재 활동 상태",
          value: getProjectActivityStatusLabel(recruitment.activityStatus),
        },
        {
          label: "모집 참고 자산",
          value: getReferenceAssetSummary(recruitment),
        },
        { label: "수상 이력", value: getAwardSummary(recruitment) },
      ]}
      representativeImage={recruitment.representativeImage ?? null}
      informationCompletenessScore={recruitment.informationCompletenessScore}
    >
      <section aria-label="팀원 모집 조건">
        <h3 className="text-sm font-bold text-slate-900">{recruitment.title}</h3>
        <dl className="mt-4 grid gap-x-7 gap-y-5 text-sm sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">필요 역할</dt>
            <dd className="mt-1 font-bold text-slate-800">
              {recruitment.roles.join(", ") || "역할 미정"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">모집 인원</dt>
            <dd className="mt-1 font-bold text-slate-800">
              {recruitment.headcount ? `${recruitment.headcount}명` : "연동 전"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">모집 마감</dt>
            <dd className="mt-1 font-bold tabular-nums text-slate-800">
              <time dateTime={recruitment.deadline}>
                {formatRecruitmentDeadline(recruitment.deadline)}
              </time>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">필요 역량·경험</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {recruitment.skills ?? "연동 전"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">진행 방식</dt>
            <dd className="mt-1 font-bold text-slate-800">
              {recruitment.workMode ?? "연동 전"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">활동 일정</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {recruitment.schedule ?? "연동 전"}
            </dd>
          </div>
        </dl>
      </section>
    </ProjectListCard>
  );
}
