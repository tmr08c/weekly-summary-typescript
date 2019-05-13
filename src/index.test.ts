import { fetchRecentlyClosedPullRequests } from "./index";
import MockDate from "mockdate";

// Reset Date back to the real date
afterEach(() => MockDate.reset());

class FakeService {
  static async recentlyClosedPullRequests(): Promise<any> {}
  static searchQueryString(): any {}
}

const fakeApiCall = (FakeService.recentlyClosedPullRequests = jest.fn());

test("dates default to the last week", () => {
  MockDate.set("1/8/2019");

  fetchRecentlyClosedPullRequests({ organization: "my-org" }, FakeService);

  expect(fakeApiCall).toHaveBeenCalledWith({
    organization: "my-org",
    startDate: new Date("1/1/2019"),
    endDate: new Date("1/7/2019")
  });
});
