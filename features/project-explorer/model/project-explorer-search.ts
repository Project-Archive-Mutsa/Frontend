import type { ProjectExplorerSearchState } from "./types";

export type ProjectExplorerSearchParams = Record<
  string,
  string | string[] | undefined
>;

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseProjectExplorerSearch(
  searchParams: ProjectExplorerSearchParams,
): ProjectExplorerSearchState {
  return {
    query: getFirstValue(searchParams.q)?.trim() ?? "",
  };
}
