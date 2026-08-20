import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ZombieProjectFilterPreview from "./zombie-project-filter-preview";

describe("ZombieProjectFilterPreview", () => {
  it("실제 목록 API 파라미터에 연결된 여섯 가지 필터를 표시한다", () => {
    render(<ZombieProjectFilterPreview />);

    expect(screen.queryByText("백엔드 미구현")).toBeNull();
    expect(screen.getByText("분야")).toBeDefined();
    expect(screen.getByText("제공 자산")).toBeDefined();
    expect(screen.getByText("결과물 단계")).toBeDefined();
    expect(screen.getByText("출품 유형")).toBeDefined();
    expect(screen.getByText("활동 상태")).toBeDefined();
    expect(screen.getByText("정렬")).toBeDefined();
    expect(screen.getAllByRole("combobox")).toHaveLength(6);

    for (const filter of screen.getAllByRole("combobox")) {
      expect((filter as HTMLSelectElement).disabled).toBe(false);
    }
  });
});
