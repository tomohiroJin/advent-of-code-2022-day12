const Direction = {
  Left: "L" as const,
  Right: "R" as const,
};

type Direction = (typeof Direction)[keyof typeof Direction];

type NodeMap = Record<string, { left: string; right: string }>;

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
  return { [node]: { left, right } };
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
  if (direction === Direction.Left) {
    return nodeMap[node].left;
  } else {
    return nodeMap[node].right;
  }
};

export const countStepsToDestination = (strNodeMap: string): number => {
  const lines = strNodeMap.split("\n");
  const directions = extractInstructionsFromFirstLine(lines[0].trim());
  const nodeMap = parseNodeMapToInstructionsAndNodes(
    lines.slice(2).join("\n").trim()
  );
  let nextNode = "AAA";
  let counter = 0;
  let position = 0;
  while (true) {
    counter += 1;
    nextNode = getNextNodeFromMap(nextNode, directions[position], nodeMap);
    if (nextNode === "ZZZ") {
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
