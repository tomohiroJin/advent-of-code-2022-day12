const MAX_CLIMB_HEIGHT = 1 as const;

const Positions = {
  CURRENT_POSITION: { value: "S", elevation: 1 },
  OPTIMAL_SIGNAL_POSITION: { value: "E", elevation: 26 },
} as const;

type Positions = (typeof Positions)[keyof typeof Positions];
const AllPositions = Object.values(Positions);

type PositionType = {
  x: number;
  y: number;
};

type ElevationMap = number[][];

export const inputMap = (map: string): string[] => {
  return map.split("\n");
};

const getPosition = (arrayMap: string[], position: Positions): PositionType => {
  for (let y = 0; y < arrayMap.length; y++) {
    const x = arrayMap[y].indexOf(position.value);
    if (x !== -1) {
      return { x, y };
    }
  }
  throw new Error(`${position.value}が見つかりませんでした。`);
};

export const getCurrentPosition = (arrayMap: string[]): PositionType =>
  getPosition(arrayMap, Positions.CURRENT_POSITION);

export const getOptimalSignalPosition = (arrayMap: string[]): PositionType =>
  getPosition(arrayMap, Positions.OPTIMAL_SIGNAL_POSITION);

const elevationMapping = Object.fromEntries(
  AllPositions.map((pos) => [pos.value, pos.elevation])
);

export const getElevationMap = (arrayMap: string[]): number[][] =>
  arrayMap.map((mapRow) =>
    Array.from(mapRow).map(
      (char) =>
        elevationMapping[char] ?? char.charCodeAt(0) - "a".charCodeAt(0) + 1
    )
  );

type MoveType = (
  elevationMap: ElevationMap,
  position: PositionType
) => PositionType;

const move = (
  elevationMap: ElevationMap,
  position: PositionType,
  next: number,
  isHorizontal: boolean
): PositionType => {
  const { x, y } = position;
  const isValidPosition = isHorizontal
    ? elevationMap[y].length > next && 0 <= next
    : elevationMap.length > next && 0 <= next;

  const currentElevation = elevationMap[y][x];
  const nextElevation = () =>
    isHorizontal ? elevationMap[y][next] : elevationMap[next][x];

  return isValidPosition &&
    currentElevation + MAX_CLIMB_HEIGHT >= nextElevation()
    ? isHorizontal
      ? { x: next, y }
      : { x, y: next }
    : { x, y };
};

const moveHorizontally = (
  elevationMap: ElevationMap,
  position: PositionType,
  next: number
): PositionType => move(elevationMap, position, next, true);

const moveVertically = (
  elevationMap: ElevationMap,
  position: PositionType,
  next: number
): PositionType => move(elevationMap, position, next, false);

export const moveRight: MoveType = (elevationMap, position) =>
  moveHorizontally(elevationMap, position, position.x + 1);

export const moveLeft: MoveType = (elevationMap, position) =>
  moveHorizontally(elevationMap, position, position.x - 1);

export const moveUp: MoveType = (elevationMap, position) =>
  moveVertically(elevationMap, position, position.y - 1);

export const moveDown: MoveType = (elevationMap, position) =>
  moveVertically(elevationMap, position, position.y + 1);

export const getAdjacentPositions = (
  elevationMap: ElevationMap,
  position: PositionType
): [PositionType, PositionType, PositionType, PositionType] => {
  return [
    moveUp(elevationMap, position),
    moveDown(elevationMap, position),
    moveLeft(elevationMap, position),
    moveRight(elevationMap, position),
  ];
};

export const isPosition = (
  srcPosition: PositionType,
  dstPosition: PositionType
): boolean =>
  srcPosition.x === dstPosition.x && srcPosition.y === dstPosition.y;

export type Queue<T> = {
  enqueue: (item: T) => void;
  dequeue: () => T | undefined;
  isEmpty: () => boolean;
};

export const createQueue = <T>(): Queue<T> => {
  const data: T[] = [];
  let head = 0;
  let tail = 0;

  const enqueue = (item: T): void => {
    data[tail] = item;
    tail++;
  };

  const dequeue = (): T | undefined => {
    if (head < tail) {
      const item = data[head];
      head++;
      if (head === tail) {
        head = 0;
        tail = 0;
      }
      return item;
    }
    return undefined;
  };

  const isEmpty = (): boolean => {
    return head === tail;
  };

  return {
    enqueue,
    dequeue,
    isEmpty,
  };
};

export const createVisitedBitmap = (elevationMap: number[][]) => {
  const width = elevationMap[0].length;
  const height = elevationMap.length;
  let visitedBitmap = new BigUint64Array(width * height);

  const isVisited = (x: number, y: number): boolean => {
    const index = y * width + x;
    const byteIndex = Math.floor(index / 64);
    const bitIndex = index % 64;
    return (visitedBitmap[byteIndex] & (1n << BigInt(bitIndex))) !== 0n;
  };

  const setVisited = (x: number, y: number): void => {
    const index = y * width + x;
    const byteIndex = Math.floor(index / 64);
    const bitIndex = index % 64;
    visitedBitmap[byteIndex] |= 1n << BigInt(bitIndex);
  };

  return {
    isVisited,
    setVisited,
  };
};

type RouteNode = {
  position: PositionType;
  stepCount: number;
};

export const getShortestStepCount = (map: string): number => {
  const strMap = inputMap(map);
  const currentPosition = getCurrentPosition(strMap);
  const optimalSignalPosition = getOptimalSignalPosition(strMap);
  const elevationMap = getElevationMap(strMap);
  const width = elevationMap[0].length;
  const visited = createVisitedBitmap(elevationMap);

  const queue = createQueue<RouteNode>();
  queue.enqueue({ position: currentPosition, stepCount: 0 });
  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();
    if (!currentNode) break;

    const { position, stepCount } = currentNode;
    const { x, y } = position;

    if (isPosition(position, optimalSignalPosition)) {
      return stepCount;
    }

    if (visited.isVisited(x, y)) continue;
    visited.setVisited(x, y);

    for (const adjacentPosition of getAdjacentPositions(
      elevationMap,
      position
    )) {
      const adjacentKey = adjacentPosition.x + adjacentPosition.y * width;
      if (!visited.isVisited(adjacentPosition.x, adjacentPosition.y)) {
        queue.enqueue({
          position: adjacentPosition,
          stepCount: stepCount + 1,
        });
      }
    }
  }

  throw new Error("最適な信号位置に到達できませんでした。");
};
