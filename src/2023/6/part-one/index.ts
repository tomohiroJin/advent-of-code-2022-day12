type RaceData = {
  time: number; // レースの総時間（ミリ秒）
  distance: number; // 記録された距離（ミリメートル）
};

export const extractRaceData = (raceDocument: string): RaceData[] => {
  const raceDataArray = raceDocument
    .replace(/Time:\s+|Distance:\s+/g, "")
    .split("\n")
    .map((race) => race.split(/\s+/).map((data) => Number(data)));
  return raceDataArray[0].map((time, index) => ({
    time,
    distance: raceDataArray[1][index],
  }));
};

export const isRecordBroken = (
  pressDuration: number,
  raceData: RaceData
): boolean =>
  // 速度は1ミリ秒あたり1ミリメートルで増加
  pressDuration * (raceData.time - pressDuration) > raceData.distance;

const binarySearchTime = (raceData: RaceData, findMax: boolean): number => {
  let minTime = 0;
  let maxTime = raceData.time;
  let result = -1;

  while (minTime <= maxTime) {
    let midTime = findMax
      ? Math.ceil((minTime + maxTime) / 2)
      : Math.floor((minTime + maxTime) / 2);

    if (isRecordBroken(midTime, raceData)) {
      result = midTime;
      if (findMax) {
        minTime = midTime + 1;
      } else {
        maxTime = midTime - 1;
      }
    } else {
      if (findMax) {
        maxTime = midTime - 1;
      } else {
        minTime = midTime + 1;
      }
    }
  }

  return result;
};

export const findRecordBreakingTimeRange = (
  raceData: RaceData
): [number, number] => [
  binarySearchTime(raceData, false),
  binarySearchTime(raceData, true),
];

export const calculatePatternCount = (range: [number, number]): number => {
  const [min, max] = range;
  return max - min + 1;
};

export const calculateTotalRecordBreakingPatterns = (
  raceDocument: string
): number =>
  extractRaceData(raceDocument)
    .map((raceData) =>
      calculatePatternCount(findRecordBreakingTimeRange(raceData))
    )
    .reduce((total, pattern) => total * pattern, 1);
