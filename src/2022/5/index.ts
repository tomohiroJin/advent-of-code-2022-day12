type Stack = string[];
type Stacks = Map<number, Stack>;

type Move = {
  from: number;
  to: number;
  move: number;
};

export const extractCharactersByPattern = (input: string): string[] =>
  input
    .split("")
    .map((char, index) => ({ char, index }))
    .filter(({ index }) => (index + 1 - 2) % 4 === 0)
    .map(({ char }) => char);

export const parseStacksFromString = (stacks: string): Stacks => {
  const lineArrays = stacks
    .split("\n")
    .map((line) => extractCharactersByPattern(line));
  const keyRow = lineArrays[lineArrays.length - 1].map(Number);
  return new Map(
    keyRow.map((key, index) => [
      key,
      lineArrays
        .slice(0, -1)
        .map((row) => row[index])
        .filter((val) => val.trim() !== "")
        .reverse(),
    ])
  );
};

export const parseMovesFromString = (moves: string): Move[] =>
  moves.split("\n").map((line) => {
    const [, move, from, to] = line
      .match(/move (\d+) from (\d+) to (\d+)/)
      ?.map(Number) ?? [NaN, NaN, NaN];
    return { move, from, to };
  });

export const moveCratesBetweenStacks = (move: Move, stacks: Stacks): Stacks =>
  new Map(
    Array.from(stacks.entries()).map(([key, value]) => {
      return key === move.from
        ? [key, value.slice(0, -1 * move.move)]
        : key === move.to
        ? [
            key,
            [
              ...value,
              ...(stacks.get(move.from)?.slice(-1 * move.move) ?? []).reverse(),
            ],
          ]
        : [key, value];
    })
  );

export const getRearrangedCratesMessage = (
  stacks: string,
  move: string
): string =>
  Array.from(
    parseMovesFromString(move)
      .reduce((prev, current) => {
        return moveCratesBetweenStacks(current, prev);
      }, parseStacksFromString(stacks))
      .values()
  )
    .map((value) => value[value.length - 1])
    .join("");
