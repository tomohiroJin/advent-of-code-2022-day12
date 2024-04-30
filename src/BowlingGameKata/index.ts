type Roll = (pins: number) => void;
type Score = () => number | string;

const sum = (array: number[]): number =>
  array.reduce((acc, val) => (acc += val), 0);

export const bowlingGame = (): [Roll, Score] => {
  const MAX_PINS = 10;
  const LAST_FRAME = 10;

  let total: number = 0;
  let gameOver = false;
  let spare = false;
  let strike = false;
  let oneFrame: number[] = [];
  let frameCounter = 0;

  const score = () =>
    gameOver
      ? "Game Over"
      : frameCounter === LAST_FRAME
      ? `Final Frame Complete! Total Score: ${total}`
      : total;

  const roll = (pins: number): void => {
    oneFrame.push(pins);
    const frameTotal = sum(oneFrame);
    const frameOut = oneFrame.length >= 2;
    const allPinsFall = pins === MAX_PINS;
    const allPinsFallFrame = frameTotal === MAX_PINS;

    total += pins;

    if (spare) {
      total += pins;
      spare = false;
    }

    if (strike) {
      total += pins;
      spare = true;
      strike = false;
    }

    strike = oneFrame.length === 1 && allPinsFall;
    spare = spare || (frameOut && allPinsFallFrame);

    if (frameOut || strike) {
      frameCounter += 1;

      if (
        oneFrame.length === 2 &&
        allPinsFallFrame &&
        frameCounter === LAST_FRAME
      ) {
        spare = false;
      }

      if (
        oneFrame.length < 3 &&
        frameCounter === LAST_FRAME &&
        (allPinsFall || allPinsFallFrame)
      ) {
        strike = false;
        frameCounter -= 1;
      } else {
        oneFrame = [];
      }
    }

    gameOver =
      pins < 0 ||
      pins > MAX_PINS ||
      (frameCounter !== LAST_FRAME && frameTotal > MAX_PINS) ||
      frameCounter > LAST_FRAME;
  };

  return [roll, score];
};
