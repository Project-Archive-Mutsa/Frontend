import { z } from "zod";
import type { TeamRecruitment } from "@/features/team-recruitment/types";
import { mapTeamRecruitment } from "./map-team-recruitment";
import { teamRecruitmentResponseItemSchema } from "./team-recruitment-response-schema";

const TEAM_RECRUITMENTS_PATH = "/api/recruitments";

const teamRecruitmentsResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().nullable().optional(),
});

export async function getTeamRecruitments(): Promise<
  readonly TeamRecruitment[]
> {
  const response = await fetch(
    `${process.env.API_BASE_URL}${TEAM_RECRUITMENTS_PATH}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`팀원 모집글 조회에 실패했습니다. (${response.status})`);
  }

  const parsedResponse = teamRecruitmentsResponseSchema.safeParse(
    await response.json(),
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
