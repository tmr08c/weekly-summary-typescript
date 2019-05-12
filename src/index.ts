/// <reference path="index.d.ts" />

import { recentlyClosedPullRequests } from "./github";

export function fetchRecentlyClosedPullRequests(
  requestParams: WeeklySummary.RequestParams
) {
  return recentlyClosedPullRequests(requestParams);
}
