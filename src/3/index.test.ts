import {
  calculateTotalPriorityOfPackingErrors,
  findCommonCharacters,
  getPriority,
  splitStringIntoHalves,
} from ".";

const samplePacks = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

test("全てのリュックサックの中身を受け取り問題のある優先度を合計してください。", () => {
  const actual = calculateTotalPriorityOfPackingErrors(samplePacks);
  expect(actual).toBe(157);
});

test("リュックサックの文字列を二つに分ける", () => {
  const actual = splitStringIntoHalves("vJrwpWtwJgWrhcsFMMfFFhFp");
  expect(actual).toEqual(["vJrwpWtwJgWr", "hcsFMMfFFhFp"]);
});

test("分けた二つを比較して同一の文字列を抽出する", () => {
  const actual = findCommonCharacters(["pvJrwpWtwJgWr", "hcsFMMfFFhFp"]);
  expect(actual).toEqual(["p"]);
});

test("抽出された文字列を優先度に変換する", () => {
  expect(getPriority("p")).toBe(16);
  expect(getPriority("A")).toBe(27);
  expect(getPriority("pA")).toBe(0);
});
