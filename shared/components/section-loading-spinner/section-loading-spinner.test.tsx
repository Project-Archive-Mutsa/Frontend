import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SectionLoadingSpinner from "./section-loading-spinner";

describe("SectionLoadingSpinner", () => {
  it("상태 영역에서 로딩 문구를 제공하고 스피너는 접근성 트리에서 숨긴다", () => {
    const { container } = render(<SectionLoadingSpinner />);
    const status = screen.getByRole("status");
    const spinner = container.querySelector('[aria-hidden="true"]');

    expect(status.textContent).toContain("콘텐츠를 불러오는 중입니다.");
    expect(status.classList.contains("text-brand")).toBe(true);
    expect(status.classList.contains("h-full")).toBe(true);
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(spinner).not.toBeNull();
  });
});
