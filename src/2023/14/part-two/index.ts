const EMPTY_SPACE = "."; // 空きスペースを表す定数
const CIRCLE_LOCK = "O"; // 丸い岩を表す定数
const SQUARE_LOCK = "#"; // 四角い岩を表す定数

const MapElements = {
  [EMPTY_SPACE]: "space",
  [SQUARE_LOCK]: "squareLock",
  [CIRCLE_LOCK]: "circleLock",
} as const;

type MapAttribute = {
  x: number;
  y: number;
  element: Elements;
};

type MapElementCharacters = keyof typeof MapElements;
type Elements = (typeof MapElements)[MapElementCharacters];

type Direction = "North" | "South" | "East" | "West";

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

const isMapElementCharacters = (char: string): char is MapElementCharacters => {
  return char in MapElements;
};

const transpose = <T>(matrix: T[][]): T[][] => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

const swapArrayElements = <T>(
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

const relocateCircleLocks = (
  attributes: MapAttribute[],
  index: number,
  spaceIndex: number
): MapAttribute[] => {
  if (attributes.length === index) {
    return attributes;
  }

  if (attributes[index].element === MapElements[EMPTY_SPACE]) {
    return relocateCircleLocks(
      attributes,
      index + 1,
      isNaN(spaceIndex) ? index : spaceIndex
    );
  }

  if (
    !isNaN(spaceIndex) &&
    attributes[index].element === MapElements[CIRCLE_LOCK]
  ) {
    return relocateCircleLocks(
      swapArrayElements(attributes, index, spaceIndex),
      spaceIndex,
      NaN
    );
  }

  if (attributes[index].element === MapElements[SQUARE_LOCK]) {
    return relocateCircleLocks(attributes, index + 1, NaN);
  }

  return relocateCircleLocks(attributes, index + 1, spaceIndex);
};

const moveElementNorth = (attributes: MapAttribute[][]): MapAttribute[][] =>
  transpose(
    transpose(attributes).map((rows) => relocateCircleLocks(rows, 0, NaN))
  );

const moveElementSouth = (attributes: MapAttribute[][]): MapAttribute[][] =>
  transpose(
    transpose(attributes).map((rows) =>
      relocateCircleLocks(rows.reverse(), 0, NaN).reverse()
    )
  );

const moveElementWest = (attributes: MapAttribute[][]): MapAttribute[][] =>
  attributes.map((row) => relocateCircleLocks(row, 0, NaN));

const moveElementEast = (attributes: MapAttribute[][]): MapAttribute[][] =>
  attributes.map((row) => relocateCircleLocks(row.reverse(), 0, NaN).reverse());

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

const parseMap = (map: string) =>
  map.split("\n").map((row, y) => {
    return row.split("").map((char, x) => createElementObject(char, x, y));
  });

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

  const getCurrentState = () => show();

  const checkCycle = () => {
    const currentState = getCurrentState();
    if (seenStates.has(currentState)) {
      cycleStartIndex = seenStates.get(currentState)!; // 最初にこの状態が現れた回数
      cycleLength = iteration - cycleStartIndex; // 現在の回数との差が周期の長さ

      return true; // 周期性が確認できた場合
    }
    seenStates.set(currentState, iteration);
    return false;
  };

  const liver = (direction: Direction) => {
    switch (direction) {
      case "North":
        currentMap = moveElementNorth(currentMap);
        break;
      case "South":
        currentMap = moveElementSouth(currentMap);
        break;
      case "West":
        currentMap = moveElementWest(currentMap);
        break;
      case "East":
        currentMap = moveElementEast(currentMap);
        break;
      default:
    }
  };

  const performCycle = () => {
    const directions: Direction[] = ["North", "West", "South", "East"];
    directions.forEach((direction: Direction) => liver(direction));
    iteration++;
    checkCycle(); // 毎回状態をチェックして周期性を確認
  };

  const calculateResultAfterCycles = () => {
    const startIndex = cycleStartIndex ?? 0;
    const length = cycleLength ?? 0;
    const index = startIndex + ((1000000000 - startIndex) % length);
    // const index = 6;

    // console.log(index, length, startIndex, iteration, seenStates.entries());

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
