import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const projectSaleTransactionSchema = z.object({
  transactionId: z.number().int().positive(),
  projectId: z.number().int().positive(),
  projectName: z.string(),
  buyerUserId: z.number().int().positive(),
  sellerUserId: z.number().int().positive(),
  price: z.number().int().nonnegative(),
  transferScope: z.string().nullable(),
  completedAt: z.string(),
  assets: z.array(z.object({
    fileId: z.number().int().positive(),
    originalFileName: z.string(),
    assetType: z.string().nullable(),
    ownershipType: z.string().nullable(),
    license: z.string().nullable(),
    reuseScope: z.string().nullable(),
    visibility: z.string().nullable(),
    fileRole: z.string().nullable(),
    fileSize: z.number().int().nonnegative(),
    sortOrder: z.number().int().nonnegative(),
  })),
});

export type ProjectSaleTransaction = z.infer<typeof projectSaleTransactionSchema>;

export async function getProjectSaleTransaction(transactionId: number) {
  const response = await fetch(
    getClientApiUrl(`/api/project-sales/transactions/${transactionId}`),
    { credentials: "include" },
  );
  const payload = await readJson(response);
  if (!response.ok) {
    throw getApiError(payload, response.status, "프로젝트 거래 스냅샷을 불러오지 못했습니다.");
  }
  const parsed = projectSaleTransactionSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("프로젝트 거래 스냅샷 응답 형식이 올바르지 않습니다.");
  }
  return parsed.data;
}
