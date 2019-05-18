import { GitHub, Response, SearchResponse } from "./github";
import fetchMock from "fetch-mock";

test("fetching from a busy, public organization", async () => {
  const response = await GitHub.recentlyClosedPullRequests({
    organization: "microsoft",
    startDate: new Date("5/1/19"),
    endDate: new Date("5/7/19")
  });

  expect(Object.values(response).length).toBeGreaterThanOrEqual(1);
});

function createMockPullRequest(repoName: string, title: string): Response {
  return {
    node: {
      repository: { name: repoName },
      title: title,
      createdAt: new Date(),
      closedAt: new Date(),
      url: `https://www.github.com/someOrg/${repoName}/pulls/1`,
      merged: true
    }
  };
}

test("responses are formatted to be groups by repo, and 'cleaned up'", async () => {
  const repoOnePullOne = createMockPullRequest("repo-1", "pull-request-1");
  const repoTwoPullOne = createMockPullRequest("repo-2", "pull-request-1");
  const repoOnePullTwo = createMockPullRequest("repo-1", "pull-request-2");

  const mockResponse: SearchResponse = {
    search: {
      edges: [repoOnePullOne, repoTwoPullOne, repoOnePullTwo]
    }
  };

  const fetch = fetchMock
    .sandbox()
    .post("https://api.github.com/graphql", (url: string, options: object) => {
      return { data: mockResponse };
    });

  const resp = await GitHub.recentlyClosedPullRequests({
    organization: "my-org",
    startDate: new Date(),
    endDate: new Date(),
    request: { fetch }
  });

  // expecting something like
  // { repoName1: PRs[], repoName2: PRs[] }
  expect(Object.keys(resp)).toEqual(["repo-1", "repo-2"]);
  expect(resp["repo-1"].length).toEqual(2);
  expect(resp["repo-2"].length).toEqual(1);
});

test("search string include the specified org and date range", async () => {
  const emptyMockResponse: SearchResponse = {
    search: { edges: [] }
  };
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
        return { data: emptyMockResponse };
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
