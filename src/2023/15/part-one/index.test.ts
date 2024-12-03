import {
  calculateHash,
  computeTotalHashFromSteps,
  getASCIICode,
  hashSteps,
  sumHashResults,
} from ".";

it("HASHアルゴリズムに文字列を与えると計算した結果を返す", () => {
  const actual = calculateHash("HASH");
  expect(actual).toBe(52);
});

it("単一文字のASCIIコード取得する", () => {
  const actual = getASCIICode("H");
  expect(actual).toBe(72);
});

it("初期化シーケンスの個々のステップごとに実行する", () => {
  const actual = hashSteps(
    "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7"
  );
  expect(actual).toEqual([30, 253, 97, 47, 14, 180, 9, 197, 48, 214, 231]);
});

it("初期化シーケンスの結果を合計する", () => {
  const actual = sumHashResults([
    30, 253, 97, 47, 14, 180, 9, 197, 48, 214, 231,
  ]);
  expect(actual).toBe(1320);
});

it("初期化シーケンスを渡すと合計結果を返す", () => {
  const actual = computeTotalHashFromSteps(
    "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7"
  );
  expect(actual).toBe(1320);
});
