import {
  countContainedPairs,
  createSectionAssignmentPairs,
  isContained,
} from ".";

const sampleSection = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

test("区画の割り当て表を受け取ってペアごとの割り当て一覧を取得できる", () => {
  const actual = createSectionAssignmentPairs(sampleSection);
  expect(actual).toEqual([
    { elfOneRange: { start: 2, end: 4 }, elfTwoRange: { start: 6, end: 8 } },
    { elfOneRange: { start: 2, end: 3 }, elfTwoRange: { start: 4, end: 5 } },
    { elfOneRange: { start: 5, end: 7 }, elfTwoRange: { start: 7, end: 9 } },
    { elfOneRange: { start: 2, end: 8 }, elfTwoRange: { start: 3, end: 7 } },
    { elfOneRange: { start: 6, end: 6 }, elfTwoRange: { start: 4, end: 6 } },
    { elfOneRange: { start: 2, end: 6 }, elfTwoRange: { start: 4, end: 8 } },
  ]);
});

test("一方の範囲が他方を含んでいる場合 true を返す", () => {
  expect(
    isContained({
      elfOneRange: { start: 2, end: 8 },
      elfTwoRange: { start: 3, end: 7 },
    })
  ).toBeTruthy();
  expect(
    isContained({
      elfOneRange: { start: 6, end: 6 },
      elfTwoRange: { start: 4, end: 6 },
    })
  ).toBeTruthy();
});

test("一方の範囲が他方を含んでいない場合 false を返す", () => {
  expect(
    isContained({
      elfOneRange: { start: 2, end: 4 },
      elfTwoRange: { start: 6, end: 8 },
    })
  ).toBeFalsy();
  expect(
    isContained({
      elfOneRange: { start: 2, end: 3 },
      elfTwoRange: { start: 4, end: 5 },
    })
  ).toBeFalsy();
});

test("再考が必要な割り当て一覧のペアの数を返却する", () => {
  const actual = countContainedPairs(sampleSection);
  expect(actual).toBe(2);
});
