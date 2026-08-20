export const queryKeys = {
  points: {
    all: ["points"] as const,
    balance: ["points", "balance"] as const,
    transactions: ["points", "transactions"] as const,
  },
  projects: {
    all: ["projects"] as const,
    detail: (projectId: number) => ["projects", "detail", projectId] as const,
    viewer: (projectId: number) => ["projects", projectId, "viewer"] as const,
    saleTransaction: (transactionId: number) =>
      ["projects", "sale-transaction", transactionId] as const,
    reportAccess: (projectId: number) =>
      ["projects", projectId, "report-access"] as const,
    report: (projectId: number) => ["projects", projectId, "report"] as const,
    detailedInfoFiles: (projectId: number) =>
      ["projects", projectId, "detailed-info-files"] as const,
  },
  mypage: {
    all: ["mypage"] as const,
    profile: (userId: number) => ["mypage", "profile", userId] as const,
    projects: (userId: number) => ["mypage", "projects", userId] as const,
    wishlist: ["mypage", "wishlist"] as const,
    wishlistIds: ["mypage", "wishlist", "ids"] as const,
    applications: ["mypage", "applications"] as const,
    messages: ["mypage", "messages"] as const,
    message: (messageId: number) => ["mypage", "messages", messageId] as const,
  },
  recruitments: {
    all: ["recruitments"] as const,
  },
} as const;
