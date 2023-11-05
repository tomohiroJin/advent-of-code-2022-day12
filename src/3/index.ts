const splitAt =
  (index: number) =>
  (str: string): [string, string] =>
    [str.slice(0, index), str.slice(index)];

export const splitStringIntoHalves = (str: string) =>
  splitAt(Math.floor(str.length / 2))(str);

export const findCommonCharacters = (stringPair: [string, string]): string[] =>
  Array.from(
    new Set(
      stringPair[0].split("").filter((item) => stringPair[1].includes(item))
    )
  );

const calculatePriority = (
  charCode: number,
  offset: number,
  basePriority: number
) => charCode - offset + basePriority;

export const getPriority = (item: string): number => {
  const charCode = item.charCodeAt(0);
  return /^[a-z]$/.test(item)
    ? calculatePriority(charCode, "a".charCodeAt(0), 1)
    : /^[A-Z]$/.test(item)
    ? calculatePriority(charCode, "A".charCodeAt(0), 27)
    : 0;
};

export const calculateTotalPriorityOfPackingErrors = (packs: string): number =>
  packs
    .split("\n")
    .reduce(
      (totalPriority, pack) =>
        totalPriority +
        findCommonCharacters(splitStringIntoHalves(pack)).reduce(
          (sum, item) => sum + getPriority(item),
          0
        ),
      0
    );
