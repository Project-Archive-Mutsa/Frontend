import { describe, expect, it } from "vitest";

import { initialRegisterValues } from "../../../../model/register-wizard";
import { registerAccountStepSchema } from "./register-account-step.schema";

describe("회원가입 계정 정보 검증", () => {
  it("비밀번호 확인이 일치하지 않으면 오류를 반환한다", () => {
    const result = registerAccountStepSchema.safeParse({
      ...initialRegisterValues,
      loginId: "archive-user",
      email: "user@example.com",
      password: "password",
      passwordConfirm: "different-password",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.passwordConfirm?.[0]).toBe(
        "비밀번호가 일치하지 않습니다.",
      );
    }
  });
});
