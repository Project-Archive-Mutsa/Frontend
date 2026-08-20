import ProjectExplorerFilterPanel, {
  type ProjectExplorerFilterField,
} from "@/features/project-explorer/components/project-explorer-filter-panel";
import BackendContractNotice from "@/shared/components/backend-contract-notice/backend-contract-notice";

const fields = [
  {
    name: "assetCategory",
    label: "제공 자산",
    allLabel: "모든 자산",
    options: [
      { value: "PLANNING", label: "기획·문서" },
      { value: "DESIGN", label: "디자인" },
      { value: "CODE", label: "코드·기술" },
      { value: "DATA", label: "데이터" },
      { value: "RESEARCH", label: "연구·검증" },
      { value: "PRESENTATION", label: "발표·시연" },
      { value: "OTHER", label: "기타" },
    ],
  },
  {
    name: "category",
    label: "분야",
    allLabel: "전체 분야",
    options: [
      "사회문제",
      "교육",
      "환경·에너지",
      "문화·예술",
      "제품·산업 디자인",
      "창업·비즈니스",
      "기술·공학",
      "연구",
    ].map((value) => ({ value, label: value })),
  },
  {
    name: "sort",
    label: "정렬",
    allLabel: "최신 등록순",
    options: [{ value: "POPULAR", label: "인기순" }],
  },
] satisfies readonly ProjectExplorerFilterField[];

interface ProjectMarketFiltersProps {
  state: {
    query: string;
    assetCategory: string;
    category: string;
    sort: "RECENT" | "POPULAR";
  };
}

export default function ProjectMarketFilters({
  state,
}: ProjectMarketFiltersProps) {
  return (
    <ProjectExplorerFilterPanel
      action="/project-market"
      description="제공 자산·분야·정렬 조건으로 판매 프로젝트를 좁혀봅니다."
      fields={fields}
      values={{
        assetCategory: state.assetCategory,
        category: state.category,
        sort: state.sort === "POPULAR" ? "POPULAR" : "",
      }}
      hiddenFields={{ q: state.query }}
      footer={
        <BackendContractNotice>
          가격 조건과 가격대는 목록 조회 조건이 제공되지 않아 아직 필터링할 수 없습니다.
        </BackendContractNotice>
      }
    />
  );
}
