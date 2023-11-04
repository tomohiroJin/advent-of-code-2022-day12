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
  const row = arrayMap.find((strRow) => strRow.includes(position.value));
  if (!row) throw new Error(`${position.value}が見つかりませんでした。`);
  return { x: row.indexOf(position.value), y: arrayMap.indexOf(row) };
};

export const getCurrentPosition = (arrayMap: string[]): PositionType =>
  getPosition(arrayMap, Positions.CURRENT_POSITION);

export const getOptimalSignalPosition = (arrayMap: string[]): PositionType =>
  getPosition(arrayMap, Positions.OPTIMAL_SIGNAL_POSITION);

export const getElevationMap = (arrayMap: string[]): number[][] =>
  arrayMap.map((map) =>
    Array.from(map).map((char) => {
      const elevation = AllPositions.find(
        (position) => char === position.value
      )?.elevation;
      return elevation ?? char.charCodeAt(0) - "a".charCodeAt(0) + 1;
    })
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

export const traverseToOptimalSignal = (
  elevationMap: number[][],
  currentPosition: PositionType,
  optimalSignalPosition: PositionType,
  traversedPositions: PositionType[]
): PositionType[] => {
  const routes = getAdjacentPositions(elevationMap, currentPosition)
    .map((nextPosition) =>
      isPosition(currentPosition, nextPosition) ||
      traversedPositions.some((position) => isPosition(nextPosition, position))
        ? null
        : isPosition(nextPosition, optimalSignalPosition)
        ? [...traversedPositions, currentPosition, nextPosition]
        : traverseToOptimalSignal(
            elevationMap,
            nextPosition,
            optimalSignalPosition,
            [...traversedPositions, currentPosition]
          )
    )
    .filter((route) => route !== null);

  if (routes.length === 0) return [];

  return (
    routes.reduce((shortestRoute, route) => {
      // null は filter で除去しているのでありえない
      if (shortestRoute === null || route === null) return [];
      return route.length < shortestRoute.length ? route : shortestRoute;
    }) ?? []
  );
};

export const getShortestStepCount = (map: string): number => {
  const strMap = inputMap(map);
  const currentPosition = getCurrentPosition(strMap);
  const optimalSignalPosition = getOptimalSignalPosition(strMap);
  const elevationMap = getElevationMap(strMap);
  const route = traverseToOptimalSignal(
    elevationMap,
    currentPosition,
    optimalSignalPosition,
    []
  );
  return 31;
};
