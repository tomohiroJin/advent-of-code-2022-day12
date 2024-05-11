type Roll = (pins: number) => void;
type Score = () => number;

export const bowlingGame = (): [Roll, Score] => {
  const rolls = Array(21).fill(0);
  let currentRoll = 0;

  const isStrike = (frameIndex: number): boolean => rolls[frameIndex] == 10;

  const isSpare = (frameIndex: number): boolean =>
    rolls[frameIndex] + rolls[frameIndex + 1] == 10;

  const sumOfBallsInFrame = (frameIndex: number): number =>
    rolls[frameIndex] + rolls[frameIndex + 1];

  const strikeBonus = (frameIndex: number): number =>
    rolls[frameIndex + 1] + rolls[frameIndex + 2];

  const spareBonus = (frameIndex: number): number => rolls[frameIndex + 2];

  const roll = (pins: number) => (rolls[currentRoll++] = pins);
  const score = () => {
    let frameIndex = 0;

    return Array.from({ length: 10 }).reduce<number>((score) => {
      if (isStrike(frameIndex)) {
        score += 10 + strikeBonus(frameIndex);
        frameIndex++;
      } else if (isSpare(frameIndex)) {
        score += 10 + spareBonus(frameIndex);
        frameIndex += 2;
      } else {
        score += sumOfBallsInFrame(frameIndex);
        frameIndex += 2;
      }
      return score;
    }, 0);
  };

  return [roll, score];
};
