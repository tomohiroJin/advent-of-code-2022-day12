const rockPaperScissorsScores: { [key: string]: number } = {
  "A Y": 8,
  "B X": 1,
  "C Z": 6,
  "A X": 4,
  "A Z": 3,
  "B Y": 5,
  "B Z": 9,
  "C X": 7,
  "C Y": 2,
};

export const calculateTotalScore = (resultSrc: string) =>
  resultSrc
    .trim()
    .split("\n")
    .reduce(
      (previous, current) =>
        previous + Number(rockPaperScissorsScores[current.trim()] ?? 0),
      0
    );
