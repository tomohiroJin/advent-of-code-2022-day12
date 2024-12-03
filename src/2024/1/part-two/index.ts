const readList = (listStr: string, index: number): number[] =>
  listStr
    .split("\n")
    .map((rowStr) => rowStr.split("   ")[index])
    .map(Number);

export const readLeftList = (listStr: string): number[] => readList(listStr, 0);

export const readRightList = (listStr: string): number[] =>
  readList(listStr, 1);

export const countOccurrences = (
  targetNumber: number,
  list: number[]
): number => list.filter((num) => targetNumber === num).length;

export const calculateSimilarityScore = (listStr: string): number => {
  const leftList = readLeftList(listStr);
  const rightList = readRightList(listStr);
  const memoMap = new Map<number, number>();
  return leftList.reduce((prev, current) => {
    if (!memoMap.has(current)) {
      memoMap.set(current, current * countOccurrences(current, rightList));
    }
    return prev + (memoMap.get(current) ?? 0);
  }, 0);
};
