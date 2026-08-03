import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Home from "@/app/page";

test("홈 페이지 콘텐츠를 렌더링한다", () => {
  render(<Home />);

  expect(screen.getByText("dd")).toBeDefined();
});
