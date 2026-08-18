import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ZombieProjectFilterPreview from "./zombie-project-filter-preview";

describe("ZombieProjectFilterPreview", () => {
  it("백엔드 미구현 안내와 여섯 가지 비활성 필터를 항상 표시한다", () => {
    render(<ZombieProjectFilterPreview />);

    expect(screen.getByText("백엔드 미구현")).toBeDefined();
    expect(screen.getByText("주제·기술")).toBeDefined();
    expect(screen.getByText("제공 자산")).toBeDefined();
    expect(screen.getByText("개발 진행도")).toBeDefined();
    expect(screen.getByText("프로젝트 규모")).toBeDefined();
    expect(screen.getByText("등록 가격")).toBeDefined();
    expect(screen.getByText("후속 개발 방식")).toBeDefined();
    expect(screen.getAllByRole("combobox")).toHaveLength(6);

    for (const filter of screen.getAllByRole("combobox")) {
      expect((filter as HTMLSelectElement).disabled).toBe(true);
    }
  });
});
