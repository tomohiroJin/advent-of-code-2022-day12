const COUNT_WORDS: [number, string][] = [
  [3, "Fizz"],
  [5, "Buzz"],
];

export const returnWord = (
  num: number,
  divisor: number,
  word: string
): string | undefined => (num % divisor === 0 ? word : undefined);

export const fizzBuzz = (num: number): string[] =>
  Array.from({ length: num }, (_, index) => index + 1).map(
    (num) =>
      COUNT_WORDS.map(([divisor, word]) => returnWord(num, divisor, word)).join(
        ""
      ) || String(num)
  );
