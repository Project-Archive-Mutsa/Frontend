import { describe, expect, it } from "vitest";
import { getProjectDiscoveryDemoResults } from "./project-discovery-demo-data";

describe("getProjectDiscoveryDemoResults", () => {
  it("검색어를 분석 요약에 반영하고 유사도순 데모 프로젝트를 반환한다", () => {
    const result = getProjectDiscoveryDemoResults("대학생 공모전 추천 서비스");

    expect(result.analysis.summary).toContain("대학생 공모전 추천 서비스");
    expect(result.analysis.keywords).toContain("맞춤 추천");
    expect(result.analysis.comparisonPoints).not.toHaveLength(0);
    expect(result.analysis.validationPoints).not.toHaveLength(0);
    expect(result.projects).toHaveLength(3);
    expect(result.projects.map((project) => project.similarityScore)).toEqual([
      0.92,
      0.84,
      0.71,
    ]);
    expect(result.projects[0].similarityReasons).not.toHaveLength(0);
    expect(result.projects[0].differences).not.toHaveLength(0);
    expect(result.projects[0].validationSuggestions).not.toHaveLength(0);
  });
});
