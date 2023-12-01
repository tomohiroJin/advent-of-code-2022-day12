import { calculateTotalScore } from ".";

const sampleRockPaperScissorsResult = `
A Y
B X
C Z
`;

test("戦略ガイドに従った場合総得点を取得できる", () => {
  const actual = calculateTotalScore(sampleRockPaperScissorsResult);
  expect(actual).toBe(15);
});
