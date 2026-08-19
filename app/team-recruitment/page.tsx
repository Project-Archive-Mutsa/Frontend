import type { Metadata } from "next";
import TeamRecruitmentSection from "@/features/team-recruitment/components/team-recruitment-section";

export const metadata: Metadata = {
  title: "팀원 모집 | Project Archive",
  description: "프로젝트와 대회 일정에 맞는 역할별 팀원 모집글을 확인하세요.",
};

export default function TeamRecruitmentPage() {
  return (
    <main className="flex flex-1 bg-slate-50">
      <TeamRecruitmentSection />
    </main>
  );
}
