import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const parts = [
  {
    partId: 1,
    partName: "프론트엔드",
    tags: [{ tagId: 1, tagName: "React" }],
  },
  {
    partId: 2,
    partName: "백엔드",
    tags: [{ tagId: 2, tagName: "Spring" }],
  },
];

vi.mock("./use-signup-parts", () => ({
  default: () => ({
    parts,
    partsError: null,
    isPartsPending: false,
  }),
}));

import useRegisterInterestStep from "./use-register-interest-step";

describe("useRegisterInterestStep", () => {
  it("첫 파트를 기본으로 보여주고 선택한 파트로 전환한다", () => {
    const { result } = renderHook(() =>
      useRegisterInterestStep({
        selectedInterests: [],
        onInterestToggle: vi.fn(),
        onComplete: vi.fn(),
      }),
    );

    expect(result.current.activePart?.partId).toBe(1);

    act(() => result.current.selectPart(2));

    expect(result.current.activePart?.partId).toBe(2);
  });

  it("현재 파트와 태그 ID를 함께 선택값으로 전달한다", () => {
    const onInterestToggle = vi.fn();
    const { result } = renderHook(() =>
      useRegisterInterestStep({
        selectedInterests: [],
        onInterestToggle,
        onComplete: vi.fn(),
      }),
    );

    act(() => result.current.toggleTag(1));

    expect(onInterestToggle).toHaveBeenCalledWith({ partId: 1, tagId: 1 });
  });
});
