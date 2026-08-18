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
        items={Array.from({ length: 5 }, (_, index) =>
          createResultItem(index + 1),
        )}
      />,
    );

    expect(container.querySelector("details")).toBeNull();
    expect(screen.queryByText(/개 더보기/)).toBeNull();
  });
});
