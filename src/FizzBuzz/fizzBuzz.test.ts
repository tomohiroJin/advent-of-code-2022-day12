import {
  fizzBuzz,
  returnBuzz,
  returnFizz,
  returnFizzBuzz,
  returnNumber,
} from "./fizzBuzz";

test("数を受け取り、その数を文字列で返す", () => {
  expect(returnNumber(1)).toBe("1");
});

describe("3 の倍数の時に Fizz それ以外は undefined を返す", () => {
  test("3 の倍数の時に Fizz を返す", () => {
    expect(returnFizz(3)).toBe("Fizz");
  });

  test("それ以外は undefined を返す", () => {
    expect(returnFizz(1)).toBeUndefined();
  });
});

describe("5 の倍数の時に Buzz それ以外は undefined を返す", () => {
  test("5 の倍数の時に Buzz を返す", () => {
    expect(returnBuzz(5)).toBe("Buzz");
  });

  test("それ以外は undefined を返す", () => {
    expect(returnBuzz(1)).toBeUndefined();
  });
});

describe("3 と 5 の両方の倍数の時に FizzBuzz それ以外は undefined を返す", () => {
  test("3 と 5 の両方の倍数の時に FizzBuzz を返す", () => {
    expect(returnFizzBuzz(15)).toBe("FizzBuzz");
  });

  test("それ以外は undefined を返す", () => {
    expect(returnFizzBuzz(1)).toBeUndefined();
  });
});

test("1 から指定された数までの数を処理し、結果をリストで返す", () => {
  expect(fizzBuzz(15)).toEqual([
    "1",
    "2",
    "Fizz",
    "4",
    "Buzz",
    "Fizz",
    "7",
    "8",
    "Fizz",
    "Buzz",
    "11",
    "Fizz",
    "13",
    "14",
    "FizzBuzz",
  ]);
});
