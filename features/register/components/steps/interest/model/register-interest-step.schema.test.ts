import { describe, expect, it } from "vitest";

import { registerInterestStepSchema } from "./register-interest-step.schema";

describe("회원가입 관심 분야 검증", () => {
  it("서버에서 받은 양의 정수 태그 ID를 허용한다", () => {
    const result = registerInterestStepSchema.safeParse({
      selectedTagIds: [66, 68],
    });

    expect(result.success).toBe(true);
  });

  it("관심 태그를 선택하지 않으면 오류를 반환한다", () => {
    const result = registerInterestStepSchema.safeParse({
      selectedTagIds: [],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.selectedTagIds?.[0]).toBe(
        "관심 태그를 하나 이상 선택해 주세요.",
      );
    }
  });

  it("유효하지 않은 태그 ID를 선택하면 오류를 반환한다", () => {
    const result = registerInterestStepSchema.safeParse({
      selectedTagIds: [0],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.selectedTagIds?.[0]).toBe(
        "올바른 관심 태그를 선택해 주세요.",
      );
    }
  });
});
