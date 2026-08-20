import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultProjectRegistrationDraft } from "../model/default-draft";
import type { ProjectRegistrationDraft } from "../model/types";

describe("프로젝트 등록 API", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => { vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("구조화 상세정보와 공통 자료 공개 동의를 전송하고 등록 점수를 파싱한다", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: vi.fn().mockResolvedValue({ success: true, data: { projectId: 31, name: "판매 프로젝트", detailPath: "/projects/31", status: "REGISTERED", informationCompletenessScore: 84 } }) } as unknown as Response);
    const draft: ProjectRegistrationDraft = {
      ...defaultProjectRegistrationDraft,
      purpose: "SELL",
      projectName: "판매 프로젝트",
      summary: "프로젝트 전체 양도 테스트",
      eventDate: "2026-08",
      activityStatus: "ACTIVE",
      resultLevel: "SUBMISSION_OUTPUT",
      pricingMode: "FIXED",
      desiredPoints: "500",
      problemDefinition: "반복되는 프로젝트 기록 손실 문제를 해결합니다.",
      targetAudience: "대회 종료 후 결과물을 관리하는 팀",
      solution: "프로젝트 정보와 자료를 구조화해 저장하고 다시 연결합니다.",
      coreApproach: "프로젝트 등록과 상세정보 열람 흐름을 제공합니다.",
      differentiation: "중단 이유와 후속 과제까지 함께 기록합니다.",
      validation: "등록·검색 시나리오를 기준으로 검증했습니다.",
      approaches: "사용자 흐름과 API 계약을 함께 설계했습니다.",
      constraints: "해커톤 기간 안에 구현해야 했습니다.",
      limitations: "실사용자 장기 검증은 아직 진행하지 못했습니다.",
      nextValidationTasks: "운영 데이터를 기준으로 검색 품질을 확인합니다.",
      materialDisclosureConsent: true,
      assets: [{ id: "asset-1", category: "CODE_TECH", title: "소스", projectRole: "핵심 구현", description: "프로젝트 핵심 구현 소스", versionLabel: "v1", updatedAt: "2026-08-20", sources: [{ id: "source-1", kind: "EXTERNAL_LINK", url: "https://github.com/example/project", provider: "GITHUB" }] }],
    };
    const { registerProject } = await import("./register-project");
    const result = await registerProject({ draft, userId: 7, representativeImage: null, assetFiles: new Map() });
    expect(result.project).toMatchObject({ projectId: 31, projectName: "판매 프로젝트", informationCompletenessScore: 84 });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/api/project-registration/sale");
    const part = (init?.body as FormData).get("projectSaleRequest") as Blob;
    const payload = JSON.parse(await part.text());
    expect(payload).toMatchObject({
      materialDisclosureConsent: true,
      price: 500,
      eventStartedAt: "2026-08-01",
      eventEndedAt: "2026-08-31",
      activityStatus: "ACTIVE",
      problemDefinition: "반복되는 프로젝트 기록 손실 문제를 해결합니다.",
      coreFunctions: ["프로젝트 등록과 상세정보 열람 흐름을 제공합니다."],
      validationSummary: "등록·검색 시나리오를 기준으로 검증했습니다.",
      links: [{ linkType: "GITHUB", url: "https://github.com/example/project" }],
    });
    expect(payload.detailPages.at(-1)?.pageContent).toBe("프로젝트 핵심 구현 소스");
    expect(payload.detailPages.at(-1)).not.toHaveProperty("visibility");
    expect(payload.links[0]).not.toHaveProperty("accessRequirement");
    expect(payload).not.toHaveProperty("fullTransferConfirmed");
  });
});
