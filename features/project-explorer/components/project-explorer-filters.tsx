import type { ProjectExplorerSearchState } from "@/features/project-explorer/model/types";
import ProjectExplorerFilterPanel, {
  type ProjectExplorerFilterField,
} from "./project-explorer-filter-panel";

const fields = [
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
      { value: "OTHER", label: "기타" },
    ],
  },
  {
    name: "eventYear",
    label: "출품 연도",
    allLabel: "전체 연도",
    options: ["2026", "2025", "2024"].map((value) => ({
      value,
      label: value,
    })),
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
    label: "현재 활동 상태",
    allLabel: "전체 상태",
    options: [
      { value: "ACTIVE", label: "진행 중" },
      { value: "PAUSED", label: "일시 중단" },
      { value: "ENDED", label: "활동 종료" },
    ],
  },
  {
    name: "sort",
    label: "정렬",
    allLabel: "최신 등록순",
    options: [{ value: "POPULAR", label: "인기순" }],
  },
] satisfies readonly ProjectExplorerFilterField[];

export default function ProjectExplorerFilters({
  state,
}: {
  state: ProjectExplorerSearchState;
}) {
  return (
    <ProjectExplorerFilterPanel
      action="/projects"
      description="행사·분야·결과물 단계·활동 상태를 조합해 조회합니다."
      fields={fields}
      values={{
        eventType: state.eventType,
        eventYear: state.eventYear,
        category: state.category,
        resultLevel: state.resultLevel,
        activityStatus: state.activityStatus,
        sort: state.sort === "POPULAR" ? "POPULAR" : "",
      }}
      hiddenFields={{ q: state.query }}
    />
  );
}
