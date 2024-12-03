import {
  differenceNumber,
  differenceTotal,
  readLeftList,
  readRightList,
  totalDifferenceList,
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

  test("リストのソートを行う", () => {
    expect(readLeftList(sampleList).sort()).toEqual([1, 2, 3, 3, 3, 4]);
    expect(readRightList(sampleList).sort()).toEqual([3, 3, 3, 4, 5, 9]);
  });

  test("リストの右と左の差異を出す", () => {
    const actual = differenceNumber(
      [1, 2, 3, 3, 3, 4, 9],
      [3, 3, 3, 4, 5, 9, 5]
    );
    expect(actual).toEqual([2, 1, 0, 1, 2, 5, 4]);
  });

  test("差異の結果を全て足す", () => {
    const actual = differenceTotal([2, 1, 0, 1, 2, 5]);
    expect(actual).toBe(11);
  });

  test("文字列のリストを渡されるとその左右の差異を合計して返す", () => {
    const actual = totalDifferenceList(sampleList);
    expect(actual).toBe(11);
  });
});
