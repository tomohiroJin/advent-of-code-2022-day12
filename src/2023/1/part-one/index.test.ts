import { calculateTotalCalibrationValue, combineFirstLastDigits } from ".";

const sampleCalibrationValues = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

test("各行の文字列結合した最初と最後の数値を算出する", () => {
  const actual = combineFirstLastDigits(sampleCalibrationValues);
  expect(actual).toEqual([12, 38, 15, 77]);
});

test("キャリブレーション文書全体から各行のキャリブレーション値の合計値を算出する", () => {
  const actual = calculateTotalCalibrationValue(sampleCalibrationValues);
  expect(actual).toBe(142);
});
