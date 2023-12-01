export const combineFirstLastDigits = (calibrationValues: string): number[] =>
  calibrationValues.split("\n").map((line) => {
    const numbers = line.match(/\d/g) ?? "0";
    return Number(numbers[0] + numbers[numbers?.length - 1]);
  });

export const calculateTotalCalibrationValue = (
  calibrationValues: string
): number =>
  combineFirstLastDigits(calibrationValues).reduce(
    (accumulator, current) => accumulator + current,
    0
  );
