export const calculateDifferences = (sequence: number[]): number[] =>
  sequence.slice(1).map((value, index) => value - sequence[index]);

export const repeatDifferences = (sequence: number[]): number[][] => {
  const differences = calculateDifferences(sequence);
  return differences.every((value) => value === 0)
    ? [differences]
    : [...repeatDifferences(differences), differences];
};

export const extrapolateNextValue = (sequence: number[]): number => {
  const differenceSequences = repeatDifferences(sequence);
  let nextValue = 0;

  for (let diffs of differenceSequences) {
    if (nextValue === 0) {
      nextValue = diffs[0];
    } else {
      nextValue = diffs[0] - nextValue;
    }
  }

  return sequence[0] - nextValue;
};

export const parseStringToNumberArray = (sequence: string): number[] =>
  sequence.split(/\s/).map(Number);

export const calculateTotalOfExtrapolations = (sequences: string) =>
  sequences
    .split(/\n/)
    .map(parseStringToNumberArray)
    .map(extrapolateNextValue)
    .reduce((total, value) => total + value, 0);
