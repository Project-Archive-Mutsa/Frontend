import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ZombieProject } from "@/features/zombie-projects/types";

const { getZombieProjectsMock } = vi.hoisted(() => ({ getZombieProjectsMock: vi.fn() }));
vi.mock("./get-zombie-projects", () => ({ getZombieProjects: getZombieProjectsMock }));

const project: ZombieProject = {
  id: 1060,
  detailPath: "/projects/1060",
  name: "접근성 예술 전시",
  description: "대체 텍스트와 음성 해설을 제작합니다.",
  registeredAt: "2026-03-25",
  representativeImage: null,
  tags: ["접근성"],
  stats: { viewCount: 10, likeCount: 2, bookmarkCount: 1 },
  sellerName: "등록자",
  price: 0,
  zipFile: null,
  bookmarked: false,
};

describe("좀비 프로젝트 검색 어댑터", () => {
  beforeEach(() => getZombieProjectsMock.mockReset());

  it("검색어를 공통 목록 조회에 전달하고 catalog 결과를 만든다", async () => {
    getZombieProjectsMock.mockResolvedValue([project]);
    const { getZombieProjectSearchResults } = await import("./get-zombie-project-search-results");
    await expect(getZombieProjectSearchResults("접근성")).resolves.toEqual({ query: "접근성", totalCount: 1, projects: [{ kind: "catalog", project }] });
    expect(getZombieProjectsMock).toHaveBeenCalledWith({ query: "접근성" });
  });

  it("빈 공통 목록은 빈 검색 결과로 유지한다", async () => {
    getZombieProjectsMock.mockResolvedValue([]);
    const { getZombieProjectSearchResults } = await import("./get-zombie-project-search-results");
    await expect(getZombieProjectSearchResults("없음")).resolves.toEqual({ query: "없음", totalCount: 0, projects: [] });
  });
});
