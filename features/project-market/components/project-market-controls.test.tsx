import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { vi } from "vitest";
import ProjectMarketControls from "./project-market-controls";

vi.mock("next/form", () => ({
  default: ({
    scroll,
    ...props
  }: ComponentProps<"form"> & { scroll?: boolean }) => (
    <form data-scroll={String(scroll)} {...props} />
  ),
}));

describe("ProjectMarketControls", () => {
  it("검색은 활성화하고 API가 없는 상세 필터만 비활성화한다", () => {
    render(<ProjectMarketControls defaultQuery="AI" />);

    const searchInput = screen.getByRole("searchbox") as HTMLInputElement;
    const searchButton = screen.getByRole("button", { name: "검색" });
    const filters = screen.getAllByRole("combobox");
    const searchForm = screen.getByRole("search") as HTMLFormElement;

    expect(searchInput.value).toBe("AI");
    expect(searchInput.name).toBe("q");
    expect(searchInput.required).toBe(true);
    expect(searchForm.getAttribute("action")).toContain("/project-market");
    expect(searchInput.hasAttribute("disabled")).toBe(false);
    expect(searchButton.hasAttribute("disabled")).toBe(false);
    expect(filters).toHaveLength(3);
    expect(filters.every((filter) => filter.hasAttribute("disabled"))).toBe(
      true,
    );
    expect(screen.getByText("백엔드 미구현")).toBeDefined();
    expect(
      screen.getByText(/태그·가격대·정렬 파라미터는/),
    ).toBeDefined();
  });
});
