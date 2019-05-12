import { recentlyClosedPullRequests } from "./github";

test("fetching from a public repo", () => {
  const recentPRs = recentlyClosedPullRequests({
    organization: "microsoft",
    repository: "typescript"
  });

  expect(recentPRs.length).toBeGreaterThanOrEqual(1)
});
