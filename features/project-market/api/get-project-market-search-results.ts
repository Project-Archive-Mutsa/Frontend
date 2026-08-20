import type { ProjectMarketProject } from "@/features/project-market/types";
import { getProjectMarketProjects } from "./get-project-market-projects";

export async function getProjectMarketSearchResults(
  query: string,
): Promise<readonly ProjectMarketProject[]> {
  return getProjectMarketProjects({ query });
}
