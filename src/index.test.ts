import MockDate from "mockdate";
import { fetchRecentlyClosedPullRequests } from "./index";

// Reset Date back to the real date
afterEach(() => MockDate.reset());

class FakeService {
  public static async recentlyClosedPullRequests(): Promise<any> {
    return {};
  }
  public static __searchQueryString(): string {
    return "";
  }
}

const fakeApiCall = (FakeService.recentlyClosedPullRequests = jest.fn());

test("dates default to the last week", () => {
  MockDate.set("1/8/2019");

  fetchRecentlyClosedPullRequests({ organization: "my-org" }, FakeService);

  expect(fakeApiCall).toHaveBeenCalledWith({
    endDate: new Date("1/7/2019"),
    organization: "my-org",
    startDate: new Date("1/1/2019")
  });
});
