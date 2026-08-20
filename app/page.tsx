import HomeHeroSection from "@/features/home/components/home-hero-section";
import OngoingContestSection from "@/features/ongoing-contests/components/ongoing-contest-section";
import PopularProjectSection from "@/features/popular-projects/components/popular-project-section";
import RecentAwardProjectSection from "@/features/recent-award-projects/components/recent-award-project-section";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <HomeHeroSection />
      <RecentAwardProjectSection />
      <PopularProjectSection />
      <OngoingContestSection />
    </main>
  );
}
