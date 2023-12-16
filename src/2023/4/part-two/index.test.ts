import {
  AsyncTask,
  calculateTotalScratchcards,
  countMatchingWinningNumbers,
  createCopiedScratchcards,
  splitCardsIntoNumbers,
} from ".";

const sampleCards = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

test("カードの一覧を勝利番号と持っている番号に分ける", () => {
  const actual = splitCardsIntoNumbers(sampleCards);
  expect(actual).toEqual([
    {
      winningNumbers: [41, 48, 83, 86, 17],
      yourNumbers: [83, 86, 6, 31, 17, 9, 48, 53],
    },
    {
      winningNumbers: [13, 32, 20, 16, 61],
      yourNumbers: [61, 30, 68, 82, 17, 32, 24, 19],
    },
    {
      winningNumbers: [1, 21, 53, 59, 44],
      yourNumbers: [69, 82, 63, 72, 16, 21, 14, 1],
    },
    {
      winningNumbers: [41, 92, 73, 84, 69],
      yourNumbers: [59, 84, 76, 51, 58, 5, 54, 83],
    },
    {
      winningNumbers: [87, 83, 26, 28, 32],
      yourNumbers: [88, 30, 70, 12, 93, 22, 82, 36],
    },
    {
      winningNumbers: [31, 18, 13, 56, 72],
      yourNumbers: [74, 77, 10, 23, 35, 67, 36, 11],
    },
  ]);
});

test("持っている番号に勝利番号がいくつ含まれているかを算出する", () => {
  const actual = countMatchingWinningNumbers({
    winningNumbers: [41, 48, 83, 86, 17],
    yourNumbers: [83, 86, 6, 31, 17, 9, 48, 53],
  });
  expect(actual).toBe(4);
});

// test("スクラッチカードからコピーされたスクラッチカードを作成する", () => {
//   const actual = createCopiedScratchcards(
//     [
//       {
//         winningNumbers: [41, 48, 83, 86, 17],
//         yourNumbers: [83, 86, 6, 31, 17, 9, 48, 53],
//       },
//       {
//         winningNumbers: [13, 32, 20, 16, 61],
//         yourNumbers: [61, 30, 68, 82, 17, 32, 24, 19],
//       },
//       {
//         winningNumbers: [1, 21, 53, 59, 44],
//         yourNumbers: [69, 82, 63, 72, 16, 21, 14, 1],
//       },
//       {
//         winningNumbers: [41, 92, 73, 84, 69],
//         yourNumbers: [59, 84, 76, 51, 58, 5, 54, 83],
//       },
//       {
//         winningNumbers: [87, 83, 26, 28, 32],
//         yourNumbers: [88, 30, 70, 12, 93, 22, 82, 36],
//       },
//       {
//         winningNumbers: [31, 18, 13, 56, 72],
//         yourNumbers: [74, 77, 10, 23, 35, 67, 36, 11],
//       },
//     ],
//     0
//   );
//   expect(actual).toEqual([
//     {
//       winningNumbers: [13, 32, 20, 16, 61],
//       yourNumbers: [61, 30, 68, 82, 17, 32, 24, 19],
//     },
//     {
//       winningNumbers: [1, 21, 53, 59, 44],
//       yourNumbers: [69, 82, 63, 72, 16, 21, 14, 1],
//     },
//     {
//       winningNumbers: [41, 92, 73, 84, 69],
//       yourNumbers: [59, 84, 76, 51, 58, 5, 54, 83],
//     },
//     {
//       winningNumbers: [87, 83, 26, 28, 32],
//       yourNumbers: [88, 30, 70, 12, 93, 22, 82, 36],
//     },
//   ]);
// });

test("全てのスクラッチカードの合計を算出する", () => {
  const actual = calculateTotalScratchcards(sampleCards);
  expect(actual).toBe(30);
});
