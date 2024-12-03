import {
  calculateSimilarityScore,
  countOccurrences,
  readLeftList,
  readRightList,
} from ".";

const sampleList = `3   4
4   3
2   5
1   3
3   9
3   3` as const;

describe("リストの調整処理", () => {
  test("リストの左を読み込む", () => {
    const actual = readLeftList(sampleList);
    expect(actual).toEqual([3, 4, 2, 1, 3, 3]);
  });

  test("リストの右を読み込む", () => {
    const actual = readRightList(sampleList);
    expect(actual).toEqual([4, 3, 5, 3, 9, 3]);
  });

  test("数値がリストに何回頻出するか返す", () => {
    const actual = countOccurrences(3, [4, 3, 5, 3, 9, 3]);
    expect(actual).toBe(3);
  });

  test("左から右のリスト出現した回数を左にかけた数値を全て足す", () => {
    const actual = calculateSimilarityScore(sampleList);
    expect(actual).toBe(31);
  });
});
