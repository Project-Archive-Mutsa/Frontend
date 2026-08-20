import { describe, expect, it } from "vitest";
import { projectDetailResponseSchema } from "./project-detail-response-schema";

describe("프로젝트 상세 응답 스키마", () => {
  it("배포 계약의 null 리포트와 판매 자산 요약을 파싱한다", () => {
    const parsed = projectDetailResponseSchema.safeParse({
      success: true,
      data: {
        projectId: 1,
        projectName: "판매 프로젝트",
        publicSummary: "공개 요약",
        representativeImageUrl: null,
        registeredAt: "2026-08-20",
        registrationPurpose: "SELL",
        event: {
          name: null,
          type: null,
          hostOrganization: null,
          startedAt: null,
          endedAt: null,
          participationTrack: null,
        },
        categories: [],
        problemAreas: [],
        methods: [],
        tags: [],
        resultLevel: null,
        activityStatus: "PAUSED",
        projectPeriod: { startDate: null, endDate: null },
        awards: [],
        team: { memberCount: null, roles: [] },
        assets: { publicCount: 0, paidCount: 0, categories: [] },
        informationCompletenessScore: 35,
        stats: { viewCount: 0, likeCount: 0, bookmarkCount: 0 },
        viewer: { bookmarked: false, liked: false, owner: false },
        reportOffer: null,
        purposeDetail: {
          purpose: "SELL",
          transferScope: null,
          priceType: null,
          price: 53_000,
          saleStatus: "RIGHTS_REVIEW",
          includedAssets: { count: 0, categories: [] },
          purchasable: false,
        },
        galleryImageUrls: [],
        detailPages: [],
        files: [],
        links: [],
      },
      message: "프로젝트 상세 정보를 조회했습니다.",
    });

    expect(parsed.success).toBe(true);
  });
});
