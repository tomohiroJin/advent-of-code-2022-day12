import { createQueue } from "../../../lib/que";

type Coordinate = {
  x: number;
  y: number;
};

type Grid = string[][];

const DIRECTIONS = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};

const OPPOSITE_DIRECTIONS: Record<string, Coordinate> = {
  N: DIRECTIONS.S,
  S: DIRECTIONS.N,
  E: DIRECTIONS.W,
  W: DIRECTIONS.E,
};

const PIPE_CONNECTIONS: Record<string, Coordinate[]> = {
  "|": [DIRECTIONS.N, DIRECTIONS.S],
  "-": [DIRECTIONS.E, DIRECTIONS.W],
  L: [DIRECTIONS.N, DIRECTIONS.E],
  J: [DIRECTIONS.N, DIRECTIONS.W],
  "7": [DIRECTIONS.S, DIRECTIONS.W],
  F: [DIRECTIONS.S, DIRECTIONS.E],
  S: [DIRECTIONS.N, DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.W],
};

const getKeyByValue = (
  object: Record<string, Coordinate>,
  value: Coordinate
): string => {
  return Object.keys(object).find((key) => object[key] === value) || "";
};

const canMoveTo = (
  position: Coordinate,
  nextPosition: Coordinate,
  pipeConnection: Coordinate,
  grid: Grid
): boolean => {
  return (
    nextPosition.x >= 0 &&
    nextPosition.y >= 0 &&
    nextPosition.x < grid[0].length &&
    nextPosition.y < grid.length &&
    grid[nextPosition.y][nextPosition.x] !== "." &&
    PIPE_CONNECTIONS[grid[nextPosition.y][nextPosition.x]].includes(
      OPPOSITE_DIRECTIONS[getKeyByValue(DIRECTIONS, pipeConnection)]
    )
  );
};

export const findNextPositions = (
  position: Coordinate,
  grid: Grid
): Coordinate[] => {
  return PIPE_CONNECTIONS[grid[position.y][position.x]]
    .map((connection) => {
      const nextPosition = {
        x: position.x + connection.x,
        y: position.y + connection.y,
      };

      if (canMoveTo(position, nextPosition, connection, grid)) {
        return nextPosition;
      }

      return undefined;
    })
    .filter(
      (nextPosition): nextPosition is Coordinate => nextPosition != undefined
    );
};

export const calculateDistancesFromStart = (
  position: Coordinate,
  grid: Grid
): number => {
  const distances = Array.from({ length: grid.length }, () =>
    Array(grid[0].length).fill(-1)
  );

  const queue = createQueue<[Coordinate, number]>();
  queue.enqueue([position, 0]);

  let maxStep = 0;
  while (!queue.isEmpty()) {
    const dequeue = queue.dequeue();
    if (!dequeue) continue;
    const [nextPosition, stepCount] = dequeue;

    if (distances[nextPosition.y][nextPosition.x] === -1) {
      distances[nextPosition.y][nextPosition.x] = stepCount;
      maxStep = Math.max(maxStep, stepCount);
      findNextPositions(nextPosition, grid).forEach((newPosition) => {
        queue.enqueue([newPosition, stepCount + 1]);
      });
    }
  }
  return maxStep;
};

export const convertMapToGrid = (map: string): Grid =>
  map.split(/\n/).map((row) => row.split(""));

export const findStartPosition = (grid: Grid): Coordinate => {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (grid[y][x] === "S") {
        return { x, y };
      }
    }
  }
  throw new Error("開始位置が取得できません");
};

export const findFarthestPoint = (map: string): number => {
  const grid = convertMapToGrid(map);
  return calculateDistancesFromStart(findStartPosition(grid), grid);
};

export const getRoute = (position: Coordinate, grid: Grid): Number[][] => {
  const distances: Number[][] = Array.from({ length: grid.length }, () =>
    Array(grid[0].length).fill(-1)
  );

  const queue = createQueue<[Coordinate, number]>();
  queue.enqueue([position, 0]);

  while (!queue.isEmpty()) {
    const dequeue = queue.dequeue();
    if (!dequeue) continue;
    const [nextPosition, stepCount] = dequeue;

    if (distances[nextPosition.y][nextPosition.x] === -1) {
      distances[nextPosition.y][nextPosition.x] = stepCount;
      findNextPositions(nextPosition, grid).forEach((newPosition) => {
        queue.enqueue([newPosition, stepCount + 1]);
      });
    }
  }
  return distances;
};

export const getRouteGrid = (map: string): Number[][] => {
  const grid = convertMapToGrid(map);
  return getRoute(findStartPosition(grid), grid);
};
