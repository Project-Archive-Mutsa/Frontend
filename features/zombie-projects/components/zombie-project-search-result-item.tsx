import type { ZombieProjectSearchResult } from "@/features/zombie-projects/types";
import ProjectListCard from "@/shared/components/project-list-card/project-list-card";

interface ZombieProjectSearchResultItemProps {
  project: ZombieProjectSearchResult;
}

export default function ZombieProjectSearchResultItem({
  project,
}: ZombieProjectSearchResultItemProps) {
  const assetTags = project.selectedFiles
    .map((file) => file.kind || file.extension)
    .filter(Boolean);
  const summary = (
    project.functionalSummary.join(" ") ||
    "프로젝트 공개 소개가 등록되지 않았습니다."
  ).slice(0, 100);

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
          label: "보유 자산",
          value: `${project.selectedFiles.length.toLocaleString("ko-KR")}개`,
        },
        { label: "수상 이력", value: "연동 전" },
      ]}
      representativeImage={null}
      informationCompletenessScore={null}
      headingLevel={3}
    >
      <section aria-label="프로젝트 상세 정보 안내">
        <h3 className="text-sm font-bold text-slate-900">프로젝트 상세 정보</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          문제 상황, 해결 방법, 검증 결과와 자산 파일·링크는 상세 정보 열람 후 확인할 수 있습니다.
        </p>
      </section>
    </ProjectListCard>
  );
}
