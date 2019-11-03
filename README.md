# Weekly Summary TypeScript

[![npm version](https://badge.fury.io/js/weekly-summary-typescript.svg)](https://badge.fury.io/js/weekly-summary-typescript)
[![CircleCI](https://circleci.com/gh/tmr08c/weekly-summary-typescript/tree/master.svg?style=svg)](https://circleci.com/gh/tmr08c/weekly-summary-typescript/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/tmr08c/weekly-summary-typescript/badge.svg?branch=master)](https://coveralls.io/github/tmr08c/weekly-summary-typescript?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This package gets the last week of merged pull requests for a specific organization from GitHub.

# Installing

```bash
npm install weekly-summary-typescript
```

# Usage

## Requsting pull requests

```typescript
import { fetchRecentlyClosedPullRequests } from "weekly-summary-typescript";

const recentlyClosedPullRequests = await fetchRecentlyClosedPullRequests(
  {
    organization: `my-organization`
  },
  `my-github-auth-token`
);
```

## Response

Pull requests are returned as an object where the key is the repository's name and the value is an array of objects that include information about the pull request. For example:

```json
{
  "weekly-summary-typescript": [
    {
      "repository": {
        "name": "weekly-summary-typescript"
      },
      "title": "refactor(github): changes setup for GitHub auth token",
      "createdAt": "2019-11-02T19:14:53Z",
      "closedAt": "2019-11-03T10:58:15Z",
      "url": "https://github.com/tmr08c/weekly-summary-typescript/pull/14",
      "merged": true
    },
    {
      "repository": {
        "name": "weekly-summary-typescript"
      },
      "title": "chore: sets up commitizen",
      "createdAt": "2019-11-02T19:00:06Z",
      "closedAt": "2019-11-02T19:00:51Z",
      "url": "https://github.com/tmr08c/weekly-summary-typescript/pull/13",
      "merged": true
    }
  ]
}
```

Type definitions can be found [here](https://github.com/tmr08c/weekly-summary-typescript/blob/f3aa636e1a2aa4d97d404b97e90f3390bc397ce4/src/github.ts#L29).

You can also check out [this project](https://github.com/tmr08c/weekly-summary-cron-with-now) for an example of how this package is used in production.
