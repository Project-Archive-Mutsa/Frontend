const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const eventTypeLabels: Record<string, string> = {
  COMPETITION: "대회",
  CONTEST: "공모전",
  HACKATHON: "해커톤",
  CAPSTONE: "캡스톤",
  COURSE: "교과·교내 프로그램",
  OTHER: "기타",
};

const assetTypeLabels: Record<string, string> = {
  PLANNING: "기획·문서",
  PLANNING_DOCUMENT: "기획·문서",
  PRESENTATION: "발표 자료",
  DESIGN: "디자인",
  CODE: "코드·기술",
  CODE_TECH: "코드·기술",
  SOURCE_PACKAGE: "소스 패키지",
  DATA: "데이터",
  RESEARCH: "연구·검증",
  RESEARCH_VALIDATION: "연구·검증",
  DEMO_MEDIA: "영상·시연",
  OFFLINE_OUTPUT: "오프라인 결과물",
  OTHER: "기타",
};

const ownershipLabels: Record<string, string> = {
  OWNED: "등록자 소유",
  UPLOADER_OWNED: "등록자 소유",
  TEAM_OWNED: "팀 공동 자산",
  THIRD_PARTY_INCLUDED: "외부 자료 포함",
  UNCONFIRMED: "권리 확인 전",
};

export function formatProjectDate(value: string | null) {
  if (!value) return "미입력";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

export function formatProjectPeriod(startedAt: string | null, endedAt: string | null) {
  if (!startedAt && !endedAt) return "미입력";
  return `${formatProjectDate(startedAt)} – ${endedAt ? formatProjectDate(endedAt) : "현재"}`;
}

export function getEventTypeLabel(value: string | null) {
  return value ? (eventTypeLabels[value] ?? value) : "미입력";
}

export function getAssetTypeLabel(value: string | null) {
  return value ? (assetTypeLabels[value] ?? value) : "유형 미입력";
}

export function getOwnershipLabel(value: string | null) {
  return value ? (ownershipLabels[value] ?? value) : "권리 미입력";
}

export function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 ** 2) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${(sizeInBytes / 1024 ** 2).toFixed(1)} MB`;
}
