import { GitHub } from "./github";
import fetchMock from "fetch-mock";

test("fetching from a busy, public organization", async () => {
  const response = await GitHub.recentlyClosedPullRequests({
    organization: "microsoft",
    startDate: new Date("5/1/19"),
    endDate: new Date("5/7/19")
  });

  expect(response.search.edges.length).toBeGreaterThanOrEqual(1);
});

test("responses are formatted to be groups by repo, and 'cleaned up'", async () => {
  const fetch = fetchMock
    .sandbox()
    .post("https://api.github.com/graphql", (url: string, options: object) => {
      return { data: {} };
    });

  const resp = await GitHub.recentlyClosedPullRequests({
    organization: "my-org",
    startDate: new Date(),
    endDate: new Date(),
    request: { fetch }
  });

  expect(resp).toEqual({});
});

test("search string include the specified org and date range", async () => {
  const fetch = fetchMock
    .sandbox()
    .post(
      "https://api.github.com/graphql",
      (url: string, options: fetchMock.MockRequest) => {
        if (options.body) {
          expect(options.body).toMatch("org:my-org");
          expect(options.body).toMatch("closed:2019-01-01..2019-01-07");
        } else {
          fail("No body supplied to mock request");
        }
        return { data: {} };
      }
    );

  const resp = await GitHub.recentlyClosedPullRequests({
    organization: "my-org",
    startDate: new Date("1/1/2019"),
    endDate: new Date("1/7/2019"),
    request: { fetch }
  });

  expect(resp).toEqual({});
});
