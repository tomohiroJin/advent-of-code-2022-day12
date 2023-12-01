import {
  calculateVisibleTreesFromBottom,
  calculateVisibleTreesFromLeft,
  calculateVisibleTreesFromRight,
  calculateVisibleTreesFromTop,
  convertToGridArray,
  countTreesVisibleFromOutside,
} from ".";

const sampleTrees = `30373
25512
65332
33549
35390`;

const sampleTreeHeightArray = [
  [3, 0, 3, 7, 3],
  [2, 5, 5, 1, 2],
  [6, 5, 3, 3, 2],
  [3, 3, 5, 4, 9],
  [3, 5, 3, 9, 0],
];

test("上から見た時に見える木の配置を算出する。", () => {
  const actual = calculateVisibleTreesFromTop(sampleTreeHeightArray);
  expect(actual).toEqual([
    [true, true, true, true, true],
    [false, true, true, false, false],
    [true, false, false, false, false],
    [false, false, false, false, true],
    [false, false, false, true, false],
  ]);
});

test("左から見た時に見える木の配置を算出する。", () => {
  const actual = calculateVisibleTreesFromLeft(sampleTreeHeightArray);
  expect(actual).toEqual([
    [true, false, false, true, false],
    [true, true, false, false, false],
    [true, false, false, false, false],
    [true, false, true, false, true],
    [true, true, false, true, false],
  ]);
});

test("下から見た時に見える木の配置を算出する。", () => {
  const actual = calculateVisibleTreesFromBottom(sampleTreeHeightArray);
  expect(actual).toEqual([
    [false, false, false, false, false],
    [false, false, false, false, false],
    [true, false, false, false, false],
    [false, false, true, false, true],
    [true, true, true, true, true],
  ]);
});

test("右から見た時に見える木の配置を算出する。", () => {
  const actual = calculateVisibleTreesFromRight(sampleTreeHeightArray);
  expect(actual).toEqual([
    [false, false, false, true, true],
    [false, false, true, false, true],
    [true, true, false, true, true],
    [false, false, false, false, true],
    [false, false, false, true, true],
  ]);
});

test("格子の木を扱いやすいように2次元配列に変換する", () => {
  const actual = convertToGridArray(sampleTrees);
  expect(actual).toEqual([
    [3, 0, 3, 7, 3],
    [2, 5, 5, 1, 2],
    [6, 5, 3, 3, 2],
    [3, 3, 5, 4, 9],
    [3, 5, 3, 9, 0],
  ]);
});

test("格子の外から見える木の数を返す", () => {
  const actual = countTreesVisibleFromOutside(sampleTrees);
  expect(actual).toBe(21);
});
