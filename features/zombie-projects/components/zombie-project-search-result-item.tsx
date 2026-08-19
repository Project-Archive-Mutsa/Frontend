import type { ZombieProjectSearchResult } from "@/features/zombie-projects/types";
import ProjectListCard from "@/shared/components/project-list-card/project-list-card";

interface ZombieProjectSearchResultItemProps {
  project: ZombieProjectSearchResult;
}

export default function ZombieProjectSearchResultItem({
  project,
}: ZombieProjectSearchResultItemProps) {
  const assetNames = project.selectedFiles.map((file) => file.path);
  const assetTags = project.selectedFiles
    .map((file) => file.kind || file.extension)
    .filter(Boolean);
  const summary =
    project.functionalSummary.join(" ") ||
    "프로젝트 한 줄 소개를 제공하는 통합 응답이 필요합니다.";
  const analysisNote = [
    project.differentiators[0],
    project.futureDirections[0],
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <ProjectListCard
      title={project.projectTitle}
      summary={summary}
      contextItems={[
        { label: "좀비 프로젝트" },
        { label: "출품 행사 연동 전" },
      ]}
      tags={[...new Set(assetTags)]}
      facts={[
        { label: "결과물 단계", value: "연동 전" },
        { label: "현재 활동 상태", value: "연동 전" },
        {
          label: "공개 재사용 자산",
          value: `${project.selectedFiles.length.toLocaleString("ko-KR")}개`,
        },
        { label: "수상 이력", value: "연동 전" },
      ]}
      representativeImage={null}
      informationCompletenessScore={null}
      headingLevel={3}
    >
      <section aria-label="공개 계승 조건">
        <h3 className="text-sm font-bold text-slate-900">공개 계승 조건</h3>
        <dl className="mt-4 grid gap-x-7 gap-y-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">공개 자산</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {assetNames.slice(0, 3).join(", ") || "연동 전"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">라이선스·재사용 조건</dt>
            <dd className="mt-1 font-bold text-slate-800">연동 전</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">기존 분석 참고</dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-slate-700">
              {analysisNote || "연동 전"}
            </dd>
          </div>
        </dl>
      </section>
    </ProjectListCard>
  );
}
