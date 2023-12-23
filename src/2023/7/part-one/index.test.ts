import {
  calculateTotalEarningsFromHandRanks,
  determineHandType,
  extractHandAndBid,
  isFirstHandStronger,
  sortByAscendingStrength,
} from ".";

const sampleTotalEarnings = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

test("list を読み込んで hand と bid を抽出する", () => {
  const actual = extractHandAndBid("32T3K 765");
  expect(actual).toEqual({ hand: "32T3K", bid: 765 });
});

test("hand から hands の strongest を決める", () => {
  expect(determineHandType("12345")).toBe(1);
  expect(determineHandType("32T3K")).toBe(2);
  expect(determineHandType("KTJJT")).toBe(3);
  expect(determineHandType("QQQJA")).toBe(4);
  expect(determineHandType("11222")).toBe(5);
  expect(determineHandType("11112")).toBe(6);
  expect(determineHandType("11111")).toBe(7);
});

test("card の頭から順番に比べて強い場合 true を返す", () => {
  expect(isFirstHandStronger("23456", "12345")).toBeTruthy();
  expect(isFirstHandStronger("1T345", "19234")).toBeTruthy();
  expect(isFirstHandStronger("QQQJA", "T55J5")).toBeTruthy();
});

test("card の頭から順番に比べて弱い場合 false を返す", () => {
  expect(isFirstHandStronger("KTJJT", "KK677")).toBeFalsy();
  expect(isFirstHandStronger("19234", "1T345")).toBeFalsy();
  expect(isFirstHandStronger("T55J5", "QQQJA")).toBeFalsy();
});

test("hands の strongest と strength から弱い順番に並べる", () => {
  const actual = sortByAscendingStrength([
    { hand: "32T3K", bid: 765 },
    { hand: "T55J5", bid: 684 },
    { hand: "KK677", bid: 28 },
    { hand: "KTJJT", bid: 220 },
    { hand: "QQQJA", bid: 483 },
  ]);
  expect(actual).toEqual([
    { hand: "32T3K", bid: 765 },
    { hand: "KTJJT", bid: 220 },
    { hand: "KK677", bid: 28 },
    { hand: "T55J5", bid: 684 },
    { hand: "QQQJA", bid: 483 },
  ]);
});

test("すべての手札のランクから総獲得金額を算出する", () => {
  const actual = calculateTotalEarningsFromHandRanks(sampleTotalEarnings);
  expect(actual).toBe(6440);
});
