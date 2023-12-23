import {
  calculateTotalEarningsFromHandRanks,
  determineHandType,
  extractHandAndBid,
  isFirstHandStronger,
  sortByAscendingStrength,
} from ".";

const sampleTotalEarnings = `32T3K 765
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

test("list を読み込んで hand と bid を抽出する", () => {
  const actual = extractHandAndBid("32T3K 765");
  expect(actual).toEqual({ hand: "32T3K", bid: 765 });
});

test("hand から hands の strongest を決める", () => {
  expect(determineHandType("23456")).toBe(1);
  expect(determineHandType("32T3K")).toBe(2);
  expect(determineHandType("22334")).toBe(3);
  expect(determineHandType("QQQ2A")).toBe(4);
  expect(determineHandType("22333")).toBe(5);
  expect(determineHandType("22223")).toBe(6);
  expect(determineHandType("22222")).toBe(7);
  expect(determineHandType("2345J")).toBe(2);
  expect(determineHandType("2323J")).toBe(5);
  expect(determineHandType("2J23J")).toBe(6);
  expect(determineHandType("KTJJT")).toBe(6);
  expect(determineHandType("J3456")).toBe(2);
  expect(determineHandType("J3J56")).toBe(4);
  expect(determineHandType("J3J2J")).toBe(6);
  expect(determineHandType("JJJJ6")).toBe(7);
  expect(determineHandType("7JJJJ")).toBe(7);
  expect(determineHandType("223JJ")).toBe(6);
  expect(determineHandType("2JJ34")).toBe(4);
  expect(determineHandType("JJJJ2")).toBe(7);
  expect(determineHandType("JJJJJ")).toBe(7);
});

test("card の頭から順番に比べて強い場合 true を返す", () => {
  expect(isFirstHandStronger("43456", "32345")).toBeTruthy();
  expect(isFirstHandStronger("2T345", "29234")).toBeTruthy();
  expect(isFirstHandStronger("QQQJA", "T55J5")).toBeTruthy();
  expect(isFirstHandStronger("K2345", "KJ222")).toBeTruthy();
});

test("card の頭から順番に比べて弱い場合 false を返す", () => {
  expect(isFirstHandStronger("KJ222", "K2345")).toBeFalsy();
  expect(isFirstHandStronger("29234", "2T345")).toBeFalsy();
  expect(isFirstHandStronger("T55J5", "QQQJA")).toBeFalsy();
  expect(isFirstHandStronger("JK5J5", "QQQJA")).toBeFalsy();
});

test("hands の strongest と strength から弱い順番に並べる", () => {
  const actual = sortByAscendingStrength([
    { hand: "32T3K", bid: 765 },
    { hand: "32T3K", bid: 765 },
    { hand: "T55J5", bid: 684 },
    { hand: "KK677", bid: 28 },
    { hand: "KTJJT", bid: 220 },
    { hand: "QQQJA", bid: 483 },
  ]);
  expect(actual).toEqual([
    { hand: "32T3K", bid: 765 },
    { hand: "32T3K", bid: 765 },
    { hand: "KK677", bid: 28 },
    { hand: "T55J5", bid: 684 },
    { hand: "QQQJA", bid: 483 },
    { hand: "KTJJT", bid: 220 },
  ]);
});

test("すべての手札のランクから総獲得金額を算出する", () => {
  const actual = calculateTotalEarningsFromHandRanks(sampleTotalEarnings);
  expect(actual).toBe(6670);
});
