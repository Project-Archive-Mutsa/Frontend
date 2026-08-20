import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("프로젝트 사용자 동작 API", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => { vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("북마크 토글 결과를 검증한다", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: vi.fn().mockResolvedValue({ success: true, data: { projectId: 9, bookmarked: true, bookmarkCount: 4 } }) } as unknown as Response);
    const { toggleProjectBookmark } = await import("./toggle-project-bookmark");
    await expect(toggleProjectBookmark(9)).resolves.toEqual({ projectId: 9, bookmarked: true, bookmarkCount: 4 });
  });
});
