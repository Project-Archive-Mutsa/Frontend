import type { PopularProject } from "@/features/popular-projects/types";
import ProjectListCard from "@/shared/components/project-list-card/project-list-card";
import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

interface PopularProjectItemProps {
  project: PopularProject;
}

export default function PopularProjectItem({
  project,
}: PopularProjectItemProps) {
  const eventYear = project.eventDate?.slice(0, 4);
  const assetSummary =
    project.assetCount === null || project.assetCount === undefined
      ? "연동 전"
      : project.assetCategories?.length
        ? `${project.assetCount}개 · ${project.assetCategories.slice(0, 2).join(" · ")}`
        : `${project.assetCount}개`;
  const awardSummary =
    project.awardTitles === undefined || project.awardTitles === null
      ? "연동 전"
      : project.awardTitles.length > 0
        ? project.awardTitles.slice(0, 2).join(", ")
        : "없음";

  return (
    <ProjectListCard
      title={project.name}
      summary={project.description}
      contextItems={[
        {
          label:
            getProjectPurposeLabel(project.registrationPurpose) ??
            "등록 목적 연동 전",
        },
        {
          label: project.eventName
            ? `${project.eventName}${eventYear ? ` · ${eventYear}년 출품` : ""}`
            : "출품 행사 연동 전",
        },
        { label: `${project.registeredDate} 등록`, dateTime: project.registeredDate },
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
        { label: "보유 자산", value: assetSummary },
        { label: "수상 이력", value: awardSummary },
      ]}
      representativeImage={
        project.thumbnailUrl
          ? { src: project.thumbnailUrl, alt: `${project.name} 대표 이미지` }
          : null
      }
      informationCompletenessScore={project.informationCompletenessScore}
      registrantName={project.sellerName}
      stats={[
        { label: "조회", value: project.viewCount },
        { label: "좋아요", value: project.likeCount },
        { label: "저장", value: project.bookmarkCount },
      ]}
      headingLevel={3}
    />
  );
}
