import Link from "next/link";
import RecruitmentApplicationForm from "@/features/team-recruitment/components/recruitment-application-form";
import { getProjectPurposeLabel } from "@/shared/project-summary/types";
import type { ProjectDetailViewModel } from "../model/types";

function Definition({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-sm font-bold leading-6 text-slate-800">{value}</dd></div>;
}

export default function ProjectPurposeSection({ project }: { project: ProjectDetailViewModel }) {
  const detail = project.purposeDetail;
  if (detail.purpose === "ZOMBIE") {
    return null;
  }

  return (
    <section aria-labelledby="purpose-action-title" className="border-t border-slate-300 pt-10">
      <div className="border-b border-slate-300 pb-5">
        <p className="text-xs font-bold text-brand">{getProjectPurposeLabel(project.registrationPurpose)}</p>
        <h2 id="purpose-action-title" className="font-display mt-2 text-2xl font-bold tracking-[-0.025em] text-slate-950">프로젝트의 다음 연결</h2>
      </div>

      {detail.purpose === "SELL" ? (
        <div className="py-7">
          <h3 className="text-lg font-bold text-slate-950">프로젝트 자산·권리 구매</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">프로젝트 구매가 완료되면 새 소유자에게 프로젝트 상세 정보와 등록된 자산이 공개됩니다. 포함 자산과 이전 범위를 확인한 뒤 결제하세요.</p>
          <dl className="mt-6 grid gap-6 sm:grid-cols-3">
            <Definition label="판매가" value={detail.price === null ? "미입력" : `${detail.price.toLocaleString("ko-KR")} P`} />
            <Definition label="권리 이전 범위" value={detail.transferScope ?? "미입력"} />
            <Definition label="판매 상태" value={detail.saleStatus ?? "미입력"} />
          </dl>
          {detail.includedAssets.count > 0 ? <div className="mt-7"><h4 className="text-sm font-bold text-slate-900">포함 자산</h4><p className="mt-3 text-sm leading-6 text-slate-600">총 {detail.includedAssets.count}개{detail.includedAssets.categories.length ? ` · ${detail.includedAssets.categories.join(", ")}` : ""}</p></div> : null}
        </div>
      ) : (
        <div className="py-7">
          <div className="flex items-start justify-between gap-6"><div><h3 className="text-lg font-bold text-slate-950">팀원 모집</h3><p className="mt-2 text-sm leading-7 text-slate-600">모집 역할과 활동 조건을 확인하고 지원할 수 있습니다.</p></div><Link href="/team-recruitment" className="shrink-0 text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4">모집 목록</Link></div>
          <dl className="mt-6 grid gap-6 sm:grid-cols-3"><Definition label="모집 역할" value={detail.roles.join(", ") || "미입력"} /><Definition label="모집 인원" value={`${detail.headcount}명`} /><Definition label="마감일" value={detail.deadline ?? "미입력"} /><Definition label="필요 역량" value={detail.requiredSkills.join(", ") || "미입력"} /><Definition label="활동 일정" value={detail.activitySchedule ?? "미입력"} /><Definition label="진행 방식" value={detail.workMode ?? "미입력"} /></dl>
          {detail.applicationGuide ? <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-700">{detail.applicationGuide}</p> : null}
          <RecruitmentApplicationForm recruitmentId={detail.recruitmentId} roles={detail.roles} closed={detail.status === "CLOSED"} returnPath={`/projects/${project.id}`} />
        </div>
      )}
    </section>
  );
}
