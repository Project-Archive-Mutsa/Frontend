import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ZombieProjectSearchResults as SearchResults } from "@/features/zombie-projects/types";
import ZombieProjectSearchResults from "./zombie-project-search-results";

const { getSearchResultsMock } = vi.hoisted(() => ({
  getSearchResultsMock: vi.fn(),
}));

vi.mock(
  "@/features/zombie-projects/api/get-zombie-project-search-results",
  () => ({
    getZombieProjectSearchResults: getSearchResultsMock,
  }),
);

const results: SearchResults = {
  query: "service",
  totalCount: 1,
  projects: [
    {
      kind: "analysis",
      project: {
        projectTitle: "service-analyzer",
        totalFiles: 86,
        selectedFiles: [
          {
            path: "README.md",
            extension: "md",
            kind: "TEXT",
            size: 12048,
          },
        ],
        functionalSummary: ["서비스 구조와 의존성을 분석합니다."],
        differentiators: ["문서와 코드를 함께 분석합니다."],
        technicalStrengths: ["정적 분석이 빠릅니다."],
        futureDirections: ["지원 언어를 확장할 수 있습니다."],
        sections: [
          { title: "운영 특징", items: ["별도 설치가 필요 없습니다."] },
        ],
      },
    },
  ],
};

describe("ZombieProjectSearchResults", () => {
  beforeEach(() => {
    getSearchResultsMock.mockReset();
  });

  it("프로젝트 설명을 표시하고 파일 근거는 무료로 노출하지 않는다", async () => {
    getSearchResultsMock.mockResolvedValue(results);

    render(await ZombieProjectSearchResults({ query: "service" }));

    expect(getSearchResultsMock).toHaveBeenCalledWith("service");
    expect(screen.getByText("service-analyzer")).toBeDefined();
    expect(
      screen.getByText("서비스 구조와 의존성을 분석합니다."),
    ).toBeDefined();
    expect(screen.queryByText("README.md")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("운영 API의 목록형 프로젝트를 상세 링크와 함께 렌더링한다", async () => {
    getSearchResultsMock.mockResolvedValue({
      query: "접근성",
      totalCount: 1,
      projects: [
        {
          kind: "catalog",
          project: {
            id: 1060,
            detailPath: "/projects/1060",
            name: "날씨 반응형 접근성 예술 전시",
            description: "대체 텍스트와 음성 해설을 제작합니다.",
            registeredAt: "2026-03-25",
            representativeImage: null,
            tags: ["접근성", "전시"],
            stats: { viewCount: 14301, likeCount: 91, bookmarkCount: 17 },
            sellerName: "Project Archive Demo",
            price: 41000,
            zipFile: null,
          },
        },
      ],
    } satisfies SearchResults);

    render(await ZombieProjectSearchResults({ query: "접근성" }));

    expect(screen.getByText("날씨 반응형 접근성 예술 전시")).toBeDefined();
    expect(screen.getAllByRole("link")[0]?.getAttribute("href")).toBe(
      "/projects/1060",
    );
  });

  it("검색된 프로젝트가 없으면 다음 검색 행동을 안내한다", async () => {
    getSearchResultsMock.mockResolvedValue({
      query: "missing",
      totalCount: 0,
      projects: [],
    });

    render(await ZombieProjectSearchResults({ query: "missing" }));

    expect(screen.getByText(/일치하는 결과가 없습니다/)).toBeDefined();
  });
});
