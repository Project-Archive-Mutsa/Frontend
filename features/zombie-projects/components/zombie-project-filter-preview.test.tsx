import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ZombieProjectFilterPreview from "./zombie-project-filter-preview";

describe("ZombieProjectFilterPreview", () => {
  it("백엔드 미구현 안내와 여섯 가지 비활성 필터를 항상 표시한다", () => {
    render(<ZombieProjectFilterPreview />);

    expect(screen.getByText("백엔드 미구현")).toBeDefined();
    expect(screen.getByText("분야·방법")).toBeDefined();
    expect(screen.getByText("제공 자산")).toBeDefined();
    expect(screen.getByText("완성 수준")).toBeDefined();
    expect(screen.getByText("출품 유형")).toBeDefined();
    expect(screen.getByText("자산 라이선스")).toBeDefined();
    expect(screen.getByText("정렬")).toBeDefined();
    expect(screen.getAllByRole("combobox")).toHaveLength(6);

    for (const filter of screen.getAllByRole("combobox")) {
      expect((filter as HTMLSelectElement).disabled).toBe(true);
    }
  });
});
