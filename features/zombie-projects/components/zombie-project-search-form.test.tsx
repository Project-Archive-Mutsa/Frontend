import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ZombieProjectSearchForm from "./zombie-project-search-form";

const { pushMock, refreshMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("next/form", () => ({
  default: ({
    scroll,
    ...props
  }: ComponentProps<"form"> & { scroll?: boolean }) => (
    <form data-scroll={String(scroll)} {...props} />
  ),
}));

describe("ZombieProjectSearchForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockReset();
    refreshMock.mockReset();
  });

  it("검색 버튼과 Enter 제출에 사용할 GET 검색 폼을 제공한다", () => {
    render(<ZombieProjectSearchForm />);

    const form = screen.getByRole("search") as HTMLFormElement;
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    const button = screen.getByRole("button", { name: "검색" });

    expect(form.getAttribute("action")).toContain("/zombie-projects");
    expect(form.method).toBe("get");
    expect(input.name).toBe("q");
    expect(input.required).toBe(true);
    expect(input.pattern).toBe(String.raw`.*\S.*`);
    expect(button.getAttribute("type")).toBe("submit");

    fireEvent.change(input, { target: { value: "service analyzer" } });
    fireEvent.submit(form);

    expect(
      JSON.parse(
        window.localStorage.getItem("zombie-project-recent-searches") ?? "[]",
      ),
    ).toEqual(["service analyzer"]);
  });

  it("최근 검색어 드롭다운을 누르면 해당 검색 URL로 이동한다", async () => {
    window.localStorage.setItem(
      "zombie-project-recent-searches",
      JSON.stringify(["service analyzer"]),
    );
    render(<ZombieProjectSearchForm />);

    fireEvent.focus(screen.getByRole("searchbox"));
    fireEvent.click(await screen.findByRole("button", { name: "service analyzer" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        "/zombie-projects?q=service+analyzer",
        { scroll: false },
      );
    });
  });

  it("현재 검색어를 다시 선택하면 서버 결과를 새로고침한다", async () => {
    render(<ZombieProjectSearchForm defaultQuery="service" />);

    fireEvent.focus(screen.getByRole("searchbox"));
    fireEvent.click(await screen.findByRole("button", { name: "service" }));

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledOnce();
    });
    expect(pushMock).not.toHaveBeenCalled();
  });
});
