import type { ZombieProject } from "@/features/zombie-projects/types";
import ProjectListCard from "@/shared/components/project-list-card/project-list-card";
import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

interface ZombieProjectItemProps {
  project: ZombieProject;
  headingLevel?: 2 | 3;
}

function getAssetCount(project: ZombieProject) {
  if (project.assetCount !== null && project.assetCount !== undefined) {
    return `${project.assetCount}개`;
  }
  if (project.zipFile) return "1개";
  return "0개";
}

function getAwardSummary(project: ZombieProject) {
  if (project.awardTitles === undefined || project.awardTitles === null) {
    return "미입력";
  }
  return project.awardTitles.length > 0
    ? project.awardTitles.slice(0, 2).join(", ")
    : "없음";
}

export default function ZombieProjectItem({
  project,
  headingLevel = 2,
}: ZombieProjectItemProps) {
  const eventYear = project.eventDate?.slice(0, 4);
  return (
    <ProjectListCard
      title={project.name}
      href={`/projects/${project.id}`}
      summary={project.description}
      contextItems={[
        {
          label:
            getProjectPurposeLabel(project.registrationPurpose) ??
            "좀비 프로젝트",
        },
        {
          label: project.eventName
            ? `${project.eventName}${eventYear ? ` · ${eventYear}년 출품` : ""}`
            : "출품 행사 미입력",
        },
        { label: `${project.registeredAt} 등록`, dateTime: project.registeredAt },
      ]}
      tags={[
        ...new Set([project.category ?? "", ...project.tags].filter(Boolean)),
      ]}
      facts={[
        {
          label: "결과물 단계",
          value: getProjectResultLevelLabel(project.resultLevel),
        },
        {
          label: "현재 활동 상태",
          value: getProjectActivityStatusLabel(project.activityStatus),
        },
        { label: "보유 자산", value: getAssetCount(project) },
        { label: "수상 이력", value: getAwardSummary(project) },
      ]}
      representativeImage={project.representativeImage}
      informationCompletenessScore={project.informationCompletenessScore}
      registrantName={project.sellerName}
      stats={[
        { label: "조회", value: project.stats.viewCount },
        { label: "좋아요", value: project.stats.likeCount },
        { label: "저장", value: project.stats.bookmarkCount },
      ]}
      headingLevel={headingLevel}
    >
      <section aria-label="프로젝트 상세 정보 안내">
        <h3 className="text-sm font-bold text-slate-900">프로젝트 상세 정보</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          문제 상황, 해결 방법, 검증 결과와 자산 파일·링크는 상세 정보 열람 후 확인할 수 있습니다.
        </p>
        {project.assetCategories?.length ? (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            자산 유형 {project.assetCategories.slice(0, 3).join(" · ")}
          </p>
        ) : null}
      </section>
    </ProjectListCard>
  );
}
