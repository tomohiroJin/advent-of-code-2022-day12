import { bowlingGame } from ".";

test("全てストライクでフィニッシュした場合スコア 300 点になる", () => {
  const [roll, score] = bowlingGame();
  Array(12)
    .fill(10)
    .forEach((val) => roll(val));
  expect(score()).toBe(300);
});

test("全てスペアでフィニッシュした場合スコア 150 点になる", () => {
  const [roll, score] = bowlingGame();
  Array(21)
    .fill(5)
    .forEach((val) => roll(val));
  expect(score()).toBe(150);
});

test("全て 1 ピンでフィニッシュした場合スコア 20 点になる", () => {
  const [roll, score] = bowlingGame();
  Array(20)
    .fill(1)
    .forEach((val) => roll(val));
  expect(score()).toBe(20);
});

test("全てガーターでフィニッシュした場合スコア 0 点になる", () => {
  const [roll, score] = bowlingGame();
  Array(20)
    .fill(0)
    .forEach((val) => roll(val));
  expect(score()).toBe(0);
});
