import { describe, expect, it } from "vitest";
import type { TeamRecruitmentResponseItem } from "@/features/team-recruitment/types";
import { mapTeamRecruitment } from "./map-team-recruitment";

describe("mapTeamRecruitment", () => {
  it("API 응답을 목록 화면 모델로 변환하고 동작 전용 경로를 제외한다", () => {
    const responseItem: TeamRecruitmentResponseItem = {
      id: 1,
      title: "프론트엔드 팀원 모집",
      description: "React 개발자를 찾습니다.",
      roles: ["Frontend", "Designer"],
      deadline: "2026-08-20",
      detailUrl: "/recruitments/1",
    };

    const result = mapTeamRecruitment(responseItem);

    expect(result).toEqual({
      id: 1,
      title: "프론트엔드 팀원 모집",
      description: "React 개발자를 찾습니다.",
      roles: ["Frontend", "Designer"],
      deadline: "2026-08-20",
    });
    expect(JSON.stringify(result)).not.toContain("detailUrl");
  });
});
