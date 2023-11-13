import { findFirstUniqueQuad, findEndOfFirstUniqueQuad } from ".";

test("与えられた文字列の最初から最も近い位置にある4文字が全て異なる文字を抽出する", () => {
  expect(findFirstUniqueQuad("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toBe("jpqm");
  expect(findFirstUniqueQuad("bvwbjplbgvbhsrlpgdmjqwftvncz")).toBe("vwbj");
  expect(findFirstUniqueQuad("nppdvjthqldpwncqszvftbrmjlhg")).toBe("pdvj");
  expect(findFirstUniqueQuad("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")).toBe("rfnt");
  expect(findFirstUniqueQuad("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")).toBe("zqfr");
});

test("抽出された 4 文字から与えられた文字列の出現位置を算出する", () => {
  expect(findEndOfFirstUniqueQuad("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toBe(7);
  expect(findEndOfFirstUniqueQuad("bvwbjplbgvbhsrlpgdmjqwftvncz")).toBe(5);
  expect(findEndOfFirstUniqueQuad("nppdvjthqldpwncqszvftbrmjlhg")).toBe(6);
  expect(findEndOfFirstUniqueQuad("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")).toBe(
    10
  );
  expect(findEndOfFirstUniqueQuad("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")).toBe(11);
});
