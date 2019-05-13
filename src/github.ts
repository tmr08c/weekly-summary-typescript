const graphql = require("@octokit/graphql");

import { format } from "date-fns";

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

interface RequestParams {
  organization: string;
  startDate: Date;
  endDate: Date;
  request?: { fetch: Function };
}

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

interface GitHubGraphqlArgs {
  query: string;
  searchString: string;
  headers: {
    authorization: string;
  };
  request?: { fetch: Function };
}

export class GitHub {
  static async recentlyClosedPullRequests(
    params: RequestParams
  ): Promise<SearchResponse> {
    let requestArgs: GitHubGraphqlArgs = {
      query: closedPullRequestsQuery,
      searchString: this.searchQueryString(params),
      headers: {
        authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`
      }
    };

    if (params.request) {
      requestArgs = { ...requestArgs, request: params.request };
    }
    return await graphql(requestArgs).catch((e: Error) => {
      console.error(`Failed to make request to GitHub. Received: ${e.message}`);
      throw e;
    });
  }

  static searchQueryString({
    organization,
    startDate,
    endDate
  }: RequestParams) {
    const formattedStartDate = format(startDate, "YYYY-MM-DD");
    const formattedEndDate = format(endDate, "YYYY-MM-DD");

    return `org:${organization} is:pr is:closed is:merged closed:${formattedStartDate}..${formattedEndDate}`;
  }
}
