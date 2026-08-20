import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectDiscoveryResultItem } from "@/features/project-discovery/types";
import ProjectDiscoveryResultList from "./project-discovery-result-list";

function createResultItem(id: number): ProjectDiscoveryResultItem {
  return {
    type: "PROJECT",
    id,
    title: `프로젝트 ${id}`,
    description: `프로젝트 ${id} 설명`,
    category: "POPULAR",
    tags: ["AI", "검색"],
    representativeImageUrl: null,
    images: [],
    detailPath: `/projects/${id}`,
    similarityScore: 0.5,
  };
}

describe("ProjectDiscoveryResultList", () => {
  it("결과가 5개를 넘으면 나머지 결과를 더보기 영역에 둔다", () => {
    const { container } = render(
      <ProjectDiscoveryResultList
        id="project-results"
        title="프로젝트"
        description="프로젝트 검색 결과"
        query="대학생 공모전 추천"
        items={Array.from({ length: 6 }, (_, index) =>
          createResultItem(index + 1),
        )}
      />,
    );

    const initialList = container.querySelector("section > ul");
    const moreResults = container.querySelector("details");

    expect(initialList?.children).toHaveLength(5);
    expect(screen.getByText("나머지 1개 더보기")).not.toBeNull();
    expect(moreResults).not.toBeNull();
    expect(
      within(moreResults as HTMLElement).getByText("프로젝트 6"),
    ).not.toBeNull();
  });

  it("결과가 5개 이하면 더보기를 표시하지 않는다", () => {
    const { container } = render(
      <ProjectDiscoveryResultList
        id="award-results"
        title="수상작"
        description="수상작 검색 결과"
        query="대학생 공모전 추천"
        items={Array.from({ length: 5 }, (_, index) =>
          createResultItem(index + 1),
        )}
      />,
    );

    expect(container.querySelector("details")).toBeNull();
    expect(screen.queryByText(/개 더보기/)).toBeNull();
  });

  it("검색어와 프로젝트의 유사도를 숫자와 막대로 표시한다", () => {
    render(
      <ProjectDiscoveryResultList
        id="project-results"
        title="유사 프로젝트"
        description="AI 검색 결과"
        query="대학생 공모전 추천"
        items={[createResultItem(1)]}
      />,
    );

    expect(screen.getByText("50%")).toBeDefined();
    expect(
      screen.getByRole("meter", {
        name: "검색어 대학생 공모전 추천. 프로젝트 1 유사도",
      }),
    ).toBeDefined();
  });

  it("#38의 프로젝트별 유사 근거와 차이·검증 과제를 표시한다", () => {
    render(
      <ProjectDiscoveryResultList
        id="project-results"
        title="유사 프로젝트"
        description="AI 검색 결과"
        query="대학생 공모전 추천"
        items={[
          {
            ...createResultItem(1),
            similarityReasons: ["사용자 조건을 분석하는 방식이 비슷합니다."],
            differences: ["추천하는 정보의 범위가 다릅니다."],
            validationSuggestions: ["추천 기준의 신뢰도를 검증해 보세요."],
          },
        ]}
      />,
    );

    expect(
      screen.getByText("사용자 조건을 분석하는 방식이 비슷합니다."),
    ).toBeDefined();
    expect(screen.getByText("추천하는 정보의 범위가 다릅니다.")).toBeDefined();
    expect(
      screen.getByText("추천 기준의 신뢰도를 검증해 보세요."),
    ).toBeDefined();
  });
});
