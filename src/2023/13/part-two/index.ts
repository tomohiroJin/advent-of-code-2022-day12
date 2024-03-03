type ReflectionPattern = string[];
type HorizontalReflectionPattern = ReflectionPattern;
type VerticalReflectionPattern = ReflectionPattern;
type ReflectionPatterns = [
  HorizontalReflectionPattern[],
  VerticalReflectionPattern[]
];
export const convertPatternsToArrays = (
  reflectionsMap: string
): ReflectionPatterns => {
  const reflections = reflectionsMap.split(/\r?\n\r?\n/);
  return reflections
    .map((reflection) => {
      const horizontalArray: ReflectionPattern = reflection.split("\n");
      const verticalArray: ReflectionPattern = horizontalArray[0]
        .split("")
        .map((_, columnIndex) =>
          horizontalArray.map((row) => row[columnIndex]).join("")
        );
      return [horizontalArray, verticalArray];
    })
    .reduce<ReflectionPatterns>(
      (acc, [horizontal, vertical]) => {
        acc[0].push(horizontal);
        acc[1].push(vertical);
        return acc;
      },
      [[], []]
    );
};

export const convertPatternToBits = (reflection: string): number =>
  reflection.split("").reduce((acc, char, index) => {
    return char === "#" ? acc | (1 << (reflection.length - index - 1)) : acc;
  }, 0);

export const isSingleBitDifference = (
  first: number,
  second: number
): boolean => {
  const xorResult = first ^ second;
  if (xorResult === 0) {
    return false;
  }
  return (xorResult & (xorResult - 1)) === 0;
};

export const findMatchingIndicesBetweenRows = (
  reflectionPattern: ReflectionPattern
): number[] => {
  const indexes: number[] = [];
  for (let i = 0; i < reflectionPattern.length - 1; i += 1) {
    if (
      isSingleBitDifference(
        convertPatternToBits(reflectionPattern[i]),
        convertPatternToBits(reflectionPattern[i + 1])
      ) ||
      reflectionPattern[i] === reflectionPattern[i + 1]
    ) {
      indexes.push(i);
    }
  }
  return indexes;
};

export const calculateMinArrayLengthFromMatchingIndex = (
  reflectionPattern: ReflectionPattern,
  index: number
): number => {
  const reflectionToSize = index + 1 + 1;
  const halfLength = Math.ceil(reflectionPattern.length / 2);
  return halfLength < reflectionToSize
    ? reflectionPattern.length - reflectionToSize
    : index;
};

export const existsReflectionLine = (
  reflectionPattern: ReflectionPattern,
  index: number,
  size: number
): boolean => {
  let isOneSmudge = false;
  return (
    [...Array(size + 1).keys()].every((offset) => {
      const aboveIndex = index - offset;
      const belowIndex = index + offset + 1;
      const isQuery = isOneSmudge
        ? reflectionPattern[aboveIndex] === reflectionPattern[belowIndex]
        : isSingleBitDifference(
            convertPatternToBits(reflectionPattern[aboveIndex]),
            convertPatternToBits(reflectionPattern[belowIndex])
          ) || reflectionPattern[aboveIndex] === reflectionPattern[belowIndex];

      isOneSmudge =
        isOneSmudge ||
        isSingleBitDifference(
          convertPatternToBits(reflectionPattern[aboveIndex]),
          convertPatternToBits(reflectionPattern[belowIndex])
        );

      return (
        aboveIndex >= 0 && belowIndex < reflectionPattern.length && isQuery
      );
    }) && isOneSmudge
  );
};

export const findReflectionLineIndex = (
  reflectionPattern: ReflectionPattern
) => {
  const indexRows = findMatchingIndicesBetweenRows(reflectionPattern);
  for (let indexRow of indexRows) {
    const checkRange = calculateMinArrayLengthFromMatchingIndex(
      reflectionPattern,
      indexRow
    );
    if (existsReflectionLine(reflectionPattern, indexRow, checkRange)) {
      return indexRow + 1;
    }
  }
  return NaN;
};

export const analyzeAndSummarizeReflections = (
  reflectionsMap: string
): number => {
  const [horizontalNumber, verticalNumber] = convertPatternsToArrays(
    reflectionsMap
  ).map((reflectionPatterns) =>
    reflectionPatterns
      .map(findReflectionLineIndex)
      .reduce((total, value) => total + (value || 0), 0)
  );

  return horizontalNumber * 100 + verticalNumber;
};
