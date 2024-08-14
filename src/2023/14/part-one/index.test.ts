import { analyzeMap } from ".";

const reflectionMap = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

describe("Day 14: Parabolic Reflector Dish", () => {
  describe("show", () => {
    it("マップを解析して現在の情報を返す取り込む", () => {
      const { show } = analyzeMap(reflectionMap);
      expect(show()).toBe(`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`);
    });
  });

  describe("analyzeMapAttributes", () => {
    it("マップを解析して座標とそれぞれの属性を保持したマップを返す", () => {
      const { analyzeMapAttributes } = analyzeMap(`.#O
O#.`);
      expect(analyzeMapAttributes()).toEqual([
        [
          { x: 0, y: 0, element: "space" },
          { x: 1, y: 0, element: "squareLock" },
          { x: 2, y: 0, element: "circleLock" },
        ],
        [
          { x: 0, y: 1, element: "circleLock" },
          { x: 1, y: 1, element: "squareLock" },
          { x: 2, y: 1, element: "space" },
        ],
      ]);
    });

    it("マップを解析して存在しない値が入っていた場合エラーを返す", () => {
      expect(() => analyzeMap("?")).toThrow(Error);
    });
  });

  describe("レバーを倒すと倒した方向に岩が移動する", () => {
    it("北にレバーを倒すと丸い岩は空きスペースに移動する", () => {
      const { show, downTheLiver } = analyzeMap(`...
O..
OO.
.OO`);
      downTheLiver("North");
      expect(show()).toBe(`OOO
OO.
...
...`);
    });

    it("北にLiverを倒すと四角い岩までの空きスペースに移動する", () => {
      const { show, downTheLiver } = analyzeMap(`#..
O.#
OO.
..O`);
      downTheLiver("North");
      expect(show()).toBe(`#O.
O.#
O.O
...`);
    });

    it("岩の位置から南の端までの行数で岩の重さを算出できる", () => {
      const { calculateTotalWeight } = analyzeMap(`#..
O.#
OO.
..O`);
      expect(calculateTotalWeight()).toBe(8);
    });

    it("北に移動したあとに岩の重さを算出できる", () => {
      const { show, calculateTotalWeight, downTheLiver } =
        analyzeMap(reflectionMap);

      downTheLiver("North");

      expect(show()).toBe(`OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....`);
      expect(calculateTotalWeight()).toBe(136);
    });
  });
});
