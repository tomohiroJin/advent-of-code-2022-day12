import {
  calculateSumOfPossibleGameIds,
  isGameFeasible,
  sumCubesByColorInEachSet,
} from ".";

const sampleGames = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

test("各セット内で色別にキューブの合計を算出する", () => {
  const actual = sumCubesByColorInEachSet(
    "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
  );
  expect(actual).toEqual({
    gameId: 1,
    cubes: [
      { red: 4, blue: 3, green: 0 },
      { red: 1, blue: 6, green: 2 },
      { red: 0, blue: 0, green: 2 },
    ],
  });
});

test("ゲームが実行可能だった場合 true を返す", () => {
  const actual = isGameFeasible({
    gameId: 1,
    cubes: [
      { red: 4, blue: 3, green: 0 },
      { red: 1, blue: 6, green: 2 },
      { red: 0, blue: 0, green: 2 },
    ],
  });
  expect(actual).toBeTruthy();
});

test("ゲームが実行不可能だった場合 false を返す", () => {
  const actual = isGameFeasible({
    gameId: 3,
    cubes: [
      { red: 20, blue: 6, green: 8 },
      { red: 4, blue: 5, green: 13 },
      { red: 1, blue: 0, green: 5 },
    ],
  });
  expect(actual).toBeFalsy();
});

test("可能なゲームのIDの合計値を計算する", () => {
  const actual = calculateSumOfPossibleGameIds(sampleGames);
  expect(actual).toBe(8);
});
