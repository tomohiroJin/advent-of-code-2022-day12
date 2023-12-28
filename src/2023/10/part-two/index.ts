import { changeDirectory } from "../../../2022/7";
import { getRouteGrid } from "../part-one";

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

const PIPES = ["|", "-", "L", "J", "7", "F", "S"];

type Queue<T> = {
  enqueue: (item: T) => void;
  dequeue: () => T | undefined;
  isEmpty: () => boolean;
};

const createQueue = <T>(): Queue<T> => {
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

const canMoveTo = (nextPosition: Coordinate, grid: Grid): boolean => {
  return (
    nextPosition.x >= 0 &&
    nextPosition.y >= 0 &&
    nextPosition.x < grid[0].length &&
    nextPosition.y < grid.length &&
    (grid[nextPosition.y][nextPosition.x] === "." ||
      grid[nextPosition.y][nextPosition.x] === "D")
  );
};

export const findNextPositions = (
  position: Coordinate,
  grid: Grid
): Coordinate[] => {
  return Object.values(DIRECTIONS)
    .map((connection) => {
      const nextPosition = {
        x: position.x + connection.x,
        y: position.y + connection.y,
      };

      if (canMoveTo(nextPosition, grid)) {
        return nextPosition;
      }

      return undefined;
    })
    .filter(
      (nextPosition): nextPosition is Coordinate => nextPosition != undefined
    );
};

export const convertNests = (position: Coordinate, grid: Grid): number[][] => {
  const distances: number[][] = grid.map((row) =>
    row.map((col) => (PIPES.includes(col) ? 1 : col === "D" ? 0 : -1))
  );

  console.log(distances.map((row) => row.join(",")).join("\n"));

  const queue = createQueue<Coordinate>();
  queue.enqueue(position);

  while (!queue.isEmpty()) {
    const dequeue = queue.dequeue();
    if (!dequeue) continue;
    const position = dequeue;

    if (
      distances[position.y][position.x] === -1 ||
      distances[position.y][position.x] === 0
    ) {
      distances[position.y][position.x] = 2;
      findNextPositions(position, grid).forEach((newPosition) => {
        queue.enqueue(newPosition);
      });
    }
  }
  return distances;
};

const fillOuterAreaWithGround = (grid: Grid): Grid => {
  const result = grid.map((row) => ["D", ...row, "D"]);
  const addRow = Array.from({ length: result[0].length }, () => "D");
  return [addRow, ...result, addRow];
};

const insertDummyHorizonGroundColumn = (grid: Grid): Grid => {
  const newGrid = grid.map((row) => [...row]);
  const horizonPipesToCheck = [
    ["|", "J", "7"],
    ["|", "F", "L"],
  ];
  const horizonDummyChangeCheck = ["-", "F", "L"];

  for (let y = 0; y < newGrid.length; y++) {
    for (let x = 0; x < newGrid[y].length - 1; x++) {
      const currentCell = newGrid[y][x];
      const nextCell = newGrid[y][x + 1];

      if (
        horizonPipesToCheck[0].includes(currentCell) &&
        horizonPipesToCheck[1].includes(nextCell)
      ) {
        for (let i = 0; i < newGrid.length; i++) {
          newGrid[i].splice(
            x + 1,
            0,
            horizonDummyChangeCheck.includes(newGrid[i][x]) ? "-" : "D"
          );
        }
        x++;
      }
    }
  }

  return newGrid;
};

const insertDummyGroundRowBetweenPipes = (grid: Grid): Grid => {
  const upperPipesToCheck = ["-", "J", "L"];
  const lowerPipesToCheck = ["-", "F", "7"];
  const verticalPipesToCheck = ["|", "F", "7"];
  let newGrid: Grid = [];

  for (let y = 0; y < grid.length; y++) {
    newGrid.push(grid[y]);

    if (y < grid.length - 1) {
      const upperRow = grid[y];
      const lowerRow = grid[y + 1];

      let needsDummyRow = false;
      for (let x = 0; x < upperRow.length; x++) {
        if (
          upperPipesToCheck.includes(upperRow[x]) &&
          lowerPipesToCheck.includes(lowerRow[x])
        ) {
          needsDummyRow = true;
          break;
        }
      }

      if (needsDummyRow) {
        const dummyRow = grid[y].map((col) =>
          verticalPipesToCheck.includes(col) ? "|" : "D"
        );
        newGrid.push(dummyRow);
      }
    }
  }

  return newGrid;
};

const convertStartToPipe = (grid: Grid): Grid => {
  const newGrid = grid.map((row) => [...row]);
  const directions = [
    { x: -1, y: 0, pipeCheck: ["-", "F", "L"], type: "W" },
    { x: 1, y: 0, pipeCheck: ["-", "J", "7"], type: "E" },
    { x: 0, y: -1, pipeCheck: ["|", "F", "7"], type: "N" },
    { x: 0, y: 1, pipeCheck: ["|", "L", "J"], type: "S" },
  ];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "S") {
        const adjacentPipes = directions
          .filter((dir) => {
            const newX = x + dir.x;
            const newY = y + dir.y;
            return (
              newX >= 0 &&
              newX < grid[y].length &&
              newY >= 0 &&
              newY < grid.length &&
              dir.pipeCheck.includes(grid[newY][newX])
            );
          })
          .map((dir) => dir.type);

        if (adjacentPipes.includes("N") && adjacentPipes.includes("E"))
          newGrid[y][x] = "L";
        else if (adjacentPipes.includes("N") && adjacentPipes.includes("W"))
          newGrid[y][x] = "J";
        else if (adjacentPipes.includes("S") && adjacentPipes.includes("W"))
          newGrid[y][x] = "7";
        else if (adjacentPipes.includes("S") && adjacentPipes.includes("E"))
          newGrid[y][x] = "F";
        else if (adjacentPipes.includes("W") && adjacentPipes.includes("E"))
          newGrid[y][x] = "-";
        else if (adjacentPipes.includes("N") && adjacentPipes.includes("S"))
          newGrid[y][x] = "|";
        else newGrid[y][x] = ".";
      }
    }
  }

  return newGrid;
};

export const convertMapToGrid = (map: string): Grid => {
  const routeGrid = getRouteGrid(map);
  const grid = map
    .split(/\n/)
    .map((row) => row.split(""))
    .map((row, rowIndex) =>
      row.map((col, colIndex) =>
        routeGrid[rowIndex][colIndex] === -1 ? "." : col
      )
    );
  return fillOuterAreaWithGround(
    insertDummyGroundRowBetweenPipes(
      insertDummyHorizonGroundColumn(convertStartToPipe(grid))
    )
  );
};

export const findStartPosition = (grid: Grid): Coordinate => {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (grid[y][x] === "D") {
        return { x, y };
      }
    }
  }
  throw new Error("開始位置が取得できません");
};

export const countNestsInLoop = (map: string): number => {
  const grid = convertMapToGrid(map);
  return convertNests(findStartPosition(grid), grid)
    .flat()
    .filter((num) => num === -1).length;
};
