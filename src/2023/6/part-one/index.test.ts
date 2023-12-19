import {
  isRecordBroken,
  extractRaceData,
  findRecordBreakingTimeRange,
  calculatePatternCount,
  calculateTotalRecordBreakingPatterns,
} from ".";

const sampleRaceDocument = `Time:      7  15   30
Distance:  9  40  200`;

test("文書から各レースの時間と距離を抽出する", () => {
  const actual = extractRaceData(sampleRaceDocument);
  expect(actual).toEqual([
    { time: 7, distance: 9 },
    { time: 15, distance: 40 },
    { time: 30, distance: 200 },
  ]);
});

test("与えられた時間に基づいて計算された距離が既存の記録を超えるか判定する", () => {
  expect(isRecordBroken(1, { time: 7, distance: 9 })).toBeFalsy();
  expect(isRecordBroken(2, { time: 7, distance: 9 })).toBeTruthy();
});

test("記録を破れる最小時間と最大時間を算出する", () => {
  const actual = findRecordBreakingTimeRange({ time: 7, distance: 9 });
  expect(actual).toHaveLength(2);
  expect(actual[0]).toBe(2);
  expect(actual[1]).toBe(5);
});
test("最大時間から最小時間を引いて最小時間分ひとつを足すことでパターン数を算出する", () => {
  const actual = calculatePatternCount([2, 5]);
  expect(actual).toBe(4);
});

test("各レースで記録を破る場合の総パターン数を決定する", () => {
  const actual = calculateTotalRecordBreakingPatterns(sampleRaceDocument);
  expect(actual).toBe(288);
});
