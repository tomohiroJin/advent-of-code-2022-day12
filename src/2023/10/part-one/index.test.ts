import {
  calculateDistancesFromStart,
  convertMapToGrid,
  findFarthestPoint,
  findNextPositions,
  findStartPosition,
} from ".";

const samplePipeMap = `.....
.S-7.
.|.|.
.L-J.
.....`;

const sampleGridMap = [
  [".", ".", ".", ".", "."],
  [".", "S", "-", "7", "."],
  [".", "|", ".", "|", "."],
  [".", "L", "-", "J", "."],
  [".", ".", ".", ".", "."],
];

test("現在の位置から同じ場所を通らずに進み続けて一番大きい数を返す", () => {
  const actual = calculateDistancesFromStart({ x: 1, y: 1 }, sampleGridMap);
  expect(actual).toBe(4);
});

test("現在の位置から記号に合わせて進むことのできる位置情報を返却する", () => {
  const actual = findNextPositions({ x: 2, y: 1 }, sampleGridMap);
  expect(actual).toEqual([
    { x: 3, y: 1 },
    { x: 1, y: 1 },
  ]);
});

test("地図をgridに変換する", () => {
  const actual = convertMapToGrid(samplePipeMap);
  expect(actual).toEqual([
    [".", ".", ".", ".", "."],
    [".", "S", "-", "7", "."],
    [".", "|", ".", "|", "."],
    [".", "L", "-", "J", "."],
    [".", ".", ".", ".", "."],
  ]);
});

test("動物（S）の位置を取得する", () => {
  const actual = findStartPosition(sampleGridMap);
  expect(actual).toEqual({ x: 1, y: 1 });
});

test("パイプの迷路から最も遠い位置を探す", () => {
  const actual = findFarthestPoint(samplePipeMap);
  expect(actual).toBe(4);
});
