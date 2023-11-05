import { findElfWithMostCalories } from ".";

const sampleCalorieList = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
` as const;

test("カロリーリストから最も多くのカロリーを持っているエルフのカロリーを取得する", () => {
  const actual = findElfWithMostCalories(sampleCalorieList);
  expect(actual).toBe(24000);
});
