import ProjectExplorerFilterPanel, {
  type ProjectExplorerFilterField,
} from "@/features/project-explorer/components/project-explorer-filter-panel";

const fields = [
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
    name: "resultLevel",
    label: "결과물 단계",
    allLabel: "전체 단계",
    options: [
      { value: "IDEA_PLAN", label: "아이디어·기획" },
      { value: "DESIGNED", label: "구체화·설계" },
      { value: "INITIAL_OUTPUT", label: "초기 결과물" },
      { value: "SUBMISSION_OUTPUT", label: "출품 결과물" },
      { value: "APPLIED", label: "실제 적용·운영" },
    ],
  },
  {
    name: "activityStatus",
    label: "활동 상태",
    allLabel: "전체 상태",
    options: [
      { value: "ACTIVE", label: "진행 중" },
      { value: "PAUSED", label: "일시 중단" },
      { value: "ENDED", label: "활동 종료" },
    ],
  },
  {
    name: "eventType",
    label: "출품 유형",
    allLabel: "모든 유형",
    options: [
      { value: "COMPETITION", label: "대회" },
      { value: "CONTEST", label: "공모전" },
      { value: "HACKATHON", label: "해커톤" },
      { value: "CAPSTONE", label: "캡스톤" },
      { value: "COURSE", label: "교과·교내 프로그램" },
    ],
  },
  {
    name: "sort",
    label: "정렬",
    allLabel: "최신 등록순",
    options: [{ value: "POPULAR", label: "인기순" }],
  },
] satisfies readonly ProjectExplorerFilterField[];

type State = {
  query: string;
  category: string;
  assetCategory: string;
  resultLevel: string;
  activityStatus: string;
  eventType: string;
  sort: "RECENT" | "POPULAR";
};

const defaultState: State = {
  query: "",
  category: "",
  assetCategory: "",
  resultLevel: "",
  activityStatus: "",
  eventType: "",
  sort: "RECENT",
};

export default function ZombieProjectFilterPreview({
  state = defaultState,
}: {
  state?: State;
}) {
  return (
    <ProjectExplorerFilterPanel
      action="/zombie-projects"
      description="분야·자산·결과물 단계·활동 상태·출품 유형을 조합해 조회합니다."
      fields={fields}
      values={{
        category: state.category,
        assetCategory: state.assetCategory,
        resultLevel: state.resultLevel,
        activityStatus: state.activityStatus,
        eventType: state.eventType,
        sort: state.sort === "POPULAR" ? "POPULAR" : "",
      }}
      hiddenFields={{ q: state.query }}
    />
  );
}
