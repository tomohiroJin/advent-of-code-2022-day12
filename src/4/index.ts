type Range = { start: number; end: number };
type SectionPair = { elfOneRange: Range; elfTwoRange: Range };

const parseRange = (rangeStr: string): Range => {
  const [start, end] = rangeStr.split("-").map(Number);
  return { start, end };
};

export const createSectionAssignmentPairs = (
  assignments: string
): SectionPair[] =>
  assignments
    .trim()
    .split("\n")
    .map((assignment): SectionPair => {
      const [elfOneRangeStr, elfTwoRangeStr] = assignment.trim().split(",");
      return {
        elfOneRange: parseRange(elfOneRangeStr),
        elfTwoRange: parseRange(elfTwoRangeStr),
      };
    });

export const isContained = ({
  elfOneRange,
  elfTwoRange,
}: SectionPair): boolean =>
  (elfOneRange.start <= elfTwoRange.start &&
    elfOneRange.end >= elfTwoRange.end) ||
  (elfTwoRange.start <= elfOneRange.start &&
    elfTwoRange.end >= elfOneRange.end);

export const countContainedPairs = (assignments: string): number =>
  createSectionAssignmentPairs(assignments).filter(isContained).length;
