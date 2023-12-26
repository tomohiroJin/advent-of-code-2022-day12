import {
  calculateDifferences,
  calculateTotalOfExtrapolations,
  extrapolateNextValue,
  parseStringToNumberArray,
  repeatDifferences,
} from ".";

const sampleSequences = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

test("シーケンスの差分を抽出する", () => {
  const actual = calculateDifferences([0, 3, 6, 9, 12, 15]);
  expect(actual).toEqual([3, 3, 3, 3, 3]);
});

test("シーケンスの差分を繰り返し計算して全ての経緯を返す", () => {
  const actual = repeatDifferences([1, 3, 6, 10, 15, 21]);
  expect(actual).toEqual([
    [2, 3, 4, 5, 6],
    [1, 1, 1, 1],
    [0, 0, 0],
  ]);
});

test("シーケンスの次に来る外挿を取得する", () => {
  const actual = extrapolateNextValue([10, 13, 16, 21, 30, 45]);
  expect(actual).toBe(68);
});

test("文字列表記のシーケンスを数値の配列に変換する", () => {
  const actual = parseStringToNumberArray("0 3 6 9 12 15");
  expect(actual).toEqual([0, 3, 6, 9, 12, 15]);
});

test("各履歴の次の値を見つけてそれらを合計する", () => {
  const actual = calculateTotalOfExtrapolations(sampleSequences);
  expect(actual).toBe(114);
});
