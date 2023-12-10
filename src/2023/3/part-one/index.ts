type PartType = {
  no: number;
  startIndex: number;
  endIndex: number;
};

type AdjacentSymbolPositionsType = {
  aboveSymbolPosition: number[] | undefined;
  centerSymbolPosition: number[];
  belowSymbolPosition: number[] | undefined;
};

export const findSymbolPositionsInLine = (schematicLine: string): number[] =>
  [...schematicLine].reduce(
    (positions, char, index) =>
      /[^\w.]/g.test(char) ? [...positions, index] : positions,
    [] as number[]
  );

const findAllPartMatches = (
  regExp: RegExp,
  schematicLine: string,
  parts: PartType[]
): PartType[] => {
  const match = regExp.exec(schematicLine);
  if (match === null) {
    return parts;
  }

  return findAllPartMatches(regExp, schematicLine, [
    ...parts,
    {
      no: Number(match[0]),
      startIndex: match.index,
      endIndex: match.index + match[0].length - 1,
    },
  ]);
};

export const findPartPositionsInLine = (schematicLine: string): PartType[] =>
  findAllPartMatches(/\d+/g, schematicLine, []);

const isValid = (
  startIndex: number,
  endIndex: number,
  symbolIndex: number
): boolean => startIndex - 1 <= symbolIndex && symbolIndex <= endIndex + 1;

export const isValidPartAdjacentToSymbol = (
  part: PartType,
  adjacentSymbolPositions: AdjacentSymbolPositionsType
): boolean =>
  (adjacentSymbolPositions.aboveSymbolPosition !== undefined &&
    adjacentSymbolPositions.aboveSymbolPosition.some((position) =>
      isValid(part.startIndex, part.endIndex, position)
    )) ||
  adjacentSymbolPositions.centerSymbolPosition.some((position) =>
    isValid(part.startIndex, part.endIndex, position)
  ) ||
  (adjacentSymbolPositions.belowSymbolPosition !== undefined &&
    adjacentSymbolPositions.belowSymbolPosition.some((position) =>
      isValid(part.startIndex, part.endIndex, position)
    ));

export const calculateTotalPartNumbersFromSchematic = (
  schematic: string
): number => {
  const schematicLines = schematic.split("\n");
  const partsLine = schematicLines.map(findPartPositionsInLine);
  const symbolsLine = schematicLines.map(findSymbolPositionsInLine);
  return partsLine.reduce((partsTotal, parts, index) => {
    partsTotal += parts.reduce((partTotal, part) => {
      partTotal += isValidPartAdjacentToSymbol(part, {
        aboveSymbolPosition: index > 0 ? symbolsLine[index - 1] : [],
        centerSymbolPosition: symbolsLine[index],
        belowSymbolPosition:
          index < symbolsLine.length ? symbolsLine[index + 1] : [],
      })
        ? part.no
        : 0;
      return partTotal;
    }, 0);
    return partsTotal;
  }, 0);
};
