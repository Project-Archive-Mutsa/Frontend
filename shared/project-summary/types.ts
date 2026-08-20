export type ProjectRegistrationPurpose =
  | "ZOMBIE"
  | "SELL"
  | "TEAM_RECRUIT";

export type ProjectRegistrationPurposeInput =
  | ProjectRegistrationPurpose
  | "REGISTER"
  | "ARCHIVE";

export type ProjectResultLevel =
  | "IDEA_PLAN"
  | "DESIGNED"
  | "INITIAL_OUTPUT"
  | "SUBMISSION_OUTPUT"
  | "APPLIED";

export type ProjectActivityStatus = "ACTIVE" | "PAUSED" | "ENDED";

export type ProjectPricingMode = "FIXED" | "NEGOTIABLE";

const purposeLabels: Record<ProjectRegistrationPurpose, string> = {
  ZOMBIE: "좀비 프로젝트",
  SELL: "프로젝트 판매",
  TEAM_RECRUIT: "팀원 모집",
};

export function normalizeProjectRegistrationPurpose(
  purpose: ProjectRegistrationPurposeInput,
): ProjectRegistrationPurpose {
  return purpose === "REGISTER" || purpose === "ARCHIVE" ? "ZOMBIE" : purpose;
}

const resultLevelLabels: Record<ProjectResultLevel, string> = {
  IDEA_PLAN: "아이디어·기획",
  DESIGNED: "구체화·설계",
  INITIAL_OUTPUT: "초기 결과물",
  SUBMISSION_OUTPUT: "출품 결과물",
  APPLIED: "실제 적용·운영",
};

const activityStatusLabels: Record<ProjectActivityStatus, string> = {
  ACTIVE: "진행 중",
  PAUSED: "일시 중단",
  ENDED: "활동 종료",
};

export function getProjectPurposeLabel(
  purpose: ProjectRegistrationPurpose | null | undefined,
) {
  return purpose ? purposeLabels[purpose] : null;
}

export function getProjectResultLevelLabel(
  level: ProjectResultLevel | null | undefined,
) {
  return level ? resultLevelLabels[level] : "미입력";
}

export function getProjectActivityStatusLabel(
  status: ProjectActivityStatus | null | undefined,
) {
  return status ? activityStatusLabels[status] : "미입력";
}
