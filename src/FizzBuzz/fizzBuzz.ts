const COUNT_WORDS = [
  [15, "FizzBuzz"],
  [5, "Buzz"],
  [3, "Fizz"],
] as const;

export const returnWord = (
  num: number,
  divisor: number,
  word: string
): string | undefined => (num % divisor === 0 ? word : undefined);

export const fizzBuzz = (num: number): string[] =>
  Array.from({ length: num }, (_, index) => index + 1).map(
    (num) =>
      COUNT_WORDS.reduce<string | undefined>(
        (acc, val) => acc ?? returnWord(num, val[0], val[1]),
        undefined
      ) ?? String(num)
  );
