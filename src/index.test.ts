import { hello } from "./index";

test("basic", () => {
  expect(0).toBe(0);
});

test("hello says hello", () => {
  expect(hello()).toMatch(new RegExp("hello", "i"));
});
