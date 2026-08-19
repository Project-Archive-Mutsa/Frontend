import { z } from "zod";
import type {
  ProjectRegistrationDraft,
  ProjectRegistrationFieldErrors,
  ProjectRegistrationStep,
} from "./types";

const requiredText = (label: string, minimum = 1) =>
  z.string().trim().min(minimum, `${label}을(를) 조금 더 구체적으로 작성해 주세요.`);

const submissionSchema = z
  .object({
    eventType: requiredText("행사 유형"),
    customEventType: z.string(),
    eventName: requiredText("행사명", 2),
    organizer: requiredText("주최 기관", 2),
    eventDate: requiredText("출품 시기"),
  })
  .superRefine((value, context) => {
    if (value.eventType === "OTHER" && value.customEventType.trim().length < 2) {
      context.addIssue({
        code: "custom",
        path: ["customEventType"],
        message: "기타 행사 유형을 입력해 주세요.",
      });
    }
  });

const overviewSchema = z
  .object({
    projectName: requiredText("프로젝트명", 2),
    summary: requiredText("한 줄 소개", 10).max(100, "한 줄 소개는 100자 이내로 작성해 주세요."),
    projectStartedAt: requiredText("프로젝트 시작일"),
    projectEndedAt: requiredText("프로젝트 종료일"),
    categories: z.array(z.string()).min(1, "분야를 하나 이상 선택해 주세요."),
    problemAreas: z.array(z.string()).min(1, "문제 영역을 하나 이상 선택해 주세요."),
    methods: z.array(z.string()).min(1, "방법·기술을 하나 이상 선택해 주세요."),
  })
  .superRefine((value, context) => {
    if (
      value.projectStartedAt &&
      value.projectEndedAt &&
      value.projectEndedAt < value.projectStartedAt
    ) {
      context.addIssue({
        code: "custom",
        path: ["projectEndedAt"],
        message: "종료일은 시작일보다 빠를 수 없습니다.",
      });
    }
  });

const contentSchema = z.object({
  problemDefinition: requiredText("문제 정의", 20),
  targetAudience: requiredText("대상 사용자·영역", 10),
  solution: requiredText("해결 방식", 20),
  coreApproach: requiredText("핵심 기능·수행 방식", 20),
  differentiation: requiredText("기존 방식과의 차이", 10),
  validation: requiredText("검증 방법과 결과", 10),
  resultLevel: requiredText("출품 당시 결과물 단계"),
  activityStatus: requiredText("현재 활동 상태"),
});

const retrospectiveSchema = z
  .object({
    attempts: requiredText("시도한 방법", 10),
    difficulties: z.string(),
    limitations: requiredText("한계와 배운 점", 10),
    endReason: z.string(),
    nextSteps: requiredText("후속 과제", 10),
    activityStatus: z.string(),
  })
  .superRefine((value, context) => {
    if (
      (value.activityStatus === "PAUSED" || value.activityStatus === "ENDED") &&
      value.endReason.trim().length < 10
    ) {
      context.addIssue({
        code: "custom",
        path: ["endReason"],
        message: "프로젝트가 멈추거나 종료된 이유를 10자 이상 작성해 주세요.",
      });
    }
  });

function issuesToErrors(issues: z.core.$ZodIssue[]): ProjectRegistrationFieldErrors {
  return Object.fromEntries(
    issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
  );
}

function validatePurpose(draft: ProjectRegistrationDraft) {
  const errors: ProjectRegistrationFieldErrors = {};

  if (!draft.purpose) {
    errors.purpose = "등록 목적을 선택해 주세요.";
    return errors;
  }

  if (draft.purpose === "ZOMBIE") {
    if (draft.zombieAssetIds.length === 0) {
      errors.zombieAssetIds = "공개 재사용할 자산을 하나 이상 선택해 주세요.";
    }
    draft.zombieAssetIds.forEach((assetId) => {
      const terms = draft.zombieAssetTerms[assetId];
      if (!terms || terms.licenseName.trim().length < 2) {
        errors[`zombie-${assetId}-license`] = "이 자산에 적용할 라이선스나 이용조건 이름을 작성해 주세요.";
      }
      if (!terms || terms.reuseTerms.trim().length < 10) {
        errors[`zombie-${assetId}-terms`] = "이 자산의 재사용 조건을 10자 이상 작성해 주세요.";
      }
    });
  }

  if (draft.purpose === "SELL") {
    if (draft.saleAssetIds.length === 0) {
      errors.saleAssetIds = "판매할 자산을 하나 이상 선택해 주세요.";
    }
    if (draft.saleRightsScope.trim().length < 10) {
      errors.saleRightsScope = "판매에 포함할 권리 범위를 10자 이상 작성해 주세요.";
    }
    if (!/^\d+$/.test(draft.desiredPoints) || Number(draft.desiredPoints) <= 0) {
      errors.desiredPoints = "희망 거래가를 1포인트 이상 입력해 주세요.";
    }
  }

  if (draft.purpose === "TEAM_RECRUIT") {
    if (draft.recruitmentTitle.trim().length < 5) {
      errors.recruitmentTitle = "모집 제목을 5자 이상 작성해 주세요.";
    }
    if (draft.recruitmentRoles.length === 0) {
      errors.recruitmentRoles = "필요 역할을 하나 이상 선택해 주세요.";
    }
    if (!/^\d+$/.test(draft.recruitmentHeadcount) || Number(draft.recruitmentHeadcount) <= 0) {
      errors.recruitmentHeadcount = "모집 인원을 1명 이상 입력해 주세요.";
    }
    if (!draft.recruitmentDeadline) {
      errors.recruitmentDeadline = "모집 마감일을 입력해 주세요.";
    }
    if (draft.recruitmentSchedule.trim().length < 5) {
      errors.recruitmentSchedule = "예상 활동 일정을 작성해 주세요.";
    }
  }

  return errors;
}

export function validateProjectRegistrationStep(
  step: ProjectRegistrationStep,
  draft: ProjectRegistrationDraft,
): ProjectRegistrationFieldErrors {
  if (step === 1) {
    const result = submissionSchema.safeParse(draft);
    const errors = result.success ? {} : issuesToErrors(result.error.issues);
    draft.awards.forEach((award) => {
      const hasAnyValue = Boolean(award.title.trim() || award.awardedAt);
      if (hasAnyValue && award.title.trim().length < 2) {
        errors[`award-${award.id}-title`] = "수상명을 입력해 주세요.";
      }
      if (hasAnyValue && !award.awardedAt) {
        errors[`award-${award.id}-date`] = "수상일을 입력해 주세요.";
      }
    });
    return errors;
  }
  if (step === 2) {
    const result = overviewSchema.safeParse(draft);
    return result.success ? {} : issuesToErrors(result.error.issues);
  }
  if (step === 3) {
    const result = contentSchema.safeParse(draft);
    return result.success ? {} : issuesToErrors(result.error.issues);
  }
  if (step === 4) {
    const result = retrospectiveSchema.safeParse(draft);
    const errors = result.success ? {} : issuesToErrors(result.error.issues);
    draft.assets.forEach((asset) => {
      if (!asset.category) errors[`asset-${asset.id}-category`] = "자산 분야를 선택해 주세요.";
      if (asset.title.trim().length < 2) errors[`asset-${asset.id}-title`] = "자산명을 2자 이상 작성해 주세요.";
      if (asset.projectRole.trim().length < 5) errors[`asset-${asset.id}-role`] = "프로젝트에서 이 자산이 맡은 역할을 작성해 주세요.";
      if (asset.description.trim().length < 10) errors[`asset-${asset.id}-description`] = "자산의 내용과 활용 방법을 10자 이상 작성해 주세요.";
      if (asset.sources.length === 0) {
        errors[`asset-${asset.id}-sources`] = "파일이나 외부 링크를 하나 이상 연결해 주세요.";
      } else if (
        asset.sources.some(
          (source) => source.kind === "UPLOAD" && source.needsReattach,
        )
      ) {
        errors[`asset-${asset.id}-sources`] =
          "새로고침 후 연결이 끊긴 파일을 다시 첨부하거나 목록에서 삭제해 주세요.";
      }
      if (!asset.ownershipStatus) errors[`asset-${asset.id}-ownership`] = "자산의 소유·사용 권한 상태를 선택해 주세요.";
    });
    return errors;
  }
  if (step === 5) {
    return validatePurpose(draft);
  }
  return {};
}

export function findFirstInvalidRegistrationStep(draft: ProjectRegistrationDraft) {
  for (const step of [1, 2, 3, 4, 5] as const) {
    const errors = validateProjectRegistrationStep(step, draft);
    if (Object.keys(errors).length > 0) {
      return { step, errors };
    }
  }
  return null;
}
