import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const envelope = <T extends z.ZodType>(data: T) => z.object({ success: z.literal(true), data, message: z.string().nullable().optional() });

const profileSchema = z.object({
  userId: z.number().int().positive(),
  loginId: z.string(),
  name: z.string(),
  totalPoint: z.number().int().nonnegative(),
  availablePoint: z.number().int().nonnegative(),
});

const myProjectSchema = z.object({
  projectId: z.number().int().positive(),
  projectName: z.string(),
  description: z.string().nullable().catch(null),
  representativeImageUrl: z.string().nullable().catch(null),
  images: z.array(z.unknown()).catch([]),
  tags: z.array(z.string()).catch([]),
  bookmarkCount: z.number().int().nonnegative().catch(0),
  registeredDate: z.string(),
  registrationPurpose: z.string(),
  registrationPurposeLabel: z.string(),
  status: z.string(),
  price: z.number().int().nonnegative().nullable().catch(null),
  detailPath: z.string(),
});

const wishlistProjectSchema = z.object({
  projectId: z.number().int().positive(),
  projectName: z.string(),
  description: z.string().nullable().catch(null),
  representativeImageUrl: z.string().nullable().catch(null),
  images: z.array(z.unknown()).catch([]),
  tags: z.array(z.string()).catch([]),
  bookmarkCount: z.number().int().nonnegative().catch(0),
  registeredDate: z.string(),
  savedDate: z.string(),
  detailPath: z.string(),
});

const balanceSchema = z.object({ totalPoint: z.number().int().nonnegative(), availablePoint: z.number().int().nonnegative() });
const chargeSchema = z.object({ chargedPoint: z.number().int().positive(), totalPoint: z.number().int().nonnegative(), availablePoint: z.number().int().nonnegative() });
const transactionSchema = z.object({
  transactionId: z.number().int().positive(),
  projectId: z.number().int().positive().nullable().catch(null),
  projectName: z.string().nullable().catch(null),
  type: z.string(),
  amount: z.number().int(),
  createdAt: z.string(),
});

const applicationSchema = z.object({
  applicationId: z.number().int().positive(),
  recruitmentId: z.number().int().positive(),
  projectId: z.number().int().positive(),
  projectName: z.string(),
  recruitmentTitle: z.string().optional(),
  role: z.string(),
  status: z.string(),
  appliedAt: z.string().optional(),
  createdAt: z.string().optional(),
}).passthrough();

const messageListItemSchema = z.object({
  messageId: z.number().int().positive(),
  senderId: z.number().int().positive(),
  senderNickname: z.string(),
  projectId: z.number().int().positive(),
  projectName: z.string(),
  preview: z.string(),
  read: z.boolean(),
  createdAt: z.string(),
});
const messageDetailSchema = messageListItemSchema.omit({ preview: true }).extend({ content: z.string() });

async function getPayload(path: string) {
  const response = await fetch(getClientApiUrl(path), { credentials: "include" });
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "마이페이지 정보를 불러오지 못했습니다.");
  return payload;
}

export async function getMyProfile(userId: number) {
  const parsed = envelope(profileSchema).safeParse(await getPayload(`/api/me/mypage?userId=${userId}`));
  if (!parsed.success) throw new Error("프로필 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

export async function getMyProjects(userId: number) {
  const parsed = envelope(z.object({ totalCount: z.number().int().nonnegative(), projects: z.array(myProjectSchema) })).safeParse(await getPayload(`/api/my/projects?userId=${userId}`));
  if (!parsed.success) throw new Error("내 프로젝트 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

export async function getWishlistProjects() {
  const parsed = envelope(z.object({ totalCount: z.number().int().nonnegative(), projects: z.array(wishlistProjectSchema) })).safeParse(await getPayload("/api/my/like-projects"));
  if (!parsed.success) throw new Error("관심 프로젝트 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

export async function getPointBalance() {
  const parsed = balanceSchema.safeParse(await getPayload("/api/members/me/points"));
  if (!parsed.success) throw new Error("포인트 잔액 응답 형식이 올바르지 않습니다.");
  return parsed.data;
}

export async function chargePoints(amount: number) {
  const response = await fetch(getClientApiUrl("/api/members/me/points/charge"), { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) });
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "포인트 충전에 실패했습니다.");
  const parsed = chargeSchema.safeParse(payload);
  if (!parsed.success) throw new Error("포인트 충전 응답 형식이 올바르지 않습니다.");
  return parsed.data;
}

export async function getPointTransactions() {
  const parsed = z.array(transactionSchema).safeParse(await getPayload("/api/members/me/points/transactions"));
  if (!parsed.success) throw new Error("포인트 거래내역 응답 형식이 올바르지 않습니다.");
  return parsed.data;
}

export async function getMyRecruitmentApplications() {
  const payload = await getPayload("/api/me/recruitment-applications?page=0&size=100");
  const arrayEnvelope = envelope(z.array(applicationSchema)).safeParse(payload);
  if (arrayEnvelope.success) return arrayEnvelope.data.data;
  const pageEnvelope = envelope(z.object({ content: z.array(applicationSchema) })).safeParse(payload);
  if (pageEnvelope.success) return pageEnvelope.data.data.content;
  throw new Error("팀 지원내역 응답 형식이 올바르지 않습니다.");
}

export async function getMessages() {
  const parsed = z.array(messageListItemSchema).safeParse(await getPayload("/api/messages"));
  if (!parsed.success) throw new Error("메시지 목록 응답 형식이 올바르지 않습니다.");
  return parsed.data;
}

export async function getMessage(messageId: number) {
  const parsed = messageDetailSchema.safeParse(await getPayload(`/api/messages/${messageId}`));
  if (!parsed.success) throw new Error("메시지 상세 응답 형식이 올바르지 않습니다.");
  return parsed.data;
}

export type MyProject = z.infer<typeof myProjectSchema>;
export type PointBalance = z.infer<typeof balanceSchema>;
export type PointTransaction = z.infer<typeof transactionSchema>;
export type WishlistProject = z.infer<typeof wishlistProjectSchema>;
