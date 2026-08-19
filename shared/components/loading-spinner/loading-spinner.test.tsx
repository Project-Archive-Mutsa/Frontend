import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingSpinner from "./loading-spinner";

describe("LoadingSpinner", () => {
  it("요청한 크기와 CSS 회전 클래스, 장식용 접근성 속성을 적용한다", () => {
    const { container } = render(<LoadingSpinner size={20} />);
    const spinner = container.querySelector("span");

    expect(spinner?.style.width).toBe("20px");
    expect(spinner?.style.height).toBe("20px");
    expect(spinner?.getAttribute("aria-hidden")).toBe("true");
    expect(spinner?.classList.contains("loading-spinner")).toBe(true);
  });

  it("크기를 지정하지 않으면 32픽셀을 사용한다", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("span");

    expect(spinner?.style.width).toBe("32px");
    expect(spinner?.style.height).toBe("32px");
  });

  it("전역 CSS에서 회전 애니메이션과 모션 감소 설정을 정의한다", () => {
    const globalCss = readFileSync(
      resolve(process.cwd(), "app/globals.css"),
      "utf8",
    );

    expect(globalCss).toMatch(
      /\.loading-spinner\s*{[^}]*animation:\s*loading-spinner-rotate/,
    );
    expect(globalCss).toMatch(
      /@keyframes loading-spinner-rotate\s*{[\s\S]*transform:\s*rotate\(360deg\)/,
    );
    expect(globalCss).toMatch(
      /prefers-reduced-motion:\s*reduce[\s\S]*\.loading-spinner[\s\S]*animation:\s*none/,
    );
  });
});
