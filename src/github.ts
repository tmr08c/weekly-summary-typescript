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

interface PullRequestsForRepos {
  [repo: string]: PullRequestInformation[];
}

interface PullRequestInformation {
  repository: { name: string };
  title: string;
  createdAt: Date;
  closedAt: Date;
  url: string;
  merged: boolean;
}

interface RequestParams {
  organization: string;
  startDate: Date;
  endDate: Date;
  request?: { fetch: Function };
}

export interface SearchResponse {
  search: {
    edges: Response[];
  };
}

export interface Response {
  node: {
    repository: { name: string };
    title: string;
    createdAt: Date;
    closedAt: Date;
    url: string;
    merged: boolean;
  };
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
  ): Promise<PullRequestsForRepos> {
    let requestArgs: GitHubGraphqlArgs = {
      query: closedPullRequestsQuery,
      searchString: this.__searchQueryString(params),
      headers: {
        authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`
      }
    };

    if (params.request) {
      requestArgs = { ...requestArgs, request: params.request };
    }

    const response: SearchResponse = await graphql(requestArgs).catch(
      (e: Error) => {
        console.error(
          `Failed to make request to GitHub. Received: ${e.message}`
        );
        throw e;
      }
    );

    const pullRequestsGroupsByRepo: PullRequestsForRepos = {};

    return response.search.edges.reduce(
      (accumulator, pullRequestResponse, _currIndex, _arr) => {
        const repoName = pullRequestResponse.node.repository.name;

        if (!accumulator[repoName]) {
          accumulator[repoName] = [];
        }

        accumulator[repoName].push(pullRequestResponse.node);

        return accumulator;
      },
      pullRequestsGroupsByRepo
    );
  }

  static __searchQueryString({
    organization,
    startDate,
    endDate
  }: RequestParams) {
    const formattedStartDate = format(startDate, "YYYY-MM-DD");
    const formattedEndDate = format(endDate, "YYYY-MM-DD");

    return `org:${organization} is:pr is:closed is:merged closed:${formattedStartDate}..${formattedEndDate}`;
  }
}
