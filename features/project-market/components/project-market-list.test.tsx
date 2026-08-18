import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectMarketProject } from "@/features/project-market/types";
import ProjectMarketList from "./project-market-list";

const { getProjectMarketProjectsMock, getProjectMarketSearchResultsMock } =
  vi.hoisted(() => ({
  getProjectMarketProjectsMock: vi.fn(),
    getProjectMarketSearchResultsMock: vi.fn(),
  }));

vi.mock("@/features/project-market/api/get-project-market-projects", () => ({
  getProjectMarketProjects: getProjectMarketProjectsMock,
}));

vi.mock(
  "@/features/project-market/api/get-project-market-search-results",
  () => ({
    getProjectMarketSearchResults: getProjectMarketSearchResultsMock,
  }),
);

function createProject(id: number): ProjectMarketProject {
  return {
    id,
    name: `판매 프로젝트 ${id}`,
    description: `프로젝트 ${id}의 긴 설명`,
    registeredAt: "2026-08-18",
    representativeImage: {
      src: "/window.svg",
      alt: `판매 프로젝트 ${id} 대표 이미지`,
    },
    tags: ["AI", "Next.js", "아카이브", "해커톤"],
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

describe("ProjectMarketList", () => {
  beforeEach(() => {
    getProjectMarketProjectsMock.mockReset();
    getProjectMarketSearchResultsMock.mockReset();
  });

  it("전체 개수와 판매 프로젝트 정보를 렌더링한다", async () => {
    getProjectMarketProjectsMock.mockResolvedValue([
      createProject(1),
      createProject(2),
    ]);

    render(await ProjectMarketList());

    expect(screen.getByText("2개")).toBeDefined();
    expect(screen.getByText("판매 프로젝트 1")).toBeDefined();
    expect(screen.getAllByText("조회 1,234")).toHaveLength(2);
    expect(screen.getAllByText("150,000원")).toHaveLength(2);
    expect(screen.getAllByText("project.zip")).toHaveLength(2);
    expect(screen.getAllByText(/1.5 KB/)).toHaveLength(2);
    expect(screen.getAllByText("외 1개")).toHaveLength(2);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("프로젝트가 없으면 빈 상태를 렌더링한다", async () => {
    getProjectMarketProjectsMock.mockResolvedValue([]);

    render(await ProjectMarketList());

    expect(
      screen.getByText("아직 등록된 판매 프로젝트가 없습니다."),
    ).toBeDefined();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("검색어가 있으면 판매 프로젝트 검색 결과를 렌더링한다", async () => {
    getProjectMarketSearchResultsMock.mockResolvedValue([createProject(1)]);

    render(await ProjectMarketList({ query: "AI" }));

    expect(getProjectMarketSearchResultsMock).toHaveBeenCalledWith("AI");
    expect(screen.getByText("“AI” 검색 결과")).toBeDefined();
    expect(screen.getByText("1개")).toBeDefined();
    expect(screen.getByText("판매 프로젝트 1")).toBeDefined();
  });

  it("판매 프로젝트 검색 결과가 없으면 전체 목록 복귀 링크를 제공한다", async () => {
    getProjectMarketSearchResultsMock.mockResolvedValue([]);

    render(await ProjectMarketList({ query: "없는 프로젝트" }));

    expect(
      screen.getByText("“없는 프로젝트”에 해당하는 판매 프로젝트가 없습니다."),
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: "전체 프로젝트 보기" }).getAttribute(
        "href",
      ),
    ).toBe("/project-market");
  });

  it("이미지와 ZIP 파일이 없으면 대체 정보를 렌더링한다", async () => {
    getProjectMarketProjectsMock.mockResolvedValue([
      {
        ...createProject(1),
        representativeImage: null,
        zipFile: null,
      },
    ]);

    render(await ProjectMarketList());

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("대표 이미지 없음")).toBeDefined();
    expect(screen.getByText("등록된 파일 없음")).toBeDefined();
  });
});
