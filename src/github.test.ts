import { GitHub } from "./github";

test("fetching from a busy, public organization", async () => {
  const response = await GitHub.recentlyClosedPullRequests({
    organization: "microsoft",
    startDate: new Date("5/1/19"),
    endDate: new Date("5/7/19")
  });

  expect(response.search.edges.length).toBeGreaterThanOrEqual(1);
});

test("searching for the correct organization", () => {
  const searchString = GitHub.searchQueryString({
    organization: "my-org",
    startDate: new Date(),
    endDate: new Date()
  });

  expect(searchString).toMatch("my-org");
});

test("searching for the right date range", () => {
  const searchString = GitHub.searchQueryString({
    organization: "my-org",
    startDate: new Date("1/1/2019"),
    endDate: new Date("1/7/2019")
  });

  expect(searchString).toMatch("closed:2019-01-01..2019-01-07");
});
