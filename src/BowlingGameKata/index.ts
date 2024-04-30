type Roll = (pins: number) => void;
type Score = () => number | string;

const sum = (array: number[]): number =>
  array.reduce((acc, val) => (acc += val), 0);

export const bowlingGame = (): [Roll, Score] => {
  const MAX_PINS = 10;
  const LAST_FRAME = 10;

  let total: number = 0;
  let strike = false;
  let spare = false;
  let frame: number[] = [];
  let frameCounter = 0;
  let gameOver = false;

  const score = () =>
    gameOver
      ? "Game Over"
      : frameCounter === LAST_FRAME
      ? `Final Frame Complete! Total Score: ${total}`
      : total;

  const roll = (pins: number): void => {
    if (frame.length === 0) {
      frameCounter += 1;
    }

    frame.push(pins);
    const lastFrame = frameCounter === LAST_FRAME;
    const frameTotal = sum(frame);

    gameOver =
      gameOver ||
      pins < 0 ||
      pins > MAX_PINS ||
      (!lastFrame && frameTotal > MAX_PINS) ||
      frameCounter > LAST_FRAME;

    if (gameOver) return;

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

    strike = frame.length === 1 && pins === MAX_PINS && !lastFrame;
    spare =
      spare || (frame.length === 2 && frameTotal === MAX_PINS && !lastFrame);

    if (
      (frame.length >= 2 && (!lastFrame || frameTotal < MAX_PINS)) ||
      strike
    ) {
      frame = [];
    }
  };

  return [roll, score];
};
