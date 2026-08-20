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
  const resultLevel = getFirstValue(searchParams.resultLevel);
  const activityStatus = getFirstValue(searchParams.activityStatus);
  const sort = getFirstValue(searchParams.sort);
  const parsedPage = Number.parseInt(getFirstValue(searchParams.page) ?? "0", 10);

  return {
    query: getFirstValue(searchParams.q)?.trim() ?? "",
    eventType: getFirstValue(searchParams.eventType)?.trim() ?? "",
    eventYear: getFirstValue(searchParams.eventYear)?.trim() ?? "",
    category: getFirstValue(searchParams.category)?.trim() ?? "",
    resultLevel:
      resultLevel && ["IDEA_PLAN", "DESIGNED", "INITIAL_OUTPUT", "SUBMISSION_OUTPUT", "APPLIED"].includes(resultLevel)
        ? (resultLevel as ProjectExplorerSearchState["resultLevel"])
        : "",
    activityStatus:
      activityStatus && ["ACTIVE", "PAUSED", "ENDED"].includes(activityStatus)
        ? (activityStatus as ProjectExplorerSearchState["activityStatus"])
        : "",
    sort: sort === "POPULAR" ? "POPULAR" : "RECENT",
    page: Number.isSafeInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0,
  };
}
