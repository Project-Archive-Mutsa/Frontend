import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getProjectDiscoveryDemoResults } from "@/features/project-discovery/data/project-discovery-demo-data";
import ProjectDiscoverySummary from "./project-discovery-summary";

describe("ProjectDiscoverySummary", () => {
  it("AI 분석 맥락과 데모 결과에서 계산한 구성을 함께 표시한다", () => {
    const data = getProjectDiscoveryDemoResults("대학생 공모전 추천 서비스");

    render(
      <ProjectDiscoverySummary
        query={data.query}
        analysis={data.analysis}
        projects={data.projects}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /대학생 공모전 추천 서비스.*분석 결과/,
      }),
    ).toBeDefined();
    expect(within(screen.getByLabelText("AI 분석 키워드")).getByText("맞춤 추천")).toBeDefined();

    const metrics = within(screen.getByLabelText("검색 결과 구성"));
    expect(metrics.getByText("검색 결과")).toBeDefined();
    expect(metrics.getByText("3개")).toBeDefined();
    expect(metrics.getByText("유사도 80% 이상")).toBeDefined();
    expect(metrics.getByText("2개")).toBeDefined();
    expect(metrics.getByText("공개 계승")).toBeDefined();
    expect(metrics.getAllByText("1개")).toHaveLength(2);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "결과를 비교할 때 볼 점",
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "추가로 검증할 점",
      }),
    ).toBeDefined();
    expect(screen.getByText(/AI 분석 백엔드 개발 중/)).toBeDefined();
  });
});
