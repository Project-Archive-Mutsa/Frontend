import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RegisterInterestTagSelector from "./register-interest-tag-selector";

const frontendPart = {
  partId: 1,
  partName: "프론트엔드",
  tags: [
    { tagId: 1, tagName: "React" },
    { tagId: 2, tagName: "Next.js" },
  ],
};

describe("RegisterInterestTagSelector", () => {
  it("선택된 태그를 표시하고 다른 태그 선택을 전달한다", () => {
    const onTagToggle = vi.fn();

    render(
      <RegisterInterestTagSelector
        part={frontendPart}
        selectedTagIds={[1]}
        isDisabled={false}
        onTagToggle={onTagToggle}
      />,
    );

    expect(
      (screen.getByRole("checkbox", { name: "React" }) as HTMLInputElement)
        .checked,
    ).toBe(true);

    fireEvent.click(screen.getByRole("checkbox", { name: "Next.js" }));

    expect(onTagToggle).toHaveBeenCalledWith(2);
  });

  it("검증 오류를 태그 그룹과 연결해 표시한다", () => {
    render(
      <RegisterInterestTagSelector
        part={frontendPart}
        selectedTagIds={[]}
        validationError="관심 태그를 하나 이상 선택해 주세요."
        isDisabled={false}
        onTagToggle={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain(
      "관심 태그를 하나 이상 선택해 주세요.",
    );
  });
});
