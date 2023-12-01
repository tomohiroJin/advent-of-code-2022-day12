const NUMERAL_CONVERSION_MAP: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const convertNumeral = (str: string) =>
  str in NUMERAL_CONVERSION_MAP ? NUMERAL_CONVERSION_MAP[str] : str;

export const convertFirstLastNumeral = (str: string): number[] => {
  const keysStr = Object.keys(NUMERAL_CONVERSION_MAP).join("|");
  const firstNumber = str.match(keysStr + "|\\d") ?? [];
  const lastNumber = str.match(".*(" + keysStr + "|\\d)") ?? [];
  if (!firstNumber[0] || !lastNumber[lastNumber.length - 1]) {
    throw new Error("一致する文字列が存在しませんでした");
  }
  return [
    Number(convertNumeral(firstNumber[0])),
    Number(convertNumeral(lastNumber[lastNumber.length - 1])),
  ];
};

export const combineFirstLastDigits = (calibrationValues: string): number[] =>
  calibrationValues.split("\n").map((line) => {
    const numbers = convertFirstLastNumeral(line);
    if (numbers.length < 2) {
      throw new Error("値に誤りが存在します");
    }
    return Number(`${numbers[0]}${numbers[numbers?.length - 1]}`);
  });

export const calculateTotalCalibrationValue = (
  calibrationValues: string
): number =>
  combineFirstLastDigits(calibrationValues).reduce(
    (accumulator, current) => accumulator + current,
    0
  );
