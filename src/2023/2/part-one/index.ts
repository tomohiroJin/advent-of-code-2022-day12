type ColorInGamesType = {
  gameId: number;
  cubes: {
    red: number;
    green: number;
    blue: number;
  }[];
};

const extractGameNumber = (reg: RegExp, str: string): number => {
  const arrays = str.match(reg);
  if (arrays && arrays.length > 1) {
    return Number(arrays[1]);
  }
  return 0;
};

const extractColorNumber = (reg: RegExp, str: string): number => {
  const arrays = str.match(reg);
  if (arrays) {
    return arrays.reduce((total, cube) => (total += Number(cube)), 0);
  }
  return 0;
};

export const sumCubesByColorInEachSet = (
  gameRecord: string
): ColorInGamesType => {
  const gameId = extractGameNumber(/Game\s(\d+):/, gameRecord);
  const sets = gameRecord.match(/(?:\b\d+\s+\w+)(?:,\s*\d+\s+\w+)*/g) ?? [];
  console.log(sets);
  const cubes = sets.map((set) => {
    const red = extractColorNumber(/\d+(?=\sred)/g, set);
    const blue = extractColorNumber(/\d+(?=\sblue)/g, set);
    const green = extractColorNumber(/\d+(?=\sgreen)/g, set);
    return { red, blue, green };
  });
  return { gameId, cubes };
};

export const isGameFeasible = (colorInGames: ColorInGamesType): boolean =>
  colorInGames.cubes.every(
    (cube) => cube.red <= 12 && cube.green <= 13 && cube.blue <= 14
  );

export const calculateSumOfPossibleGameIds = (gameRecords: string): number =>
  gameRecords
    .split("\n")
    .map(sumCubesByColorInEachSet)
    .filter(isGameFeasible)
    .reduce((total, colorInGames) => (total += colorInGames.gameId), 0);
