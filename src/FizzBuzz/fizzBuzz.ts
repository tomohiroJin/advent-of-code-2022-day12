export const returnNumber = (num: number): string => String(num);
export const returnFizz = (num: number): string | undefined =>
  num % 3 === 0 ? "Fizz" : undefined;
export const returnBuzz = (num: number): string | undefined =>
  num % 5 === 0 ? "Buzz" : undefined;
export const returnFizzBuzz = (num: number): string | undefined =>
  num % 15 === 0 ? "FizzBuzz" : undefined;
export const fizzBuzz = (num: number): string[] =>
  Array.from({ length: num }, (_, index) => index + 1).map(
    (num) =>
      returnFizzBuzz(num) ??
      returnBuzz(num) ??
      returnFizz(num) ??
      returnNumber(num)
  );
