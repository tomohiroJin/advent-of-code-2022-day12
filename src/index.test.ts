import {
  getAdjacentPositions,
  getCurrentPosition,
  getElevationMap,
  getOptimalSignalPosition,
  getShortestStepCount,
  inputMap,
  isPosition,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  traverseToOptimalSignal,
} from ".";

const sampleMap = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

describe("マップテスト", () => {
  test("入力されたマップを読み込んだ場合読み込んだマップを返す", () => {
    const actual = inputMap(sampleMap);
    expect(actual).toEqual([
      "Sabqponm",
      "abcryxxl",
      "accszExk",
      "acctuvwj",
      "abdefghi",
    ]);
  });

  test("現在位置(S)を特定できる", () => {
    const actual = getCurrentPosition(inputMap(sampleMap));
    expect(actual).toEqual({ x: 0, y: 0 });
  });

  test("最適な信号位置(E)を特定できる", () => {
    const actual = getOptimalSignalPosition(inputMap(sampleMap));
    expect(actual).toEqual({ x: 5, y: 2 });
  });

  test("マップに現在位置(S)が存在しない場合エラーが発生する", () => {
    expect(() => getCurrentPosition(inputMap("abcdefg"))).toThrowError(
      new Error("Sが見つかりませんでした。")
    );
  });

  test("マップに最適な信号位置(E)が存在しない場合エラーが発生する", () => {
    expect(() => getOptimalSignalPosition(inputMap("abcdefg"))).toThrowError(
      new Error("Eが見つかりませんでした。")
    );
  });

  test("マップを解析し、各セルの高度を取得できる", () => {
    const actual = getElevationMap([
      "Sabqponm",
      "abcryxxl",
      "accszExk",
      "acctuvwj",
      "abdefghi",
    ]);
    expect(actual).toEqual([
      [1, 1, 2, 17, 16, 15, 14, 13],
      [1, 2, 3, 18, 25, 24, 24, 12],
      [1, 3, 3, 19, 26, 26, 24, 11],
      [1, 3, 3, 20, 21, 22, 23, 10],
      [1, 2, 4, 5, 6, 7, 8, 9],
    ]);
  });
});

describe("移動テスト", () => {
  const sampleElevationMap = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];

  test("上下左右に移動した一覧を返す", () => {
    const actual = getAdjacentPositions(sampleElevationMap, { x: 1, y: 1 });
    expect(actual).toEqual([
      { x: 1, y: 0 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
      { x: 2, y: 1 },
    ]);
  });

  test("上下左右に移動できない場合はカレントの一覧を返す", () => {
    const actual = getAdjacentPositions(
      [
        [1, 3, 1],
        [3, 1, 3],
        [1, 3, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  test("右に移動できた場合はポジションが返ってくる", () => {
    const actual = moveRight(sampleElevationMap, { x: 1, y: 1 });
    expect(actual).toEqual({ x: 2, y: 1 });
  });

  test("右に移動すると高さが1つ差がある場合は移動先のポジションが返ってくる", () => {
    const actual = moveRight(
      [
        [1, 1, 1],
        [1, 1, 2],
        [1, 1, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual({ x: 2, y: 1 });
  });

  test("右に移動するとマップをはみ出す場合は元のポジションが返ってくる", () => {
    const actual = moveRight(sampleElevationMap, { x: 2, y: 1 });
    expect(actual).toEqual({ x: 2, y: 1 });
  });

  test("右に移動すると高さが1つより差がある場合は元のポジションが返ってくる", () => {
    const actual = moveRight(
      [
        [1, 1, 1],
        [1, 1, 3],
        [1, 1, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual({ x: 1, y: 1 });
  });

  test("左に移動できた場合はポジションが返ってくる", () => {
    const actual = moveLeft(sampleElevationMap, { x: 1, y: 1 });
    expect(actual).toEqual({ x: 0, y: 1 });
  });

  test("左に移動すると高さが1つ差がある場合は移動先のポジションが返ってくる", () => {
    const actual = moveLeft(
      [
        [1, 1, 1],
        [2, 1, 1],
        [1, 1, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual({ x: 0, y: 1 });
  });

  test("左に移動するとマップをはみ出す場合は元のポジションが返ってくる", () => {
    const actual = moveLeft(sampleElevationMap, { x: 0, y: 1 });
    expect(actual).toEqual({ x: 0, y: 1 });
  });

  test("左に移動すると高さが1つより差がある場合は元のポジションが返ってくる", () => {
    const actual = moveLeft(
      [
        [1, 1, 1],
        [3, 1, 1],
        [1, 1, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual({ x: 1, y: 1 });
  });

  test("上に移動できた場合はポジションが返ってくる", () => {
    const actual = moveUp(sampleElevationMap, { x: 1, y: 1 });
    expect(actual).toEqual({ x: 1, y: 0 });
  });

  test("上に移動すると高さが1つ差がある場合は移動先のポジションが返ってくる", () => {
    const actual = moveUp(
      [
        [1, 2, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual({ x: 1, y: 0 });
  });

  test("上に移動するとマップをはみ出す場合は元のポジションが返ってくる", () => {
    const actual = moveUp(sampleElevationMap, { x: 1, y: 0 });
    expect(actual).toEqual({ x: 1, y: 0 });
  });

  test("上に移動すると高さが1つより差がある場合は元のポジションが返ってくる", () => {
    const actual = moveUp(
      [
        [1, 3, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual({ x: 1, y: 1 });
  });

  test("下に移動できた場合はポジションが返ってくる", () => {
    const actual = moveDown(sampleElevationMap, { x: 1, y: 1 });
    expect(actual).toEqual({ x: 1, y: 2 });
  });

  test("下に移動すると高さが1つ差がある場合は移動先のポジションが返ってくる", () => {
    const actual = moveDown(
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 2, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual({ x: 1, y: 2 });
  });

  test("下に移動するとマップをはみ出す場合は元のポジションが返ってくる", () => {
    const actual = moveDown(sampleElevationMap, { x: 1, y: 2 });
    expect(actual).toEqual({ x: 1, y: 2 });
  });

  test("下に移動すると高さが1つより差がある場合は元のポジションが返ってくる", () => {
    const actual = moveDown(
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 3, 1],
      ],
      { x: 1, y: 1 }
    );
    expect(actual).toEqual({ x: 1, y: 1 });
  });
});

test("ポジション位置が同一の場合 true を返す", () => {
  expect(isPosition({ x: 1, y: 1 }, { x: 1, y: 1 })).toBeTruthy();
});

test("ポジション位置が別の場合 false を返す", () => {
  expect(isPosition({ x: 1, y: 1 }, { x: 2, y: 1 })).toBeFalsy();
  expect(isPosition({ x: 1, y: 1 }, { x: 1, y: 2 })).toBeFalsy();
  expect(isPosition({ x: 1, y: 1 }, { x: 2, y: 2 })).toBeFalsy();
});

test("現在の位置から最適な信号位置(E)か移動できなくなるまでを繰り返し移動した結果をポジションの配列で返す", () => {
  const actual = traverseToOptimalSignal(
    [
      [1, 1, 3],
      [3, 1, 3],
      [1, 1, 3],
    ],
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    []
  );
  expect(actual).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ]);
});

test("現在の位置から最適な信号位置(E)か移動できなくなるまでを繰り返し移動した結果をポジションの配列で返す", () => {
  const actual = traverseToOptimalSignal(
    [
      [1, 1, 2, 17, 16, 15, 14, 13],
      [1, 2, 3, 18, 25, 24, 24, 12],
      [1, 3, 3, 19, 26, 26, 24, 11],
      [1, 3, 3, 20, 21, 22, 23, 10],
      [1, 2, 4, 5, 6, 7, 8, 9],
    ],
    { x: 0, y: 0 },
    { x: 5, y: 2 },
    []
  );
  console.log(actual);
  // expect(actual).toEqual([
  //   [
  //     { x: 0, y: 0 },
  //     { x: 0, y: 1 },
  //     { x: 0, y: 2 },
  //     { x: 1, y: 2 },
  //     { x: 1, y: 1 },
  //   ],
  // ]);
});

test("現在位置(S)から最適な信号位置(E)までを最短で移動した場合のステップ数を返す", () => {
  const actual = getShortestStepCount(sampleMap);
  expect(actual).toBe(31);
});
