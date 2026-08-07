import { popularProjects } from "@/mocks/popular-projects/dummy-data";
import type { PopularProject } from "@/mocks/popular-projects/types";

export async function getPopularProjects(): Promise<
  readonly PopularProject[]
> {
  // TODO: 백엔드 연결 시 mock 반환을 Axios 요청으로 교체
  return popularProjects;
}
