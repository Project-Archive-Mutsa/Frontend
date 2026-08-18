import { describe, expect, it } from "vitest";
import { formatRecruitmentDeadline } from "./format-recruitment-deadline";

describe("formatRecruitmentDeadline", () => {
  it("ISO 날짜를 한국어 날짜로 표시한다", () => {
    expect(formatRecruitmentDeadline("2026-08-20")).toBe("2026년 8월 20일");
  });

  it("날짜를 해석할 수 없으면 원문을 유지한다", () => {
    expect(formatRecruitmentDeadline("알 수 없음")).toBe("알 수 없음");
  });
});
