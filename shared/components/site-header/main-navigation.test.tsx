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
    usePathnameMock.mockReturnValue("/zombie-projects");
  });

  it("현재 중단 프로젝트 메뉴에 활성 상태를 표시한다", () => {
    render(<MainNavigation />);

    const activeLink = screen.getByRole("link", { name: "중단 프로젝트" });
    const inactiveLink = screen.getByRole("link", { name: "프로젝트 마켓" });

    expect(activeLink.getAttribute("aria-current")).toBe("page");
    expect(activeLink.classList.contains("bg-white")).toBe(true);
    expect(inactiveLink.hasAttribute("aria-current")).toBe(false);
  });

  it("중단 프로젝트 하위 경로에서도 메뉴를 활성화한다", () => {
    usePathnameMock.mockReturnValue("/zombie-projects/1");

    render(<MainNavigation />);

    expect(
      screen
        .getByRole("link", { name: "중단 프로젝트" })
        .getAttribute("aria-current"),
    ).toBe("page");
  });
});
