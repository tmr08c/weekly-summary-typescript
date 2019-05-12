import { fetchRecentlyClosedPullRequests } from "./index";

test("gives recently closed issues for public repositories", () => {
  const recentlyClosedPullRequests = fetchRecentlyClosedPullRequests({
    organization: "microsoft",
    repository: "typescript"
  });

  expect(recentlyClosedPullRequests.length).toBeGreaterThan(1);
});
