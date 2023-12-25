import { parentPort, workerData } from "worker_threads";

const Direction = {
  Left: "L" as const,
  Right: "R" as const,
};

type Direction = (typeof Direction)[keyof typeof Direction];

type NodeMap = Record<string, Record<Direction, string>>;

export const extractInstructionsFromFirstLine = (
  nodeMapRow: string
): Direction[] =>
  nodeMapRow.split("").map((char) => {
    if (char === Direction.Left) return Direction.Left;
    if (char === Direction.Right) return Direction.Right;
    throw new Error("Invalid direction character");
  });

export const createNodeMap = (nodeRow: string): NodeMap => {
  const [node, directions] = nodeRow.split(" = ");
  const [left, right] = directions.replace(/[()]/g, "").split(", ");
  return { [node]: { [Direction.Left]: left, [Direction.Right]: right } };
};

export const parseNodeMapToInstructionsAndNodes = (
  nodeLines: string
): NodeMap =>
  nodeLines
    .split("\n")
    .map((nodeRow) => createNodeMap(nodeRow))
    .reduce((nodeMap, node) => {
      const key = Object.keys(node)[0];
      nodeMap[key] = node[key];
      return nodeMap;
    }, {} as NodeMap);

export const getNextNodeFromMap = (
  node: string,
  direction: Direction,
  nodeMap: NodeMap
): string => {
  return nodeMap[node][direction];
};

export const memoizeGetNextNodeFromMap = (() => {
  const cache = new Map<string, string>();
  return (node: string, direction: Direction, nodeMap: NodeMap): string => {
    const key = `${node}-${direction}`;
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const nextNode = getNextNodeFromMap(node, direction, nodeMap);
    cache.set(key, nextNode);
    return nextNode;
  };
})();

export const gcd = (a: number, b: number): number =>
  b === 0 ? a : gcd(b, a % b);

export const lcm = (a: number, b: number): number =>
  Math.abs(a * b) / gcd(a, b);

const findCycleLength = (
  startNode: string,
  directions: Direction[],
  nodeMap: NodeMap
): number => {
  let nextNode = startNode;
  let counter = 0;
  let position = 0;
  while (true) {
    counter += 1;
    nextNode = getNextNodeFromMap(nextNode, directions[position], nodeMap);

    if (nextNode.endsWith("Z")) {
      break;
    }
    if (position === directions.length - 1) {
      position = 0;
    } else {
      position += 1;
    }
  }
  return counter;
};

export const countStepsToDestination = (strNodeMap: string): number => {
  const lines = strNodeMap.split("\n");
  const directions = extractInstructionsFromFirstLine(lines[0].trim());
  const nodeMap = parseNodeMapToInstructionsAndNodes(
    lines.slice(2).join("\n").trim()
  );

  let startNodes = Object.keys(nodeMap).filter((node) => node.endsWith("A"));
  return startNodes
    .map((node) => findCycleLength(node, directions, nodeMap))
    .reduce((total, length) => (total = lcm(total, length)), 1);
};
