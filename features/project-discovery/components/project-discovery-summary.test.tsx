import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectDiscoveryResultItem } from "@/features/project-discovery/types";
import ProjectDiscoverySummary from "./project-discovery-summary";

const projects: readonly ProjectDiscoveryResultItem[] = [
  {
    type: "PROJECT",
    id: 17,
    title: "광고 성과 분석기",
    description: "광고 데이터를 분석합니다.",
    category: "AI·데이터",
    tags: ["광고"],
    representativeImageUrl: null,
    images: [],
    detailPath: "/projects/17",
    similarityScore: 0.91,
    metadataStatus: "FULL",
  },
  {
    type: "PROJECT",
    id: 18,
    title: "캠페인 추천기",
    description: "캠페인을 추천합니다.",
    category: "마케팅",
    tags: ["추천"],
    representativeImageUrl: null,
    images: [],
    detailPath: "/projects/18",
    similarityScore: 0.82,
    metadataStatus: "FULL",
  },
];

const resultCounts = {
  projects: 2,
  contests: 1,
  ideas: 0,
  awards: 1,
};

describe("ProjectDiscoverySummary", () => {
  it("#38의 AI 요약과 비교·검증 문구를 그대로 표시한다", () => {
    render(
      <ProjectDiscoverySummary
        query="AI 광고"
        analysis={{
          summary: "백엔드가 생성한 실제 후보 기반 분석 요약입니다.",
          keywords: ["AI", "광고 분석"],
          comparisonPoints: ["성과 지표의 차이를 비교해 보세요."],
          validationPoints: ["광고 데이터 확보 가능성을 확인해 보세요."],
          interpretationNote: "유사도는 성공 가능성을 보장하지 않습니다.",
        }}
        analysisStatus="SUCCEEDED"
        matchedCategories={["마케팅"]}
        projects={projects}
        resultCounts={resultCounts}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "“AI 광고” 분석 결과" }),
    ).toBeDefined();
    expect(
      screen.getByText("백엔드가 생성한 실제 후보 기반 분석 요약입니다."),
    ).toBeDefined();
    expect(screen.getByText("성과 지표의 차이를 비교해 보세요.")).toBeDefined();
    expect(
      screen.getByText("광고 데이터 확보 가능성을 확인해 보세요."),
    ).toBeDefined();
    expect(
      screen.getByText("유사도는 성공 가능성을 보장하지 않습니다."),
    ).toBeDefined();
    expect(screen.getByText("총 4건")).toBeDefined();
    expect(screen.queryByText("데모 데이터")).toBeNull();
  });

  it("AI 분석 실패 시 후보 수는 유지하고 가짜 분석 문구를 만들지 않는다", () => {
    render(
      <ProjectDiscoverySummary
        query="AI 광고"
        analysis={null}
        analysisStatus="FAILED"
        matchedCategories={["AI·인공지능"]}
        projects={projects}
        resultCounts={resultCounts}
      />,
    );

    expect(screen.getByRole("status").textContent).toBe("AI 분석 실패");
    expect(
      screen.getByText(
        "AI 종합 분석을 제공하지 못했습니다. 검색된 프로젝트 후보는 아래 목록에서 확인할 수 있습니다.",
      ),
    ).toBeDefined();
    expect(screen.getByText("AI·인공지능")).toBeDefined();
    expect(screen.queryByText("결과를 비교할 때 볼 점")).toBeNull();
    expect(screen.queryByText("추가로 검증할 점")).toBeNull();
  });
});
