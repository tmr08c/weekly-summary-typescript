import graphql from "@octokit/graphql";
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

export interface IPullRequestsForRepos {
  [repo: string]: IPullRequestInformation[];
}

interface IPullRequestInformation {
  closedAt: Date;
  createdAt: Date;
  merged: boolean;
  repository: { name: string };
  title: string;
  url: string;
}

interface IRequestParams {
  endDate: Date;
  organization: string;
  startDate: Date;
  request?: { fetch: () => object };
}

export interface ISearchResponse {
  search: {
    edges: IResponse[];
  };
}

export interface IResponse {
  node: {
    repository: { name: string };
    title: string;
    createdAt: Date;
    closedAt: Date;
    url: string;
    merged: boolean;
  };
}

interface IGitHubGraphqlArgs {
  headers: {
    authorization: string;
  };
  query: string;
  request?: { fetch: () => object };
  searchString: string;
}

export class GitHub {
  token: string;

  constructor({ authToken }: { authToken: string }) {
    this.token = authToken;
  }

  public async recentlyClosedPullRequests(
    params: IRequestParams
  ): Promise<IPullRequestsForRepos> {
    let requestArgs: IGitHubGraphqlArgs = {
      headers: {
        authorization: `token ${this.token}`
      },
      query: closedPullRequestsQuery,
      searchString: this.__searchQueryString(params)
    };

    if (params.request) {
      requestArgs = { ...requestArgs, request: params.request };
    }

    const response: ISearchResponse = await graphql(requestArgs).catch(
      (e: Error) => {
        console.error(
          `Failed to make request to GitHub. Received: ${e.message}`
        );
        throw e;
      }
    );

    const pullRequestsGroupsByRepo: IPullRequestsForRepos = {};

    return response.search.edges.reduce((accumulator, pullRequestResponse) => {
      const repoName = pullRequestResponse.node.repository.name;

      if (!accumulator[repoName]) {
        accumulator[repoName] = [];
      }

      accumulator[repoName].push(pullRequestResponse.node);

      return accumulator;
    }, pullRequestsGroupsByRepo);
  }

  public __searchQueryString({
    organization,
    startDate,
    endDate
  }: IRequestParams) {
    const formattedStartDate = format(startDate, "YYYY-MM-DD");
    const formattedEndDate = format(endDate, "YYYY-MM-DD");

    return `org:${organization} is:pr is:closed is:merged closed:${formattedStartDate}..${formattedEndDate}`;
  }
}
