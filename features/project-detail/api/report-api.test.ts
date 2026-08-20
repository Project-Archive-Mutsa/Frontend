import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("리포트 거래 API", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => { vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("사용자 동작별 멱등 키를 구매 요청 헤더로 전달한다", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: vi.fn().mockResolvedValue({ success: true, data: { purchaseId: 1, projectId: 2, entitlementId: 3, paidPoint: 100, balance: 900, accessStatus: "GRANTED", reportVersion: 1, purchasedAt: "2026-08-20T12:00:00Z" } }) } as unknown as Response);
    const { purchaseProjectReport } = await import("./purchase-project-report");
    await expect(purchaseProjectReport(2, "action-key-1")).resolves.toMatchObject({ accessStatus: "GRANTED", balance: 900 });
    expect(fetchMock).toHaveBeenCalledWith("/api/projects/2/report-purchases", expect.objectContaining({ method: "POST", headers: { "Idempotency-Key": "action-key-1" } }));
  });
});
