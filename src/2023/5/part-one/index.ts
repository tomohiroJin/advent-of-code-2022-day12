type Mapping = {
  destStart: number;
  sourceStart: number;
  length: number;
};

export const MapLabels = {
  SeedToSoil: "seed-to-soil map:",
  SoilToFertilizer: "soil-to-fertilizer map:",
  FertilizerToWater: "fertilizer-to-water map:",
  WaterToLight: "water-to-light map:",
  LightToTemperature: "light-to-temperature map:",
  TemperatureToHumidity: "temperature-to-humidity map:",
  HumidityToLocation: "humidity-to-location map:",
};

type MapLabel = (typeof MapLabels)[keyof typeof MapLabels];
type MapLabelKeys = keyof typeof MapLabels;
type CategoryMappings = { [key in MapLabelKeys]?: Mapping[] };

export const extractSeedNumbersFromAlmanac = (almanac: string): number[] => {
  const seedMatch = almanac.match(/^seeds:\s+(\d+(?:\s+\d+)*)$/gm);
  if (seedMatch) {
    const seedNumbers = seedMatch[0].match(/\d+/g);
    if (seedNumbers) return seedNumbers.map(Number);
  }
  return [];
};

export const extractMapping = (
  almanac: string,
  mapLabel: MapLabel
): Mapping[] => {
  const pattern = new RegExp(
    `^${mapLabel}\n((?:\\d+\\s+\\d+\\s+\\d+\n?)+)`,
    "gm"
  );
  const seedToSoilMatch = almanac.match(pattern);
  if (seedToSoilMatch) {
    return seedToSoilMatch[0]
      .split("\n")
      .slice(1) // 最初の行（ラベル行）を除外
      .flatMap((line) =>
        line.trim() === "" ? [] : [line.trim().split(/\s+/).map(Number)]
      )
      .map(([destStart, sourceStart, length]) => ({
        destStart,
        sourceStart,
        length,
      }));
  }
  return [];
};

export const extractAllMappings = (almanac: string): CategoryMappings =>
  Object.entries(MapLabels).reduce((acc, [key, label]) => {
    acc[key as MapLabelKeys] = extractMapping(almanac, label as MapLabel);
    return acc;
  }, {} as CategoryMappings);

export const convertNumber = (mappings: Mapping[], number: number): number => {
  for (const { destStart, sourceStart, length } of mappings) {
    if (number >= sourceStart && number < sourceStart + length) {
      return destStart + (number - sourceStart);
    }
  }
  return number;
};

export const convertSeedToLocation = (
  seed: number,
  mappings: CategoryMappings
): number =>
  (Object.keys(MapLabels) as MapLabelKeys[]).reduce(
    (currentNumber, key) =>
      mappings[key]
        ? convertNumber(mappings[key]!, currentNumber)
        : currentNumber,
    seed
  );

export const findLowestLocationForSeed = (almanac: string): number =>
  Math.min(
    ...extractSeedNumbersFromAlmanac(almanac).map((seed) =>
      convertSeedToLocation(seed, extractAllMappings(almanac))
    )
  );
