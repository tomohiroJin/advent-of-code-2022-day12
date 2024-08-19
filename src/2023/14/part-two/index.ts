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
 * マップを解析する関数の型
 * @param {string} map - マップの文字列
 * @returns {Object} - 解析されたマップに関する操作を提供するオブジェクト
 * @property {Function} show - 現在のマップを文字列として表示する関数
 * @property {Function} analyzeMapAttributes - マップの属性を解析して返す関数
 * @property {Function} liver - 指定された方向に岩を移動させる関数
 * @property {Function} calculateTotalWeight - 現在のマップの岩の総重量を計算する関数
 * @property {Function} performCycle - マップ内の岩を回転させる1サイクルを実行する関数
 * @property {Function} cycleStartIndex - サイクルの開始インデックスを取得する関数
 * @property {Function} cycleLength - サイクルの長さを取得する関数
 * @property {Function} calculateResultAfterCycles - 指定されたサイクル数後の岩の総重量を計算する関数
 */
type AnalyzedMapType = (map: string) => {
  show: () => string;
  analyzeMapAttributes: () => MapAttribute[][];
  liver: (direction: Direction) => void;
  calculateTotalWeight: () => number;
  performCycle: () => void;
  cycleStartIndex: () => number | null;
  cycleLength: () => number | null;
  calculateResultAfterCycles: (totalCycles: number) => number;
};

/**
 * 指定された文字が MapElementCharacters 型かどうかを判定します。
 * @param {string} char - 判定する文字。
 * @returns {boolean} - 文字が MapElementCharacters 型である場合に true を返します。
 */
const isMapElementCharacters = (char: string): char is MapElementCharacters => {
  return char in MapElements;
};

/**
 * 与えられた2次元配列の行と列を転置します。
 * @param {T[][]} matrix - 転置する2次元配列。
 * @returns {T[][]} - 転置された2次元配列。
 */
const transpose = <T>(matrix: T[][]): T[][] => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

/**
 * 指定された2つのインデックス位置の要素をスワップした新しい配列を返します。
 * @param {MapAttribute[]} arr - 要素をスワップする配列。
 * @param {number} index1 - スワップする最初のインデックス。
 * @param {number} index2 - スワップする2つ目のインデックス。
 * @returns {MapAttribute[]} - 指定された要素がスワップされた新しい配列。
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
 * @param {MapAttribute[]} attributes - マップ内の各要素の配列。
 * @param {number} [spaceIndex=NaN] - 現在の空きスペースのインデックス。
 * @param {number} [currentIndex=0] - 現在のインデックス。
 * @returns {MapAttribute[]} - 更新された配列。
 */
const relocateCircleLocks = (
  attributes: MapAttribute[],
  spaceIndex = NaN,
  currentIndex = 0
): MapAttribute[] => {
  if (attributes.length === currentIndex) {
    return attributes;
  }

  const currentAttr = attributes[currentIndex];
  const nextIndex = currentIndex + 1;

  if (currentAttr.element === MapElements[EMPTY_SPACE]) {
    return relocateCircleLocks(
      attributes,
      isNaN(spaceIndex) ? currentIndex : spaceIndex,
      nextIndex
    );
  }

  if (!isNaN(spaceIndex) && currentAttr.element === MapElements[CIRCLE_LOCK]) {
    return relocateCircleLocks(
      swapArrayElements(attributes, currentIndex, spaceIndex),
      NaN,
      spaceIndex
    );
  }

  if (currentAttr.element === MapElements[SQUARE_LOCK]) {
    return relocateCircleLocks(attributes, NaN, nextIndex);
  }

  return relocateCircleLocks(attributes, spaceIndex, nextIndex);
};

/**
 * グリッド内の要素を移動させる関数を作成します。
 * @returns {Object} - 方向ごとの移動関数を持つオブジェクト。
 */
const createGridMover = () => {
  const processRows = (grid: MapAttribute[][]) =>
    grid.map((row) => relocateCircleLocks(row));

  const moveNorth = (grid: MapAttribute[][]) =>
    transpose(processRows(transpose(grid)));

  const moveSouth = (grid: MapAttribute[][]) =>
    transpose(
      transpose(grid).map((rows) =>
        relocateCircleLocks(rows.reverse()).reverse()
      )
    );

  const moveWest = (grid: MapAttribute[][]) => processRows(grid);

  const moveEast = (grid: MapAttribute[][]) =>
    processRows(grid.map((row) => row.reverse())).map((row) => row.reverse());

  return {
    moveNorth,
    moveSouth,
    moveWest,
    moveEast,
  };
};

const gridMover = createGridMover();

/**
 * グリッド内の要素を指定された方向に移動させます。
 * @param {MapAttribute[][]} grid - グリッド内の要素の配列。
 * @param {Direction} direction - 移動する方向。
 * @returns {MapAttribute[][]} - 移動後のグリッド。
 */
const moveElements = (grid: MapAttribute[][], direction: Direction) => {
  const operations = {
    North: gridMover.moveNorth,
    South: gridMover.moveSouth,
    West: gridMover.moveWest,
    East: gridMover.moveEast,
  };
  return operations[direction](grid);
};

/**
 * 文字と座標から新しい MapAttribute オブジェクトを作成します。
 * @param {string} char - 要素を表す文字。
 * @param {number} x - 要素のx座標。
 * @param {number} y - 要素のy座標。
 * @returns {MapAttribute} - 新しく作成された MapAttribute オブジェクト。
 * @throws {Error} - 文字が MapElementCharacters に該当しない場合にエラーをスローします。
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
 * @param {string} map - 解析するマップの文字列。
 * @returns {MapAttribute[][]} - 解析された MapAttribute オブジェクトの2次元配列。
 */
const parseMap = (map: string) =>
  map.split("\n").map((row, y) => {
    return row.split("").map((char, x) => createElementObject(char, x, y));
  });

/**
 * 現在のマップ内の岩の総重量を計算します。
 * @param {MapAttribute[][]} mapAttributes - マップ内の要素の2次元配列。
 * @returns {number} - 岩の総重量。
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

export const analyzeMap: AnalyzedMapType = (map) => {
  let currentMap = parseMap(map);
  let cycleStartIndex: number | null = null;
  let cycleLength: number | null = null;
  let iteration = 0;
  const seenStates = new Map<string, number>(); // 過去の状態とそのサイクル番号を保存

  const show = () => {
    return currentMap
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
  };

  const extractMapAttributes = () => currentMap;

  const checkCycle = () => {
    const currentState = show();
    if (seenStates.has(currentState)) {
      cycleStartIndex = seenStates.get(currentState)!; // 最初にこの状態が現れた回数
      cycleLength = iteration - cycleStartIndex; // 現在の回数との差が周期の長さ

      return true; // 周期性が確認できた場合
    }
    seenStates.set(currentState, iteration);
    return false;
  };

  const liver = (direction: Direction) => {
    currentMap = moveElements(currentMap, direction);
  };

  const performCycle = () => {
    const directions: Direction[] = ["North", "West", "South", "East"];
    directions.forEach((direction: Direction) => liver(direction));
    iteration++;
    checkCycle(); // 毎回状態をチェックして周期性を確認
  };

  const calculateResultAfterCycles = (cycleNumber: number) => {
    const startIndex = cycleStartIndex ?? 0;
    const length = cycleLength ?? 0;
    const index = startIndex + ((cycleNumber - startIndex) % length);

    // 周期開始前の状態に戻す
    currentMap = parseMap(
      Array.from(seenStates.entries()).find(([_, cycle]) => cycle === index)![0]
    );

    return calculateTotalWeight(currentMap); // 最終状態の重さを計算
  };

  return {
    show,
    analyzeMapAttributes: extractMapAttributes,
    liver,
    calculateTotalWeight: () => calculateTotalWeight(currentMap),
    performCycle,
    cycleStartIndex: () => cycleStartIndex,
    cycleLength: () => cycleLength,
    calculateResultAfterCycles,
  };
};
