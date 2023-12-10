import {
  calculateProductOfNumbersAroundGear,
  calculateTotalPartNumbersFromSchematic,
  findGearSymbolPositionsInLine,
  findPartPositionsInLine,
  generateGearSymbolPositionsFromSchematic,
  generatePartPositionsFromSchematic,
} from ".";

const sampleParts = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

test("設計図の一行から歯車の記号の位置を取得する", () => {
  expect(findGearSymbolPositionsInLine("...*......")).toEqual([3]);
  expect(findGearSymbolPositionsInLine("617*......")).toEqual([3]);
  expect(findGearSymbolPositionsInLine("...$.*..*.")).toEqual([5, 8]);
  expect(findGearSymbolPositionsInLine(".664.598..")).toEqual([]);
});

test("設計図の一行からパーツの位置を取得する", () => {
  expect(findPartPositionsInLine("617*......")).toEqual([
    { no: 617, startIndex: 0, endIndex: 2 },
  ]);
  expect(findPartPositionsInLine("..35..633.")).toEqual([
    { no: 35, startIndex: 2, endIndex: 3 },
    { no: 633, startIndex: 6, endIndex: 8 },
  ]);
  expect(findPartPositionsInLine("...*......")).toEqual([]);
  expect(findPartPositionsInLine("1........9")).toEqual([
    { no: 1, startIndex: 0, endIndex: 0 },
    { no: 9, startIndex: 9, endIndex: 9 },
  ]);
});

test("設計図からパーツの位置情報の一覧を生成する", () => {
  const actual = generatePartPositionsFromSchematic(
    "617*......\n..35..633.\n...*......\n1........9"
  );
  expect(actual).toEqual([
    {
      parts: [{ no: 617, startIndex: 0, endIndex: 2 }],
    },
    {
      parts: [
        { no: 35, startIndex: 2, endIndex: 3 },
        { no: 633, startIndex: 6, endIndex: 8 },
      ],
    },
    {
      parts: [],
    },
    {
      parts: [
        { no: 1, startIndex: 0, endIndex: 0 },
        { no: 9, startIndex: 9, endIndex: 9 },
      ],
    },
  ]);
});

test("設計図から歯車の記号の位置情報の一覧を生成する", () => {
  const actual = generateGearSymbolPositionsFromSchematic(
    "...*......\n617*......\n...$.*..*.\n.664.598.."
  );
  expect(actual).toEqual([
    { gears: [3] },
    { gears: [3] },
    { gears: [5, 8] },
    { gears: [] },
  ]);
});

describe("calculateProductOfNumbersAroundGear", () => {
  test("ギアの位置から上下左右に数値がぶつかる場合はその二つをかけた値を返す", () => {
    const actual = calculateProductOfNumbersAroundGear(1, 1, [
      { parts: [{ no: 1, startIndex: 1, endIndex: 1 }] },
      {
        parts: [
          { no: 2, startIndex: 0, endIndex: 0 },
          { no: 3, startIndex: 2, endIndex: 2 },
        ],
      },
      { parts: [{ no: 4, startIndex: 1, endIndex: 1 }] },
    ]);
    expect(actual).toBe(24);
  });

  test("ギアの位置から上下に数値がぶつかる場合はその二つをかけた値を返す", () => {
    const actual = calculateProductOfNumbersAroundGear(1, 1, [
      { parts: [{ no: 1, startIndex: 1, endIndex: 1 }] },
      {
        parts: [],
      },
      { parts: [{ no: 4, startIndex: 1, endIndex: 1 }] },
    ]);
    expect(actual).toBe(4);
  });

  test("ギアの位置から左右に数値がぶつかる場合はその二つをかけた値を返す", () => {
    const actual = calculateProductOfNumbersAroundGear(1, 1, [
      { parts: [{ no: 1, startIndex: 3, endIndex: 3 }] },
      {
        parts: [
          { no: 2, startIndex: 0, endIndex: 0 },
          { no: 3, startIndex: 2, endIndex: 2 },
        ],
      },
      { parts: [{ no: 4, startIndex: 3, endIndex: 3 }] },
    ]);
    expect(actual).toBe(6);
  });

  test("ギアの位置に 2 つ以上の数値がぶつからない場合は 0 を返す", () => {
    const actual = calculateProductOfNumbersAroundGear(1, 1, [
      { parts: [{ no: 1, startIndex: 3, endIndex: 3 }] },
      {
        parts: [],
      },
      { parts: [{ no: 4, startIndex: 3, endIndex: 3 }] },
    ]);
    expect(actual).toBe(0);
  });

  test("ギアの上部に左右に数値がぶつかる場合はその二つをかけた値を返す", () => {
    const actual = calculateProductOfNumbersAroundGear(1, 1, [
      {
        parts: [
          { no: 2, startIndex: 0, endIndex: 0 },
          { no: 3, startIndex: 2, endIndex: 2 },
        ],
      },
      {
        parts: [],
      },
      { parts: [] },
    ]);
    expect(actual).toBe(6);
  });

  test("ギアの下部に左右に数値がぶつかる場合はその二つをかけた値を返す", () => {
    const actual = calculateProductOfNumbersAroundGear(1, 1, [
      {
        parts: [],
      },
      {
        parts: [],
      },
      {
        parts: [
          { no: 2, startIndex: 0, endIndex: 0 },
          { no: 3, startIndex: 1, endIndex: 1 },
        ],
      },
    ]);
    expect(actual).toBe(6);
  });
});

test("エンジン設計図にあるすべての部品番号の合計を算出できる", () => {
  const actual = calculateTotalPartNumbersFromSchematic(sampleParts);
  expect(actual).toBe(467835);
});
2375;
