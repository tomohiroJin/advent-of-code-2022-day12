type HandBidPair = { hand: string; bid: number };

type PokerHandRank =
  | "HighCard"
  | "OnePair"
  | "TwoPair"
  | "ThreeOfAKind"
  | "FullHouse"
  | "FourOfAKind"
  | "FiveOfAKind";

type IsMatch = (cards: string[][]) => boolean;

type HandDescription = {
  rank: number;
  isMatch: IsMatch;
};

const CARD_STRENGTH: Record<string, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10, // T は 10 を表す
  J: 11, // J は Jack
  Q: 12, // Q は Queen
  K: 13, // K は King
  A: 14, // A は Ace、最も強い
};

const HAND_DESCRIPTIONS: Record<PokerHandRank, HandDescription> = {
  HighCard: {
    rank: 1,
    isMatch: (cards) => cards.length === 5,
  },
  OnePair: {
    rank: 2,
    isMatch: (cards) => cards.length === 4,
  },
  TwoPair: {
    rank: 3,
    isMatch: (cards) =>
      cards.length === 3 &&
      cards.filter((card) => card.length === 2).length === 2,
  },
  ThreeOfAKind: {
    rank: 4,
    isMatch: (cards) =>
      cards.length === 3 &&
      cards.filter((card) => card.length === 3).length === 1,
  },
  FullHouse: {
    rank: 5,
    isMatch: (cards) =>
      cards.length === 2 &&
      cards.filter((card) => card.length === 2).length === 1,
  },
  FourOfAKind: {
    rank: 6,
    isMatch: (cards) =>
      cards.length === 2 &&
      cards.filter((card) => card.length === 4).length === 1,
  },
  FiveOfAKind: {
    rank: 7,
    isMatch: (cards) => cards.length === 1,
  },
};

export const extractHandAndBid = (handBidRow: string): HandBidPair => {
  const handBidPair = handBidRow.split(" ");
  return {
    hand: handBidPair[0],
    bid: Number(handBidPair[1]),
  };
};

export const determineHandType = (hand: string): number => {
  const cards = hand
    .split("")
    .sort()
    .reduce((pairs, card, index) => {
      for (const pair of pairs) {
        if (pair.includes(card)) {
          pair.push(card);
          return pairs;
        }
      }
      return [...pairs, [card]];
    }, [] as string[][]);
  for (const hand of Object.values(HAND_DESCRIPTIONS)) {
    if (hand.isMatch(cards)) {
      return hand.rank;
    }
  }
  return 0;
};

export const isFirstHandStronger = (
  firstHand: string,
  secondHand: string
): boolean => {
  const firstCardArray = firstHand.split("");
  const secondCardArray = secondHand.split("");
  for (let index = 0; index < firstCardArray.length; index += 1) {
    if (
      CARD_STRENGTH[firstCardArray[index]] >
      CARD_STRENGTH[secondCardArray[index]]
    ) {
      return true;
    } else if (
      CARD_STRENGTH[firstCardArray[index]] <
      CARD_STRENGTH[secondCardArray[index]]
    ) {
      return false;
    }
  }
  return false;
};

export const sortByAscendingStrength = (
  handBidPair: HandBidPair[]
): HandBidPair[] => {
  return handBidPair.sort((firstHand, secondHand) => {
    const firstRank = determineHandType(firstHand.hand);
    const secondRank = determineHandType(secondHand.hand);
    if (firstRank > secondRank) {
      return 1;
    } else if (firstRank < secondRank) {
      return -1;
    } else {
      if (isFirstHandStronger(firstHand.hand, secondHand.hand)) {
        return 1;
      } else {
        return -1;
      }
    }
  });
};

export const calculateTotalEarningsFromHandRanks = (
  handBidList: string
): number =>
  sortByAscendingStrength(
    handBidList.split("\n").map((handBidRow) => extractHandAndBid(handBidRow))
  ).reduce(
    (total, handBidPair, index) => (total += handBidPair.bid * (index + 1)),
    0
  );
