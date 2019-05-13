/// <reference path="index.d.ts" />

const graphql = require("@octokit/graphql");

interface SearchResponse {
  search: {
    edges: [{ node: Response }];
  };
}

interface Response {
  repository: { name: string };
  title: string;
  createdAt: Date;
  closedAt: Date;
  url: string;
  merged: boolean;
}

const closedPullRequestsQuery = `
  query recentPullRequests($searchString: String!) {
    search(
      query: $searchString
      type: ISSUE
      first: 100
    ) {
      edges {
        node {
          ... on PullRequest {
            repository {
              name
            }
            title
            createdAt
            closedAt
            url
            merged
          }
        }
      }
    }
 }
`;

export async function recentlyClosedPullRequests({
  organization
}: WeeklySummary.RequestParams): Promise<SearchResponse> {
  return await graphql({
    query: closedPullRequestsQuery,
    searchString: searchQueryString({ organization }),
    headers: {
      authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`
    }
  }).catch((e: Error) => {
    console.error(`Failed to make request to GitHub. Received: ${e.message}`);
  });
}

function searchQueryString({ organization }: { organization: string }) {
  return `org:${organization} is:pr is:closed is:merged closed:>2019-04-01`;
}
