import {
  calculateTotalPartNumbersFromSchematic,
  findPartPositionsInLine,
  findSymbolPositionsInLine,
  isValidPartAdjacentToSymbol,
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

test("設計図の一行から記号の位置を取得する", () => {
  expect(findSymbolPositionsInLine("...*......")).toEqual([3]);
  expect(findSymbolPositionsInLine("617*......")).toEqual([3]);
  expect(findSymbolPositionsInLine("...$.*....")).toEqual([3, 5]);
  expect(findSymbolPositionsInLine(".664.598..")).toEqual([]);
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

test("パーツに記号が隣接している場合 true を返す", () => {
  expect(
    isValidPartAdjacentToSymbol(
      { no: 617, startIndex: 0, endIndex: 2 },
      {
        aboveSymbolPosition: [6],
        centerSymbolPosition: [3],
        belowSymbolPosition: [5],
      }
    )
  ).toBeTruthy();

  expect(
    isValidPartAdjacentToSymbol(
      { no: 35, startIndex: 2, endIndex: 3 },
      {
        aboveSymbolPosition: [3],
        centerSymbolPosition: [],
        belowSymbolPosition: [7],
      }
    )
  ).toBeTruthy();
});

test("パーツに記号が隣接していない場合 false を返す", () => {
  const actual = isValidPartAdjacentToSymbol(
    { no: 58, startIndex: 7, endIndex: 8 },
    {
      aboveSymbolPosition: [3],
      centerSymbolPosition: [5],
      belowSymbolPosition: [],
    }
  );
  expect(actual).toBeFalsy();
});

test("エンジン設計図にあるすべての部品番号の合計を算出できる", () => {
  const actual = calculateTotalPartNumbersFromSchematic(sampleParts);
  expect(actual).toBe(4361);
});
