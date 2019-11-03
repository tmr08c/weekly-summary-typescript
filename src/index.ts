import { subDays } from "date-fns";
import { GitHub } from "./github";

interface IRequestParams {
  organization: string;
}

export function fetchRecentlyClosedPullRequests(
  requestParams: IRequestParams,
  authToken: string,
  Service = GitHub
) {
  const dates = {
    endDate: subDays(new Date(), 1),
    startDate: subDays(new Date(), 7)
  };
  const args = { ...dates, ...requestParams };

  console.debug(
    `Fetching pull requests for ${
      requestParams.organization
    } that were closed between ${dates.startDate} and ${dates.endDate}`
  );

  return new Service({ authToken }).recentlyClosedPullRequests(args);
}
