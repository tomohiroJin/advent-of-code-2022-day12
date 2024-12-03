const parseLocationList = (
  locationListStr: string,
  columnIndex: number
): number[] =>
  locationListStr
    .split("\n")
    .map((rowStr) => rowStr.split("   ")[columnIndex])
    .map(Number);

export const parseLeftColumn = (locationListStr: string): number[] =>
  parseLocationList(locationListStr, 0);

export const parseRightColumn = (locationListStr: string): number[] =>
  parseLocationList(locationListStr, 1);

export const calculateDifferenceList = (
  leftLocationList: number[],
  rightLocationList: number[]
): number[] =>
  leftLocationList.map((left, index) =>
    Math.abs(left - rightLocationList[index])
  );

export const sumOfDifferences = (differenceList: number[]): number =>
  differenceList.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );

export const calculateTotalDifference = (locationListStr: string): number =>
  sumOfDifferences(
    calculateDifferenceList(
      parseLeftColumn(locationListStr).slice().sort(),
      parseRightColumn(locationListStr).slice().sort()
    )
  );
