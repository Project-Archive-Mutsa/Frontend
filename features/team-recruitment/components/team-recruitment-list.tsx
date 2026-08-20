import { getTeamRecruitments } from "@/features/team-recruitment/api/get-team-recruitments";
import TeamRecruitmentCard from "./team-recruitment-card";

type State = { query: string; role: string; status: "" | "OPEN" | "CLOSED" };

export default async function TeamRecruitmentList({ state }: { state: State }) {
  const recruitments = await getTeamRecruitments(state);

  if (recruitments.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center border-y border-slate-300 px-6 text-center text-sm text-slate-600">
        현재 등록된 팀원 모집글이 없습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <p className="text-sm text-slate-600">
          등록 모집글{" "}
          <strong className="font-bold tabular-nums text-slate-900">
            {recruitments.length.toLocaleString("ko-KR")}개
          </strong>
        </p>
      </div>

      <ul className="mt-5 divide-y divide-slate-300 border-y border-slate-300">
        {recruitments.map((recruitment) => (
          <li key={recruitment.id}>
            <TeamRecruitmentCard recruitment={recruitment} />
          </li>
        ))}
      </ul>
    </div>
  );
}
