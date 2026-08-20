import type { ZombieProjectSearchResults } from "@/features/zombie-projects/types";
import { getZombieProjects } from "./get-zombie-projects";

export async function getZombieProjectSearchResults(query: string): Promise<ZombieProjectSearchResults> {
  const projects = await getZombieProjects({ query });
  return {
    query,
    totalCount: projects.length,
    projects: projects.map((project) => ({ kind: "catalog" as const, project })),
  };
}
