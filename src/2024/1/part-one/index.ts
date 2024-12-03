const readList = (listStr: string, index: number): number[] =>
  listStr
    .split("\n")
    .map((rowStr) => rowStr.split("   ")[index])
    .map(Number);

export const readLeftList = (listStr: string): number[] => readList(listStr, 0);

export const readRightList = (listStr: string): number[] =>
  readList(listStr, 1);

export const differenceNumber = (
  leftList: number[],
  rightList: number[]
): number[] =>
  leftList.map((left, index) =>
    rightList[index] > left ? rightList[index] - left : left - rightList[index]
  );

export const differenceTotal = (list: number[]): number =>
  list.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

export const totalDifferenceList = (listStr: string): number =>
  differenceTotal(
    differenceNumber(
      readLeftList(listStr).sort(),
      readRightList(listStr).sort()
    )
  );
