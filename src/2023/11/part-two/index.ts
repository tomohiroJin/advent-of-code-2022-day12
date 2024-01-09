const GALAXY = "#";
const EMPTY_SPACE = ".";

type Cell = typeof GALAXY | typeof EMPTY_SPACE;
type Row = Cell[];
type GalaxyMap = Row[];

type ExpansionAreas = {
  rows: boolean[];
  cols: boolean[];
};

type Coordinate = [number, number];
type GalaxyPairs = [Coordinate, Coordinate][];

export const extractGalaxies = (map: GalaxyMap): GalaxyPairs => {
  const galaxies: Coordinate[] = [];

  // 銀河の座標を抽出
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === GALAXY) {
        galaxies.push([x, y]);
      }
    }
  }

  // 全ての銀河ペアを生成
  const pairs: GalaxyPairs = [];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      pairs.push([galaxies[i], galaxies[j]]);
    }
  }

  return pairs;
};

export const calculateShortestPath = (
  start: [number, number],
  end: [number, number],
  expansionAreas: ExpansionAreas
): number => {
  let distance = 0;

  // 水平方向の距離の計算
  for (
    let x = Math.min(start[0], end[0]);
    x < Math.max(start[0], end[0]);
    x += 1
  ) {
    distance += expansionAreas.cols[x] ? 100 : 1;
  }

  // 垂直方向の距離の計算
  for (
    let y = Math.min(start[1], end[1]);
    y < Math.max(start[1], end[1]);
    y += 1
  ) {
    distance += expansionAreas.rows[y] ? 100 : 1;
  }

  return distance;
};

export const identifyEmptyRowsAndCols = (map: GalaxyMap): ExpansionAreas => {
  const rows = map.map((row) => !row.includes(GALAXY));
  const cols = Array.from(
    { length: map[0].length },
    (_, colIndex) => !map.some((row) => row[colIndex] === GALAXY)
  );

  return { rows, cols };
};

export const parseGalaxyMap = (mapString: string): GalaxyMap =>
  mapString
    .split("\n")
    .map((row) =>
      row.split("").map((cell) => (cell === GALAXY ? GALAXY : EMPTY_SPACE))
    );

export const sumOfAllGalacticPathLengths = (map: string): number => {
  const galaxyMap = parseGalaxyMap(map);
  const expansionAreas = identifyEmptyRowsAndCols(galaxyMap);
  return extractGalaxies(galaxyMap)
    .map((coordinates) =>
      calculateShortestPath(coordinates[0], coordinates[1], expansionAreas)
    )
    .reduce((total, step) => (total += step), 0);
};
