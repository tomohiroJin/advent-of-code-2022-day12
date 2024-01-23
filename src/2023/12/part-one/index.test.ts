import {
  calculateTotalConfigurations,
  generateAllPossiblePatterns,
  isMatchingGroupSizes,
  parseSpringRecord,
} from ".";

const sampleStateRecords = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

test("温泉の状態とグループサイズから推定される形を返す", () => {
  const actual = generateAllPossiblePatterns(
    ["?", "?", "?", ".", "#", "#", "#"],
    [1, 1, 3]
  );
  expect(actual).toEqual(["#.#.###"]);
});

test("推定された温泉の状態とグループサイズが正しい状態である場合に true を返す", () => {
  expect(isMatchingGroupSizes("#.#.###", [1, 1, 3])).toBeTruthy();
});

test("推定された温泉の状態とグループサイズが誤った状態である場合に false を返す", () => {
  expect(isMatchingGroupSizes("#...###", [1, 1, 3])).toBeFalsy();
  expect(isMatchingGroupSizes("###.###", [1, 1, 3])).toBeFalsy();
  expect(isMatchingGroupSizes(".##...#...###.", [1, 1, 3])).toBeFalsy();
});

test("状態記録の文字列を温泉の状態と温泉のグループサイズにして返す", () => {
  const actual = parseSpringRecord(`???.### 1,1,3
.??..??...?##. 1,1,3`);
  expect(actual).toEqual([
    {
      states: ["?", "?", "?", ".", "#", "#", "#"],
      groupSizes: [1, 1, 3],
    },
    {
      states: [
        ".",
        "?",
        "?",
        ".",
        ".",
        "?",
        "?",
        ".",
        ".",
        ".",
        "?",
        "#",
        "#",
        ".",
      ],
      groupSizes: [1, 1, 3],
    },
  ]);
});

test("全ての配置可能な値を合計する", () => {
  const actual = calculateTotalConfigurations(sampleStateRecords);
  expect(actual).toBe(21);
});
