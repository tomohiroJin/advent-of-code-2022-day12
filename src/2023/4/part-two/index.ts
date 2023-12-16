export type AsyncTask = () => Promise<void>;
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

export const countMatchingWinningNumbers = (
  scratchCard: ScratchCard
): number => {
  const winningNumberSet = new Set(scratchCard.winningNumbers);
  return scratchCard.yourNumbers.filter((yourNumber) =>
    winningNumberSet.has(yourNumber)
  ).length;
};

const createWinningNumberSets = (
  scratchcards: ScratchCard[]
): Set<number>[] => {
  return scratchcards.map((card) => new Set(card.winningNumbers));
};

const countMatches = (
  card: ScratchCard,
  winningNumberSet: Set<number>
): number => {
  return card.yourNumbers.filter((number) => winningNumberSet.has(number))
    .length;
};

export const createCopiedScratchcards = (
  scratchcards: ScratchCard[],
  targetIndex: number,
  winningNumberSets: Set<number>[]
): ScratchCard[] => {
  const matchCount = countMatches(
    scratchcards[targetIndex],
    winningNumberSets[targetIndex]
  );
  return scratchcards.slice(targetIndex + 1, targetIndex + 1 + matchCount);
};

export const calculateTotalScratchcards = (scratchcardData: string): number => {
  const initialScratchcards = splitCardsIntoNumbers(scratchcardData);
  const winningNumberSets = createWinningNumberSets(initialScratchcards);
  // 最初のスクラッチカードの一覧を処理回数に変換する
  const winningNumbers = initialScratchcards.map((card, index) => ({
    win: countMatches(card, winningNumberSets[index]),
    index,
  }));
  console.log(JSON.stringify(winningNumbers));

  let totalCards = 0;
  const queue = [...winningNumbers];
  let index = 0;

  while (queue[index]) {
    // const winningCards = queue.shift();
    const winningCards = queue[index];
    index += 1;
    if (!winningCards) continue;
    totalCards++;
    if (winningCards.win < 1) continue;
    const copiedCards = winningNumbers.slice(
      winningCards.index + 1,
      winningCards.index + 1 + winningCards.win
    );
    queue.push(...copiedCards);
  }

  return totalCards;
};
