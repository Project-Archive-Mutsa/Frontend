import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock(
  "@/features/recent-award-projects/components/recent-award-project-list",
  () => ({
    default: () => <div>최근 수상작 목록</div>,
  }),
);

import Home from "@/app/page";

test("홈 페이지 콘텐츠를 렌더링한다", () => {
  render(<Home />);

  expect(screen.getByRole("heading", { name: "최근 수상작" })).toBeDefined();
  expect(screen.getByText("최근 수상작 목록")).toBeDefined();
});
