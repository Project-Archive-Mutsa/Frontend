import type { ProjectMarketProject } from "@/features/project-market/types";
import ProjectListCard from "@/shared/components/project-list-card/project-list-card";
import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

interface ProjectMarketCardProps {
  project: ProjectMarketProject;
}

function getAssetSummary(project: ProjectMarketProject) {
  if (project.assetCount !== null && project.assetCount !== undefined) {
    const categories = project.assetCategories?.slice(0, 2).join(" · ");
    return categories
      ? `${project.assetCount}개 · ${categories}`
      : `${project.assetCount}개`;
  }
  return project.zipFile ? `1개 · ${project.zipFile.name}` : "연동 전";
}

function getAwardSummary(project: ProjectMarketProject) {
  if (project.awardTitles === null || project.awardTitles === undefined) return "연동 전";
  return project.awardTitles.length > 0
    ? project.awardTitles.slice(0, 2).join(", ")
    : "없음";
}

export default function ProjectMarketCard({
  project,
}: ProjectMarketCardProps) {
  const eventYear = project.eventDate?.slice(0, 4);

  return (
    <ProjectListCard
      title={project.name}
      summary={project.description}
      contextItems={[
        {
          label:
            getProjectPurposeLabel(project.registrationPurpose) ??
            "프로젝트 판매",
        },
        {
          label: project.eventName
            ? `${project.eventName}${eventYear ? ` · ${eventYear}년 출품` : ""}`
            : "출품 행사 연동 전",
        },
        { label: `${project.registeredAt} 등록`, dateTime: project.registeredAt },
      ]}
      tags={[
        ...new Set(
          [project.category, ...project.tags].filter(
            (tag): tag is string => Boolean(tag),
          ),
        ),
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
        { label: "판매 자산", value: getAssetSummary(project) },
        { label: "수상 이력", value: getAwardSummary(project) },
      ]}
      representativeImage={project.representativeImage}
      informationCompletenessScore={project.informationCompletenessScore}
      registrantName={project.sellerName}
      registrantLabel="판매자"
      stats={[
        { label: "조회", value: project.stats.viewCount },
        { label: "좋아요", value: project.stats.likeCount },
        { label: "저장", value: project.stats.bookmarkCount },
      ]}
    >
      <section aria-label="판매 조건">
        <h3 className="text-sm font-bold text-slate-900">판매 조건</h3>
        <dl className="mt-4 grid gap-x-7 gap-y-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">희망 판매가</dt>
            <dd className="mt-1 text-lg font-bold tabular-nums text-brand">
              {project.price.toLocaleString("ko-KR")} P
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">가격 조건</dt>
            <dd className="mt-1 font-bold text-slate-800">
              {project.pricingMode === "FIXED"
                ? "제시 가격"
                : project.pricingMode === "NEGOTIABLE"
                  ? "협의 가능"
                  : "연동 전"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">판매 권리 범위</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {project.saleRightsSummary ?? "연동 전"}
            </dd>
          </div>
        </dl>
      </section>
    </ProjectListCard>
  );
}
