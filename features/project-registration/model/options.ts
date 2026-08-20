import type {
  AssetLinkProvider,
  EventType,
  ProjectActivityStatus,
  ProjectAssetCategory,
  ProjectRegistrationPurpose,
  ProjectResultLevel,
} from "./types";
import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

export const projectRegistrationSteps = [
  { step: 1, label: "출품 정보", description: "어디에 출품한 프로젝트인지 기록합니다." },
  { step: 2, label: "프로젝트 개요", description: "탐색 목록에 보일 기본정보를 작성합니다." },
  { step: 3, label: "문제·해결·결과", description: "프로젝트가 무엇을 시도했는지 설명합니다." },
  { step: 4, label: "제약·한계·프로젝트 자료", description: "확인된 제약과 남은 자료를 객관적으로 정리합니다." },
  { step: 5, label: "등록 목적", description: "프로젝트를 다음 사람과 연결할 방식을 정합니다." },
  { step: 6, label: "검토·등록", description: "입력 내용을 확인하고 등록 자료 공개에 동의합니다." },
] as const;

export const eventTypeOptions: ReadonlyArray<{ value: EventType; label: string }> = [
  { value: "COMPETITION", label: "대회" },
  { value: "CONTEST", label: "공모전" },
  { value: "HACKATHON", label: "해커톤" },
  { value: "CAPSTONE", label: "캡스톤" },
  { value: "COURSE", label: "교과·교내 프로그램" },
  { value: "OTHER", label: "기타" },
];

export const resultLevelOptions: ReadonlyArray<{
  value: ProjectResultLevel;
  label: string;
  description: string;
}> = [
  { value: "IDEA_PLAN", label: "아이디어·기획", description: "문제와 해결 방향을 기획한 단계" },
  { value: "DESIGNED", label: "구체화·설계", description: "구조, 설계안 또는 콘셉트를 구체화한 단계" },
  { value: "INITIAL_OUTPUT", label: "초기 결과물", description: "시제품, 초안, 프로토타입 등 확인 가능한 결과물이 있는 단계" },
  { value: "SUBMISSION_OUTPUT", label: "출품 결과물", description: "행사에 제출 가능한 결과물을 완성한 단계" },
  { value: "APPLIED", label: "실제 적용·운영", description: "출품 이후 실제 환경에서 활용하거나 운영한 단계" },
];

export const activityStatusOptions: ReadonlyArray<{
  value: ProjectActivityStatus;
  label: string;
  description: string;
}> = [
  { value: "ACTIVE", label: "진행 중", description: "출품 이후에도 계속 발전시키고 있습니다." },
  { value: "PAUSED", label: "일시 중단", description: "현재는 멈췄지만 다시 이어갈 가능성이 있습니다." },
  { value: "ENDED", label: "활동 종료", description: "계획한 활동이나 팀 운영을 마친 상태입니다." },
];

export const registrationPurposeOptions: ReadonlyArray<{
  value: ProjectRegistrationPurpose;
  label: string;
  description: string;
}> = [
  { value: "ZOMBIE", label: "좀비 프로젝트", description: "기본정보는 공개되며, 다른 사용자가 프로젝트 상세 정보를 열람하면 콘텐츠 정산 포인트가 지급됩니다." },
  { value: "SELL", label: "프로젝트 판매", description: "등록한 프로젝트와 모든 자료를 희망 가격으로 특정 구매자에게 판매합니다." },
  { value: "TEAM_RECRUIT", label: "팀원 모집", description: "등록자가 프로젝트를 계속 주도하며 필요한 팀원을 찾습니다." },
];

export const projectCategoryOptions = [
  "사회문제",
  "교육",
  "환경·에너지",
  "문화·예술",
  "제품·산업 디자인",
  "창업·비즈니스",
  "기술·공학",
  "연구",
] as const;

export const problemAreaOptions = [
  "정보 접근",
  "지역·공동체",
  "안전",
  "건강·돌봄",
  "이동·교통",
  "환경 문제",
  "업무 효율",
  "문화 경험",
] as const;

export const methodOptions = [
  "서비스 기획",
  "제품 설계",
  "캠페인",
  "콘텐츠",
  "데이터 분석",
  "AI",
  "웹·앱",
  "하드웨어",
] as const;

export const assetCategoryOptions: ReadonlyArray<{
  value: ProjectAssetCategory;
  label: string;
  helper: string;
  acceptedExtensions: string;
}> = [
  { value: "PLANNING_DOCUMENT", label: "기획·문서", helper: "기획서, 발표 자료, 운영 문서", acceptedExtensions: ".pdf,.doc,.docx,.hwp,.hwpx,.ppt,.pptx,.xls,.xlsx,.csv" },
  { value: "DESIGN", label: "디자인", helper: "Figma, 화면·제품 디자인, 그래픽", acceptedExtensions: ".fig,.sketch,.xd,.pdf,.svg,.png,.jpg,.jpeg" },
  { value: "CODE_TECH", label: "코드·기술", helper: "저장소, 소스 코드, 배포 결과", acceptedExtensions: ".zip" },
  { value: "DATA", label: "데이터", helper: "조사·분석 데이터와 구조화 자료", acceptedExtensions: ".csv,.xls,.xlsx,.json,.xml,.zip" },
  { value: "RESEARCH_VALIDATION", label: "연구·검증", helper: "설문, 인터뷰, 실험과 결과 자료", acceptedExtensions: ".pdf,.doc,.docx,.hwp,.hwpx,.csv,.xls,.xlsx,.zip" },
  { value: "DEMO_MEDIA", label: "영상·시연", helper: "발표, 데모, 사용 영상", acceptedExtensions: ".mp4,.webm,.mov" },
  { value: "OFFLINE_OUTPUT", label: "오프라인 결과물", helper: "전시물, 제작물, 현장 활동 기록", acceptedExtensions: ".pdf,.png,.jpg,.jpeg,.mp4,.webm,.mov,.zip" },
  { value: "OTHER", label: "기타", helper: "목록에 없는 프로젝트 자료", acceptedExtensions: "" },
];

export const recruitmentRoleOptions = [
  "기획",
  "디자인",
  "개발",
  "데이터·리서치",
  "마케팅·운영",
  "제작·엔지니어링",
] as const;

export const assetProviderLabels: Record<AssetLinkProvider, string> = {
  FIGMA: "Figma",
  GITHUB: "GitHub",
  GITLAB: "GitLab",
  NOTION: "Notion",
  GOOGLE_DRIVE: "Google Drive",
  YOUTUBE: "YouTube",
  VIMEO: "Vimeo",
  GENERAL: "외부 링크",
};

export function getAssetCategoryOption(category: ProjectAssetCategory | "") {
  return assetCategoryOptions.find((option) => option.value === category);
}

export function getPurposeLabel(purpose: ProjectRegistrationPurpose | "") {
  return getProjectPurposeLabel(purpose || null) ?? "미선택";
}

export function getResultLevelLabel(level: ProjectResultLevel | "") {
  return level ? getProjectResultLevelLabel(level) : "미선택";
}

export function getActivityStatusLabel(status: ProjectActivityStatus | "") {
  return status ? getProjectActivityStatusLabel(status) : "미선택";
}
