type SpringState = "." | "#" | "?";
type GroupSizes = number[];

type SpringRecord = {
  states: SpringState[];
  groupSizes: GroupSizes;
};

type Memo = Map<string, number>;

export const isMatchingGroupSizes = (
  estimatedString: string,
  groupSizes: GroupSizes
): boolean => {
  const regexParts = groupSizes.map((size) => `#{${size}}`);
  const regex = new RegExp(`^\\.*${regexParts.join("\\.+")}\\.*$`);

  return regex.test(estimatedString);
};

export const checkCurrentHotSpringGroupSizes = (
  currentPattern: string,
  groupSizes: GroupSizes,
  currentGroupIndex: number
): boolean => {
  const regexParts = groupSizes
    .slice(0, currentGroupIndex + 1)
    .map((size) => `#{${size}}`);
  const regex = new RegExp(`^\\.*${regexParts.join("\\.+")}\\.*$`);

  return regex.test(currentPattern);
};

// TODO 数値で返却するようにしてからメモ化すること
export const generateAllPossiblePatterns = (
  states: SpringState[],
  groupSizes: GroupSizes,
  currentIndex: number = 0,
  currentPattern: string = "",
  currentGroupSize: number = 0,
  currentGroupIndex: number = 0,
  memo: Memo = new Map()
): number => {
  // メモ化のキーを作成
  const memoKey = `${currentIndex}:${currentGroupSize}:${currentGroupIndex}`;

  // 既にキャッシュされている結果をチェック
  if (memo.has(memoKey)) {
    return memo.get(memoKey)!;
  }

  // 現在のインデックスがstatesの長さに達したら、パターンを検証
  if (currentIndex === states.length) {
    if (isMatchingGroupSizes(currentPattern, groupSizes)) {
      return 1;
    }
    return 0;
  }

  // 現在の残り文字数では条件を達成できない場合に処理を終了する
  const remainingStates = states.length - currentIndex;
  let remainingGroupSizes = 0;
  for (let i = currentGroupIndex; i < groupSizes.length; i++) {
    remainingGroupSizes += groupSizes[i];
  }
  if (remainingStates < remainingGroupSizes - currentGroupSize) {
    return 0;
  }

  let totalPossiblePatternSize = 0;

  if (
    states[currentIndex] !== "." &&
    currentGroupIndex < groupSizes.length &&
    currentGroupSize < groupSizes[currentGroupIndex]
  ) {
    totalPossiblePatternSize += generateAllPossiblePatterns(
      states,
      groupSizes,
      currentIndex + 1,
      currentPattern + "#",
      currentGroupSize + 1,
      currentGroupIndex,
      memo
    );
  }

  if (
    states[currentIndex] !== "#" &&
    (currentGroupSize === 0 ||
      currentGroupSize === groupSizes[currentGroupIndex])
  ) {
    totalPossiblePatternSize += generateAllPossiblePatterns(
      states,
      groupSizes,
      currentIndex + 1,
      currentPattern + ".",
      0,
      currentGroupIndex +
        (currentGroupSize === groupSizes[currentGroupIndex] ? 1 : 0),
      memo
    );
  }

  // 結果をメモ化
  memo.set(memoKey, totalPossiblePatternSize);

  return totalPossiblePatternSize;
};

const isSpringState = (input: string): input is SpringState => {
  return input === "." || input === "#" || input === "?";
};

export const parseSpringRecord = (stateRecords: string): SpringRecord[] => {
  return stateRecords.split("\n").map((recordString) => {
    const [stateStr, groupSizeStr] = recordString.split(" ");
    const expandedStates = Array(5).fill(stateStr).join("?");
    const expandedGroupSizes = Array(5).fill(groupSizeStr).join(",");
    return {
      states: expandedStates.split("").filter(isSpringState),
      groupSizes: expandedGroupSizes.split(",").map(Number),
    };
  });
};

export const calculateTotalConfigurations = (stateRecords: string): number =>
  parseSpringRecord(stateRecords)
    .map((springRecord) =>
      generateAllPossiblePatterns(springRecord.states, springRecord.groupSizes)
    )
    .reduce((total, matchPatterns) => {
      return (total += matchPatterns);
    }, 0);
