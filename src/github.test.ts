import { recentlyClosedPullRequests } from "./github";

test("fetching from a busy, public organization", async () => {
  const response = await recentlyClosedPullRequests({
    organization: "microsoft"
  });

  expect(response.search.edges.length).toBeGreaterThanOrEqual(1);
});

