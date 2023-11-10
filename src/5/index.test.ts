import {
  extractCharactersByPattern,
  getRearrangedCratesMessage,
  moveCratesBetweenStacks,
  parseMovesFromString,
  parseStacksFromString,
} from ".";

const sampleStacks = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 `;

const sampleMoves = `move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

test("一行の文字列を2文字目から4文字ずつ進めて格納した配列を返すことができる", () => {
  expect(extractCharactersByPattern("    [D]    ")).toEqual([" ", "D", " "]);
  expect(extractCharactersByPattern("[N] [C]    ")).toEqual(["N", "C", " "]);
  expect(extractCharactersByPattern("[Z] [M] [P]")).toEqual(["Z", "M", "P"]);
  expect(extractCharactersByPattern(" 1   2   3 ")).toEqual(["1", "2", "3"]);
});

test("スタックの配列を番号順のマップに変換できること", () => {
  const actual = parseStacksFromString(sampleStacks);
  expect(actual).toEqual(
    new Map([
      [1, ["Z", "N"]],
      [2, ["M", "C", "D"]],
      [3, ["P"]],
    ])
  );
});

test("動作を読み込んでオブジェクトの配列にできること", () => {
  const actual = parseMovesFromString(sampleMoves);
  expect(actual).toEqual([
    { from: 2, to: 1, move: 1 },
    { from: 1, to: 3, move: 3 },
    { from: 2, to: 1, move: 2 },
    { from: 1, to: 2, move: 1 },
  ]);
});

describe("moveCratesBetweenStacks", () => {
  test("動作の内容に合わせてスタックの中身を移動することができる", () => {
    const actual = moveCratesBetweenStacks(
      { from: 2, to: 1, move: 1 },
      new Map([
        [1, ["Z", "N"]],
        [2, ["M", "C", "D"]],
        [3, ["P"]],
      ])
    );
    expect(actual).toEqual(
      new Map([
        [1, ["Z", "N", "D"]],
        [2, ["M", "C"]],
        [3, ["P"]],
      ])
    );
  });

  test("複数のスタックの中身の場合も移動することができる", () => {
    const actual = moveCratesBetweenStacks(
      { from: 1, to: 3, move: 3 },
      new Map([
        [1, ["Z", "N", "D"]],
        [2, ["M", "C"]],
        [3, ["P"]],
      ])
    );
    expect(actual).toEqual(
      new Map([
        [1, []],
        [2, ["M", "C"]],
        [3, ["P", "D", "N", "Z"]],
      ])
    );
  });
});

test("クレートを並び替えた結果のメッセージが取得できること", () => {
  const actual = getRearrangedCratesMessage(sampleStacks, sampleMoves);
  expect(actual).toBe("CMZ");
});
