import {
  countStepsToDestination,
  createNodeMap,
  extractInstructionsFromFirstLine,
  gcd,
  getNextNodeFromMap,
  lcm,
  memoizeGetNextNodeFromMap,
  parseNodeMapToInstructionsAndNodes,
} from ".";

const sampleNodeMap = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

test("ノードの一行目の文章を取得して指示を抽出し指示の配列を作る", () => {
  const actual = extractInstructionsFromFirstLine("LLR");
  expect(actual).toEqual(["L", "L", "R"]);
});

test("ノードの一文を取得してノードと次の左右のノードを表すマップを作成する", () => {
  const actual = createNodeMap("AAA = (BBB, BBB)");
  expect(actual).toEqual({ AAA: { L: "BBB", R: "BBB" } });
});

test("ノードマップを分解して指示とノードの配列に変換する", () => {
  const actual = parseNodeMapToInstructionsAndNodes(`AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`);
  expect(actual).toEqual({
    AAA: { L: "BBB", R: "BBB" },
    BBB: { L: "AAA", R: "ZZZ" },
    ZZZ: { L: "ZZZ", R: "ZZZ" },
  });
});

test("与えられた指示とノードからノードマップを取得して次のノードを返す", () => {
  const actual = getNextNodeFromMap("BBB", "R", {
    AAA: { L: "BBB", R: "BBB" },
    BBB: { L: "AAA", R: "ZZZ" },
    ZZZ: { L: "ZZZ", R: "ZZZ" },
  });
  expect(actual).toBe("ZZZ");
});

test("与えられた指示とノードが一度呼び出されたことのある内容の場合はメモ化された情報から同じ結果が返ること", () => {
  const nodeMap = {
    AAA: { L: "BBB", R: "BBB" },
    BBB: { L: "AAA", R: "ZZZ" },
    ZZZ: { L: "ZZZ", R: "ZZZ" },
  };

  const first = memoizeGetNextNodeFromMap("BBB", "R", nodeMap);
  const second = memoizeGetNextNodeFromMap("BBB", "R", nodeMap);
  expect(first).toBe(second);
});

test("8 と 12 の最大公約数は 4 になること", () => {
  expect(gcd(8, 12)).toBe(4);
});

test("8 と 12 の最小公倍数は 24 になること", () => {
  expect(lcm(8, 12)).toBe(24);
});

test("末尾 A の一覧から末尾 Z の一覧にすべてが到達するのに必要なステップ数をカウントする", () => {
  const actual = countStepsToDestination(sampleNodeMap);
  expect(actual).toBe(6);
});
