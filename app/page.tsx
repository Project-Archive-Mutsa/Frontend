import OngoingContestSection from "@/features/ongoing-contests/components/ongoing-contest-section";
import PopularProjectSection from "@/features/popular-projects/components/popular-project-section";
import RecentAwardProjectSection from "@/features/recent-award-projects/components/recent-award-project-section";

export default function Home() {
  return (
    <main className="flex flex-col">
      <RecentAwardProjectSection />
      <PopularProjectSection />
      <OngoingContestSection />
    </main>
  );
}
