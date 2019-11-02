import MockDate from "mockdate";
import { fetchRecentlyClosedPullRequests } from "./index";

// Reset Date back to the real date
afterEach(() => MockDate.reset());

test("dates default to the last week", () => {
  MockDate.set("1/8/2019");

  jest.mock("./github");
  const MockedGitHub = require("./github").GitHub;

  const fakeApiCall = jest.fn().mockImplementation();
  MockedGitHub.mockImplementation(() => {
    return {
      recentlyClosedPullRequests: fakeApiCall
    };
  });

  fetchRecentlyClosedPullRequests(
    { organization: "my-org" },
    "fake-token",
    MockedGitHub
  );

  expect(fakeApiCall).toHaveBeenCalledWith({
    endDate: new Date("1/7/2019"),
    organization: "my-org",
    startDate: new Date("1/1/2019")
  });
});
