import {
  calculateTotalConfigurations,
  generateAllPossiblePatterns,
  isMatchingGroupSizes,
  checkCurrentHotSpringGroupSizes,
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
  expect(actual).toEqual(1);
});

test("温泉の状態とグループサイズから推定される形が複数存在する場合は複数の結果を返す", () => {
  const actual = generateAllPossiblePatterns(
    [".", "?", "?", ".", ".", "?", "?", ".", ".", ".", "?", "#", "#", "."],
    [1, 1, 3]
  );
  expect(actual).toEqual(4);
});

test("温泉の状態とグループサイズから推定される形の最後にピリオドが存在する場合も正常に結果を返す", () => {
  const actual = generateAllPossiblePatterns(["?", "?"], [1]);
  expect(actual).toEqual(2);
});

test("推定された温泉の状態とグループサイズが正しい状態である場合に true を返す", () => {
  expect(isMatchingGroupSizes("#.#.###", [1, 1, 3])).toBeTruthy();
});

test("推定された温泉の状態とグループサイズが誤った状態である場合に false を返す", () => {
  expect(isMatchingGroupSizes("#...###", [1, 1, 3])).toBeFalsy();
  expect(isMatchingGroupSizes("###.###", [1, 1, 3])).toBeFalsy();
  expect(isMatchingGroupSizes(".##...#...###.", [1, 1, 3])).toBeFalsy();
});

test("推定された途中の温泉の状態とグループサイズの現在の確認済みまでの位置が正しい状態である場合に true を返す", () => {
  expect(checkCurrentHotSpringGroupSizes("#", [1, 1, 3], 0)).toBeTruthy();
  expect(checkCurrentHotSpringGroupSizes(".#", [1, 1, 3], 0)).toBeTruthy();
  expect(checkCurrentHotSpringGroupSizes("#.#", [1, 1, 3], 1)).toBeTruthy();
  expect(checkCurrentHotSpringGroupSizes("#.#.###", [1, 1, 3], 2)).toBeTruthy();
  expect(
    checkCurrentHotSpringGroupSizes(".#..#....###.", [1, 1, 3], 2)
  ).toBeTruthy();
  expect(checkCurrentHotSpringGroupSizes("##", [2, 1, 3], 0)).toBeTruthy();
});

test("推定された途中の温泉の状態とグループサイズの現在の確認済みまでの位置が誤った状態である場合に false を返す", () => {
  expect(checkCurrentHotSpringGroupSizes("##", [1, 1, 3], 0)).toBeFalsy();
  expect(checkCurrentHotSpringGroupSizes(".##", [1, 1, 3], 0)).toBeFalsy();
  expect(checkCurrentHotSpringGroupSizes(".#.##", [1, 1, 3], 1)).toBeFalsy();
  expect(
    checkCurrentHotSpringGroupSizes(".#.#..##.#", [1, 1, 3], 2)
  ).toBeFalsy();
});

test("状態記録の文字列を温泉の状態と温泉のグループサイズにして返す", () => {
  const actual = parseSpringRecord(`???.### 1,1,3`);
  expect(actual).toEqual([
    {
      states: [
        "?",
        "?",
        "?",
        ".",
        "#",
        "#",
        "#",
        "?",
        "?",
        "?",
        "?",
        ".",
        "#",
        "#",
        "#",
        "?",
        "?",
        "?",
        "?",
        ".",
        "#",
        "#",
        "#",
        "?",
        "?",
        "?",
        "?",
        ".",
        "#",
        "#",
        "#",
        "?",
        "?",
        "?",
        "?",
        ".",
        "#",
        "#",
        "#",
      ],
      groupSizes: [1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3],
    },
  ]);
});

test("全ての配置可能な値を合計する", () => {
  const actual = calculateTotalConfigurations(sampleStateRecords);
  expect(actual).toBe(525152);
});
