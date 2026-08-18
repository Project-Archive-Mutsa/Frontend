import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TeamRecruitment } from "@/features/team-recruitment/types";
import TeamRecruitmentList from "./team-recruitment-list";

const { getTeamRecruitmentsMock } = vi.hoisted(() => ({
  getTeamRecruitmentsMock: vi.fn(),
}));

vi.mock("@/features/team-recruitment/api/get-team-recruitments", () => ({
  getTeamRecruitments: getTeamRecruitmentsMock,
}));

function createRecruitment(id: number): TeamRecruitment {
  return {
    id,
    title: `팀원 모집 ${id}`,
    description: `프로젝트 ${id}의 팀원을 찾습니다.`,
    roles: ["Frontend", "Designer"],
    deadline: "2026-08-20",
  };
}

describe("TeamRecruitmentList", () => {
  beforeEach(() => {
    getTeamRecruitmentsMock.mockReset();
  });

  it("모집글 개수와 API 응답 필드를 렌더링한다", async () => {
    getTeamRecruitmentsMock.mockResolvedValue([
      createRecruitment(1),
      createRecruitment(2),
    ]);

    render(await TeamRecruitmentList());

    expect(screen.getByText("2개")).toBeDefined();
    expect(screen.getByText("팀원 모집 1")).toBeDefined();
    expect(screen.getAllByText("Frontend")).toHaveLength(2);
    expect(screen.getAllByText("2026년 8월 20일")).toHaveLength(2);
    expect(screen.getByText("백엔드 미구현")).toBeDefined();
    expect(screen.queryByRole("link")).toBeNull();

    const actionButtons = screen.getAllByRole("button");
    expect(actionButtons).toHaveLength(4);
    expect(
      actionButtons.every((button) => button.hasAttribute("disabled")),
    ).toBe(true);
  });

  it("모집글이 없으면 빈 상태를 렌더링한다", async () => {
    getTeamRecruitmentsMock.mockResolvedValue([]);

    render(await TeamRecruitmentList());

    expect(
      screen.getByText("현재 등록된 팀원 모집글이 없습니다."),
    ).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
  });
});
