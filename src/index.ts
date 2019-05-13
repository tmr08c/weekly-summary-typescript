import { GitHub } from "./github";
import { subDays } from "date-fns";

interface RequestParams {
  organization: string;
}

export function fetchRecentlyClosedPullRequests(
  requestParams: RequestParams,
  service = GitHub
) {
  const dates = {
    startDate: subDays(new Date(), 7),
    endDate: subDays(new Date(), 1)
  };
  const args = { ...dates, ...requestParams };

  console.debug(
    `Fetching pull requests for ${
      requestParams.organization
    } that were closed between ${dates.startDate} and ${dates.endDate}`
  );

  return service.recentlyClosedPullRequests(args);
}
