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

function getPublicAssetSummary(project: ZombieProject) {
  if (project.publicAssets && project.publicAssets.length > 0) {
    return project.publicAssets
      .slice(0, 2)
      .map((asset) => `${asset.name} · ${asset.category}`)
      .join(", ");
  }
  if (project.zipFile) return project.zipFile.name;
  return "연동 전";
}

function getAssetCount(project: ZombieProject) {
  if (project.publicAssets) return `${project.publicAssets.length}개`;
  if (project.assetCount !== null && project.assetCount !== undefined) {
    return `${project.assetCount}개`;
  }
  if (project.zipFile) return "1개";
  return "연동 전";
}

function getAwardSummary(project: ZombieProject) {
  if (project.awardTitles === undefined || project.awardTitles === null) {
    return "연동 전";
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
  const firstPublicAsset = project.publicAssets?.[0];

  return (
    <ProjectListCard
      title={project.name}
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
            : "출품 행사 연동 전",
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
        { label: "공개 재사용 자산", value: getAssetCount(project) },
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
      <section aria-label="공개 계승 조건">
        <h3 className="text-sm font-bold text-slate-900">공개 계승 조건</h3>
        <dl className="mt-4 grid gap-x-7 gap-y-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">공개 자산</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {getPublicAssetSummary(project)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">라이선스</dt>
            <dd className="mt-1 font-bold text-slate-800">
              {firstPublicAsset?.licenseName ?? "연동 전"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">재사용 조건</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {firstPublicAsset?.reuseTerms ?? "연동 전"}
            </dd>
          </div>
        </dl>
      </section>
    </ProjectListCard>
  );
}
