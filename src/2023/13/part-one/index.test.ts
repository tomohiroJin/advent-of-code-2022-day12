import {
  analyzeAndSummarizeReflections,
  calculateMinArrayLengthFromMatchingIndex,
  convertPatternsToArrays,
  existsReflectionLine,
  findMatchingIndicesBetweenRows,
  findReflectionLineIndex,
} from ".";

const sampleReflections = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#

#....#..#######
.#...#.###...#.
#.#.#.##.##.###
###.##..#...#..
#..#.#..###..#.
#..#.#..###..#.
###.##..#...#..
#.#.#.##.##.##.
.#...#.###...#.
#....#..#######
#....#..#######`;

test("与えられたパターンを解析して反射線の正確な集計結果が得られること", () => {
  const actual = analyzeAndSummarizeReflections(sampleReflections);
  expect(actual).toBe(1405);
});

test("複数のパターンが正しく読み込まれ、分析されること", () => {
  const actual = convertPatternsToArrays(sampleReflections);
  expect(actual).toEqual([
    [
      [
        "#.##..##.",
        "..#.##.#.",
        "##......#",
        "##......#",
        "..#.##.#.",
        "..##..##.",
        "#.#.##.#.",
      ],
      [
        "#...##..#",
        "#....#..#",
        "..##..###",
        "#####.##.",
        "#####.##.",
        "..##..###",
        "#....#..#",
      ],
      [
        "#....#..#######",
        ".#...#.###...#.",
        "#.#.#.##.##.###",
        "###.##..#...#..",
        "#..#.#..###..#.",
        "#..#.#..###..#.",
        "###.##..#...#..",
        "#.#.#.##.##.##.",
        ".#...#.###...#.",
        "#....#..#######",
        "#....#..#######",
      ],
    ],
    [
      [
        "#.##..#",
        "..##...",
        "##..###",
        "#....#.",
        ".#..#.#",
        ".#..#.#",
        "#....#.",
        "##..###",
        "..##...",
      ],
      [
        "##.##.#",
        "...##..",
        "..####.",
        "..####.",
        "#..##..",
        "##....#",
        "..####.",
        "..####.",
        "###..##",
      ],
      [
        "#.######.##",
        ".#.#..#.#..",
        "..##..##...",
        "....##.....",
        "..##..##...",
        "##.####.###",
        "..#....#...",
        ".##....##..",
        "##.####.###",
        "###.##.####",
        "#.#.##.#.##",
        "#........##",
        "#.##..##.##",
        "###.##.####",
        "#.#......##",
      ],
    ],
  ]);
});

describe("findReflectionLineIndex", () => {
  const reflectionPattern = [
    "#.##..#",
    "..##...",
    "##..###",
    "#....#.",
    ".#..#.#",
    ".#..#.#",
    "#....#.",
    "##..###",
    "..##...",
  ];

  const lastRowReflectionPattern = [
    "#....#..#######",
    ".#...#.###...#.",
    "#.#.#.##.##.###",
    "###.##..#...#..",
    "#..#.#..###..#.",
    "#..#.#..###..#.",
    "###.##..#...#..",
    "#.#.#.##.##.##.",
    ".#...#.###...#.",
    "#....#..#######",
    "#....#..#######",
  ];

  const noReflectionPattern = ["##..###", ".#..#.#", ".#..#.#", "#....#."];

  test("現在の行とその次の行が同じ個所のインデックスを返す", () => {
    const actual = findMatchingIndicesBetweenRows(reflectionPattern);
    expect(actual).toEqual([4]);
  });

  test("現在の行とその次の行が同じ個所が複数ある場合そのすべてのインデックスを返す", () => {
    const actual = findMatchingIndicesBetweenRows(lastRowReflectionPattern);
    expect(actual).toEqual([4, 9]);
  });

  test("選択された位置までの数が全体の半分より同じか大きい場合は全体のから位置までの数を引いた数を返す", () => {
    const actual = calculateMinArrayLengthFromMatchingIndex(
      reflectionPattern,
      4
    );
    expect(actual).toBe(3);
  });

  test("選択された位置までの数が全体の半分より小さい場合は選択された位置までの数を返す", () => {
    const actual = calculateMinArrayLengthFromMatchingIndex(
      [
        "##..###",
        "#....#.",
        ".#..#.#",
        ".#..#.#",
        "#....#.",
        "##..###",
        "..##...",
      ],
      2
    );
    expect(actual).toBe(2);
  });

  test("選択された位置から上下に反射が一致する場合はTrueを返す", () => {
    const actual = existsReflectionLine(reflectionPattern, 4, 3);
    expect(actual).toBeTruthy();
  });

  test("選択された位置から上下に反射が一致しない場合はfalseを返す", () => {
    const actual = existsReflectionLine(noReflectionPattern, 1, 1);
    expect(actual).toBeFalsy();
  });

  test("反射線が正しく識別されること", () => {
    const actual = findReflectionLineIndex(reflectionPattern);
    expect(actual).toBe(5);
  });

  test("反射線が最終行でも正しく識別されること", () => {
    const actual = findReflectionLineIndex(lastRowReflectionPattern);
    expect(actual).toBe(10);
  });

  test("反射線でない場合にNaNが返されること", () => {
    const actual = findReflectionLineIndex(noReflectionPattern);
    expect(actual).toBe(NaN);
  });
});
