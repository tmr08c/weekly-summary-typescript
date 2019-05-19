import fetchMock from "fetch-mock";
import { GitHub, IResponse, ISearchResponse } from "./github";

test("fetching from a busy, public organization", async () => {
  const response = await GitHub.recentlyClosedPullRequests({
    endDate: new Date("5/7/19"),
    organization: "microsoft",
    startDate: new Date("5/1/19")
  });

  expect(Object.values(response).length).toBeGreaterThanOrEqual(1);
});

function createMockPullRequest(repoName: string, title: string): IResponse {
  return {
    node: {
      closedAt: new Date(),
      createdAt: new Date(),
      merged: true,
      repository: { name: repoName },
      title,
      url: `https://www.github.com/someOrg/${repoName}/pulls/1`
    }
  };
}

test("responses are formatted to be groups by repo, and 'cleaned up'", async () => {
  const repoOnePullOne = createMockPullRequest("repo-1", "pull-request-1");
  const repoTwoPullOne = createMockPullRequest("repo-2", "pull-request-1");
  const repoOnePullTwo = createMockPullRequest("repo-1", "pull-request-2");

  const mockResponse: ISearchResponse = {
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
    endDate: new Date(),
    organization: "my-org",
    request: { fetch },
    startDate: new Date()
  });

  // expecting something like
  // { repoName1: PRs[], repoName2: PRs[] }
  expect(Object.keys(resp)).toEqual(["repo-1", "repo-2"]);
  expect(resp["repo-1"].length).toEqual(2);
  expect(resp["repo-2"].length).toEqual(1);
});

test("search string include the specified org and date range", async () => {
  const emptyMockResponse: ISearchResponse = {
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
    endDate: new Date("1/7/2019"),
    organization: "my-org",
    request: { fetch },
    startDate: new Date("1/1/2019")
  });

  expect(resp).toEqual({});
});
