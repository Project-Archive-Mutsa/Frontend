import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ZombieProject } from "@/features/zombie-projects/types";
import ZombieProjectList from "./zombie-project-list";

const { getZombieProjectsMock } = vi.hoisted(() => ({
  getZombieProjectsMock: vi.fn(),
}));

vi.mock("@/features/zombie-projects/api/get-zombie-projects", () => ({
  getZombieProjects: getZombieProjectsMock,
}));

function createProject(id: number): ZombieProject {
  return {
    id,
    detailPath: `/projects/${id}`,
    name: `좀비 프로젝트 ${id}`,
    description: `프로젝트 ${id}의 긴 설명`,
    registeredAt: "2026-08-18",
    representativeImage: {
      src: "/window.svg",
      alt: `좀비 프로젝트 ${id} 대표 이미지`,
    },
    tags: ["AI", "Next.js"],
    stats: {
      viewCount: 1234,
      likeCount: 56,
      bookmarkCount: 7,
    },
    sellerName: "테스트 판매자",
    price: 150000,
    zipFile: {
      name: "project.zip",
      sizeInBytes: 1536,
    },
  };
}

describe("ZombieProjectList", () => {
  beforeEach(() => {
    getZombieProjectsMock.mockReset();
  });

  it("전체 개수와 프로젝트 정보 및 canonical 상세 링크를 렌더링한다", async () => {
    getZombieProjectsMock.mockResolvedValue([createProject(1), createProject(2)]);

    render(await ZombieProjectList());

    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("좀비 프로젝트 1")).toBeDefined();
    expect(screen.getAllByText("조회 1,234")).toHaveLength(2);
    expect(screen.queryByText("project.zip")).toBeNull();
    expect(screen.getAllByText("프로젝트 상세 정보")).toHaveLength(2);
    expect(screen.getAllByRole("link")[0]?.getAttribute("href")).toBe("/projects/1");
  });

  it("프로젝트가 없으면 빈 상태를 렌더링한다", async () => {
    getZombieProjectsMock.mockResolvedValue([]);

    render(await ZombieProjectList());

    expect(
      screen.getByText("아직 등록된 좀비 프로젝트가 없습니다."),
    ).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("이미지가 없으면 이미지 영역을 생략하고 ZIP 대체 정보를 렌더링한다", async () => {
    getZombieProjectsMock.mockResolvedValue([
      {
        ...createProject(1),
        representativeImage: null,
        zipFile: null,
      },
    ]);

    render(await ZombieProjectList());

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByText("대표 이미지 없음")).toBeNull();
    expect(screen.getAllByText("미입력").length).toBeGreaterThan(0);
  });
});
