type SpringState = "." | "#" | "?";
type GroupSizes = number[];

type SpringRecord = {
  states: SpringState[];
  groupSizes: GroupSizes;
};

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

export const generateAllPossiblePatterns = (
  states: SpringState[],
  groupSizes: GroupSizes,
  currentIndex: number = 0,
  currentPattern: string = "",
  currentGroupSize: number = 0,
  currentGroupIndex: number = 0
): string[] => {
  // 現在のインデックスがstatesの長さに達したら、パターンを検証
  if (currentIndex === states.length) {
    if (isMatchingGroupSizes(currentPattern, groupSizes)) {
      return [currentPattern];
    }
    return [];
  }

  if (states[currentIndex] === ".") {
    return generateAllPossiblePatterns(
      states,
      groupSizes,
      currentIndex + 1,
      currentPattern + states[currentIndex],
      currentGroupSize,
      currentGroupIndex
    );
  }

  const nextPeriod =
    states[currentIndex] === "?"
      ? generateAllPossiblePatterns(
          states,
          groupSizes,
          currentIndex + 1,
          currentPattern + ".",
          currentGroupSize,
          currentGroupIndex
        )
      : [];

  const nextPattern = currentPattern + "#";

  if (
    checkCurrentHotSpringGroupSizes(nextPattern, groupSizes, currentGroupIndex)
  ) {
    return [
      ...generateAllPossiblePatterns(
        states,
        groupSizes,
        currentIndex + 1,
        nextPattern,
        0,
        currentGroupIndex + 1
      ),
      ...nextPeriod,
    ];
  } else {
    if (currentGroupSize + 1 < groupSizes[currentGroupIndex]) {
      return [
        ...generateAllPossiblePatterns(
          states,
          groupSizes,
          currentIndex + 1,
          nextPattern,
          currentGroupSize + 1,
          currentGroupIndex
        ),
        ...nextPeriod,
      ];
    } else {
      return nextPeriod;
    }
  }
};

// バックトラッキングというのを試してみたけどうまくいかなくて失敗した。
// export const generateAllPossiblePatterns = (
//   states: SpringState[],
//   groupSizes: GroupSizes,
//   currentIndex: number = 0,
//   currentPattern: string = "",
//   currentGroupSize: number = 0,
//   currentGroupIndex: number = 0
// ): string[] => {
//   // 現在のインデックスがstatesの長さに達したら、パターンを検証
//   if (currentIndex === states.length) {
//     if (isMatchingGroupSizes(currentPattern, groupSizes)) {
//       return [currentPattern];
//     }
//     return [];
//   }

//   // 現在の状態が'?'でない場合、その状態をパターンに追加
//   if (states[currentIndex] !== "?") {
//     const isBroken = states[currentIndex] === "#";
//     const nextGroupSize = isBroken ? currentGroupSize + 1 : 0;
//     const nextGroupIndex =
//       isBroken && nextGroupSize === groupSizes[currentGroupIndex]
//         ? currentGroupIndex + 1
//         : currentGroupIndex;

//     return generateAllPossiblePatterns(
//       states,
//       groupSizes,
//       currentIndex + 1,
//       currentPattern + states[currentIndex],
//       nextGroupSize,
//       nextGroupIndex
//     );
//   }

//   let patterns: string[] = [];

//   // '#'を試す
//   if (currentGroupIndex < groupSizes.length) {
//     patterns = patterns.concat(
//       generateAllPossiblePatterns(
//         states,
//         groupSizes,
//         currentIndex + 1,
//         currentPattern + "#",
//         currentGroupSize + 1,
//         currentGroupIndex
//       )
//     );
//   }

//   // '.'を試す
//   const nextGroupIndex =
//     currentGroupSize === groupSizes[currentGroupIndex]
//       ? currentGroupIndex + 1
//       : currentGroupIndex;
//   patterns = patterns.concat(
//     generateAllPossiblePatterns(
//       states,
//       groupSizes,
//       currentIndex + 1,
//       currentPattern + ".",
//       0,
//       nextGroupIndex
//     )
//   );

//   return patterns;
// };

const isSpringState = (input: string): input is SpringState => {
  return input === "." || input === "#" || input === "?";
};

export const parseSpringRecord = (stateRecords: string): SpringRecord[] => {
  return stateRecords.split("\n").map((recordString) => {
    const [stateStr, groupSizeStr] = recordString.split(" ");
    return {
      states: stateStr.split("").filter(isSpringState),
      groupSizes: groupSizeStr.split(",").map(Number),
    };
  });
};

export const calculateTotalConfigurations = (stateRecords: string): number =>
  parseSpringRecord(stateRecords)
    .map((springRecord) =>
      generateAllPossiblePatterns(springRecord.states, springRecord.groupSizes)
    )
    .reduce((total, matchPatterns) => {
      return (total += matchPatterns.length);
    }, 0);
