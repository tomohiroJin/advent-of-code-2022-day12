type TreeHeightMap = number[][];
type VisibilityMap = boolean[][];
type CalculateVisibleTrees = (treeHeightMap: TreeHeightMap) => VisibilityMap;

const calculateVerticalVisibility: CalculateVisibleTrees = (treeHeightMap) => {
  let maxHeightArray: number[] = [];
  return treeHeightMap.map((treeHeightArray, topViewPosition) => {
    return treeHeightArray.map((treeHeight, leftViewPosition) => {
      const visibility =
        topViewPosition === 0 || treeHeight > maxHeightArray[leftViewPosition];
      maxHeightArray[leftViewPosition] = visibility
        ? treeHeight
        : maxHeightArray[leftViewPosition];
      return visibility;
    });
  });
};

export const calculateVisibleTreesFromTop: CalculateVisibleTrees = (
  treeHeightMap
) => calculateVerticalVisibility(treeHeightMap);

export const calculateVisibleTreesFromBottom: CalculateVisibleTrees = (
  treeHeightMap
) => calculateVerticalVisibility([...treeHeightMap].reverse()).reverse();

const calculateHorizontalVisibility: CalculateVisibleTrees = (
  treeHeightMap
) => {
  return treeHeightMap.map((treeHeightArray, topViewPosition) => {
    let maxHeight: number = 0;
    return treeHeightArray.map((treeHeight, leftViewPosition) => {
      const visibility = leftViewPosition === 0 || treeHeight > maxHeight;
      maxHeight = visibility ? treeHeight : maxHeight;
      return visibility;
    });
  });
};

export const calculateVisibleTreesFromLeft: CalculateVisibleTrees = (
  treeHeightMap
) => calculateHorizontalVisibility(treeHeightMap);

const reverseMap = <T>(map: T[][]): T[][] =>
  map.map((row) => [...row].reverse());

export const calculateVisibleTreesFromRight: CalculateVisibleTrees = (
  treeHeightMap
) => reverseMap(calculateHorizontalVisibility(reverseMap(treeHeightMap)));

export const convertToGridArray = (input: string) =>
  input.split("\n").map((line) => line.split("").map((str) => Number(str)));

const directionalVisibilityFunctions = [
  calculateVisibleTreesFromTop,
  calculateVisibleTreesFromBottom,
  calculateVisibleTreesFromLeft,
  calculateVisibleTreesFromRight,
];

export const countTreesVisibleFromOutside = (trees: string): number => {
  const treeHeightMap = convertToGridArray(trees);
  const directionalVisibilityMaps = directionalVisibilityFunctions.map((fnc) =>
    fnc(treeHeightMap)
  );
  return treeHeightMap
    .map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        directionalVisibilityMaps.some(
          (directionalVisibility) => directionalVisibility[rowIndex][colIndex]
        )
          ? 1
          : 0
      )
    )
    .reduce(
      (total, row) =>
        total + row.reduce((rowSum: number, cell) => rowSum + cell, 0),
      0
    );
};
