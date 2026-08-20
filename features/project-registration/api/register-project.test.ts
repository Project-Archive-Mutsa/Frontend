import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultProjectRegistrationDraft } from "../model/default-draft";
import type { ProjectRegistrationDraft } from "../model/types";

describe("프로젝트 등록 API", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => { vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("공통 자료 공개 동의와 목적별 링크 접근 조건을 전송하고 등록 점수를 파싱한다", async () => {
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
      fullTransferConfirmed: true,
      price: 500,
      eventStartedAt: "2026-08-01",
      eventEndedAt: "2026-08-31",
      links: [{ accessRequirement: "OWNER" }],
    });
    expect(payload.detailPages.at(-1)?.pageContent).toBe("프로젝트 핵심 구현 소스");
  });
});
