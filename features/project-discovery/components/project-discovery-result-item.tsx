import type { ProjectDiscoveryResultItem as ProjectDiscoveryResultItemType } from "@/features/project-discovery/types";
import ProjectListCard from "@/shared/components/project-list-card/project-list-card";
import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

interface ProjectDiscoveryResultItemProps {
  item: ProjectDiscoveryResultItemType;
}

const targetLabels = {
  PROJECT: "프로젝트",
  CONTEST: "공모전",
  IDEA: "아이디어",
  AWARD: "수상작",
} as const;

function getAssetSummary(item: ProjectDiscoveryResultItemType) {
  if (item.assetCount === null || item.assetCount === undefined) return "연동 전";
  const categories = item.assetCategories?.slice(0, 2).join(" · ");
  return categories ? `${item.assetCount}개 · ${categories}` : `${item.assetCount}개`;
}

function getAwardSummary(item: ProjectDiscoveryResultItemType) {
  if (item.awards === undefined) return "연동 전";
  return item.awards.length > 0
    ? item.awards.slice(0, 2).map((award) => award.title).join(", ")
    : "없음";
}

export default function ProjectDiscoveryResultItem({
  item,
}: ProjectDiscoveryResultItemProps) {
  const similarityPercent = Math.min(
    100,
    Math.max(0, Math.round(item.similarityScore * 1000) / 10),
  );
  const isProject = item.type === "PROJECT" || item.type === "AWARD";
  const eventYear = item.eventDate?.slice(0, 4);

  return (
    <ProjectListCard
      title={item.title}
      summary={item.description}
      contextItems={[
        {
          label:
            getProjectPurposeLabel(item.registrationPurpose) ??
            targetLabels[item.type],
        },
        ...(isProject
          ? [{
              label: item.eventName
                ? `${item.eventName}${eventYear ? ` · ${eventYear}년 출품` : ""}`
                : "출품 행사 연동 전",
            }]
          : [{ label: item.category }]),
      ]}
      tags={[...new Set([item.category, ...item.tags].filter(Boolean))]}
      facts={
        isProject
          ? [
              {
                label: "결과물 단계",
                value: getProjectResultLevelLabel(item.resultLevel),
              },
              {
                label: "현재 활동 상태",
                value: getProjectActivityStatusLabel(item.activityStatus),
              },
              { label: "보유 자산", value: getAssetSummary(item) },
              { label: "수상 이력", value: getAwardSummary(item) },
            ]
          : [
              { label: "검색 유형", value: targetLabels[item.type] },
              { label: "분야", value: item.category || "미분류" },
              { label: "관련 태그", value: `${item.tags.length}개` },
            ]
      }
      representativeImage={
        item.representativeImageUrl
          ? { src: item.representativeImageUrl, alt: `${item.title} 대표 이미지` }
          : null
      }
      informationCompletenessScore={item.informationCompletenessScore}
      showInformationCompleteness={isProject}
      headingLevel={3}
    >
      <section aria-label="AI 비교 결과">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="text-sm font-bold text-slate-900">AI 비교</h4>
          <strong className="text-sm tabular-nums text-brand">
            유사도 {similarityPercent}%
          </strong>
        </div>
        <div
          role="meter"
          aria-label={`${item.title} 유사도`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={similarityPercent}
          className="mt-3 h-1.5 overflow-hidden bg-slate-200"
        >
          <div
            className="h-full bg-brand-accent"
            style={{ width: `${similarityPercent}%` }}
          />
        </div>
        <dl className="mt-5 grid gap-x-7 gap-y-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">유사한 이유</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {item.similarityReasons?.slice(0, 2).join(" · ") || "연동 전"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">주요 차이점</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {item.differences?.slice(0, 2).join(" · ") || "연동 전"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">추가 검증 과제</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {item.validationSuggestions?.slice(0, 2).join(" · ") || "연동 전"}
            </dd>
          </div>
        </dl>
      </section>
    </ProjectListCard>
  );
}
