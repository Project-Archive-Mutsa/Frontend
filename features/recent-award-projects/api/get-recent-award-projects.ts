import { recentAwardProjects } from "@/mocks/recent-award-projects/dummy-data";
import type { RecentAwardProject } from "@/mocks/recent-award-projects/types";

export async function getRecentAwardProjects(): Promise<
  readonly RecentAwardProject[]
> {
  // TODO: 백엔드 연결 시 mock 반환을 Axios 요청으로 교체
  return recentAwardProjects;
}
