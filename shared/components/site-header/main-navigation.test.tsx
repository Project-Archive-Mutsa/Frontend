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

  it("프로젝트 탐색과 팀원 모집을 분리하고 현재 경로를 표시한다", () => {
    render(<MainNavigation />);

    const links = screen.getAllByRole("link");
    const activeLink = screen.getByRole("link", { name: "프로젝트 탐색" });

    expect(links).toHaveLength(3);
    expect(screen.getByRole("link", { name: "AI 프로젝트 검색" })).toBeDefined();
    expect(screen.getByRole("link", { name: "팀원 모집" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "좀비 프로젝트" })).toBeNull();
    expect(screen.queryByRole("link", { name: "프로젝트 마켓" })).toBeNull();
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

  it.each(["/zombie-projects", "/project-market"])(
    "%s 경로를 프로젝트 탐색의 하위 보기로 표시한다",
    (pathname) => {
      usePathnameMock.mockReturnValue(pathname);

      render(<MainNavigation />);

      expect(
        screen
          .getByRole("link", { name: "프로젝트 탐색" })
          .getAttribute("aria-current"),
      ).toBe("page");
    },
  );

  it("팀원 모집은 독립 메뉴로 활성화한다", () => {
    usePathnameMock.mockReturnValue("/team-recruitment");

    render(<MainNavigation />);

    expect(
      screen
        .getByRole("link", { name: "팀원 모집" })
        .getAttribute("aria-current"),
    ).toBe("page");
  });
});
