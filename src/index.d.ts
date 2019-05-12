// Type definitions for weekly-summary-typescript
// Project: Weekly Summary
// Definitions by: Troy Rosenberg <tmr08c.github.io>
// Based on https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html

declare namespace WeeklySummary {
  export interface RequestParams {
    organization: string;
    repository: string;
  }
}
