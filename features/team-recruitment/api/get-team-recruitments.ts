import { z } from "zod";
import type { TeamRecruitment } from "@/features/team-recruitment/types";
import { mapTeamRecruitment } from "./map-team-recruitment";
import { teamRecruitmentResponseItemSchema } from "./team-recruitment-response-schema";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getServerApiUrl } from "@/shared/api/server-api-url";

const TEAM_RECRUITMENTS_PATH = "/api/recruitments";

const teamRecruitmentsResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().nullable().optional(),
});

export async function getTeamRecruitments(query: { query?: string; role?: string; status?: "" | "OPEN" | "CLOSED" } = {}): Promise<
  readonly TeamRecruitment[]
> {
  const url = getServerApiUrl(TEAM_RECRUITMENTS_PATH);
  if (query.query) url.searchParams.set("q", query.query);
  if (query.role) url.searchParams.set("role", query.role);
  if (query.status) url.searchParams.set("status", query.status);
  const response = await fetch(url, { cache: "no-store" });
  const payload = await readJson(response);

  if (!response.ok) {
    throw getApiError(payload, response.status, "팀원 모집글 조회에 실패했습니다.");
  }

  const parsedResponse = teamRecruitmentsResponseSchema.safeParse(
    payload,
  );

  if (!parsedResponse.success) {
    throw new Error("팀원 모집글 응답 형식이 올바르지 않습니다.");
  }

  if (!parsedResponse.data.success) {
    throw new Error(
      parsedResponse.data.message ?? "팀원 모집글을 조회하지 못했습니다.",
    );
  }

  const parsedRecruitments = z
    .array(teamRecruitmentResponseItemSchema)
    .safeParse(parsedResponse.data.data);

  if (!parsedRecruitments.success) {
    throw new Error("팀원 모집글 응답 형식이 올바르지 않습니다.");
  }

  return parsedRecruitments.data.map(mapTeamRecruitment);
}
