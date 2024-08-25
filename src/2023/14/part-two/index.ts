/**
 * 空きスペースを表す定数
 */
const EMPTY_SPACE = ".";

/**
 * 丸い岩を表す定数
 */
const CIRCLE_LOCK = "O";

/**
 * 四角い岩を表す定数
 */
const SQUARE_LOCK = "#";

/**
 * マップ要素とその対応する文字を表すオブジェクト
 * @constant
 */
const MapElements = {
  [EMPTY_SPACE]: "space",
  [SQUARE_LOCK]: "squareLock",
  [CIRCLE_LOCK]: "circleLock",
} as const;

/**
 * MapElementsのキーの型（"." | "#" | "O"）
 */
type MapElementCharacters = keyof typeof MapElements;

/**
 * MapElementsの値の型（"space" | "squareLock" | "circleLock"）
 */
type Elements = (typeof MapElements)[MapElementCharacters];

/**
 * マップ内の要素の属性を表す型
 * @property {number} x - 要素のx座標
 * @property {number} y - 要素のy座標
 * @property {Elements} element - 要素の種類（"space" | "squareLock" | "circleLock"）
 */
type MapAttribute = {
  x: number;
  y: number;
  element: Elements;
};

/**
 * 方向を表す列挙型
 */
type Direction = "North" | "South" | "East" | "West";

/**
 * 方向に動かす処理型
 */
type MoveDirection = (grid: MapAttribute[][]) => MapAttribute[][];

/**
 * サイクルの発生個所
 */
type CycleIndexes = { cycleStartIndex: number; cycleLength: number } | null;

/**
 * マップを解析する関数の型
 * @param map - マップの文字列
 * @returns - 解析されたマップに関する操作を提供するオブジェクト
 * @property show - 現在のマップを文字列として表示する関数
 * @property analyzeMapAttributes - マップの属性を解析して返す関数
 * @property operateLever - 指定された方向に岩を移動させる関数
 * @property calculateTotalWeight - 現在のマップの岩の総重量を計算する関数
 * @property performCycle - マップ内の岩を回転させる1サイクルを実行する関数
 * @property cycleStartIndex - サイクルの開始インデックスを取得する関数
 * @property cycleLength - サイクルの長さを取得する関数
 * @property calculateResultAfterCycles - 指定されたサイクル数後の岩の総重量を計算する関数
 */
type AnalyzedMapType = (map: string) => {
  show: (map: MapAttribute[][]) => string;
  analyzeMapAttributes: (map: string) => MapAttribute[][];
  operateLever: (
    direction: Direction,
    map: MapAttribute[][]
  ) => MapAttribute[][];
  calculateTotalWeight: (map: MapAttribute[][]) => number;
  performCycle: (
    seenStates: Map<string, number>,
    iteration: number,
    map: MapAttribute[][]
  ) => [
    seenStates: Map<string, number>,
    number,
    CycleIndexes,
    MapAttribute[][]
  ];
  calculateResultAfterCycles: (
    seenStates: Map<string, number>,
    totalCycles: number,
    cycleIndexes: CycleIndexes
  ) => number;
};

/**
 * 指定された文字が MapElementCharacters 型かどうかを判定します。
 * @param char 判定する文字。
 * @returns 文字が MapElementCharacters 型である場合に true を返します。
 */
const isMapElementCharacters = (char: string): char is MapElementCharacters =>
  char in MapElements;

/**
 * 与えられた2次元配列の行と列を転置します。
 * @param matrix - 転置する2次元配列。
 * @returns 転置された2次元配列。
 */
const transpose = <T>(matrix: T[][]): T[][] =>
  matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));

/**
 * 指定された2つのインデックス位置の要素をスワップした新しい配列を返します。
 * @param arr - 要素をスワップする配列。
 * @param index1 - スワップする最初のインデックス。
 * @param index2 - スワップする2つ目のインデックス。
 * @returns 指定された要素がスワップされた新しい配列。
 */
const swapArrayElements = (
  arr: MapAttribute[],
  index1: number,
  index2: number
): MapAttribute[] => {
  const updatedElement1 = { ...arr[index2], y: arr[index1].y };
  const updatedElement2 = { ...arr[index1], y: arr[index2].y };
  return arr.map((element, index) => {
    if (index === index1) return updatedElement1;
    if (index === index2) return updatedElement2;
    return element;
  });
};

/**
 * 丸い岩 (CIRCLE_LOCK) を適切な位置に移動させるために、空きスペースや四角い岩の配置に応じて配列を更新します。
 * @param attributes - マップ内の各要素の配列。
 * @param spaceIndex=NaN - 現在の空きスペースのインデックス。
 * @param currentIndex=0 - 現在のインデックス。
 * @returns 更新された配列。
 */
const relocateCircleLocks = (
  attributes: MapAttribute[],
  spaceIndex = NaN,
  currentIndex = 0
): MapAttribute[] => {
  if (currentIndex >= attributes.length) {
    return attributes;
  }

  const currentAttr = attributes[currentIndex];

  switch (currentAttr.element) {
    case MapElements[EMPTY_SPACE]:
      return relocateCircleLocks(
        attributes,
        isNaN(spaceIndex) ? currentIndex : spaceIndex,
        currentIndex + 1
      );

    case MapElements[CIRCLE_LOCK]:
      return !isNaN(spaceIndex)
        ? relocateCircleLocks(
            swapArrayElements(attributes, currentIndex, spaceIndex),
            NaN,
            spaceIndex
          )
        : relocateCircleLocks(attributes, spaceIndex, currentIndex + 1);

    case MapElements[SQUARE_LOCK]:
      return relocateCircleLocks(attributes, NaN, currentIndex + 1);

    default:
      return relocateCircleLocks(attributes, spaceIndex, currentIndex + 1);
  }
};

/**
 * グリッド内の要素を移動させる関数を作成します。
 * @returns 方向ごとの移動関数を持つオブジェクト。
 */
const createGridMover = (): Record<Direction, MoveDirection> => {
  const processRows: MoveDirection = (grid) =>
    grid.map((row) => relocateCircleLocks(row));

  const moveNorth: MoveDirection = (grid) =>
    transpose(processRows(transpose(grid)));

  const moveSouth: MoveDirection = (grid) =>
    transpose(
      transpose(grid).map((rows) =>
        relocateCircleLocks(rows.reverse()).reverse()
      )
    );

  const moveWest: MoveDirection = (grid) => processRows(grid);

  const moveEast: MoveDirection = (grid) =>
    processRows(grid.map((row) => row.reverse())).map((row) => row.reverse());

  return {
    North: moveNorth,
    South: moveSouth,
    West: moveWest,
    East: moveEast,
  };
};

/**
 * グリッド内の要素を指定された方向に移動させます。
 * @param direction - 移動する方向。
 * @param grid - グリッド内の要素の配列。
 * @returns 移動後のグリッド。
 */
const moveElements = (direction: Direction, grid: MapAttribute[][]) => {
  const gridMover = createGridMover();
  return gridMover[direction](grid);
};

/**
 * 文字と座標から新しい MapAttribute オブジェクトを作成します。
 * @param char - 要素を表す文字。
 * @param x - 要素のx座標。
 * @param y - 要素のy座標。
 * @returns 新しく作成された MapAttribute オブジェクト。
 * @throws 文字が MapElementCharacters に該当しない場合にエラーをスローします。
 */
const createElementObject = (
  char: string,
  x: number,
  y: number
): MapAttribute => {
  if (!isMapElementCharacters(char)) {
    throw new Error(`Unexpected character ${char}`);
  }
  return { x, y, element: MapElements[char] };
};

/**
 * 文字列からマップを解析し、MapAttribute オブジェクトの2次元配列を作成します。
 * @param map - 解析するマップの文字列。
 * @returns 解析された MapAttribute オブジェクトの2次元配列。
 */
const parseMap = (map: string): MapAttribute[][] =>
  map
    .split("\n")
    .map((row, y) =>
      row.split("").map((char, x) => createElementObject(char, x, y))
    );

/**
 * 現在のマップ内の岩の総重量を計算します。
 * @param mapAttributes - マップ内の要素の2次元配列。
 * @returns 岩の総重量。
 */
const calculateTotalWeight = (mapAttributes: MapAttribute[][]): number => {
  return mapAttributes.reduce((totalWeight, row) => {
    return (
      totalWeight +
      row.reduce((rowWeight, attr) => {
        if (attr.element === MapElements[CIRCLE_LOCK]) {
          // 岩の位置から南の端までの行数を計算して重さを加算
          return rowWeight + (mapAttributes.length - attr.y);
        }
        return rowWeight;
      }, 0)
    );
  }, 0);
};

const show = (map: MapAttribute[][]) =>
  map
    .map((row) =>
      row
        .map((attr) => {
          for (const [key, value] of Object.entries(MapElements)) {
            if (value === attr.element) return key;
          }
          return " ";
        })
        .join("")
    )
    .join("\n");

export const analyzeMap: AnalyzedMapType = (inputMap) => {
  const analyzeMapAttributes = (map: string) => parseMap(map);

  const checkCycle = (
    currentMap: MapAttribute[][],
    seenStates: Map<string, number>,
    iteration: number
  ) => {
    const currentState = show(currentMap);
    if (seenStates.has(currentState)) {
      const cycleStartIndex = seenStates.get(currentState)!; // 最初にこの状態が現れた回数
      const cycleLength = iteration - cycleStartIndex; // 現在の回数との差が周期の長さ

      return { cycleStartIndex, cycleLength };
    }
    seenStates.set(currentState, iteration);
    return null;
  };

  const performCycle = (
    seenStates: Map<string, number>,
    iteration: number,
    map: MapAttribute[][]
  ): [
    seenStates: Map<string, number>,
    number,
    CycleIndexes,
    map: MapAttribute[][]
  ] => {
    const directions: Direction[] = ["North", "West", "South", "East"];
    const currentMap = directions.reduce(
      (prev, direction: Direction) => moveElements(direction, prev),
      map
    );
    iteration += 1;
    const cycleIndexes = checkCycle(currentMap, seenStates, iteration); // 毎回状態をチェックして周期性を確認
    return [seenStates, iteration, cycleIndexes, currentMap];
  };

  const calculateResultAfterCycles = (
    seenStates: Map<string, number>,
    cycleNumber: number,
    cycleIndexes: CycleIndexes
  ) => {
    if (!cycleIndexes) {
      return -1;
    }

    const startIndex = cycleIndexes.cycleStartIndex ?? 0;
    const length = cycleIndexes.cycleLength ?? 0;
    const index = startIndex + ((cycleNumber - startIndex) % length);

    // 周期開始前の状態に戻す
    const map = parseMap(
      Array.from(seenStates.entries()).find(([_, cycle]) => cycle === index)![0]
    );

    return calculateTotalWeight(map); // 最終状態の重さを計算
  };

  return {
    show,
    analyzeMapAttributes,
    operateLever: moveElements,
    calculateTotalWeight: (map: MapAttribute[][]) => calculateTotalWeight(map),
    performCycle,
    calculateResultAfterCycles,
  };
};
