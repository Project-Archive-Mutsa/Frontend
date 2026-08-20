import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("포인트 API", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => { vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("충전 API의 envelope 없는 성공 응답을 검증한다", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: vi.fn().mockResolvedValue({ chargedPoint: 300, totalPoint: 1300, availablePoint: 1200 }) } as unknown as Response);
    const { chargePoints } = await import("./mypage-api");
    await expect(chargePoints(300)).resolves.toEqual({ chargedPoint: 300, totalPoint: 1300, availablePoint: 1200 });
    expect(fetchMock).toHaveBeenCalledWith("/api/members/me/points/charge", expect.objectContaining({ method: "POST", body: JSON.stringify({ amount: 300 }) }));
  });
});
