import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MainNavigation } from "./main-navigation";

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: usePathnameMock,
}));

describe("MainNavigation", () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
    usePathnameMock.mockReturnValue("/projects");
  });

  it("핵심 기능 메뉴를 직접 노출하고 현재 경로를 표시한다", () => {
    render(<MainNavigation />);

    const links = screen.getAllByRole("link");
    const activeLink = screen.getByRole("link", { name: "프로젝트 탐색" });

    expect(links).toHaveLength(5);
    expect(screen.getByRole("link", { name: "AI 프로젝트 검색" })).toBeDefined();
    expect(screen.getByRole("link", { name: "좀비 프로젝트" })).toBeDefined();
    expect(screen.getByRole("link", { name: "프로젝트 마켓" })).toBeDefined();
    expect(screen.getByRole("link", { name: "팀원 모집" })).toBeDefined();
    expect(activeLink.getAttribute("aria-current")).toBe("page");
    expect(activeLink.classList.contains("border-white")).toBe(true);
  });

  it("프로젝트 탐색 하위 경로에서도 메뉴를 활성화한다", () => {
    usePathnameMock.mockReturnValue("/projects/1");

    render(<MainNavigation />);

    expect(
      screen
        .getByRole("link", { name: "프로젝트 탐색" })
        .getAttribute("aria-current"),
    ).toBe("page");
  });

  it("전용 기능 경로에서 해당 메뉴를 활성화한다", () => {
    usePathnameMock.mockReturnValue("/zombie-projects");

    render(<MainNavigation />);

    expect(
      screen
        .getByRole("link", { name: "좀비 프로젝트" })
        .getAttribute("aria-current"),
    ).toBe("page");
  });
});
