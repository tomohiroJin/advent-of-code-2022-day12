import {
  calculateTotalCalibrationValue,
  combineFirstLastDigits,
  convertFirstLastNumeral,
} from ".";

const sampleCalibrationValues = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

test("文字列の最初と最後の数字または数詞を数値に変換する", () => {
  expect(convertFirstLastNumeral("two1nine")).toEqual([2, 9]);
  expect(convertFirstLastNumeral("eightwothree")).toEqual([8, 3]);
  expect(convertFirstLastNumeral("abcone2threexyz")).toEqual([1, 3]);
  expect(convertFirstLastNumeral("xtwone3four")).toEqual([2, 4]);
  expect(convertFirstLastNumeral("4nineeightseven2")).toEqual([4, 2]);
  expect(convertFirstLastNumeral("zoneight234")).toEqual([1, 4]);
  expect(convertFirstLastNumeral("7pqrstsixteen")).toEqual([7, 6]);
  expect(convertFirstLastNumeral("eighthree")).toEqual([8, 3]);
});

test("各行の文字列結合した最初と最後の数値を算出する", () => {
  const actual = combineFirstLastDigits(sampleCalibrationValues);
  expect(actual).toEqual([29, 83, 13, 24, 42, 14, 76]);
});

test("キャリブレーション文書全体から各行のキャリブレーション値の合計値を算出する", () => {
  const actual = calculateTotalCalibrationValue(sampleCalibrationValues);
  expect(actual).toBe(281);
});
