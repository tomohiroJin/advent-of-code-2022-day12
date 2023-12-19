import {
  MapLabels,
  convertNumber,
  convertSeedToLocation,
  extractAllMappings,
  extractMapping,
  extractSeedRanges,
  findLowestLocationForSeed,
  generateNumbersFromRanges,
} from ".";

const sampleAlmanac = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

test("年鑑から種子番号の一覧を取得する", () => {
  const actual = extractSeedRanges(sampleAlmanac);
  expect(actual).toEqual([79, 14, 55, 13]);
});

test("種子番号の数値ペアから範囲内の数値ペアを全て算出する", () => {
  const seedPairs = [10, 3, 20, 2]; // 10から始まる3つの数値、20から始まる2つの数値
  const generator = generateNumbersFromRanges(seedPairs);
  expect(generator.next().value).toBe(10);
  expect(generator.next().value).toBe(11);
  expect(generator.next().value).toBe(12);
  expect(generator.next().value).toBe(20);
  expect(generator.next().value).toBe(21);
  expect(generator.next().done).toBe(true);
});

test("年鑑から「種子から土」への変換マップを抽出する", () => {
  const actual = extractMapping(sampleAlmanac, MapLabels.SeedToSoil);
  expect(actual).toEqual([
    { destStart: 50, sourceStart: 98, length: 2 },
    { destStart: 52, sourceStart: 50, length: 48 },
  ]);
});

test("年鑑から「土から肥料」への変換マップを抽出する", () => {
  const actual = extractMapping(sampleAlmanac, MapLabels.SoilToFertilizer);
  expect(actual).toEqual([
    { destStart: 0, sourceStart: 15, length: 37 },
    { destStart: 37, sourceStart: 52, length: 2 },
    { destStart: 39, sourceStart: 0, length: 15 },
  ]);
});

test("年鑑から種子番号に紐づく対応表を抽出する", () => {
  const actual = extractAllMappings(sampleAlmanac);
  expect(actual).toEqual({
    SeedToSoil: [
      { destStart: 50, sourceStart: 98, length: 2 },
      { destStart: 52, sourceStart: 50, length: 48 },
    ],
    SoilToFertilizer: [
      { destStart: 0, sourceStart: 15, length: 37 },
      { destStart: 37, sourceStart: 52, length: 2 },
      { destStart: 39, sourceStart: 0, length: 15 },
    ],
    FertilizerToWater: [
      { destStart: 49, sourceStart: 53, length: 8 },
      { destStart: 0, sourceStart: 11, length: 42 },
      { destStart: 42, sourceStart: 0, length: 7 },
      { destStart: 57, sourceStart: 7, length: 4 },
    ],
    WaterToLight: [
      { destStart: 88, sourceStart: 18, length: 7 },
      { destStart: 18, sourceStart: 25, length: 70 },
    ],
    LightToTemperature: [
      { destStart: 45, sourceStart: 77, length: 23 },
      { destStart: 81, sourceStart: 45, length: 19 },
      { destStart: 68, sourceStart: 64, length: 13 },
    ],
    TemperatureToHumidity: [
      { destStart: 0, sourceStart: 69, length: 1 },
      { destStart: 1, sourceStart: 0, length: 69 },
    ],
    HumidityToLocation: [
      { destStart: 60, sourceStart: 56, length: 37 },
      { destStart: 56, sourceStart: 93, length: 4 },
    ],
  });
});

test("番号に対して対応表の変換結果の値を算出する", () => {
  const actual = convertNumber(
    [
      { destStart: 50, sourceStart: 98, length: 2 },
      { destStart: 52, sourceStart: 50, length: 48 },
    ],
    79
  );
  expect(actual).toBe(81);
});

test("番号に対して対応表の変換結果の範囲外の場合はそのまま値を返す", () => {
  const actual = convertNumber(
    [
      { destStart: 50, sourceStart: 98, length: 2 },
      { destStart: 52, sourceStart: 50, length: 48 },
    ],
    14
  );
  expect(actual).toBe(14);
});

test("シード番号から対応表を用いて場所を算出する", () => {
  const actual = convertSeedToLocation(79, {
    SeedToSoil: [
      { destStart: 50, sourceStart: 98, length: 2 },
      { destStart: 52, sourceStart: 50, length: 48 },
    ],
    SoilToFertilizer: [
      { destStart: 0, sourceStart: 15, length: 37 },
      { destStart: 37, sourceStart: 52, length: 2 },
      { destStart: 39, sourceStart: 0, length: 15 },
    ],
    FertilizerToWater: [
      { destStart: 49, sourceStart: 53, length: 8 },
      { destStart: 0, sourceStart: 11, length: 42 },
      { destStart: 42, sourceStart: 0, length: 7 },
      { destStart: 57, sourceStart: 7, length: 4 },
    ],
    WaterToLight: [
      { destStart: 88, sourceStart: 18, length: 7 },
      { destStart: 18, sourceStart: 25, length: 70 },
    ],
    LightToTemperature: [
      { destStart: 45, sourceStart: 77, length: 23 },
      { destStart: 81, sourceStart: 45, length: 19 },
      { destStart: 68, sourceStart: 64, length: 13 },
    ],
    TemperatureToHumidity: [
      { destStart: 0, sourceStart: 69, length: 1 },
      { destStart: 1, sourceStart: 0, length: 69 },
    ],
    HumidityToLocation: [
      { destStart: 60, sourceStart: 56, length: 37 },
      { destStart: 56, sourceStart: 93, length: 4 },
    ],
  });
  expect(actual).toBe(82);
});

test("年鑑から種子番号のいずれかに対応する最も低い場所番号を取得する", () => {
  const actual = findLowestLocationForSeed(sampleAlmanac);
  expect(actual).toBe(46);
});
