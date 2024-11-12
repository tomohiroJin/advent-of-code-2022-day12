// セルの状態を表す型
export type CellState = "alive" | "dead";

// セルの状態定数
export const ALIVE: CellState = "alive";
export const DEAD: CellState = "dead";

/**
 * 指定されたセルが生きているかどうかを判定する関数
 * @param cell - セルの状態を表す CellState 型（ALIVE か DEAD）
 * @returns boolean - セルが ALIVE の場合は true、それ以外は false
 */
export function isCellAlive(cell: CellState): boolean {
  return cell === ALIVE;
}

/**
 * 指定されたサイズの格子を作成し、全てのセルに DEAD 状態を設定する関数
 * @param width - 格子の幅
 * @param height - 格子の高さ
 * @returns CellState[][] - DEAD で埋められた width x height の二次元配列
 */
export function createGrid(width: number, height: number): CellState[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => DEAD)
  );
}

/**
 * 隣接する生きているセルの数を数える
 * @param grid - セル格子
 * @param x - X 軸
 * @param y - y 軸
 * @returns 隣接する生きているセルの数
 */
export function countAliveNeighbors(
  grid: CellState[][],
  x: number,
  y: number
): number {
  const neighbors = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];

  return neighbors.filter(
    ([nx, ny]) =>
      nx >= 0 &&
      nx < grid[0].length &&
      ny >= 0 &&
      ny < grid.length &&
      grid[ny][nx] === ALIVE
  ).length;
}

/**
 * 現在のセル状態と隣接する生きたセル数から次の世代のセル状態を決定する関数
 * @param currentState - 現在のセル状態
 * @param aliveNeighbors - 隣接する生きたセルの数
 * @returns CellState - 次の世代のセル状態
 */
export function getNextCellState(
  currentState: CellState,
  aliveNeighbors: number
): CellState {
  if (currentState === ALIVE) {
    return aliveNeighbors === 2 || aliveNeighbors === 3 ? ALIVE : DEAD;
  }
  return aliveNeighbors === 3 ? ALIVE : DEAD;
}

/**
 * 次のセル
 * @param grid - セル格子
 * @param x - X 軸
 * @param y - y 軸
 * @returns CellState - 次のセル
 */
export function nextCell(grid: CellState[][], x: number, y: number): CellState {
  const aliveNeighbors = countAliveNeighbors(grid, x, y);
  return getNextCellState(grid[y][x], aliveNeighbors);
}

/**
 * 現在の格子から次の世代の格子を生成する関数
 * @param grid - 現在の世代のセル格子
 * @returns CellState[][] - 次の世代のセル格子
 */
export function getNextGeneration(grid: CellState[][]): CellState[][] {
  return grid.map((row, y) => row.map((_, x) => nextCell(grid, x, y)));
}

/**
 * 初期状態のグリッドに対して getNextGeneration を指定回数適用する関数
 * @param grid - 初期状態のグリッド
 * @param times - 繰り返し実行する回数
 * @returns CellState[][] - 指定回数だけ次世代に進んだ結果のグリッド
 */
export function applyGenerations(
  grid: CellState[][],
  times: number
): CellState[][] {
  // times が 0 の場合は元のグリッドを返し、再帰を終了する
  if (times <= 0) {
    return grid;
  }
  // 再帰的に getNextGeneration を適用し、残りの回数を減らす
  return applyGenerations(getNextGeneration(grid), times - 1);
}
