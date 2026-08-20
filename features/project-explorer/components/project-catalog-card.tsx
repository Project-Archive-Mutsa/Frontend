import type { ArchiveProjectItem } from "@/features/project-explorer/model/types";
import ProjectListCard from "@/shared/components/project-list-card/project-list-card";
import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

interface ProjectCatalogCardProps {
  project: ArchiveProjectItem;
}

function getAssetSummary(project: ArchiveProjectItem) {
  if (project.assetCount === null) return "미입력";
  const categorySummary = project.assetCategories.slice(0, 2).join(" · ");
  return categorySummary
    ? `${project.assetCount}개 · ${categorySummary}`
    : `${project.assetCount}개`;
}

function getAwardSummary(project: ArchiveProjectItem) {
  if (project.awardTitles === null) return "미입력";
  return project.awardTitles.length > 0
    ? project.awardTitles.slice(0, 2).join(", ")
    : "없음";
}

export default function ProjectCatalogCard({
  project,
}: ProjectCatalogCardProps) {
  const eventYear = project.eventDate?.slice(0, 4);
  const contextItems = [
    {
      label:
        getProjectPurposeLabel(project.registrationPurpose) ??
        "등록 목적 미입력",
    },
    {
      label: project.eventName
        ? `${project.eventName}${eventYear ? ` · ${eventYear}년 출품` : ""}`
        : "출품 행사 미입력",
    },
    { label: `${project.registeredAt} 등록`, dateTime: project.registeredAt },
  ];

  return (
    <ProjectListCard
      title={project.name}
      href={`/projects/${project.id}`}
      summary={project.description}
      contextItems={contextItems}
      tags={[...new Set([project.category, ...project.tags].filter(Boolean))]}
      facts={[
        {
          label: "결과물 단계",
          value: getProjectResultLevelLabel(project.resultLevel),
        },
        {
          label: "현재 활동 상태",
          value: getProjectActivityStatusLabel(project.activityStatus),
        },
        { label: "보유 자산", value: getAssetSummary(project) },
        { label: "수상 이력", value: getAwardSummary(project) },
      ]}
      representativeImage={project.representativeImage}
      informationCompletenessScore={project.informationCompletenessScore}
      registrantName={project.registrantName}
      stats={[
        { label: "조회", value: project.stats.viewCount },
        { label: "좋아요", value: project.stats.likeCount },
        { label: "저장", value: project.stats.bookmarkCount },
      ]}
      headingLevel={3}
    />
  );
}
