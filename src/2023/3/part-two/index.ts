type PartType = {
  no: number;
  startIndex: number;
  endIndex: number;
};

type PartInfoType = {
  parts: PartType[];
};

type GearInfoType = {
  gears: number[];
};

export const findGearSymbolPositionsInLine = (
  schematicLine: string
): number[] =>
  [...schematicLine].reduce(
    (positions, char, index) =>
      /[*]/g.test(char) ? [...positions, index] : positions,
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

const splitTextIntoLines = (str: string): string[] => str.split("\n");

export const generatePartPositionsFromSchematic = (
  schematic: string
): PartInfoType[] =>
  splitTextIntoLines(schematic).map((row, index) => ({
    parts: findPartPositionsInLine(row),
  }));

export const generateGearSymbolPositionsFromSchematic = (
  schematic: string
): GearInfoType[] =>
  splitTextIntoLines(schematic).map((row, index) => ({
    gears: findGearSymbolPositionsInLine(row),
  }));

const isValid = (
  startIndex: number,
  endIndex: number,
  symbolIndex: number
): boolean => startIndex - 1 <= symbolIndex && symbolIndex <= endIndex + 1;

export const calculateProductOfNumbersAroundGear = (
  index: number,
  gearPosition: number,
  partsInfo: PartInfoType[]
): number => {
  const aboveValue =
    index > 0
      ? partsInfo[index - 1].parts
          .filter((part) =>
            isValid(part.startIndex, part.endIndex, gearPosition)
          )
          .map((part) => part.no)
      : [];
  const centerValue = partsInfo[index].parts
    .filter((part) => isValid(part.startIndex, part.endIndex, gearPosition))
    .map((part) => part.no);
  const belowValue =
    partsInfo.length > gearPosition
      ? partsInfo[index + 1].parts
          .filter((part) =>
            isValid(part.startIndex, part.endIndex, gearPosition)
          )
          .map((part) => part.no)
      : [];

  const values = [...aboveValue, ...centerValue, ...belowValue].filter(
    (value): value is number => value !== undefined
  );
  return values.length > 1
    ? values.reduce((total, value) => total * value, 1)
    : 0;
};

export const calculateTotalPartNumbersFromSchematic = (
  schematic: string
): number => {
  const partsInfo = generatePartPositionsFromSchematic(schematic);
  const gearsInfo = generateGearSymbolPositionsFromSchematic(schematic);
  return gearsInfo
    .map((gearInfo, index) =>
      gearInfo.gears.map((gear) =>
        calculateProductOfNumbersAroundGear(index, gear, partsInfo)
      )
    )
    .flat()
    .reduce((total, value) => total + value, 0);
};
