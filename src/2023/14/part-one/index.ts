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
  downTheLiver: (direction: Direction) => void;
  calculateTotalWeight: () => number;
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

  const downTheLiver = (direction: Direction) => {
    if (direction === "North") {
      currentMap = moveElementNorth(currentMap);
    }
  };

  return {
    show,
    analyzeMapAttributes: extractMapAttributes,
    downTheLiver,
    calculateTotalWeight: () => calculateTotalWeight(currentMap),
  };
};
