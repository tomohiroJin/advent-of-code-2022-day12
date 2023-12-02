type CubeType = {
  red: number;
  green: number;
  blue: number;
};

type ColorInGamesType = {
  gameId: number;
  cubes: CubeType[];
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

export const calculateProductOfMinimumCubesRequired = (
  colorInGames: ColorInGamesType
): number =>
  Object.values(
    colorInGames.cubes.reduce(
      (minimumCubes, cube) => ({
        red: minimumCubes.red > cube.red ? minimumCubes.red : cube.red,
        green:
          minimumCubes.green > cube.green ? minimumCubes.green : cube.green,
        blue: minimumCubes.blue > cube.blue ? minimumCubes.blue : cube.blue,
      }),
      { red: NaN, green: NaN, blue: NaN }
    )
  ).reduce((total, value) => (total *= value), 1);

export const calculateTotalPowerOfMinimumCubeSets = (
  gameRecords: string
): number =>
  gameRecords
    .split("\n")
    .map(sumCubesByColorInEachSet)
    .map(calculateProductOfMinimumCubesRequired)
    .reduce((total, value) => (total += value), 0);
