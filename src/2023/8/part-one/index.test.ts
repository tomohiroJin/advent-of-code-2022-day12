import {
  countStepsToDestination,
  createNodeMap,
  extractInstructionsFromFirstLine,
  getNextNodeFromMap,
  parseNodeMapToInstructionsAndNodes,
} from ".";

const sampleNodeMap = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

test("ノードの一行目の文章を取得して指示を抽出し指示の配列を作る", () => {
  const actual = extractInstructionsFromFirstLine("LLR");
  expect(actual).toEqual(["L", "L", "R"]);
});

test("ノードの一文を取得してノードと次の左右のノードを表すマップを作成する", () => {
  const actual = createNodeMap("AAA = (BBB, BBB)");
  expect(actual).toEqual({ AAA: { left: "BBB", right: "BBB" } });
});

test("ノードマップを分解して指示とノードの配列に変換する", () => {
  const actual = parseNodeMapToInstructionsAndNodes(`AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`);
  expect(actual).toEqual({
    AAA: { left: "BBB", right: "BBB" },
    BBB: { left: "AAA", right: "ZZZ" },
    ZZZ: { left: "ZZZ", right: "ZZZ" },
  });
});

test("与えられた指示とノードからノードマップを取得して次のノードを返す", () => {
  const actual = getNextNodeFromMap("BBB", "R", {
    AAA: { left: "BBB", right: "BBB" },
    BBB: { left: "AAA", right: "ZZZ" },
    ZZZ: { left: "ZZZ", right: "ZZZ" },
  });
  expect(actual).toBe("ZZZ");
});

test("AAA から ZZZ に到達に必要なステップ数をカウントする", () => {
  const actual = countStepsToDestination(sampleNodeMap);
  expect(actual).toBe(6);
});
