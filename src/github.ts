/// <reference path="index.d.ts" />

const graphql = require("@octokit/graphql");

export async function recentlyClosedPullRequests({
  organization,
  repository
}: WeeklySummary.RequestParams) {
  console.log(process.env.GITHUB_AUTH_TOKEN);

  const response = await graphql(
    `
      {
        repository(owner: "octokit", name: "graphql.js") {
          issues(last: 3) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    `,
    {
      headers: {
        authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`
      }
    }
  ).catch((e: Error) => {
    console.error(`Failed to make request to GitHub. Received: ${e.message}`);
  });

  return response;
}

recentlyClosedPullRequests({ organization: "", repository: "" }).then(
  response => {
    console.log(response);
  }
);
