import { z } from "zod";

const nullableText = z.string().nullable().catch(null);
const purposeSchema = z.enum(["REGISTER", "ARCHIVE", "ZOMBIE", "SELL", "TEAM_RECRUIT"]);
const unlockModeSchema = z.enum([
  "POINT_ACCESS",
  "PROJECT_PURCHASE",
  "OWNER_ONLY",
  "ALREADY_GRANTED",
]);

const eventSchema = z.object({
  name: nullableText,
  type: nullableText,
  hostOrganization: nullableText,
  startedAt: nullableText,
  endedAt: nullableText,
  participationTrack: nullableText,
});

const assetSchema = z.object({
  fileId: z.number().int().positive(),
  originalFileName: z.string().catch("이름 없는 자산"),
  fileUrl: nullableText.optional(),
  visibility: nullableText,
  canView: z.boolean().catch(false),
  fileSize: z.number().int().nonnegative().catch(0),
  fileRole: nullableText,
  assetType: nullableText,
  ownershipType: nullableText,
  license: nullableText,
  reuseScope: nullableText,
});

const detailPageSchema = z.object({
  detailPageId: z.number().int().positive(),
  pageName: z.string().catch("상세 기록"),
  pageIntro: nullableText,
  pageContent: nullableText,
  visibility: nullableText,
  canView: z.boolean().optional(),
  files: z.array(assetSchema).catch([]),
});

const archivePurposeSchema = z.object({ purpose: z.literal("ARCHIVE") }).passthrough();
const sellPurposeSchema = z.object({
  purpose: z.literal("SELL"),
  transferScope: nullableText,
  priceType: z.enum(["FIXED", "NEGOTIABLE"]).nullable().catch(null),
  price: z.number().int().nonnegative().nullable().catch(null),
  saleStatus: nullableText,
  includedAssets: z.object({
    count: z.number().int().nonnegative().catch(0),
    categories: z.array(z.string()).catch([]),
  }).catch({ count: 0, categories: [] }),
  purchasable: z.boolean().catch(false),
});
const zombiePurposeSchema = z.object({
  purpose: z.literal("ZOMBIE"),
  reusableAssets: z.array(z.object({
    assetId: z.number().int().positive(),
    title: z.string(),
    assetType: nullableText,
    role: nullableText,
    license: nullableText,
    attribution: nullableText,
    reuseConditions: nullableText,
    publicSource: nullableText,
  })).catch([]),
});
const teamPurposeSchema = z.object({
  purpose: z.literal("TEAM_RECRUIT"),
  recruitmentId: z.number().int().positive(),
  status: z.enum(["OPEN", "CLOSED"]),
  roles: z.array(z.string()).catch([]),
  headcount: z.number().int().positive(),
  requiredSkills: z.array(z.string()).catch([]),
  activitySchedule: nullableText,
  workMode: nullableText,
  deadline: nullableText,
  applicationGuide: nullableText,
  referenceAssetSummary: nullableText,
});

const assetSummarySchema = z
  .union([
    z.object({
      publicCount: z.number().int().nonnegative(),
      paidCount: z.number().int().nonnegative(),
      categories: z.array(z.string()).catch([]),
    }),
    z
      .object({
        count: z.number().int().nonnegative(),
        categories: z.array(z.string()).catch([]),
      })
      .transform((assets) => ({
        publicCount: assets.count,
        paidCount: 0,
        categories: assets.categories,
      })),
  ])
  .catch({ publicCount: 0, paidCount: 0, categories: [] });

const detailAccessSchema = z.object({
  unlockMode: unlockModeSchema,
  pricePoint: z.number().int().nonnegative().nullable().catch(null),
  purchaseEnabled: z.boolean(),
  available: z.boolean(),
  unavailableReason: nullableText,
});

export const projectDetailResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    projectId: z.number().int().positive(),
    projectName: z.string(),
    publicSummary: nullableText.optional(),
    description: nullableText.optional(),
    representativeImageUrl: nullableText,
    galleryImageUrls: z.array(z.string()).catch([]),
    registrationPurpose: purposeSchema,
    registeredAt: nullableText,
    event: eventSchema.nullable().catch(null),
    categories: z.array(z.string()).catch([]),
    problemAreas: z.array(z.string()).catch([]),
    methods: z.array(z.string()).catch([]),
    tags: z.array(z.string()).catch([]),
    resultLevel: z.enum(["IDEA_PLAN", "DESIGNED", "INITIAL_OUTPUT", "SUBMISSION_OUTPUT", "APPLIED"]).nullable().catch(null),
    activityStatus: z.enum(["ACTIVE", "PAUSED", "ENDED"]).nullable().catch(null),
    projectPeriod: z.object({ startDate: nullableText, endDate: nullableText }).nullable().catch(null),
    developmentPeriod: z.object({ startDate: nullableText, endDate: nullableText }).nullable().optional(),
    awards: z.array(z.object({ title: z.string(), awardedAt: nullableText })).catch([]),
    awardHistory: nullableText.optional(),
    team: z.object({ memberCount: z.number().int().nonnegative().nullable().catch(null), roles: z.array(z.string()).catch([]) }).nullable().catch(null),
    assets: assetSummarySchema,
    informationCompletenessScore: z.number().int().min(0).max(100).nullable().catch(null),
    stats: z.object({
      viewCount: z.number().int().nonnegative().catch(0),
      likeCount: z.number().int().nonnegative().catch(0),
      bookmarkCount: z.number().int().nonnegative().catch(0),
    }),
    viewer: z.object({ bookmarked: z.boolean(), liked: z.boolean(), owner: z.boolean() }),
    reportOffer: z.object({
      available: z.boolean(),
      price: z.number().int().nonnegative().nullable().catch(null),
      sectionCount: z.number().int().nonnegative(),
      sectionTitles: z.array(z.string()).catch([]),
    }).nullable().catch(null),
    detailAccess: detailAccessSchema.nullable().catch(null),
    purposeDetail: z.discriminatedUnion("purpose", [archivePurposeSchema, sellPurposeSchema, zombiePurposeSchema, teamPurposeSchema]),
    seller: z.object({ userId: z.number().int().positive().nullable().catch(null), loginId: nullableText, name: nullableText }).nullable().optional(),
    detailPages: z.array(detailPageSchema).catch([]),
    files: z.array(assetSchema).catch([]),
    links: z.array(z.object({ linkType: z.string(), url: z.string(), accessRequirement: nullableText.optional() })).catch([]),
  }),
  message: z.string().nullable().optional(),
});

export type RawProjectDetail = z.infer<typeof projectDetailResponseSchema>["data"];
export type RawProjectDetailFile = z.infer<typeof assetSchema>;
