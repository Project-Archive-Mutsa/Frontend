import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectExplorerViewNavigation from "./project-explorer-view-navigation";

describe("ProjectExplorerViewNavigation", () => {
  it("프로젝트 보기를 실제 경로로 연결하고 현재 보기를 표시한다", () => {
    render(<ProjectExplorerViewNavigation activeView="continuation" />);

    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(
      screen.getByRole("link", { name: /전체 프로젝트/ }).getAttribute("href"),
    ).toBe("/projects");
    expect(
      screen
        .getByRole("link", { name: /좀비 프로젝트/ })
        .getAttribute("aria-current"),
    ).toBe("page");
    expect(
      screen
        .getByRole("link", { name: /판매 중인 프로젝트/ })
        .getAttribute("href"),
    ).toBe("/project-market");
    expect(screen.getByText("공개 자산으로 계승 · 후속 개발 필요")).toBeDefined();
    expect(screen.getByText("판매 자산·권리 범위·희망 가격 확인")).toBeDefined();
  });
});
