import {
  calculateShortestPath,
  extractGalaxies,
  identifyEmptyRowsAndCols,
  parseGalaxyMap,
  sumOfAllGalacticPathLengths,
} from ".";

const sampleGalaxyMap = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

test("全ての銀河ペアを抽出する", () => {
  const actual = extractGalaxies([
    [".", ".", ".", "#", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "#", ".", "."],
    ["#", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  ]);
  expect(actual).toEqual([
    [
      [3, 0],
      [7, 1],
    ],
    [
      [3, 0],
      [0, 2],
    ],
    [
      [7, 1],
      [0, 2],
    ],
  ]);
});

describe("２つのペアの最短経路を取得する", () => {
  test("1,5 から 4,9 までの２つのペアの最短経路 9 を取得する", () => {
    const actual = calculateShortestPath([1, 5], [4, 9], {
      rows: [
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
      ],
      cols: [false, false, true, false, false, true, false, false, true, false],
    });
    expect(actual).toBe(9);
  });

  test("0,9 から 4,9 までの２つのペアの最短経路 5 を取得する", () => {
    const actual = calculateShortestPath([0, 9], [4, 9], {
      rows: [
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
      ],
      cols: [false, false, true, false, false, true, false, false, true, false],
    });
    expect(actual).toBe(5);
  });

  test("3,0 から 7,8 までの２つのペアの最短経路 15 を取得する", () => {
    const actual = calculateShortestPath([3, 0], [7, 8], {
      rows: [
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
      ],
      cols: [false, false, true, false, false, true, false, false, true, false],
    });
    expect(actual).toBe(15);
  });

  test("0,2 から 6,9 までの２つのペアの最短経路 17 を取得する", () => {
    const actual = calculateShortestPath([0, 2], [6, 9], {
      rows: [
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
      ],
      cols: [false, false, true, false, false, true, false, false, true, false],
    });
    expect(actual).toBe(17);
  });
});

test("銀河のない行と列を識別する", () => {
  const actual = identifyEmptyRowsAndCols([
    [".", ".", ".", "#", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "#", ".", "."],
    ["#", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "#", ".", ".", "."],
    [".", "#", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "#", ".", "."],
    ["#", ".", ".", ".", "#", ".", ".", ".", ".", "."],
  ]);
  expect(actual).toEqual({
    rows: [false, false, false, true, false, false, false, true, false, false],
    cols: [false, false, true, false, false, true, false, false, true, false],
  });
});

test("与えられたマップを分解して銀河の地図に変換する", () => {
  const actual = parseGalaxyMap(sampleGalaxyMap);
  console.log(actual);
  expect(actual).toEqual([
    [".", ".", ".", "#", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "#", ".", "."],
    ["#", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "#", ".", ".", "."],
    [".", "#", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "#", ".", "."],
    ["#", ".", ".", ".", "#", ".", ".", ".", ".", "."],
  ]);
});

test("全ての銀河間の最短経路数の合計を算出する", () => {
  const actual = sumOfAllGalacticPathLengths(sampleGalaxyMap);
  expect(actual).toBe(374);
});
