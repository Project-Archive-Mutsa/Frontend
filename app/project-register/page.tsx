import type { Metadata } from "next";
import ProjectRegistrationSection from "@/features/project-registration/components/project-registration-section";

export const metadata: Metadata = {
  title: "프로젝트 등록 | Project Archive",
  description: "공모전·대회·해커톤·캡스톤에 출품한 프로젝트의 배경, 결과와 자산을 등록합니다.",
};

export default function ProjectRegisterPage() {
  return (
    <main className="flex-1 bg-slate-50 px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
      <ProjectRegistrationSection />
    </main>
  );
}
