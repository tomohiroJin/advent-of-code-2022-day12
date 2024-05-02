type Roll = (pins: number) => void;
type Score = () => number | string;

export const bowlingGame = (): [Roll, Score] => {
  let rolls = Array(21).fill(0);
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
    let score = 0;
    let frameIndex = 0;

    for (let frame = 0; frame < 10; frame++) {
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
    }
    return score;
  };

  return [roll, score];
};
