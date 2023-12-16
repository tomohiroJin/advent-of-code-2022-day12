type ScratchCard = {
  winningNumbers: number[];
  yourNumbers: number[];
};

const splitCardNumbers = (cardData: string): number[] =>
  cardData
    .split(/\s/)
    .map((str) => (/\d/.test(str) ? Number(str) : undefined))
    .filter((card): card is number => card !== undefined);

export const splitCardsIntoNumbers = (scratchcardData: string): ScratchCard[] =>
  scratchcardData
    .replace(/Card.*:/g, "")
    .split("\n")
    .map((cardData) => {
      const cards = cardData.split("|");
      return {
        winningNumbers: splitCardNumbers(cards[0]),
        yourNumbers: splitCardNumbers(cards[1]),
      };
    });

export const countMatchingWinningNumbers = (scratchCard: ScratchCard): number =>
  scratchCard.yourNumbers.filter((yourNumber) =>
    scratchCard.winningNumbers.includes(yourNumber)
  ).length;

const doublePoints = (count: number, point: number): number =>
  count < 2 ? point : doublePoints(count - 1, point * 2);

export const doublePointsByCount = (yourWinningNumbers: number): number =>
  yourWinningNumbers === 0 ? 0 : doublePoints(yourWinningNumbers, 1);

export const calculateScratchcardPoints = (scratchcardData: string): number =>
  splitCardsIntoNumbers(scratchcardData)
    .map((card) => countMatchingWinningNumbers(card))
    .map((yourWinningNumbers) => doublePointsByCount(yourWinningNumbers))
    .reduce((totalPoint, point) => totalPoint + point);
