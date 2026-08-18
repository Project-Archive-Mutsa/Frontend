import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TeamRecruitmentControls from "./team-recruitment-controls";

describe("TeamRecruitmentControls", () => {
  it("API가 없는 검색과 필터를 비활성 상태로 설명한다", () => {
    render(<TeamRecruitmentControls />);

    const searchInput = screen.getByRole("searchbox");
    const filters = screen.getAllByRole("combobox");
    const searchButton = screen.getByRole("button", { name: "검색" });

    expect(searchInput.hasAttribute("disabled")).toBe(true);
    expect(filters).toHaveLength(3);
    expect(filters.every((filter) => filter.hasAttribute("disabled"))).toBe(
      true,
    );
    expect(searchButton.hasAttribute("disabled")).toBe(true);
    expect(screen.getByText("백엔드 미구현")).toBeDefined();
    expect(screen.getByText(/검색·역할·상태·정렬 파라미터/)).toBeDefined();
  });
});
